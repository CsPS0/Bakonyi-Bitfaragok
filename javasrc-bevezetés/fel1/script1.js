function frissitOra() {
    const most = new Date();
    document.getElementById("ora").innerText = most.toLocaleTimeString();
}
setInterval(frissitOra, 1000);

function toggleBemutatkozas(id) {
    const elem = document.getElementById(id);
    elem.style.display = elem.style.display === "none" ? "block" : "none";
}

function frissitOra() {
    const most = new Date();
    const ora = most.getHours();
    const perc = most.getMinutes();
    const masodperc = most.getSeconds();

    document.getElementById("ora").innerText = most.toLocaleTimeString();

    const oraEl = document.getElementById("hourHand");
    const percEl = document.getElementById("minuteHand");
    const masodpercEl = document.getElementById("secondHand");

    oraEl.style.transform = `rotate(${(ora % 12) * 30 + (perc / 60) * 30}deg)`;
    percEl.style.transform = `rotate(${perc * 6}deg)`;
    masodpercEl.style.transform = `rotate(${masodperc * 6}deg)`;
}

setInterval(frissitOra, 1000);
frissitOra();


const kepek = [
    "../forras/images/tajkep1.jpg",
    "../forras/images/tajkep2.jpg",
    "../forras/images/tajkep3.jpg",
    "../forras/images/tajkep4.jpg",
    "../forras/images/tajkep5.jpg"
];

let index = 0;

document.getElementById("kovetkezoKep").onclick = function() {
    const extraKep = document.getElementById("extraKep");

    if (index < kepek.length) {
        extraKep.style.display = "block";
        extraKep.src = kepek[index];
        index++;
    } else {
        const atlepes = confirm("Ez volt az utolsó kép. Át szeretnél lépni a második feladatra?");
        if (atlepes) {
            window.location.href = "../fel2/index2.html";
        } else {
            index = 0;
            extraKep.src = kepek[index];
            index++;
        }
    }

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
};