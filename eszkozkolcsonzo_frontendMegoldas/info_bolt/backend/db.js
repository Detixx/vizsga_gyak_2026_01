require('dotenv').config();

const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Sikeres adatbázis-kapcsolat.');
        return pool;
    })
    .catch(error => {
        console.log('Adatbázis-kapcsolati hiba:', error);
    });

module.exports = {
    sql,
    poolPromise
};