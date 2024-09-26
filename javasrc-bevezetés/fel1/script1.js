function frissitOra() {
    const most = new Date();
    document.getElementById("ora").innerText = most.toLocaleTimeString();
}
setInterval(frissitOra, 1000);

function toggleBemutatkozas(id) {
    const elem = document.getElementById(id);
    elem.style.display = elem.style.display === "none" ? "block" : "none";
}

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

    // Automatikus görgetés az oldal aljára
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // Sima görgetés
    });
};