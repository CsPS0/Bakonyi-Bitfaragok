const boardSize = 5;
const maxSteps = 10;
let stepsLeft = maxSteps;
let fruitCollected = 0;
let bestScore = 0;
let gameBoard = [];
let playerPosition = { x: 0, y: 0 };

function generateBoard() {
    gameBoard = [];
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const fruitCount = Math.floor(Math.random() * 10);
            row.push(fruitCount);
        }
        gameBoard.push(row);
    }
    renderBoard();
}

function renderBoard() {
    const boardDiv = document.getElementById("game-board");
    boardDiv.innerHTML = ''; 
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cellDiv = document.createElement("div");
            cellDiv.textContent = gameBoard[i][j];
            if (playerPosition.x === i && playerPosition.y === j) {
                cellDiv.classList.add("player");
            }
            boardDiv.appendChild(cellDiv);
        }
    }
}