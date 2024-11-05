const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let startX = 0, startY = 0; // Coordenadas de início do toque

// Pega a maior pontuação do armazenamento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Maior Pontuação: ${highScore}`;

// Atualiza a posição da comida
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Função para finalizar o jogo
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pressione OK para jogar novamente...");
    location.reload();
};

// Função para mudar a direção com teclado
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Função para controlar a direção com toque
const handleTouchStart = (event) => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
};

const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;

    // Verifica o deslize na horizontal ou vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (diffX < 0 && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        }
    } else {
        if (diffY > 0 && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (diffY < 0 && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        }
    }
};

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontuação: ${score}`;
        highScoreElement.innerText = `Maior Pontuação: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
};

// Atualiza a posição da comida e inicia o jogo
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);

// Detecta se está em um dispositivo móvel e adiciona o evento adequado
if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
} else {
    document.addEventListener("keyup", changeDirection);
}
