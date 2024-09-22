function frissitOra() {
    const most = new Date();
    document.getElementById("ora").innerText = most.toLocaleTimeString();
}
setInterval(frissitOra, 1000);

function toggleBemutatkozas(id) {
    const elem = document.getElementById(id);
    elem.style.display = elem.style.display === "none" ? "block" : "none";
}

const kepek = ["extra1.jpg", "extra2.jpg", "extra3.jpg"];
let index = 0;

document.getElementById("kovetkezoKep").onclick = function() {
    document.getElementById("extraKep").style.display = "block";
    document.getElementById("extraKep").src = kepek[index];
    index = (index + 1) % kepek.length;
};