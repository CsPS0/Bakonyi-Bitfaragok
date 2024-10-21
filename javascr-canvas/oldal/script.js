const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cityRadius = 20;
const workshopRadius = 30;
const serviceRadius = 100;

let cities = [
  { x: 150, y: 100, battery: 'A', type: 'single', served: false },
  { x: 400, y: 200, battery: 'B', type: 'single', served: false },
  { x: 600, y: 400, battery: 'C', type: 'single', served: false },
  { x: 200, y: 500, battery: 'A', type: 'double', battery2: 'B', served: false },
];

let workshops = [];
let maxWorkshops = 3;
let availableWorkshops = [
  { type: 'A', placed: false },
  { type: 'B', placed: false },
  { type: 'C', placed: false }
];

function drawCities() {
  cities.forEach(city => {
    ctx.beginPath();
    ctx.arc(city.x, city.y, cityRadius, 0, 2 * Math.PI);
    ctx.fillStyle = city.served ? '#28a745' : '#dc3545';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Roboto';
    ctx.fillText(city.battery, city.x - 5, city.y + 5);

    if (city.type === 'double') {
      ctx.fillText(city.battery2, city.x - 5, city.y + 20);
    }
  });
}

function drawWorkshops() {
  workshops.forEach(workshop => {
    ctx.beginPath();
    ctx.arc(workshop.x, workshop.y, workshopRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#007bff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(workshop.x, workshop.y, serviceRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.2)';
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Roboto';
    ctx.fillText(workshop.type, workshop.x - 5, workshop.y + 5);
  });
}

function checkCityServed(city) {
  return workshops.some(workshop => {
    const distance = Math.hypot(city.x - workshop.x, city.y - workshop.y);
    if (distance <= serviceRadius) {
      if (city.type === 'single' && workshop.type === city.battery) {
        return true;
      } else if (city.type === 'double' && 
        (workshop.type === city.battery || workshop.type === city.battery2)) {
        return true;
      }
    }
    return false;
  });
}

function updateCityStatus() {
  cities.forEach(city => {
    city.served = checkCityServed(city);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCities();
  drawWorkshops();
}

canvas.addEventListener('click', (e) => {
  if (workshops.length >= maxWorkshops) {
    document.getElementById('status').innerText = "Nincs több elhelyezhető műhely.";
    return;
  }

  const x = e.offsetX;
  const y = e.offsetY;

  let selectedWorkshop = availableWorkshops.find(w => !w.placed);
  if (selectedWorkshop) {
    workshops.push({ x, y, type: selectedWorkshop.type });
    selectedWorkshop.placed = true;
    updateCityStatus();
    draw();
  }
});

document.getElementById('checkSolution').addEventListener('click', () => {
  const allServed = cities.every(city => city.served);
  if (allServed) {
    document.getElementById('status').innerText = "Gratulálok! Minden város ki van szolgálva.";
  } else {
    document.getElementById('status').innerText = "Nem minden város van kiszolgálva.";
  }
});

draw();