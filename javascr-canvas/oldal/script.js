const vászon = document.getElementById('jatekvászon');
const ctx = vászon.getContext('2d');

const varosSugara = 20;
const muhelySugara = 30;
const szolgaltatasiKor = 100;

let varosok = [
    { x: 150, y: 100, akkumulator: 'A', tipus: 'egyszeres', kiszolgalva: false },
    { x: 400, y: 200, akkumulator: 'B', tipus: 'egyszeres', kiszolgalva: false },
    { x: 600, y: 400, akkumulator: 'C', tipus: 'egyszeres', kiszolgalva: false },
    { x: 200, y: 500, akkumulator: 'A', tipus: 'dupla', akkumulator2: 'B', kiszolgalva: false },
];

let muhelyek = [];
let maxMuhelyek = 3;
let elerhetoMuhelyek = [
    { tipus: 'A', elhelyezett: false },
    { tipus: 'B', elhelyezett: false },
    { tipus: 'C', elhelyezett: false }
];

function varosokRajzolasa() {
    varosok.forEach(varos => {
        ctx.beginPath();
        ctx.arc(varos.x, varos.y, varosSugara, 0, 2 * Math.PI);
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
        ctx.arc(muhely.x, muhely.y, muhelySugara, 0, 2 * Math.PI);
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

function rajzol() {
    ctx.clearRect(0, 0, vászon.width, vászon.height);
    varosokRajzolasa();
    muhelyekRajzolasa();
}

vászon.addEventListener('click', (e) => {
    if (muhelyek.length >= maxMuhelyek) {
        document.getElementById('allapot').innerText = "Nincs több elhelyezhető műhely.";
        return;
    }

    const x = e.offsetX;
    const y = e.offsetY;

    let kivalasztottMuhely = elerhetoMuhelyek.find(m => !m.elhelyezett);
    if (kivalasztottMuhely) {
        muhelyek.push({ x, y, tipus: kivalasztottMuhely.tipus });
        kivalasztottMuhely.elhelyezett = true;
        varosokFrissitese();
        rajzol();
    }
});

document.getElementById('megoldasEllenorzese').addEventListener('click', () => {
    const mindKiszolgalva = varosok.every(varos => varos.kiszolgalva);
    document.getElementById('allapot').innerText = mindKiszolgalva ? 
        "Gratulálok! Minden város ki van szolgálva." : 
        "Nem minden város van kiszolgálva.";
});

rajzol();