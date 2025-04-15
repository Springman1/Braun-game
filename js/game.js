// Konfiguracja gry
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true
};

// Inicjalizacja gry
const game = new Phaser.Game(config);

// Zmienne globalne
let player;
let candles;
let extinguishParticles;
let ground;
let platforms;
let cursors;
let score = 0;
let scoreText;
let gameOverText;
let restartText;
let gameOver = false;

// Ładowanie zasobów
function preload() {
    // Ładowanie tymczasowych zasobów - docelowo należy zastąpić własnymi grafikami
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('candle', 'assets/candle.png');
    this.load.image('extinguish', 'assets/extinguish.png');
}

// Tworzenie obiektów gry
function create() {
    // Tło
    this.add.rectangle(400, 300, 800, 600, 0x4488aa);
    
    // Platformy
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    // Gracz
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setSize(20, 48);
    player.setData('hasExtinguisher', true);
    
    // Animacje gracza
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    // Świeczki (hanukije)
    candles = this.physics.add.group();
    for (let i = 0; i < 8; i++) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 300);
        const candle = candles.create(x, y, 'candle');
        candle.setBounce(0.4);
        candle.setCollideWorldBounds(true);
        candle.setData('isLit', true);
    }
    
    // Cząsteczki gaśnicy
    extinguishParticles = this.add.particles('extinguish');
    
    // Kolizje
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(candles, platforms);
    
    // Interakcja z świeczkami
    this.physics.add.overlap(player, candles, extinguishCandle, null, this);
    
    // Sterowanie
    cursors = this.input.keyboard.createCursorKeys();
    
    // Wynik
    scoreText = this.add.text(16, 16, 'Zgaszone: 0/8', { fontSize: '32px', fill: '#fff' });
    
    // Teksty końca gry
    gameOverText = this.add.text(400, 300, 'ZWYCIĘSTWO!', { fontSize: '64px', fill: '#fff' });
    gameOverText.setOrigin(0.5);
    gameOverText.visible = false;
    
    restartText = this.add.text(400, 350, 'Kliknij, aby zagrać ponownie', { fontSize: '32px', fill: '#fff' });
    restartText.setOrigin(0.5);
    restartText.visible = false;
}

// Główna pętla gry
function update() {
    if (gameOver) {
        return;
    }
    
    // Sterowanie graczem
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
    
    // Użycie gaśnicy (spacja)
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && player.getData('hasExtinguisher')) {
        useExtinguisher();
    }
    
    // Sprawdzenie warunku zwycięstwa
    if (score === 8 && !gameOver) {
        victory();
    }
}

// Funkcja gaszenia świeczki
function extinguishCandle(player, candle) {
    if (candle.getData('isLit') && player.getData('hasExtinguisher')) {
        candle.setData('isLit', false);
        candle.setTint(0x888888);
        score += 1;
        scoreText.setText('Zgaszone: ' + score + '/8');
    }
}

// Funkcja używania gaśnicy
function useExtinguisher() {
    const x = player.flipX ? player.x - 20 : player.x + 20;
    const y = player.y;
    
    const emitter = extinguishParticles.createEmitter({
        x: x,
        y: y,
        speed: { min: 50, max: 100 },
        angle: player.flipX ? 180 : 0,
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        quantity: 20
    });
    
    // Automatycznie zatrzymaj emiter po krótkim czasie
    setTimeout(() => {
        emitter.stop();
    }, 200);
    
    // Sprawdź świeczki w pobliżu
    candles.getChildren().forEach(candle => {
        if (Phaser.Math.Distance.Between(x, y, candle.x, candle.y) < 100 && candle.getData('isLit')) {
            candle.setData('isLit', false);
            candle.setTint(0x888888);
            score += 1;
            scoreText.setText('Zgaszone: ' + score + '/8');
        }
    });
}

// Funkcja zwycięstwa
function victory() {
    gameOver = true;
    player.setVelocity(0, 0);
    player.anims.play('turn');
    gameOverText.visible = true;
    restartText.visible = true;
    
    this.input.on('pointerdown', () => {
        resetGame.call(this);
    });
}

// Resetowanie gry
function resetGame() {
    gameOver = false;
    score = 0;
    gameOverText.visible = false;
    restartText.visible = false;
    
    // Resetowanie świeczek
    candles.getChildren().forEach(candle => {
        candle.setData('isLit', true);
        candle.clearTint();
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 300);
        candle.setPosition(x, y);
    });
    
    // Resetowanie gracza
    player.setPosition(100, 450);
    player.setData('hasExtinguisher', true);
    
    // Aktualizacja wyniku
    scoreText.setText('Zgaszone: 0/8');
}