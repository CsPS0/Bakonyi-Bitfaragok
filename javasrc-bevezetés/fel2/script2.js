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
    renderTankolasok();
    calculateMonthlyCost();
    calculateEfficiency();
});

// Render the list of tankolások
function renderTankolasok(filteredTankolasok = null) {
    let naplo = document.querySelector("main > div:nth-child(2)");
    naplo.innerHTML = `<h2>Tankolási Napló</h2>`;
    
    const records = filteredTankolasok || tankolasok;
    
    records.forEach((t) => {
        naplo.innerHTML += `<p>Dátum: ${t.datum.toLocaleDateString()}, Mennyiség: ${t.mennyiseg}L, Összeg: ${t.koltseg}Ft, Km: ${t.km}</p>`;
    });
}

// Calculate monthly fuel costs
function calculateMonthlyCost() {
    let monthlyCosts = {};

    tankolasok.forEach((t) => {
        let month = `${t.datum.getFullYear()}-${t.datum.getMonth() + 1}`;
        if (!monthlyCosts[month]) {
            monthlyCosts[month] = 0;
        }
        monthlyCosts[month] += t.koltseg;
    });

    let monthlyCostSection = document.querySelector("main > div:nth-child(2) > h2:first-of-type");
    monthlyCostSection.innerHTML = "Havi költségek";
    for (let month in monthlyCosts) {
        monthlyCostSection.innerHTML += `<p>${month}: ${monthlyCosts[month].toFixed(2)} Ft</p>`;
    }
}

// Filter tankolások by date interval
function filterByDateRange(startDate, endDate) {
    let filtered = tankolasok.filter(t => t.datum >= new Date(startDate) && t.datum <= new Date(endDate));
    renderTankolasok(filtered);
}

// Calculate and rank based on fuel efficiency
function calculateEfficiency() {
    if (tankolasok.length < 2) return;

    let efficiencyData = [];
    
    for (let i = 1; i < tankolasok.length; i++) {
        let prev = tankolasok[i - 1];
        let current = tankolasok[i];
        
        let kmTraveled = current.km - prev.km;
        let fuelUsed = prev.mennyiseg;
        
        let efficiency = kmTraveled / fuelUsed;
        efficiencyData.push({
            date: current.datum,
            kmTraveled: kmTraveled,
            fuelUsed: fuelUsed,
            efficiency: efficiency
        });
    }

    // Sort by efficiency
    efficiencyData.sort((a, b) => b.efficiency - a.efficiency);

    let efficiencySection = document.querySelector("main > div:nth-child(2) > h2:last-of-type");
    efficiencySection.innerHTML = "Hatékonyság szerinti rangsor";
    
    efficiencyData.forEach((data) => {
        efficiencySection.innerHTML += `<p>Dátum: ${data.date.toLocaleDateString()}, Kilométer: ${data.kmTraveled}, Fogyasztás: ${data.fuelUsed}L, Hatékonyság: ${data.efficiency.toFixed(2)} km/L</p>`;
    });
}

document.getElementById("dateFilterForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    filterByDateRange(startDate, endDate);
});
