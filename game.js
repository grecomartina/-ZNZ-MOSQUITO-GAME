const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;
let gameActive = true;

const mosquito = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    gravity: 0.6,
    velocity: 0,
    jump: -9
};

const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 160;

function createObstacle() {
    const minHeight = 50;
    const maxHeight = canvas.height - obstacleGap - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    obstacles.push({
        x: canvas.width,
        top: height,
        bottom: canvas.height - height - obstacleGap,
        passed: false
    });
}

function gameOver() {
    gameActive = false;
    alert("GIOCO FINITO!\nPunteggio: " + score + "\n\nEntra nel gruppo per non perdere il lancio!");
    // Reset automatico
    score = 0;
    scoreElement.innerText = score;
    mosquito.y = 300;
    mosquito.velocity = 0;
    obstacles.length = 0;
    gameActive = true;
    requestAnimationFrame(update);
}

function update() {
    if (!gameActive) return;

    // Gravità e movimento zanzara
    mosquito.velocity += mosquito.gravity;
    mosquito.y += mosquito.velocity;

    // COLLISIONE TERRA O SOFFITTO
    if (mosquito.y + mosquito.height >= canvas.height || mosquito.y <= 0) {
        gameOver();
        return;
    }

    // Generazione ostacoli
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 250) {
        createObstacle();
    }

    // Movimento e collisione ostacoli
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 3;

        // Collisione con tubi
        if (
            mosquito.x < obstacles[i].x + obstacleWidth &&
            mosquito.x + mosquito.width > obstacles[i].x &&
            (mosquito.y < obstacles[i].top || mosquito.y + mosquito.height > canvas.height - obstacles[i].bottom)
        ) {
            gameOver();
            return;
        }

        // Punteggio
        if (!obstacles[i].passed && obstacles[i].x < mosquito.x) {
            score++;
            scoreElement.innerText = score;
            obstacles[i].passed = true;
        }

        if (obstacles[i].x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
        }
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sfondo
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Zanzara
    ctx.fillStyle = '#f3ba2f';
    ctx.fillRect(mosquito.x, mosquito.y, mosquito.width, mosquito.height);

    // Ostacoli
    ctx.fillStyle = '#555';
    obstacles.forEach(opt => {
        ctx.fillRect(opt.x, 0, obstacleWidth, opt.top);
        ctx.fillRect(opt.x, canvas.height - opt.bottom, obstacleWidth, opt.bottom);
    });
}

// Comandi per PC e Telefono
window.addEventListener('keydown', (e) => {
    mosquito.velocity = mosquito.jump;
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mosquito.velocity = mosquito.jump;
}, { passive: false });

update();
