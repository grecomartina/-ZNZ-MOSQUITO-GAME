const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameActive = true;
const mosquito = { x: 50, y: 250, w: 30, h: 30, grav: 0.6, vel: 0, jump: -8 };
const pipes = [];
const pipeWidth = 50;
const gap = 150;

function reset() {
    score = 0; 
    scoreDisplay.innerText = score;
    mosquito.y = 250; 
    mosquito.vel = 0;
    pipes.length = 0; 
    gameActive = true;
}

function update() {
    if (!gameActive) return;

    mosquito.vel += mosquito.grav;
    mosquito.y += mosquito.vel;

    // Boundary collision
    if (mosquito.y + mosquito.h > canvas.height || mosquito.y < 0) {
        alert("GAME OVER! Score: " + score);
        reset();
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const h = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({ x: canvas.width, top: h, passed: false });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 3;
        
        if (mosquito.x < pipes[i].x + pipeWidth && 
            mosquito.x + mosquito.w > pipes[i].x &&
            (mosquito.y < pipes[i].top || mosquito.y + mosquito.h > pipes[i].top + gap)) {
            alert("COLLISION! Score: " + score);
            reset();
        }

        if (!pipes[i].passed && pipes[i].x < mosquito.x) {
            score++; 
            scoreDisplay.innerText = score;
            pipes[i].passed = true;
        }

        if (pipes[i].x + pipeWidth < 0) pipes.splice(i, 1);
    }
    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3ba2f';
    ctx.fillRect(mosquito.x, mosquito.y, mosquito.w, mosquito.h);
    ctx.fillStyle = '#444';
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, p.top + gap, pipeWidth, canvas.height);
    });
}

window.addEventListener('keydown', () => mosquito.vel = mosquito.jump);
canvas.addEventListener('touchstart', (e) => { 
    e.preventDefault(); 
    mosquito.vel = mosquito.jump; 
}, {passive: false});

update();
