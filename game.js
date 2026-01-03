const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameActive = true;

// Pallina rimpicciolita (20x20)
const mosquito = { x: 50, y: 300, w: 20, h: 20, grav: 0.6, vel: 0, jump: -10 };
const pipes = [];
const gap = 150;

function update() {
    if (!gameActive) return;

    mosquito.vel += mosquito.grav;
    mosquito.y += mosquito.vel;

    // MODIFICA: Perdi se tocchi terra o soffitto
    if (mosquito.y + mosquito.h >= canvas.height || mosquito.y <= 0) {
        alert("GAME OVER! Score: " + score);
        location.reload(); 
        return;
    }

    // Generazione ostacoli
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push({ x: canvas.width, top: Math.random() * (canvas.height - 250) + 50, passed: false });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 3;

        // Collisione tubi
        if (mosquito.x < pipes[i].x + 50 && mosquito.x + mosquito.w > pipes[i].x &&
            (mosquito.y < pipes[i].top || mosquito.y + mosquito.h > pipes[i].top + gap)) {
            gameActive = false;
            location.reload();
        }

        if (!pipes[i].passed && pipes[i].x < mosquito.x) {
            score++; scoreDisplay.innerText = score;
            pipes[i].passed = true;
        }
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3ba2f'; // Pallina
    ctx.fillRect(mosquito.x, mosquito.y, mosquito.w, mosquito.h);
    ctx.fillStyle = '#444'; // Ostacoli
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 50, p.top);
        ctx.fillRect(p.x, p.top + gap, 50, canvas.height);
    });
}

window.addEventListener('keydown', () => mosquito.vel = mosquito.jump);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); mosquito.vel = mosquito.jump; }, {passive: false});

update();
