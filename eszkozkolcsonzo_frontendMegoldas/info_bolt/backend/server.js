require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Alap végpont ──────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.json({
        message: 'Informatikai termékbolt API',
        endpoints: [
            'GET /api/tesztkapcsolat',
            'GET /api/termekek',
            'GET /api/diakok/:azonosito',
            'POST /api/rendelesek'
        ]
    });
});

// ── Tesztkapcsolat ────────────────────────────────────────────────────────────

app.get('/api/tesztkapcsolat', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                @@SERVERNAME AS szerverNev,
                DB_NAME() AS adatbazisNev
        `);

        res.json({
            message: 'Sikeres adatbázis-kapcsolat.',
            data: result.recordset[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Nem sikerült kapcsolódni az adatbázishoz.' });
    }
});

// ── Termékek lekérdezése ──────────────────────────────────────────────────────

app.get('/api/termekek', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                Id,
                Nev,
                Leiras,
                Egysegar,
                Keszlet,
                Elerheto,
                KepFajlnev
            FROM Termek
            ORDER BY Id ASC
        `);

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Nem sikerült lekérdezni a termékeket.' });
    }
});

// ── Diák ellenőrzése ──────────────────────────────────────────────────────────

app.get('/api/diakok/:azonosito', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('azonosito', sql.NVarChar(50), req.params.azonosito)
            .query(`
                SELECT
                    Id,
                    Azonosito,
                    Nev,
                    Email,
                    Telefon
                FROM Diak
                WHERE Azonosito = @azonosito
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'A megadott diákazonosító nem található.' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: 'Nem sikerült lekérdezni a diák adatait.' });
    }
});

// ── Rendelés leadása ──────────────────────────────────────────────────────────

app.post('/api/rendelesek', async (req, res) => {
    const vasarloAzonosito = String(req.body.vasarloAzonosito || '').trim();
    const vasarloNev = String(req.body.vasarloNev || '').trim();
    const telefon = String(req.body.telefon || '').trim();
    const email = String(req.body.email || '').trim();
    const termekek = Array.isArray(req.body.termekek) ? req.body.termekek : [];

    if (!vasarloNev || !telefon || !email) {
        return res.status(400).json({ message: 'A név, telefon és e-mail mező kitöltése kötelező.' });
    }

    if (vasarloNev.length < 3) {
        return res.status(400).json({ message: 'A név legalább 3 karakter hosszú legyen.' });
    }

    const tisztitottTelefon = telefon.replaceAll(' ', '').replaceAll('-', '');

    if (
        !(tisztitottTelefon.startsWith('+36') && tisztitottTelefon.length >= 11) &&
        !(tisztitottTelefon.startsWith('06') && tisztitottTelefon.length >= 10)
    ) {
        return res.status(400).json({ message: 'A telefonszám formátuma nem megfelelő.' });
    }

    if (!email.includes('@') || !email.includes('.') || email.indexOf('@') === 0) {
        return res.status(400).json({ message: 'Az e-mail cím formátuma nem megfelelő.' });
    }

    if (termekek.length === 0) {
        return res.status(400).json({ message: 'Nem lehet üres kosarat leadni.' });
    }

    const osszesitettTermekek = [];

    termekek.forEach(tetel => {
        const termekId = Number(tetel.termekId);
        const mennyiseg = Number(tetel.mennyiseg);

        if (Number.isInteger(termekId) && termekId > 0 && Number.isInteger(mennyiseg) && mennyiseg > 0) {
            const letezo = osszesitettTermekek.find(t => t.termekId === termekId);

            if (letezo) {
                letezo.mennyiseg += mennyiseg;
            } else {
                osszesitettTermekek.push({
                    termekId,
                    mennyiseg
                });
            }
        }
    });

    if (osszesitettTermekek.length === 0) {
        return res.status(400).json({ message: 'A kosárban nincs érvényes termék.' });
    }

    let transaction;

    try {
        const pool = await poolPromise;

        let kedvezmenySzazalek = 0;

        if (vasarloAzonosito !== '') {
            const diakResult = await pool.request()
                .input('azonosito', sql.NVarChar(50), vasarloAzonosito)
                .query(`
                    SELECT Id
                    FROM Diak
                    WHERE Azonosito = @azonosito
                `);

            if (diakResult.recordset.length === 0) {
                return res.status(400).json({ message: 'A megadott diákazonosító nem található az adatbázisban.' });
            }

            kedvezmenySzazalek = 20;
        }

        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const termekRequest = new sql.Request(transaction);

        const idParameterek = osszesitettTermekek.map((tetel, index) => {
            const paramNev = `id${index}`;
            termekRequest.input(paramNev, sql.Int, tetel.termekId);
            return `@${paramNev}`;
        });

        const termekResult = await termekRequest.query(`
            SELECT
                Id,
                Nev,
                Egysegar,
                Keszlet,
                Elerheto
            FROM Termek WITH (UPDLOCK, HOLDLOCK)
            WHERE Id IN (${idParameterek.join(', ')})
        `);

        if (termekResult.recordset.length !== osszesitettTermekek.length) {
            await transaction.rollback();
            return res.status(404).json({ message: 'A kosárban olyan termék szerepel, amely nem található.' });
        }

        let osszeg = 0;

        for (const tetel of osszesitettTermekek) {
            const termek = termekResult.recordset.find(t => Number(t.Id) === Number(tetel.termekId));

            if (!termek || termek.Elerheto === false || termek.Elerheto === 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'A kosárban nem elérhető termék szerepel.' });
            }

            if (tetel.mennyiseg > Number(termek.Keszlet)) {
                await transaction.rollback();
                return res.status(400).json({
                    message: `A(z) ${termek.Nev} termékből csak ${termek.Keszlet} db van készleten.`
                });
            }

            osszeg += Number(termek.Egysegar) * Number(tetel.mennyiseg);
        }

        const kedvezmenyOsszeg = Math.round(osszeg * kedvezmenySzazalek / 100);
        const fizetendoOsszeg = osszeg - kedvezmenyOsszeg;

        const rendelesRequest = new sql.Request(transaction);

        const rendelesResult = await rendelesRequest
            .input('vasarloAzonosito', sql.NVarChar(50), vasarloAzonosito || null)
            .input('vasarloNev', sql.NVarChar(100), vasarloNev)
            .input('telefon', sql.NVarChar(50), telefon)
            .input('email', sql.NVarChar(100), email)
            .input('kedvezmenySzazalek', sql.Int, kedvezmenySzazalek)
            .input('osszeg', sql.Int, osszeg)
            .input('kedvezmenyOsszeg', sql.Int, kedvezmenyOsszeg)
            .input('fizetendoOsszeg', sql.Int, fizetendoOsszeg)
            .query(`
                INSERT INTO Rendeles
                    (VasarloAzonosito, VasarloNev, Telefon, Email, KedvezmenySzazalek, Osszeg, KedvezmenyOsszeg, FizetendoOsszeg)
                OUTPUT INSERTED.Id
                VALUES
                    (@vasarloAzonosito, @vasarloNev, @telefon, @email, @kedvezmenySzazalek, @osszeg, @kedvezmenyOsszeg, @fizetendoOsszeg)
            `);

        const rendelesId = rendelesResult.recordset[0].Id;

        for (const tetel of osszesitettTermekek) {
            const termek = termekResult.recordset.find(t => Number(t.Id) === Number(tetel.termekId));
            const tetelOsszeg = Number(termek.Egysegar) * Number(tetel.mennyiseg);

            const tetelRequest = new sql.Request(transaction);

            await tetelRequest
                .input('rendelesId', sql.Int, rendelesId)
                .input('termekId', sql.Int, tetel.termekId)
                .input('mennyiseg', sql.Int, tetel.mennyiseg)
                .input('egysegar', sql.Int, termek.Egysegar)
                .input('tetelOsszeg', sql.Int, tetelOsszeg)
                .query(`
                    INSERT INTO RendelesTetel
                        (RendelesId, TermekId, Mennyiseg, Egysegar, TetelOsszeg)
                    VALUES
                        (@rendelesId, @termekId, @mennyiseg, @egysegar, @tetelOsszeg)
                `);

            const keszletRequest = new sql.Request(transaction);

            await keszletRequest
                .input('termekId', sql.Int, tetel.termekId)
                .input('mennyiseg', sql.Int, tetel.mennyiseg)
                .query(`
                    UPDATE Termek
                    SET Keszlet = Keszlet - @mennyiseg
                    WHERE Id = @termekId
                `);
        }

        await transaction.commit();

        res.status(201).json({
            message: 'A rendelés sikeresen rögzítve.',
            rendelesId,
            kedvezmenySzazalek,
            osszeg,
            kedvezmenyOsszeg,
            fizetendoOsszeg
        });
    } catch (error) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch {}
        }

        res.status(500).json({ message: 'Hiba történt a rendelés mentése közben.' });
    }
});

// ── Ismeretlen végpont ────────────────────────────────────────────────────────

app.use((req, res) => {
    res.status(404).json({ message: 'A keresett végpont nem található.' });
});

// ── Szerver indítása ──────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`A szerver fut: http://localhost:${PORT}`);
});