const API_URL = "http://localhost:4000/api";
const KOSAR_KULCS = "termekbolt_kosar";



// ─────────────────────────────────────────────────────────────
// Termékek lekérése és kártyák dinamikus megjelenítése
// ─────────────────────────────────────────────────────────────
/* const TERMEK_KEPEK = {

     Laptop ;  laptop.jpg ,
     Tablet ;  tablet.jpg ,
     Pendrive ;  pendrive.jpg ,
     Webkamera ;  webkamera.jpg ,
     Fejhallgató ;  fejhallgato.jpg ,
     Billentyűzet ;  billentyuzet.jpg ,
     Vezeték nélküli egér ;  eger.jpg ,
     Egérpad ;  egerpad.jpg ,
     Laptop táska ;  laptop-taska.jpg ,
     USB-C töltő ;  usb-c-tolto.jpg ,
     HDMI kábel ;  hdmi-kabel.jpg ,
     USB elosztó ;  usb-eloszto.jpg ,
     Külső merevlemez ;  kulso-merevlemez.jpg ,
     Monitor ;  monitor.jpg ,
     Laptop állvány ;  laptop-allvany.jpg 
}; */

let kosar = [];
let termekek = [];

/* function termekekBetoltese() {
    const termekKartyaTarolo = document.getElementById("termekKartyaTarolo");

    if (!termekKartyaTarolo) {
        return;
    }

    termekKartyaTarolo.innerHTML = "";



            termekek.forEach(termek => {
                termekKartyaTarolo.innerHTML += `
                    <div class="col-12 col-md-6 col-xl-3 mb-3">
                        <div class="termek-kartya card">
                            <img src="" alt="">

                            <div class="card-body">
                                <h3 class="card-title"></h3>
                                <p class="termek-meta mb-2">Egységár:  Ft</p>
                                <p class="termek-meta mb-2">Készleten:  db</p>
                                <p class="card-text mb-0"></p>
                            </div>

                            <div class="card-footer">
                                <button class="btn btn-sajat w-100"
                                    onclick="termekModalMegnyitasa()">
                                    Tovább
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        })

} */

// ─────────────────────────────────────────────────────────────
// Modal ablak megnyitása
// A termékek listájának megjelenítése a modalban
// ─────────────────────────────────────────────────────────────

function termekModalMegnyitasa() {
    const modalCim = document.getElementById("modalCim");
    const termekLista = document.getElementById("termekLista");

    modalCim.innerText = "";
    termekLista.innerHTML = "";

    termekek.forEach(termek => {
        termekLista.innerHTML += `
            <div class="termek-lista-sor d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                 style="border-bottom: 1px solid #ddd;">
                
                <div class="termek-lista-adat">
                    <strong></strong>
                    <span> Ft</span>
                </div>

                <div class="termek-lista-muvelet d-flex align-items-center gap-2">
                    <input id="qty-${termek.Id}"
                           class="form-control form-control-sm"
                           type="number"
                           min="0"
                           max=""
                           value="0"
                           style="width: 70px; text-align: center;">

                    <button class="btn btn-sajat btn-sm"
                        onclick="kosarbaTesz(1, 'aaa', 120, 10)">
                        Kosárba
                    </button>
                </div>
            </div>
        `;
    });

    const modal = new bootstrap.Modal(document.getElementById("termekModal"));
    modal.show();
}

// ─────────────────────────────────────────────────────────────
// Kosárba helyezés
// ─────────────────────────────────────────────────────────────

function kosarbaTesz(termekId, nev, egysegar, keszlet) {

}

// ─────────────────────────────────────────────────────────────
// Kosár mentése localStorage-be
// ─────────────────────────────────────────────────────────────

function kosarMentes() {

}

// ─────────────────────────────────────────────────────────────
// Kosár betöltése localStorage-ből
// ─────────────────────────────────────────────────────────────

function kosarBetoltes() {
    const mentes = localStorage.getItem(KOSAR_KULCS);

    if (mentes) {
        kosar = JSON.parse(mentes);
    }
}

// ─────────────────────────────────────────────────────────────
// Diákazonosító ellenőrzése
// ─────────────────────────────────────────────────────────────

function diakEllenorzese() {
    const diakAzonosito = document.getElementById("diakAzonosito");
    const vasarloNev = document.getElementById("vasarloNev");
    const telefon = document.getElementById("telefon");
    const email = document.getElementById("email");

    const azonosito = diakAzonosito.value.trim();

    if (azonosito === "") {
        alert("A diákazonosító megadása kötelező.");
        return;
    }

    fetch(API_URL + "/diakok/" + azonosito)
        .then(valasz => {

        })
        .then(adat => {

        })
        .catch(hiba => {

        });
}

// ─────────────────────────────────────────────────────────────
// Kosár tartalmának megjelenítése
// Ahogy betöltődik a rendeles.html oldal, rögtön lefut.
// ─────────────────────────────────────────────────────────────

function kosarTartalma() {
    const kosarTartalom = document.getElementById("kosarTartalom");
    const osszeg = document.getElementById("osszeg");
    const kedvezmenyOsszeg = document.getElementById("kedvezmenyOsszeg");
    const fizetendoOsszeg = document.getElementById("fizetendoOsszeg");
    const diakAzonosito = document.getElementById("diakAzonosito");

    if (!kosarTartalom) {
        return;
    }

    kosarTartalom.innerHTML = "";

    if (kosar.length === 0) {

        return;
    }

    let teljesOsszeg = 0;

    kosar.forEach((tetel, index) => {
        kosarTartalom.innerHTML += `
            <div class="kosar-lista-sor d-flex justify-content-between align-items-center mb-2">
                <div class="kosar-lista-adat">
                    <strong></strong><br>
                    <span> db ×  Ft</span>
                </div>

                <div class="kosar-lista-muvelet text-end">
                    <strong> Ft</strong><br>
                    <button class="btn btn-outline-danger btn-sm mt-1"
                        onclick="">
                        Eltávolítás
                    </button>
                </div>
            </div>
        `;
    });
}

// ─────────────────────────────────────────────────────────────
// Kosártétel törlése
// ─────────────────────────────────────────────────────────────

function kosarTetelTorlese(index) {

}

// ─────────────────────────────────────────────────────────────
// Kosár ürítése
// ─────────────────────────────────────────────────────────────

function kosarUritese() {

}

// ─────────────────────────────────────────────────────────────
// Rendelés leadása
// ─────────────────────────────────────────────────────────────

function rendelesLeadasa() {

}

// ─────────────────────────────────────────────────────────────
// Oldalbetöltéskor lefutó műveletek
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    kosarBetoltes();
    termekekBetoltese();
    kosarTartalma();

    const termekekLekerdezesGomb = document.getElementById("termekekLekerdezesGomb");
    const diakEllenorzesGomb = document.getElementById("diakEllenorzesGomb");
    const diakAzonosito = document.getElementById("diakAzonosito");
    const rendelesLeadasGomb = document.getElementById("rendelesLeadasGomb");
    const kosarUriteseGomb = document.getElementById("kosarUriteseGomb");

    if (termekekLekerdezesGomb) {
        termekekLekerdezesGomb.onclick = termekekBetoltese;
    }

    if (diakEllenorzesGomb) {
        diakEllenorzesGomb.onclick = diakEllenorzese;
    }

    if (diakAzonosito) {
        diakAzonosito.oninput = () => {

        };
    }

    if (rendelesLeadasGomb) {
        rendelesLeadasGomb.onclick = rendelesLeadasa;
    }

    if (kosarUriteseGomb) {
        kosarUriteseGomb.onclick = kosarUritese;
    }

    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                bsCollapse.hide();
            });
        });
    }
});