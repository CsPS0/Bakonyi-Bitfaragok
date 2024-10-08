//Játék

let palyaMeret = 5;
let lepesekSzama = 10;
let gyumolcsokSzama = 0;
let legjobbEredmeny = 0;
let palya = [];
let jatekosPozicio = { x: 0, y: 0 };

const lepesekElem = document.getElementById('lepesek');
const gyumolcsokElem = document.getElementById('gyumolcsok');
const legjobbElem = document.getElementById('lgjb-eredmeny');
const jatekterElem = document.getElementById('jatekter');

function palyaGeneralasa() {
    for (let i = 0; i < palyaMeret; i++) {
        palya[i] = [];
        for (let j = 0; j < palyaMeret; j++) {
            let mezoErtek = Math.random() < 0.5 ? 'gyumolcs' : 'ures';
            palya[i][j] = mezoErtek;
        }
    }
    jatekosPozicio = { x: Math.floor(Math.random() * palyaMeret), y: Math.floor(Math.random() * palyaMeret) };
}

function palyaKirajzolasa() {
    jatekterElem.innerHTML = '';
    for (let i = 0; i < palyaMeret; i++) {
        for (let j = 0; j < palyaMeret; j++) {
            const mezo = document.createElement('div');
            mezo.classList.add('mezo', palya[i][j]);
            if (i === jatekosPozicio.x && j === jatekosPozicio.y) {
                mezo.classList.add('jatekos');
            }
            jatekterElem.appendChild(mezo);
        }
    }
}

function jatekosMozgatasa(irany) {
    if (lepesekSzama <= 0) return;

    switch (irany) {
        case 'fel':
            if (jatekosPozicio.x > 0) jatekosPozicio.x--;
            break;
        case 'le':
            if (jatekosPozicio.x < palyaMeret - 1) jatekosPozicio.x++;
            break;
        case 'balra':
            if (jatekosPozicio.y > 0) jatekosPozicio.y--;
            break;
        case 'jobbra':
            if (jatekosPozicio.y < palyaMeret - 1) jatekosPozicio.y++;
            break;
    }

    if (palya[jatekosPozicio.x][jatekosPozicio.y] === 'gyumolcs') {
        gyumolcsokSzama++;
        palya[jatekosPozicio.x][jatekosPozicio.y] = 'ures';
    }

    lepesekSzama--;
    lepesekElem.textContent = lepesekSzama;
    gyumolcsokElem.textContent = gyumolcsokSzama;

    if (lepesekSzama === 0) {
        jatekVege();
    }

    palyaKirajzolasa();
}

function jatekVege() {
    if (gyumolcsokSzama > legjobbEredmeny) {
        legjobbEredmeny = gyumolcsokSzama;
        alert(`Játék vége! Legjobb eredmény: ${legjobbEredmeny}`);
    } else {
        alert(`Játék vége! Gyümölcsök: ${gyumolcsokSzama}`);
    }
    legjobbElem.textContent = legjobbEredmeny;
}

function ujraindit() {
    lepesekSzama = 10;
    gyumolcsokSzama = 0;
    palyaGeneralasa();
    palyaKirajzolasa();
    lepesekElem.textContent = lepesekSzama;
    gyumolcsokElem.textContent = gyumolcsokSzama;
}

function kepessegAtlo() {
    if (lepesekSzama > 0) {
        jatekosPozicio.x = Math.max(0, jatekosPozicio.x - 1);
        jatekosPozicio.y = Math.max(0, jatekosPozicio.y - 1);
        jatekosMozgatasa('');
    }
}

function kepessegTeleport() {
    if (lepesekSzama > 0) {
        jatekosPozicio = {
            x: Math.floor(Math.random() * palyaMeret),
            y: Math.floor(Math.random() * palyaMeret)
        };
        jatekosMozgatasa('');
    }
}

function kepessegSzomszed() {
    let szomszedok = [
        { x: jatekosPozicio.x - 1, y: jatekosPozicio.y },
        { x: jatekosPozicio.x + 1, y: jatekosPozicio.y },
        { x: jatekosPozicio.x, y: jatekosPozicio.y - 1 },
        { x: jatekosPozicio.x, y: jatekosPozicio.y + 1 }
    ];

    szomszedok.forEach(szomszed => {
        if (szomszed.x >= 0 && szomszed.x < palyaMeret && szomszed.y >= 0 && szomszed.y < palyaMeret) {
            if (palya[szomszed.x][szomszed.y] === 'gyumolcs') {
                gyumolcsokSzama++;
                palya[szomszed.x][szomszed.y] = 'ures';
            }
        }
    });
    gyumolcsokElem.textContent = gyumolcsokSzama;
    palyaKirajzolasa();
}

document.getElementById('ujra').addEventListener('click', ujraindit);
document.getElementById('atlo').addEventListener('click', kepessegAtlo);
document.getElementById('teleport').addEventListener('click', kepessegTeleport);
document.getElementById('szomszed').addEventListener('click', kepessegSzomszed);

ujraindit();

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            jatekosMozgatasa('fel');
            break;
        case 'ArrowDown':
            jatekosMozgatasa('le');
            break;
        case 'ArrowLeft':
            jatekosMozgatasa('balra');
            break;
        case 'ArrowRight':
            jatekosMozgatasa('jobbra');
            break;
    }
});

//Tutorial
const ablak = document.getElementById("tutorialAblak");
const megnyitasGomb = document.getElementById("tutorialGomb");
const bezarasGomb = document.getElementById("tutorialBezarasGomb");

megnyitasGomb.onclick = function() {
    ablak.style.display = "block";
}

bezarasGomb.onclick = function() {
    ablak.style.display = "none";
}

window.onclick = function(esemeny) {
    if (esemeny.target == ablak) {
        ablak.style.display = "none";
    }
}