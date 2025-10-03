
const gridContainer = document.getElementById('grid-container');
const stepCounter = document.getElementById('step-counter');
const timeAttackCheckbox = document.getElementById('time-attack-checkbox');
const newGameButton = document.getElementById('new-game-button');
const factionMenu = document.getElementById('faction-menu');
const gameScreen = document.getElementById('game-screen');
const rebelButton = document.getElementById('rebel-button');
const empireButton = document.getElementById('empire-button');
const modal = document.getElementById('ship-destroyed-modal');
const modalCloseButton = document.getElementById('modal-close-button');

const tutorialPanel = document.getElementById('tutorial-panel');
const tutorialContent = document.getElementById('tutorial-content');
const scoreboardPanel = document.getElementById('scoreboard-panel');
const scoreboardList = document.getElementById('scoreboard-list');
const scoreEntry = document.getElementById('score-entry');
const playerNameInput = document.getElementById('player-name-input');
const submitScoreButton = document.getElementById('submit-score-button');

modal.style.display = 'none';

let chosenFaction = null;

const GRID_SIZE = 12;
let steps = 0;
let timeAttack = false;
let timeAttackLimit = 20;
let foundShips = 0;

const imperialShips = {
    types: [
        { name: 'TIE Fighter', baseShape: [[true]], size: 1 },
        { name: 'TIE Interceptor', baseShape: [[true, true]], size: 2 },
        { name: 'TIE Bomber', baseShape: [[true, true, true]], size: 3 },
        { name: 'Star Destroyer', baseShape: [[true, false], [true, true]], size: 3 },
        { name: 'Imperial Cruiser', baseShape: [[true, true], [true, true]], size: 4 },
        { name: 'Super Star Destroyer', baseShape: [[true, true, true, true]], size: 4 },
        { name: 'Executor', baseShape: [[true, true, true], [false, true, false]], size: 4 }
    ],
    icons: {
        'TIE Fighter': 'Empire/TIE-Fighter.svg',
        'TIE Interceptor': 'Empire/TIE-Interceptor.svg',
        'TIE Bomber': 'Empire/TIE-Bomber.svg',
        'Star Destroyer': 'Empire/Star-Destroyer.svg',
        'Imperial Cruiser': 'Empire/Imperial-Cruiser.svg',
        'Super Star Destroyer': 'Empire/Super-Star-Destroyer.svg',
        'Executor': 'Empire/Executor.svg'
    }
};

const rebelShips = {
    types: [
        { name: 'X-Wing', baseShape: [[true]], size: 1 },
        { name: 'A-Wing', baseShape: [[true, true]], size: 2 },
        { name: 'Y-Wing', baseShape: [[true, true, true]], size: 3 },
        { name: 'Millennium Falcon', baseShape: [[true, false], [true, true]], size: 3 },
        { name: 'CR90 Corvette', baseShape: [[true, true], [true, true]], size: 4 },
        { name: 'Mon Calamari Cruiser', baseShape: [[true, true, true, true]], size: 4 },
        { name: 'Home One', baseShape: [[true, true, true], [false, true, false]], size: 4 }
    ],
    icons: {
        'X-Wing': 'Rebel/X-Wing.svg',
        'A-Wing': 'Rebel/A-Wing.svg',
        'Y-Wing': 'Rebel/Y-Wing.svg',
        'Millennium Falcon': 'Rebel/Millennium-Falcon.svg',
        'CR90 Corvette': 'Rebel/CR90-Corvette.svg',
        'Mon Calamari Cruiser': 'Rebel/Mon-Calamari-Cruiser.svg',
        'Home One': 'Rebel/Home-One.svg'
    }
};

let shipTypes = [];
let shipIcons = {};

let gameBoard = [];
let shipLocations = [];

rebelButton.addEventListener('click', () => startGame('rebel'));
empireButton.addEventListener('click', () => startGame('empire'));
modalCloseButton.addEventListener('click', () => modal.style.display = 'none');
submitScoreButton.addEventListener('click', submitScore);

function startGame(faction) {
    chosenFaction = faction;
    factionMenu.style.display = 'none';
    gameScreen.style.display = 'grid'; // Show the game screen

    if (chosenFaction === 'rebel') {
        shipTypes = imperialShips.types;
        shipIcons = imperialShips.icons;
        document.body.classList.add('rebel-theme');
        document.body.classList.remove('empire-theme');
    } else {
        shipTypes = rebelShips.types;
        shipIcons = rebelShips.icons;
        document.body.classList.add('empire-theme');
        document.body.classList.remove('rebel-theme');
    }

    loadTutorial();
    loadScoreboard();
    initializeGame();
}

function createGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;
        gridContainer.appendChild(cell);
    }
}

function initializeGame() {
    steps = 0;
    foundShips = 0;
    stepCounter.textContent = steps;
    timeAttack = timeAttackCheckbox.checked;
    if (timeAttack) {
        timeAttackLimit = 20;
    }

    gameBoard = Array(GRID_SIZE * GRID_SIZE).fill(null);
    shipLocations = [];

    placeShips();
    updateGrid();
    scoreEntry.style.display = 'none'; // Hide score entry form at start of new game
}

function getRotations(shape) {
    const rotations = [];
    let current = shape;
    for (let i = 0; i < 4; i++) {
        rotations.push(current);
        const newShape = [];
        for (let x = 0; x < current[0].length; x++) {
            const newRow = [];
            for (let y = current.length - 1; y >= 0; y--) {
                newRow.push(current[y][x]);
            }
            newShape.push(newRow);
        }
        current = newShape;
    }
    return rotations;
}


function placeShips() {
    for (const shipType of shipTypes) {
        const rotations = getRotations(shipType.baseShape);
        let placed = false;
        while (!placed) {
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            const startX = Math.floor(Math.random() * (GRID_SIZE - randomRotation[0].length + 1));
            const startY = Math.floor(Math.random() * (GRID_SIZE - randomRotation.length + 1));

            if (canPlaceShip(randomRotation, startX, startY)) {
                const ship = {
                    name: shipType.name,
                    parts: [],
                    found: false
                };
                for (let y = 0; y < randomRotation.length; y++) {
                    for (let x = 0; x < randomRotation[y].length; x++) {
                        if (randomRotation[y][x]) {
                            const index = (startY + y) * GRID_SIZE + (startX + x);
                            gameBoard[index] = { shipName: shipType.name, partOf: ship };
                            ship.parts.push({ index, hit: false });
                        }
                    }
                }
                shipLocations.push(ship);
                placed = true;
            }
        }
    }
}

function canPlaceShip(shape, startX, startY) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const checkX = startX + x;
                const checkY = startY + y;

                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const neighborY = checkY + i;
                        const neighborX = checkX + j;

                        if (neighborX >= 0 && neighborX < GRID_SIZE && neighborY >= 0 && neighborY < GRID_SIZE) {
                            if (gameBoard[neighborY * GRID_SIZE + neighborX] !== null) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}


function updateGrid() {
    for (let i = 0; i < gameBoard.length; i++) {
        const cell = gridContainer.children[i];
        cell.textContent = '';
        cell.style.backgroundColor = '#555';
    }
}

gridContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('grid-cell')) {
        const index = parseInt(e.target.dataset.index);
        probeCell(index);
    }
});

newGameButton.addEventListener('click', initializeGame);
timeAttackCheckbox.addEventListener('change', initializeGame);


function probeCell(index) {
    if (gameBoard[index] && gameBoard[index].hit) {
        return; // Already hit
    }

    steps++;
    stepCounter.textContent = steps;

    const cell = gridContainer.children[index];
    if (gameBoard[index]) {
        gameBoard[index].hit = true;
        const ship = gameBoard[index].partOf;
        const part = ship.parts.find(p => p.index === index);
        part.hit = true;

        cell.style.backgroundColor = 'var(--hit-red)';
        cell.textContent = 'X';

        const allPartsFound = ship.parts.every(p => p.hit);
        if (allPartsFound && !ship.found) {
            ship.found = true;
            foundShips++;
            if (timeAttack) {
                timeAttackLimit += 5;
            }
            showShipDestroyedModal(ship.name);
            checkWinCondition();
        }
    } else {
        const distance = calculateDistance(index);
        cell.textContent = distance;
    }

    if (timeAttack && steps >= timeAttackLimit) {
        alert('Game Over!');
        initializeGame();
    }
}

function calculateDistance(index) {
    const startX = index % GRID_SIZE;
    const startY = Math.floor(index / GRID_SIZE);
    let minDistance = Infinity;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i]) {
            const shipX = i % GRID_SIZE;
            const shipY = Math.floor(i / GRID_SIZE);
            const distance = Math.abs(startX - shipX) + Math.abs(startY - shipY);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }
    }
    return minDistance;
}

function checkWinCondition() {
    if (foundShips === shipTypes.length) {
        scoreEntry.style.display = 'block'; // Show score entry form
    }
}

function submitScore() {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        const newScore = { name: playerName, score: steps };
        if (chosenFaction === 'rebel') {
            rebelScoreboard.push(newScore);
            rebelScoreboard.sort((a, b) => a.score - b.score);
        } else {
            empireScoreboard.push(newScore);
            empireScoreboard.sort((a, b) => a.score - b.score);
        }
        loadScoreboard();
        scoreEntry.style.display = 'none';
        playerNameInput.value = '';
        initializeGame(); // Start a new game after submitting score
    }
}

function loadTutorial() {
    let tutorialText = '';
    if (chosenFaction === 'rebel') {
        tutorialText = `
            <p>Welcome, Rebel operative! Your mission is to locate and destroy the Imperial fleet hidden in this sector. Each click sends a probe. If you hit a ship, it will be marked. If you miss, you'll get a distance reading to the nearest Imperial vessel.</p>
            <p>Imperial Ships to find:</p>
            <ul>
                <li>TIE Fighter</li>
                <li>TIE Interceptor</li>
                <li>TIE Bomber</li>
                <li>Star Destroyer</li>
                <li>Imperial Cruiser</li>
                <li>Super Star Destroyer</li>
                <li>Executor</li>
            </ul>
            <p>May the Force be with you!</p>
        `;
    } else {
        tutorialText = `
            <p>Greetings, Imperial Commander! Your task is to eradicate the Rebel scum hiding in this sector. Deploy your probes to find their ships. A hit will be marked, a miss will give you intel on the nearest Rebel vessel.</p>
            <p>Rebel Ships to find:</p>
            <ul>
                <li>X-Wing</li>
                <li>A-Wing</li>
                <li>Y-Wing</li>
                <li>Millennium Falcon</li>
                <li>CR90 Corvette</li>
                <li>Mon Calamari Cruiser</li>
                <li>Home One</li>
            </ul>
            <p>For the Empire!</p>
        `;
    }
    tutorialContent.innerHTML = tutorialText;
}

const rebelScoreboard = [
    { name: 'Leia Organa', score: 25 },
    { name: 'Han Solo', score: 30 },
    { name: 'Chewbacca', score: 35 },
    { name: 'Lando Calrissian', score: 40 },
    { name: 'Admiral Ackbar', score: 45 }
];

const empireScoreboard = [
    { name: 'Darth Vader', score: 20 },
    { name: 'Grand Moff Tarkin', score: 28 },
    { name: 'Admiral Thrawn', score: 32 },
    { name: 'Emperor Palpatine', score: 38 },
    { name: 'Grand Admiral Rae Sloane', score: 42 }
];

function loadScoreboard() {
    scoreboardList.innerHTML = '';
    const currentScoreboard = chosenFaction === 'rebel' ? rebelScoreboard : empireScoreboard;

    currentScoreboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score} probes`;
        scoreboardList.appendChild(li);
    });
}

async function showShipDestroyedModal(shipName) {
    const modalShipName = document.getElementById('modal-ship-name');
    const modalShipIcon = document.getElementById('modal-ship-icon');

    modalShipName.textContent = shipName;
    // Fetch SVG content from file
    try {
        const response = await fetch(`source/IMG/${shipIcons[shipName]}`);
        const svgContent = await response.text();
        modalShipIcon.innerHTML = svgContent;
    } catch (error) {
        console.error('Error fetching SVG:', error);
        modalShipIcon.innerHTML = '<p>Error loading icon</p>';
    }

    modal.style.display = 'flex';
}

createGrid();

// New Intro JS
function initIntro() {
	const swContainer = document.querySelector(".sw-container");
	const swTextIntro = document.querySelector(".sw-text-intro");
	const swCrawl = document.querySelector(".sw-crawl");

	const swContainerHeight = swContainer.clientHeight;
	const swCrawlHeight = swCrawl.clientHeight;

	// configurações iniciais
	//--------------------------------------------------
	swCrawl.style.transform = `rotateX(45deg) scale(2.5) translateY(${swContainerHeight}px)`;

	// animações
	//---------------------------------------------------
	const animSWTextIntro = swTextIntro.animate(
		[
			{
				opacity: 0
			},
			{
				opacity: 1,
				visibility: "visible",
				offset: 0.4
			},
			{
	_opacity: 1,
				offset: 0.9
			},
			{
				opacity: 0,
				visibility: "hidden"
			}
		],
		{
			duration: 5000,
			easing: "linear"
		}
	);

	const animSWCrawl = swCrawl.animate(
		[
			{
				transform: `rotateX(45deg) scale(2.5) translateY(${swContainerHeight}px)`,
				opacity: 1,
				visibility: "visible"
			},
			{
				opacity: 1,
				offset: 0.8
			},
			{
				transform: `rotateX(45deg) scale(2.5) translateY(-${swContainerHeight + swCrawlHeight}px)`,
				opacity: 0,
				visibility: "hidden"
			}
		],
		{
			duration: 60000,
			easing: "linear",
			fill: "forwards",
			delay: 5000 // Start after animSWTextIntro finishes
		}
	);

    animSWCrawl.onfinish = () => {
        const swContainer = document.querySelector(".sw-container");
        swContainer.style.display = 'none';
        factionMenu.style.display = 'flex';
    };

    swContainer.addEventListener('click', () => {
        animSWTextIntro.finish();
        animSWCrawl.finish();
        swContainer.style.display = 'none';
        factionMenu.style.display = 'flex';
    });
}

window.addEventListener("load", function (ev) {
	initIntro();
});
