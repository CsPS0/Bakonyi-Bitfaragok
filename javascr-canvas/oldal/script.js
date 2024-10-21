const vaszon = document.getElementById('jatekVaszon');
const ctx = vaszon.getContext('2d');

const varosSugar = 20;
const muhelySugar = 30;
const szervizSugar = 100;

let varosok = [
  { x: 150, y: 100, akkumulátor: 'A', tipus: 'egyes', kiszolgalva: false },
  { x: 400, y: 200, akkumulátor: 'B', tipus: 'egyes', kiszolgalva: false },
  { x: 600, y: 400, akkumulátor: 'C', tipus: 'egyes', kiszolgalva: false },
  { x: 200, y: 500, akkumulátor: 'A', tipus: 'kettes', akkumulátor2: 'B', kiszolgalva: false },
];

let muhelyek = [];
let maxMuhelyek = 3;
let elerhetoMuhelyek = [
  { tipus: 'A', elhelyezve: false },
  { tipus: 'B', elhelyezve: false },
  { tipus: 'C', elhelyezve: false }
];

function rajzolVarosok() {
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
    ctx.fillText(varos.akkumulátor, varos.x - 5, varos.y + 5);

    if (varos.tipus === 'kettes') {
      ctx.fillText(varos.akkumulátor2, varos.x - 5, varos.y + 20);
    }
  });
}

function rajzolMuhelyek() {
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
    ctx.arc(muhely.x, muhely.y, szervizSugar, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.2)';
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Roboto';
    ctx.fillText(muhely.tipus, muhely.x - 5, muhely.y + 5);
  });
}

function ellenorizVarosKiszolgalt(varos) {
  return muhelyek.some(muhely => {
    const tavolsag = Math.hypot(varos.x - muhely.x, varos.y - muhely.y);
    if (tavolsag <= szervizSugar) {
      if (varos.tipus === 'egyes' && muhely.tipus === varos.akkumulátor) {
        return true;
      } else if (varos.tipus === 'kettes' && 
        (muhely.tipus === varos.akkumulátor || muhely.tipus === varos.akkumulátor2)) {
        return true;
      }
    }
    return false;
  });
}

function frissitVarosAllapot() {
  varosok.forEach(varos => {
    varos.kiszolgalva = ellenorizVarosKiszolgalt(varos);
  });
}

function rajzol() {
  ctx.clearRect(0, 0, vaszon.width, vaszon.height);
  rajzolVarosok();
  rajzolMuhelyek();
}

vaszon.addEventListener('click', (e) => {
  if (muhelyek.length >= maxMuhelyek) {
    document.getElementById('allapot').innerText = "Nincs több elhelyezhető műhely.";
    return;
  }

  const x = e.offsetX;
  const y = e.offsetY;

  let kivalasztottMuhely = elerhetoMuhelyek.find(m => !m.elhelyezve);
  if (kivalasztottMuhely) {
    muhelyek.push({ x, y, tipus: kivalasztottMuhely.tipus });
    kivalasztottMuhely.elhelyezve = true;
    frissitVarosAllapot();
    rajzol();
  }
});

document.getElementById('megoldasEllenorzese').addEventListener('click', () => {
  const mindenKiszolgalva = varosok.every(varos => varos.kiszolgalva);
  if (mindenKiszolgalva) {
    document.getElementById('allapot').innerText = "Gratulálok! Minden város ki van szolgálva.";
  } else {
    document.getElementById('allapot').innerText = "Nem minden város van kiszolgálva.";
  }
});

rajzol();
