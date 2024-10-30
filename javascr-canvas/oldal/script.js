const vaszon = document.getElementById('jatekVaszon');
const ctx = vaszon.getContext('2d');

const varosSugar = 20;
const muhelySugar = 30;
const szolgaltatasiKor = 100;

let varosok = [];
let muhelyek = [];
let maxMuhelyek = 3;
let elerhetoMuhelyek = [];

const feladvanyek = [
    {
        // Nagyon könnyű: A, B, C telepek
        varosok: [
            { x: 321, y: 153, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 456, y: 278, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 689, y: 423, akkumulator: 'C', tipus: 'egyszeres' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' }, { tipus: 'B' }, { tipus: 'C' }
        ]
    },
    {
        // Könnyű: A, B, C, D telepek
        varosok: [
            { x: 135, y: 207, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 457, y: 350, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 234, y: 487, akkumulator: 'C', tipus: 'egyszeres' },
            { x: 601, y: 112, akkumulator: 'D', tipus: 'egyszeres' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' }, { tipus: 'B' }, { tipus: 'C' }, { tipus: 'D' }
        ]
    },
    {
        // Közepes: A, B, C, D; valamelyiknek 2 is kell
        varosok: [
            { x: 211, y: 345, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 556, y: 212, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 678, y: 389, akkumulator: 'C', tipus: 'egyszeres' },
            { x: 333, y: 512, akkumulator: 'D', tipus: 'dupla', akkumulator2: 'C' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' }, { tipus: 'B' }, { tipus: 'C' }, { tipus: 'D' }
        ]
    },
    {
        // Nehéz: A, B, C, D, E, F; legalább 2-nek 2 plusz akkumulátor kell
        varosok: [
            { x: 123, y: 654, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 412, y: 287, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 678, y: 434, akkumulator: 'C', tipus: 'egyszeres' },
            { x: 567, y: 143, akkumulator: 'D', tipus: 'egyszeres' },
            { x: 211, y: 547, akkumulator: 'E', tipus: 'dupla', akkumulator2: 'C' },
            { x: 489, y: 333, akkumulator: 'F', tipus: 'dupla', akkumulator2: 'B' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' }, { tipus: 'B' }, { tipus: 'C' }, { tipus: 'D' }, { tipus: 'E' }, { tipus: 'F' }
        ]
    },
    {
        // Ultra Nehéz: A, B, C, D, E, F, G, H; valamelyiknek 3 kell, és legalább 2-nek 2db
        varosok: [
            { x: 222, y: 333, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 434, y: 678, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 678, y: 300, akkumulator: 'C', tipus: 'egyszeres' },
            { x: 123, y: 478, akkumulator: 'D', tipus: 'egyszeres' },
            { x: 390, y: 567, akkumulator: 'E', tipus: 'dupla', akkumulator2: 'D' },
            { x: 512, y: 340, akkumulator: 'F', tipus: 'dupla', akkumulator2: 'C' },
            { x: 211, y: 432, akkumulator: 'G', tipus: 'dupla', akkumulator2: 'A' },
            { x: 678, y: 412, akkumulator: 'H', tipus: 'tripla', akkumulator2: 'B', akkumulator3: 'C' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' }, { tipus: 'B' }, { tipus: 'C' }, { tipus: 'D' }, { tipus: 'E' }, { tipus: 'F' }, { tipus: 'G' }, { tipus: 'H' }
        ]
    }
];

function feladvanybetoltes(index) {
    const feladvany = feladvanyek[index];
    varosok = feladvany.varosok.map(v => ({...v, kiszolgalva: false}));
    elerhetoMuhelyek = feladvany.elerhetoMuhelyek.map(m => ({...m, elhelyezett: false}));
    muhelyek = [];
    maxMuhelyek = elerhetoMuhelyek.length;
    muhelyekFrissitese();
    rajzol();
}

function varosokRajzolasa() {
    varosok.forEach(varos => {
        const kiszolgalasiAllapot = varosKiszolgalasEllenorzes(varos);

        ctx.beginPath();
        ctx.arc(varos.x, varos.y, varosSugar, 0, 2 * Math.PI);

        // Szín beállítása a kiszolgálási állapot alapján
        if (kiszolgalasiAllapot === 'teljes') {
            ctx.fillStyle = '#28a745';  // Zöld teljes kiszolgálásnál
        } else if (kiszolgalasiAllapot === 'reszleges' && varos.tipus === 'dupla') {
            ctx.fillStyle = '#800080';  // Lila részleges duplánál (2/1)
        } else if (kiszolgalasiAllapot === 'reszleges' && varos.tipus === 'tripla') {
            ctx.fillStyle = '#FFD700';  // Sárga részleges triplánál (3/2)
        } else {
            ctx.fillStyle = '#dc3545';  // Piros ha nincs kiszolgálva
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Roboto';
        ctx.fillText(varos.akkumulator, varos.x - 5, varos.y + 5);

        if (varos.tipus === 'dupla') {
            ctx.fillText(varos.akkumulator2, varos.x - 5, varos.y + 20);
        } else if (varos.tipus === 'tripla') {
            ctx.fillText(varos.akkumulator2, varos.x - 5, varos.y + 20);
            ctx.fillText(varos.akkumulator3, varos.x - 5, varos.y + 35);
        }
    });
}

function muhelyekRajzolasa() {
    muhelyek.forEach(muhely => {
        ctx.beginPath();
        ctx.arc(muhely.x, muhely.y, muhelySugar, 0, 2 * Math.PI);
        ctx.fillStyle = '#007bff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(muhely.x, muhely.y, szolgaltatasiKor, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 123, 255, 0.2)';
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Roboto';
        ctx.fillText(muhely.tipus, muhely.x - 5, muhely.y + 5);
    });
}

function varosKiszolgalasEllenorzes(varos) {
    let kiszolgaltTipusok = 0;

    muhelyek.forEach(muhely => {
        const tavolsag = Math.hypot(varos.x - muhely.x, varos.y - muhely.y);

        if (tavolsag <= szolgaltatasiKor) {
            if (varos.tipus === 'egyszeres' && muhely.tipus === varos.akkumulator) {
                kiszolgaltTipusok = 1;  // Teljes kiszolgálás egyszeresnél
            } else if (varos.tipus === 'dupla' && 
                    (muhely.tipus === varos.akkumulator || muhely.tipus === varos.akkumulator2)) {
                kiszolgaltTipusok += 1;  // Részleges kiszolgálás duplánál
            } else if (varos.tipus === 'tripla' && 
                    (muhely.tipus === varos.akkumulator || muhely.tipus === varos.akkumulator2 || muhely.tipus === varos.akkumulator3)) {
                kiszolgaltTipusok += 1;  // Részleges kiszolgálás triplánál
            }
        }
    });

    // Részleges és teljes kiszolgálás ellenőrzése
    if (varos.tipus === 'egyszeres' && kiszolgaltTipusok === 1) {
        return 'teljes';
    } else if (varos.tipus === 'dupla' && kiszolgaltTipusok === 2) {
        return 'teljes';
    } else if (varos.tipus === 'tripla' && kiszolgaltTipusok === 3) {
        return 'teljes';
    } else if ((varos.tipus === 'dupla' && kiszolgaltTipusok === 1) || (varos.tipus === 'tripla' && kiszolgaltTipusok === 2)) {
        return 'reszleges';
    } else {
        return 'nincsKiszolgalva';
    }
}

function varosokFrissitese() {
    varosok.forEach(varos => {
        varos.kiszolgalva = varosKiszolgalasEllenorzes(varos);
    });
}

function muhelyekFrissitese() {
    const muhelyekDiv = document.getElementById('muhelyek');
    muhelyekDiv.innerHTML = '';
    elerhetoMuhelyek.forEach((muhely, index) => {
        const gomb = document.createElement('button');
        gomb.textContent = `${muhely.tipus} műhely`;
        gomb.disabled = muhely.elhelyezett;
        gomb.addEventListener('click', () => muhelyKivalasztas(index));
        muhelyekDiv.appendChild(gomb);
    });
}

function muhelyKivalasztas(index) {
    const kivalasztottMuhely = elerhetoMuhelyek[index];
    if (!kivalasztottMuhely.elhelyezett) {
        document.getElementById('allapot').innerText = "Kattints a vászonra a műhely elhelyezéséhez!";
        vaszon.addEventListener('click', muhelyElhelyezes);

        function muhelyElhelyezes(e) {
            const x = e.offsetX;
            const y = e.offsetY;
            muhelyek.push({ x, y, tipus: kivalasztottMuhely.tipus });
            kivalasztottMuhely.elhelyezett = true;
            vaszon.removeEventListener('click', muhelyElhelyezes);
            document.getElementById('allapot').innerText = "";
            varosokFrissitese();
            muhelyekFrissitese();
            rajzol();
        }
    }
}

// this is the backup

function rajzol() {
    ctx.clearRect(0, 0, vaszon.width, vaszon.height);
    varosokRajzolasa();
    muhelyekRajzolasa();
}

document.getElementById('feladvanybetoltes').addEventListener('click', () => {
    const index = parseInt(document.getElementById('feladvanylista').value) - 1;
    feladvanybetoltes(index);
});

const feladvanylista = document.getElementById('feladvanylista');

feladvanylista.addEventListener('change', () => {
    const index = parseInt(feladvanylista.value) - 1;
    const megerosites = confirm("Biztosan szeretnéd betölteni a " + (index + 1) + ". feladványt?");
    if (megerosites) {
        feladvanybetoltes(index);
    } else {
        feladvanylista.value = "";  // Opció törlése, ha nem töltik be
    }
});

document.getElementById('megoldasEllenorzese').addEventListener('click', () => {
    let halottakSzama = 0;
    varosok.forEach(varos => {
        const kiszolgalasiAllapot = varosKiszolgalasEllenorzes(varos);

        if (kiszolgalasiAllapot === 'nincsKiszolgalva') {
            const lakosokSzama = Math.floor(Math.random() * 5000) + 1000; // 1000-5000 lakos
            halottakSzama += lakosokSzama;
        }
    });

    if (halottakSzama === 0) {
        document.getElementById('allapot').innerText = "Gratulálok! Minden város ki van szolgálva.";
    } else {
        document.getElementById('allapot').innerText = `Nem sikerült az összes várost kiszolgálni. ${halottakSzama} ember vesztette életét.`;
    }
});

// Sötét mód
const sotetGomb = document.getElementById('sotetGomb');
const napIkon = document.querySelector('.nap-ikon');
const holdIkon = document.querySelector('.hold-ikon');

if (localStorage.getItem('sotet-mod') === 'enabled') {
    document.body.classList.add('sotet-mod');
}

sotetGomb.addEventListener('click', () => {
    document.body.classList.toggle('sotet-mod');
    if (document.body.classList.contains('sotet-mod')) {
        localStorage.setItem('sotet-mod', 'enabled');
    } else {
        localStorage.setItem('sotet-mod', 'disabled');
    }
});

feladvanybetoltes(0);