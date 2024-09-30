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
    megjelenitTankolasok();
    haviKoltsegSzamitas();
    hatékonysagSzamitas();
});

function megjelenitTankolasok(szurtTankolasok = null) {
    let naplo = document.getElementById("tankolasi-naplo");
    naplo.innerHTML = `<h2>Tankolási Napló</h2>`;
    const records = szurtTankolasok || tankolasok;
    records.forEach((t) => {
        naplo.innerHTML += `<p>Dátum: ${t.datum.toLocaleDateString()}, Mennyiség: ${t.mennyiseg}L, Összeg: ${t.koltseg}Ft, Km: ${t.km}</p>`;
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
    let haviKoltsegSection = document.querySelector(".naplo-container h2:first-of-type");
    haviKoltsegSection.innerHTML = "Havi költségek";
    for (let honap in haviKoltsegek) {
        haviKoltsegSection.innerHTML += `<p>${honap}: ${haviKoltsegek[honap].toFixed(2)} Ft</p>`;
    }
}

function datumIntervallumSzures(startDate, endDate) {
    let szurt = tankolasok.filter(t => t.datum >= new Date(startDate) && t.datum <= new Date(endDate));
    megjelenitTankolasok(szurt);
}

function hatékonysagSzamitas() {
    if (tankolasok.length < 2) return;
    let hatekonysagAdatok = [];
    for (let i = 1; i < tankolasok.length; i++) {
        let eloző = tankolasok[i - 1];
        let jelenlegi = tankolasok[i];
        let megtettKm = jelenlegi.km - eloző.km;
        let felhasznaltUzany = eloző.mennyiseg; // Feltételezzük, hogy minden tankolásnál tele tankolunk
        let hatekonysag = megtettKm / felhasznaltUzany;
        hatekonysagAdatok.push({
            datum: jelenlegi.datum,
            megtettKm: megtettKm,
            felhasznaltUzany: felhasznaltUzany,
            hatekonysag: hatekonysag
        });
    }

    hatekonysagAdatok.sort((a, b) => b.hatekonysag - a.hatekonysag);
    let hatekonysagSection = document.querySelector(".naplo-container h2:last-of-type");
    hatekonysagSection.innerHTML = "Hatékonyság szerinti rangsor";
    hatekonysagAdatok.forEach((adat) => {
        hatekonysagSection.innerHTML += `<p>Dátum: ${adat.datum.toLocaleDateString()}, Kilométer: ${adat.megtettKm}, Fogyasztás: ${adat.felhasznaltUzany}L, Hatékonyság: ${adat.hatekonysag.toFixed(2)} km/L</p>`;
    });
}

document.getElementById("dateFilterForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    datumIntervallumSzures(startDate, endDate);
});