let tankolasok = [];

document.getElementById("tankolasForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let datum = document.getElementById("datum").value;
    let mennyiseg = parseFloat(document.getElementById("mennyiseg").value);
    let koltseg = parseFloat(document.getElementById("koltseg").value);
    let km = parseFloat(document.getElementById("km").value);
    let tankolas = {
        datum: new Date(datum),
        mennyiseg: mennyiseg,
        koltseg: koltseg,
        km: km
    };
    tankolasok.push(tankolas);
    tankolasok.sort((a, b) => a.datum - b.datum);
    megjelenitTankolasok();
    haviKoltsegSzamitas();
    hatekonysagSzamitas();
});

function megjelenitTankolasok(szurtTankolasok = null) {
    let naplo = document.getElementById("tankolasi-naplo");
    naplo.innerHTML = `<h2>Tankolási bejegyzések</h2>`;
    const bejegyzesek = szurtTankolasok || tankolasok;
    bejegyzesek.forEach((t) => {
        naplo.innerHTML += `<p>Dátum: ${t.datum.toLocaleDateString()}, Mennyiség: ${t.mennyiseg.toFixed(2)}L, Összeg: ${t.koltseg.toFixed(0)}Ft, Km: ${t.km}</p>`;
    });
}

function haviKoltsegSzamitas() {
    let haviKoltsegek = {};
    tankolasok.forEach((t) => {
        let honap = `${t.datum.getFullYear()}-${(t.datum.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!haviKoltsegek[honap]) {
            haviKoltsegek[honap] = 0;
        }
        haviKoltsegek[honap] += t.koltseg;
    });
    let haviKoltsegDiv = document.getElementById("havi-koltsegek");
    haviKoltsegDiv.innerHTML = "";
    for (let honap in haviKoltsegek) {
        haviKoltsegDiv.innerHTML += `<p>${honap}: ${haviKoltsegek[honap].toFixed(0)} Ft</p>`;
    }
}

function datumIntervallumSzures(kezdoDatum, vegDatum) {
    let szurt = tankolasok.filter(t => t.datum >= new Date(kezdoDatum) && t.datum <= new Date(vegDatum));
    megjelenitTankolasok(szurt);
}

function hatekonysagSzamitas() {
    if (tankolasok.length < 2) return;
    let hatekonysagAdatok = [];
    for (let i = 1; i < tankolasok.length; i++) {
        let elozo = tankolasok[i - 1];
        let jelenlegi = tankolasok[i];
        let megtettKm = jelenlegi.km - elozo.km;
        let felhasznaltUzemanyag = jelenlegi.mennyiseg;
        let atlagFogyasztas = (felhasznaltUzemanyag / megtettKm) * 100; // L/100km
        hatekonysagAdatok.push({
            kezdoDatum: elozo.datum,
            vegDatum: jelenlegi.datum,
            megtettKm: megtettKm,
            felhasznaltUzemanyag: felhasznaltUzemanyag,
            atlagFogyasztas: atlagFogyasztas
        });
    }

    hatekonysagAdatok.sort((a, b) => a.atlagFogyasztas - b.atlagFogyasztas);
    let hatekonysagDiv = document.getElementById("hatekonysag-rangsor");
    hatekonysagDiv.innerHTML = "";
    hatekonysagAdatok.forEach((adat) => {
        hatekonysagDiv.innerHTML += `<p>${adat.kezdoDatum.toLocaleDateString()} - ${adat.vegDatum.toLocaleDateString()}: ${adat.megtettKm.toFixed(0)} km, ${adat.felhasznaltUzemanyag.toFixed(2)}L, Átlagfogyasztás: ${adat.atlagFogyasztas.toFixed(2)} L/100km</p>`;
    });
}

document.getElementById("datumSzuroForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let kezdoDatum = document.getElementById("kezdoDatum").value;
    let vegDatum = document.getElementById("vegDatum").value;
    datumIntervallumSzures(kezdoDatum, vegDatum);
});