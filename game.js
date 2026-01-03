window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 450,
        height: 650,
        parent: 'game-container',
        backgroundColor: '#000000',
        physics: { default: 'arcade', arcade: { gravity: { y: 0 }, fps: 120 } },
        scene: { create: create, update: update }
    };

    const game = new Phaser.Game(config);
    let _s = 0, _l = 3, _lvl = 1, _gs = false, _paused = false;
    let _id = "7492089236"; // Il tuo ID verificatore [cite: 2026-01-02]
    let barra, pallina, cubetti, scoreText, livesText, levelText, jackpotText, pauseBtn, pauseText;

    function create() {
        // Blocco PC: se non è touch, mostra avviso
        if (!this.sys.game.device.input.touch && window.innerWidth > 1000) {
            this.add.text(50, 300, "GIOCA DA SMARTPHONE\nPER IL JACKPOT", { font: '22px Courier', fill: '#f00', align: 'center' });
            this.scene.pause(); return;
        }

        // UI - Interfaccia Giocatore
        scoreText = this.add.text(20, 20, 'SCORE: 0', { font: 'bold 20px Courier', fill: '#fff' });
        levelText = this.add.text(20, 45, 'LEVEL: 1', { font: '16px Courier', fill: '#0f0' });
        livesText = this.add.text(250, 20, 'VITE: ❤️❤️❤️', { font: '18px Courier', fill: '#fff' });
        jackpotText = this.add.text(225, 85, 'JACKPOT: 0%', { font: 'bold 14px Courier', fill: '#ff0' }).setOrigin(0.5);

        // Tasto Pausa
        pauseBtn = this.add.text(410, 20, '||', { font: 'bold 26px Courier', fill: '#fff' }).setInteractive();
        pauseText = this.add.text(225, 320, 'PAUSE', { font: 'bold 45px Courier', fill: '#ff0' }).setOrigin(0.5).setVisible(false);
        pauseBtn.on('pointerdown', () => {
            _paused = !_paused;
            if (_paused) { this.physics.pause(); pauseText.setVisible(true); }
            else { this.physics.resume(); pauseText.setVisible(false); }
        });

        cubetti = this.physics.add.staticGroup();
        generaLivello.call(this);

        barra = this.add.rectangle(225, 600, 100, 15, 0xffffff);
        this.physics.add.existing(barra);
        barra.body.setImmovable(true).setCollideWorldBounds(true);

        pallina = this.add.rectangle(225, 580, 10, 10, 0xffffff);
        this.physics.add.existing(pallina);
        pallina.body.setCollideWorldBounds(true).setBounce(1, 1);

        // Collisione sicura con la barra
        this.physics.add.collider(pallina, barra, (p, b) => {
            if (p.body.velocity.y > 0) {
                p.y = b.y - 16;
                p.body.setVelocityX(12 * (p.x - b.x));
                p.body.setVelocityY(-Math.abs(p.body.velocity.y));
            }
        });

        // Collisione con cubetti
        this.physics.add.collider(pallina, cubetti, (p, c) => {
            c.destroy();
            _s += 10 * Math.pow(_lvl, 1.5); // Punti esponenziali per il Jackpot [cite: 2025-12-26]
            scoreText.setText('SCORE: ' + Math.floor(_s));
            aggiornaJackpot();
            if (cubetti.countActive() === 0) prossimoLivello.call(this);
        });
    }

    function generaLivello() {
        cubetti.clear(true, true);
        let size = Math.max(10, 30 - (_lvl * 2)); 
        let rows = 4 + (_lvl * 2);
        let cols = Math.floor(410 / (size + 3));
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (Math.sin(i * 0.5) * Math.cos(j * 0.5 * _lvl) > -0.3) {
                    let b = this.add.rectangle(40 + (i * (size + 3)), 110 + (j * (size/2 + 3)), size, size/2, 0x0);
                    b.setStrokeStyle(1, 0xffffff);
                    cubetti.add(b);
                }
            }
        }
    }

    function aggiornaJackpot() {
        let prog = Math.min(100, Math.floor((_s / 50000) * 100)); // Obiettivo 1 Solana [cite: 2025-12-26]
        jackpotText.setText('MEGA JACKPOT: ' + prog + '%');
    }

    function prossimoLivello() {
        _lvl++; _gs = false; if (_l < 3) _l++;
        levelText.setText('LEVEL: ' + _lvl);
        aggiornaViteUI(); generaLivello.call(this);
        pallina.body.setVelocity(0,0); pallina.x = barra.x; pallina.y = 580;
    }

    function update() {
        if (_paused) return;
        if (this.input.activePointer.isDown) {
            barra.x = Phaser.Math.Clamp(this.input.activePointer.x, 50, 400);
            if (!_gs && this.input.activePointer.y > 100) {
                _gs = true;
                pallina.body.setVelocity(150, -350 - (_lvl * 25));
            }
        }
        if (!_gs) { pallina.x = barra.x; pallina.y = barra.y - 20; pallina.body.setVelocity(0, 0); }
        if (pallina.y > 645) { _l--; _gs = false; aggiornaViteUI(); if (_l <= 0) fine(); }
    }

    function aggiornaViteUI() {
        let h = ""; for(let i=0; i<_l; i++) h += "❤️";
        livesText.setText('VITE: ' + h);
    }

    function fine() {
        let code = btoa((Math.floor(_s) * _lvl + 7492).toString()).substring(0, 8).toUpperCase();
        alert("GAME OVER\nSCORE: " + Math.floor(_s) + "\nVERIFY CODE: " + code + "\nID: " + _id);
        location.reload();
    }
};