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
        varosok: [
            { x: 150, y: 100, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 400, y: 200, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 600, y: 400, akkumulator: 'C', tipus: 'egyszeres' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' },
            { tipus: 'B' },
            { tipus: 'C' }
        ]
    },
    {
        varosok: [
            { x: 150, y: 100, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 400, y: 200, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 600, y: 400, akkumulator: 'C', tipus: 'egyszeres' },
            { x: 200, y: 500, akkumulator: 'A', tipus: 'dupla', akkumulator2: 'B' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' },
            { tipus: 'B' },
            { tipus: 'C' }
        ]
    },
    {
        varosok: [
            { x: 100, y: 100, akkumulator: 'A', tipus: 'egyszeres' },
            { x: 300, y: 200, akkumulator: 'B', tipus: 'egyszeres' },
            { x: 500, y: 300, akkumulator: 'C', tipus: 'egyszeres' },
            { x: 700, y: 400, akkumulator: 'A', tipus: 'dupla', akkumulator2: 'C' },
            { x: 200, y: 500, akkumulator: 'B', tipus: 'dupla', akkumulator2: 'C' }
        ],
        elerhetoMuhelyek: [
            { tipus: 'A' },
            { tipus: 'B' },
            { tipus: 'C' },
            { tipus: 'A' }
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
        ctx.beginPath();
        ctx.arc(varos.x, varos.y, varosSugar, 0, 2 * Math.PI);
        ctx.fillStyle = varos.kiszolgalva ? '#28a745' : '#dc3545';
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
    return muhelyek.some(muhely => {
        const tavolsag = Math.hypot(varos.x - muhely.x, varos.y - muhely.y);
        if (tavolsag <= szolgaltatasiKor) {
            if (varos.tipus === 'egyszeres' && muhely.tipus === varos.akkumulator) {
                return true;
            } else if (varos.tipus === 'dupla' && 
                (muhely.tipus === varos.akkumulator || muhely.tipus === varos.akkumulator2)) {
                return true;
            }
        }
        return false;
    });
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

function rajzol() {
    ctx.clearRect(0, 0, vaszon.width, vaszon.height);
    varosokRajzolasa();
    muhelyekRajzolasa();
}

document.getElementById('feladvanybetoltes').addEventListener('click', () => {
    const index = parseInt(document.getElementById('feladvanylista').value) - 1;
    feladvanybetoltes(index);
});

document.getElementById('megoldasEllenorzese').addEventListener('click', () => {
    const mindKiszolgalva = varosok.every(varos => varos.kiszolgalva);
    if (mindKiszolgalva) {
        document.getElementById('allapot').innerText = "Gratulálok! Minden város ki van szolgálva.";
    } else {
        const hianyosVarosok = varosok.filter(varos => !varos.kiszolgalva).map(varos => varos.akkumulator).join(', ');
        document.getElementById('allapot').innerText = `Nem minden város van kiszolgálva. Hiányos városok: ${hianyosVarosok}`;
    }
});

feladvanybetoltes(0);