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

let kepessegHasznalat = {
    atlo: 2,
    teleport: 2,
    szomszed: 2
};

function kepessegekFrissitese() {
    document.getElementById('atlo').innerHTML = `Átlós mozgás (${kepessegHasznalat.atlo})`;
    document.getElementById('teleport').innerHTML = `Teleport (${kepessegHasznalat.teleport})`;
    document.getElementById('szomszed').innerHTML = `Szomszédos mezők szüretelése (${kepessegHasznalat.szomszed})`;
}

function palyaGeneralasa() {
    const gyumolcsok = ['alma', 'barack', 'banan', 'cseresznye'];
    for (let i = 0; i < palyaMeret; i++) {
        palya[i] = [];
        for (let j = 0; j < palyaMeret; j++) {
            if (Math.random() < 0.5) {
                const veletlenGyumolcs = gyumolcsok[Math.floor(Math.random() * gyumolcsok.length)];
                palya[i][j] = { tipus: 'gyumolcs', gyumolcs: veletlenGyumolcs };
            } else {
                palya[i][j] = { tipus: 'ures' };
            }
        }
    }
}

function palyaKirajzolasa() {
    jatekterElem.innerHTML = '';
    for (let i = 0; i < palyaMeret; i++) {
        for (let j = 0; j < palyaMeret; j++) {
            const mezo = document.createElement('div');
            mezo.classList.add('mezo', palya[i][j].tipus);
            if (palya[i][j].tipus === 'gyumolcs') {
                mezo.classList.add(palya[i][j].gyumolcs);
            }
            if (i === jatekosPozicio.x && j === jatekosPozicio.y) {
                mezo.classList.add('jatekos');
            }
            jatekterElem.appendChild(mezo);
        }
    }
}

function jatekosMozgatasa(irany) {
    if (lepesekSzama <= 0) return;

    let ujX = jatekosPozicio.x;
    let ujY = jatekosPozicio.y;

    switch (irany) {
        case 'fel': ujX--; break;
        case 'le': ujX++; break;
        case 'balra': ujY--; break;
        case 'jobbra': ujY++; break;
    }

    if (ujX >= 0 && ujX < palyaMeret && ujY >= 0 && ujY < palyaMeret) {
        jatekosPozicio = { x: ujX, y: ujY };
        if (palya[ujX][ujY].tipus === 'gyumolcs') {
            gyumolcsokSzama++;
            palya[ujX][ujY] = { tipus: 'ures' };
        }

        lepesekSzama--;
        lepesekElem.textContent = lepesekSzama;
        gyumolcsokElem.textContent = gyumolcsokSzama;

        if (lepesekSzama === 0) {
            jatekVege();
        }

        palyaKirajzolasa();
    }
}

function jatekVege() {
    if (gyumolcsokSzama > legjobbEredmeny) {
        legjobbEredmeny = gyumolcsokSzama;
        legjobbElem.textContent = legjobbEredmeny;
        alert(`Játék vége! Új legjobb eredmény: ${legjobbEredmeny}`);
    } else {
        alert(`Játék vége! Gyümölcsök: ${gyumolcsokSzama}`);
    }
}

function ujraindit(ujPalya = true) {
    lepesekSzama = 10;
    gyumolcsokSzama = 0;
    kepessegHasznalat = { atlo: 2, teleport: 2, szomszed: 2 };
    kepessegekFrissitese();

    if (ujPalya) {
        palyaGeneralasa();
    }
    
    jatekosPozicio = { x: Math.floor(palyaMeret / 2), y: Math.floor(palyaMeret / 2) };
    
    palyaKirajzolasa();
    lepesekElem.textContent = lepesekSzama;
    gyumolcsokElem.textContent = gyumolcsokSzama;
}

function kepessegAtlo() {
    if (kepessegHasznalat.atlo > 0) {
        const atlosOpciok = `
            <div class="atlos-opciok">
                <button onclick="mozgasAtlosan(-1, -1)">↖ Balra fel</button>
                <button onclick="mozgasAtlosan(1, -1)">↙ Balra le</button>
                <button onclick="mozgasAtlosan(-1, 1)">↗ Jobbra fel</button>
                <button onclick="mozgasAtlosan(1, 1)">↘ Jobbra le</button>
            </div>
        `;
        document.getElementById('abilities').insertAdjacentHTML('afterend', atlosOpciok);
        kepessegHasznalat.atlo--;
        kepessegekFrissitese();
    }
}

function mozgasAtlosan(dx, dy) {
    if (jatekosPozicio.x + dx >= 0 && jatekosPozicio.x + dx < palyaMeret &&
        jatekosPozicio.y + dy >= 0 && jatekosPozicio.y + dy < palyaMeret) {
        jatekosPozicio.x += dx;
        jatekosPozicio.y += dy;
        jatekosMozgatasa('');
    }
    document.querySelector('.atlos-opciok').remove();
}

function kepessegTeleport() {
    if (kepessegHasznalat.teleport > 0) {
        jatekosPozicio = {
            x: Math.floor(Math.random() * palyaMeret),
            y: Math.floor(Math.random() * palyaMeret)
        };
        jatekosMozgatasa('');
        kepessegHasznalat.teleport--;
        kepessegekFrissitese();
    }
}

function kepessegSzomszed() {
    if (kepessegHasznalat.szomszed > 0) {
        let szomszedok = [
            { x: jatekosPozicio.x - 1, y: jatekosPozicio.y },
            { x: jatekosPozicio.x + 1, y: jatekosPozicio.y },
            { x: jatekosPozicio.x, y: jatekosPozicio.y - 1 },
            { x: jatekosPozicio.x, y: jatekosPozicio.y + 1 }
        ];

        szomszedok.forEach(szomszed => {
            if (szomszed.x >= 0 && szomszed.x < palyaMeret && szomszed.y >= 0 && szomszed.y < palyaMeret) {
                if (palya[szomszed.x][szomszed.y].tipus === 'gyumolcs') {
                    gyumolcsokSzama++;
                    palya[szomszed.x][szomszed.y] = { tipus: 'ures' };
                }
            }
        });
        gyumolcsokElem.textContent = gyumolcsokSzama;
        palyaKirajzolasa();
        kepessegHasznalat.szomszed--;
        kepessegekFrissitese();
    }
}

document.getElementById('ujra').addEventListener('click', () => {
    const ujrainditOpciok = `
        <div class="ujraindit-opciok">
            <button onclick="ujraindit(false)">Újrakezdés ugyanezen a pályán</button>
            <button onclick="ujraindit(true)">Teljesen új pálya</button>
        </div>
    `;
    document.getElementById('ujra').insertAdjacentHTML('afterend', ujrainditOpciok);
});

document.getElementById('atlo').addEventListener('click', kepessegAtlo);
document.getElementById('teleport').addEventListener('click', kepessegTeleport);
document.getElementById('szomszed').addEventListener('click', kepessegSzomszed);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': jatekosMozgatasa('fel'); break;
        case 'ArrowDown': jatekosMozgatasa('le'); break;
        case 'ArrowLeft': jatekosMozgatasa('balra'); break;
        case 'ArrowRight': jatekosMozgatasa('jobbra'); break;
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

// Tutorial
const tutorialAblak = document.getElementById("tutorialAblak");
const tutorialGomb = document.getElementById("tutorialGomb");
const tutorialBezarasGomb = document.getElementById("tutorialBezarasGomb");

tutorialGomb.onclick = function() {
    tutorialAblak.style.display = "block";
}

tutorialBezarasGomb.onclick = function() {
    tutorialAblak.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == tutorialAblak) {
        tutorialAblak.style.display = "none";
    }
}

// Játék indítása
window.onload = ujraindit;
