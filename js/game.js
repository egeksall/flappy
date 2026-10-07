// ============================================================
// FLAPPY BIRD ULTRA - PHASER 3 ENGINE
// Mobile-ready & App Store optimized
// ============================================================

const CONFIG = {
    GAME_WIDTH: 400,
    GAME_HEIGHT: 700,
    GROUND_Y: 590,
    GRAVITY: 980,
    FLAP_POWER: -340,
    PIPE_SPEED_BASE: -155,
    PIPE_SPAWN_INTERVAL: 1750,
    PIPE_GAP_BASE: 142,
    MIN_PIPE_Y: 140,
    MAX_PIPE_Y: 410,
};

// Bird Skin Catalog with unlock conditions
const SKINS = [
    { id: 'bird_classic', name: 'Classic Pip', unlockScore: 0, desc: 'Ready for flight' },
    { id: 'bird_cyber', name: 'Cyber Neon', unlockScore: 10, desc: 'Unlocks at 10 pts' },
    { id: 'bird_crimson', name: 'Crimson Ember', unlockScore: 25, desc: 'Unlocks at 25 pts' },
    { id: 'bird_golden', name: 'Golden Phoenix', unlockScore: 50, desc: 'Unlocks at 50 pts' },
];

let selectedSkinIndex = parseInt(localStorage.getItem('flappy_selected_skin') || '0', 10);
if (isNaN(selectedSkinIndex) || selectedSkinIndex < 0 || selectedSkinIndex >= SKINS.length) {
    selectedSkinIndex = 0;
}

// ------------------------------------------------------------
// PRELOAD SCENE
// ------------------------------------------------------------
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        const cx = CONFIG.GAME_WIDTH / 2;
        const cy = CONFIG.GAME_HEIGHT / 2;

        // Visual loading indicator
        const loadText = this.add.text(cx, cy - 20, 'LOADING...', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.6);
        progressBox.fillRoundedRect(cx - 100, cy + 20, 200, 16, 8);

        this.load.on('progress', (val) => {
            progressBar.clear();
            progressBar.fillStyle(0x55cc33, 1);
            progressBar.fillRoundedRect(cx - 98, cy + 22, 196 * val, 12, 6);
        });

        // Load Sprites & Textures
        this.load.image('bg_sky', 'assets/bg_sky.png');
        this.load.image('bg_clouds', 'assets/bg_clouds.png');
        this.load.image('bg_hills', 'assets/bg_hills.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('pipe_top', 'assets/pipe_top.png');
        this.load.image('pipe_bottom', 'assets/pipe_bottom.png');
        this.load.image('feather', 'assets/feather.png');
        this.load.image('sparkle', 'assets/sparkle.png');
        this.load.image('medal_bronze', 'assets/medal_bronze.png');
        this.load.image('medal_silver', 'assets/medal_silver.png');
        this.load.image('medal_gold', 'assets/medal_gold.png');
        this.load.image('medal_platinum', 'assets/medal_platinum.png');

        // Spritesheets (3 frames: 64x48)
        SKINS.forEach(skin => {
            this.load.spritesheet(skin.id, `assets/${skin.id}.png`, {
                frameWidth: 64,
                frameHeight: 48
            });
        });
    }

    create() {
        // Register animations for each skin
        SKINS.forEach(skin => {
            this.anims.create({
                key: `${skin.id}_fly`,
                frames: this.anims.generateFrameNumbers(skin.id, { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1,
                yoyo: true
            });
        });

        this.scene.start('MenuScene');
    }
}

// ------------------------------------------------------------
// MENU SCENE
// ------------------------------------------------------------
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const cx = CONFIG.GAME_WIDTH / 2;
        const cy = CONFIG.GAME_HEIGHT / 2;

        // Backgrounds
        this.add.image(cx, CONFIG.GAME_HEIGHT / 2, 'bg_sky').setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        this.clouds = this.add.tileSprite(cx, 160, CONFIG.GAME_WIDTH, 220, 'bg_clouds').setAlpha(0.9);
        this.hills = this.add.tileSprite(cx, CONFIG.GROUND_Y - 90, CONFIG.GAME_WIDTH, 240, 'bg_hills');
        this.ground = this.add.tileSprite(cx, CONFIG.GROUND_Y + 56, CONFIG.GAME_WIDTH, 112, 'ground').setDepth(10);

        // Best Score
        const bestScore = parseInt(localStorage.getItem('flappy_high_score') || '0', 10);

        // Sound Toggle Button (Top Right)
        this.createSoundButton();

        // Title Header
        const titleContainer = this.add.container(cx, 150);
        const titleText = this.add.text(0, 0, 'FLAPPY BIRD', {
            fontFamily: 'Impact, "Arial Black", system-ui, sans-serif',
            fontSize: '44px',
            color: '#ffffff',
            stroke: '#1e5f0d',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 6, color: '#0f3306', blur: 6, fill: true }
        }).setOrigin(0.5);

        const subText = this.add.text(0, 42, 'ULTRA EDITION', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            fontStyle: '900',
            color: '#ffe543',
            stroke: '#7a4e00',
            strokeThickness: 3,
            letterSpacing: 3
        }).setOrigin(0.5);

        titleContainer.add([titleText, subText]);

        // Idle floating title animation
        this.tweens.add({
            targets: titleContainer,
            y: 142,
            duration: 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Interactive Bird Showcase & Skin Picker
        this.createSkinPicker(cx, 280, bestScore);

        // High Score Trophy Display
        const trophyBg = this.add.graphics();
        trophyBg.fillStyle(0x000000, 0.35);
        trophyBg.fillRoundedRect(cx - 100, 375, 200, 46, 23);

        this.add.text(cx, 398, `🏆 BEST RECORD: ${bestScore}`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#ffe663',
        }).setOrigin(0.5);

        // Pulse Play CTA Button
        const playBtn = this.add.container(cx, 480);
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x55cc22, 1);
        btnBg.fillRoundedRect(-110, -28, 220, 56, 28);
        btnBg.lineStyle(4, 0xffffff, 1);
        btnBg.strokeRoundedRect(-110, -28, 220, 56, 28);

        const btnText = this.add.text(0, 0, 'TAP TO FLY', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '26px',
            color: '#ffffff',
            stroke: '#286b09',
            strokeThickness: 5
        }).setOrigin(0.5);

        playBtn.add([btnBg, btnText]);
        playBtn.setSize(220, 56).setInteractive({ useHandCursor: true });

        this.tweens.add({
            targets: playBtn,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Instructions Footer
        this.add.text(cx, 550, 'TAP SCREEN OR PRESS SPACE', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#222222',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Start trigger
        const startGame = () => {
            window.soundManager.playClick();
            this.scene.start('GameScene');
        };

        playBtn.on('pointerdown', startGame);

        this.input.keyboard.on('keydown-SPACE', startGame);
        this.input.keyboard.on('keydown-UP', startGame);
    }

    createSoundButton() {
        const btn = this.add.container(CONFIG.GAME_WIDTH - 42, 42).setDepth(20);
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.4);
        bg.fillCircle(0, 0, 22);

        const text = this.add.text(0, 0, window.soundManager.isMuted() ? '🔇' : '🔊', {
            fontSize: '20px'
        }).setOrigin(0.5);

        btn.add([bg, text]);
        btn.setSize(44, 44).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            const muted = window.soundManager.toggleMute();
            text.setText(muted ? '🔇' : '🔊');
            if (!muted) window.soundManager.playClick();
        });
    }

    createSkinPicker(cx, cy, bestScore) {
        const skin = SKINS[selectedSkinIndex];

        this.birdPreview = this.add.sprite(cx, cy, skin.id, 1).setScale(1.4);
        this.birdPreview.play(`${skin.id}_fly`);

        this.tweens.add({
            targets: this.birdPreview,
            y: cy - 10,
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.skinNameText = this.add.text(cx, cy + 42, skin.name, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#111111',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.skinDescText = this.add.text(cx, cy + 62, skin.desc, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            color: '#e0e0e0',
            stroke: '#111111',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Arrows to change skin
        const leftArrow = this.add.text(cx - 75, cy, '◀', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const rightArrow = this.add.text(cx + 75, cy, '▶', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const updateSkin = (delta) => {
            window.soundManager.playClick();
            let newIndex = (selectedSkinIndex + delta + SKINS.length) % SKINS.length;
            const targetSkin = SKINS[newIndex];

            // Check if unlocked
            if (bestScore < targetSkin.unlockScore) {
                this.cameras.main.shake(120, 0.005);
                this.skinDescText.setText(`🔒 Locked! Need ${targetSkin.unlockScore} pts`).setColor('#ff7777');
                return;
            }

            selectedSkinIndex = newIndex;
            localStorage.setItem('flappy_selected_skin', selectedSkinIndex);
            const curSkin = SKINS[selectedSkinIndex];
            this.birdPreview.setTexture(curSkin.id);
            this.birdPreview.play(`${curSkin.id}_fly`);
            this.skinNameText.setText(curSkin.name);
            this.skinDescText.setText(curSkin.desc).setColor('#e0e0e0');
        };

        leftArrow.on('pointerdown', () => updateSkin(-1));
        rightArrow.on('pointerdown', () => updateSkin(1));
    }

    update() {
        this.clouds.tilePositionX += 0.25;
        this.hills.tilePositionX += 0.6;
        this.ground.tilePositionX += 2.2;
    }
}

// ------------------------------------------------------------
// GAME SCENE
// ------------------------------------------------------------
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.score = 0;
        this.isGameOver = false;
        this.gameStarted = false;
        this.currentPipeSpeed = CONFIG.PIPE_SPEED_BASE;
        this.currentGap = CONFIG.PIPE_GAP_BASE;
    }

    create() {
        const cx = CONFIG.GAME_WIDTH / 2;

        // Visual Parallax Layers
        this.add.image(cx, CONFIG.GAME_HEIGHT / 2, 'bg_sky').setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        this.clouds = this.add.tileSprite(cx, 160, CONFIG.GAME_WIDTH, 220, 'bg_clouds').setAlpha(0.9);
        this.hills = this.add.tileSprite(cx, CONFIG.GROUND_Y - 90, CONFIG.GAME_WIDTH, 240, 'bg_hills');

        // Physics Groups
        this.pipes = this.physics.add.group();

        // Animated Bird Player
        const currentSkin = SKINS[selectedSkinIndex] || SKINS[0];
        this.bird = this.physics.add.sprite(cx - 60, CONFIG.GAME_HEIGHT / 2 - 30, currentSkin.id);
        this.bird.play(`${currentSkin.id}_fly`);
        this.bird.setDepth(15);
        this.bird.body.setSize(34, 28).setOffset(15, 10);
        this.bird.body.allowGravity = false; // Hover until first flap

        // Hover tween before start
        this.hoverTween = this.tweens.add({
            targets: this.bird,
            y: this.bird.y - 12,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Scrolling Ground (Physically Solid)
        this.ground = this.add.tileSprite(cx, CONFIG.GROUND_Y + 56, CONFIG.GAME_WIDTH, 112, 'ground').setDepth(20);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(CONFIG.GAME_WIDTH, 112).setOffset(0, 0);

        // Particle Emitter for Feathers
        this.featherEmitter = this.add.particles(0, 0, 'feather', {
            lifespan: 500,
            speed: { min: 40, max: 90 },
            scale: { start: 0.8, end: 0.1 },
            alpha: { start: 1, end: 0 },
            gravityY: 150,
            emitting: false
        }).setDepth(12);

        // Particle Emitter for Score Sparkles
        this.sparkleEmitter = this.add.particles(0, 0, 'sparkle', {
            lifespan: 600,
            speed: { min: 60, max: 130 },
            scale: { start: 1, end: 0.2 },
            alpha: { start: 1, end: 0 },
            emitting: false
        }).setDepth(25);

        // Colliders
        this.physics.add.collider(this.bird, this.ground, this.handleGroundHit, null, this);
        this.physics.add.overlap(this.bird, this.pipes, this.handlePipeCollision, null, this);

        // In-Game Score HUD
        this.scoreText = this.add.text(cx, 80, '0', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '52px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 7,
            shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 4, fill: true }
        }).setOrigin(0.5).setDepth(30).setAlpha(0);

        // "Ready? Tap to fly" Banner
        this.getReadyGuide = this.createReadyPrompt(cx, CONFIG.GAME_HEIGHT / 2 + 70);

        // Input Setup (Screen touch / click / spacebar / arrow up)
        this.input.on('pointerdown', this.handleFlap, this);
        this.input.keyboard.on('keydown-SPACE', this.handleFlap, this);
        this.input.keyboard.on('keydown-UP', this.handleFlap, this);
    }

    createReadyPrompt(cx, cy) {
        const container = this.add.container(cx, cy).setDepth(25);

        const banner = this.add.text(0, -20, 'GET READY!', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#286b09',
            strokeThickness: 6
        }).setOrigin(0.5);

        const hint = this.add.text(0, 22, 'TAP OR PRESS SPACE', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        container.add([banner, hint]);

        this.tweens.add({
            targets: container,
            scaleX: 1.06,
            scaleY: 1.06,
            duration: 650,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return container;
    }

    handleFlap() {
        if (this.isGameOver) return;

        // Unlock sound context on first tap
        window.soundManager.init();

        // Start game on first flap
        if (!this.gameStarted) {
            this.gameStarted = true;
            if (this.hoverTween) this.hoverTween.stop();
            this.bird.body.allowGravity = true;
            this.bird.body.setGravityY(CONFIG.GRAVITY);

            // Fade out prompt, show HUD score
            this.tweens.add({
                targets: this.getReadyGuide,
                alpha: 0,
                duration: 250,
                onComplete: () => this.getReadyGuide.destroy()
            });
            this.tweens.add({
                targets: this.scoreText,
                alpha: 1,
                duration: 200
            });

            // Start pipe spawning
            this.pipeTimer = this.time.addEvent({
                delay: CONFIG.PIPE_SPAWN_INTERVAL,
                callback: this.spawnPipes,
                callbackScope: this,
                loop: true
            });
        }

        // Apply upward impulse
        this.bird.body.setVelocityY(CONFIG.FLAP_POWER);

        // Flap feather particles
        this.featherEmitter.explode(4, this.bird.x - 16, this.bird.y + 4);

        // Audio
        window.soundManager.playFlap();
    }

    spawnPipes() {
        if (this.isGameOver) return;

        // Dynamic difficulty scaling
        this.currentPipeSpeed = Math.max(-210, CONFIG.PIPE_SPEED_BASE - (this.score * 1.5));
        this.currentGap = Math.max(122, CONFIG.PIPE_GAP_BASE - (this.score * 0.5));

        const gapY = Phaser.Math.Between(CONFIG.MIN_PIPE_Y, CONFIG.MAX_PIPE_Y);
        const spawnX = CONFIG.GAME_WIDTH + 60;

        // Top Pipe
        const topPipeY = gapY - (this.currentGap / 2);
        const topPipe = this.pipes.create(spawnX, topPipeY, 'pipe_top');
        topPipe.setOrigin(0.5, 1);
        topPipe.body.allowGravity = false;
        topPipe.body.setVelocityX(this.currentPipeSpeed);
        topPipe.body.setSize(70, 480).setOffset(8, 0);
        topPipe.setDepth(10);

        // Bottom Pipe
        const bottomPipeY = gapY + (this.currentGap / 2);
        const bottomPipe = this.pipes.create(spawnX, bottomPipeY, 'pipe_bottom');
        bottomPipe.setOrigin(0.5, 0);
        bottomPipe.body.allowGravity = false;
        bottomPipe.body.setVelocityX(this.currentPipeSpeed);
        bottomPipe.body.setSize(70, 480).setOffset(8, 0);
        bottomPipe.setDepth(10);

        // Scoring Trigger Zone
        const scoreZone = this.add.zone(spawnX + 35, gapY, 12, this.currentGap);
        this.physics.add.existing(scoreZone);
        scoreZone.body.allowGravity = false;
        scoreZone.body.setVelocityX(this.currentPipeSpeed);
        scoreZone.scored = false;

        this.physics.add.overlap(this.bird, scoreZone, () => {
            if (!scoreZone.scored && !this.isGameOver) {
                scoreZone.scored = true;
                this.incrementScore(spawnX, gapY);
            }
        });
    }

    incrementScore(x, y) {
        this.score += 1;
        this.scoreText.setText(this.score.toString());

        // Punchy Score Pop Animation
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.35,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        // Floating "+1" Indicator
        const plusOne = this.add.text(this.bird.x + 20, this.bird.y - 15, '+1', {
            fontFamily: 'Impact, sans-serif',
            fontSize: '22px',
            color: '#ffe53b',
            stroke: '#000000',
            strokeThickness: 4
        }).setDepth(26);

        this.tweens.add({
            targets: plusOne,
            y: plusOne.y - 35,
            alpha: 0,
            scale: 1.2,
            duration: 650,
            ease: 'Cubic.easeOut',
            onComplete: () => plusOne.destroy()
        });

        // Sparkle particles
        this.sparkleEmitter.explode(8, this.bird.x, this.bird.y);

        window.soundManager.playScore();
    }

    handlePipeCollision(bird, pipe) {
        if (this.isGameOver) return;
        this.triggerGameOver(false);
    }

    handleGroundHit(bird, ground) {
        if (this.isGameOver) return;
        this.triggerGameOver(true);
    }

    triggerGameOver(hitGround) {
        this.isGameOver = true;
        if (this.pipeTimer) this.pipeTimer.remove();

        // Audio & Haptics
        window.soundManager.playHit();
        if (hitGround) {
            window.soundManager.playDie();
        } else {
            this.time.delayedCall(160, () => window.soundManager.playDie());
        }

        // Camera Juice: White Flash + Impact Shake
        this.cameras.main.flash(200, 255, 255, 255);
        this.cameras.main.shake(260, 0.022);

        // Feather explosion
        this.featherEmitter.explode(18, this.bird.x, this.bird.y);

        // Stop bird animation and set death tumble
        this.bird.stop();
        this.bird.body.setVelocityX(0);
        this.bird.body.setVelocityY(-150);
        this.bird.setAngularVelocity(420);

        // Stop all pipes
        this.pipes.getChildren().forEach(p => {
            if (p.body) p.body.setVelocityX(0);
        });

        // Fade out main HUD score
        this.tweens.add({
            targets: this.scoreText,
            alpha: 0,
            duration: 200
        });

        // High Score Processing
        const oldHigh = parseInt(localStorage.getItem('flappy_high_score') || '0', 10);
        const isNewBest = this.score > oldHigh;
        if (isNewBest) {
            localStorage.setItem('flappy_high_score', this.score);
        }

        // Check unlocked skins
        let newlyUnlockedSkin = null;
        SKINS.forEach(s => {
            if (s.unlockScore > 0 && oldHigh < s.unlockScore && Math.max(oldHigh, this.score) >= s.unlockScore) {
                newlyUnlockedSkin = s;
            }
        });

        // Delay before showing scorecard for dramatic effect
        this.time.delayedCall(700, () => {
            this.showGameOverModal(isNewBest, Math.max(oldHigh, this.score), newlyUnlockedSkin);
        });
    }

    showGameOverModal(isNewBest, bestScore, newSkin) {
        const cx = CONFIG.GAME_WIDTH / 2;
        const cy = CONFIG.GAME_HEIGHT / 2 - 20;

        const modal = this.add.container(cx, cy + 300).setDepth(40);

        // Card Backdrop
        const cardW = 320;
        const cardH = 260;
        const cardBg = this.add.graphics();
        // Shadow
        cardBg.fillStyle(0x000000, 0.45);
        cardBg.fillRoundedRect(-cardW / 2 + 4, -cardH / 2 + 6, cardW, cardH, 20);
        // Main panel
        cardBg.fillStyle(0xfff7e6, 1);
        cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
        // Border
        cardBg.lineStyle(5, 0xd4a046, 1);
        cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);

        // Game Over Banner
        const bannerText = this.add.text(0, -cardH / 2 - 38, 'GAME OVER', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#d9381e',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 6, fill: true }
        }).setOrigin(0.5);

        // Medal Box
        const medalBox = this.add.graphics();
        medalBox.fillStyle(0xecd8b2, 0.8);
        medalBox.fillRoundedRect(-cardW / 2 + 24, -55, 90, 90, 12);
        medalBox.lineStyle(2, 0xc19b62, 1);
        medalBox.strokeRoundedRect(-cardW / 2 + 24, -55, 90, 90, 12);

        const medalLabel = this.add.text(-cardW / 2 + 69, -68, 'MEDAL', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#7a5a2a'
        }).setOrigin(0.5);

        // Determine Medal Key
        let medalKey = null;
        if (this.score >= 50) medalKey = 'medal_platinum';
        else if (this.score >= 35) medalKey = 'medal_gold';
        else if (this.score >= 20) medalKey = 'medal_silver';
        else if (this.score >= 10) medalKey = 'medal_bronze';

        let medalSprite = null;
        if (medalKey) {
            medalSprite = this.add.image(-cardW / 2 + 69, -10, medalKey).setScale(1.2);
        } else {
            medalSprite = this.add.text(-cardW / 2 + 69, -10, 'NONE', {
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#9c8159'
            }).setOrigin(0.5);
        }

        // Score Labels & Values
        const scoreLabel = this.add.text(35, -55, 'SCORE', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontStyle: '900',
            color: '#b08436'
        }).setOrigin(0, 0.5);

        const scoreVal = this.add.text(125, -30, '0', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#3d260f'
        }).setOrigin(1, 0.5);

        const bestLabel = this.add.text(35, 10, 'BEST', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontStyle: '900',
            color: '#b08436'
        }).setOrigin(0, 0.5);

        const bestVal = this.add.text(125, 35, `${bestScore}`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#3d260f'
        }).setOrigin(1, 0.5);

        // New High Score Badge
        let newBestBadge = null;
        if (isNewBest && this.score > 0) {
            newBestBadge = this.add.text(50, -10, 'NEW!', {
                fontFamily: 'Impact, sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#e63946',
                padding: { x: 6, y: 3 }
            }).setOrigin(0, 0.5);
            window.soundManager.playFanfare();
        }

        // New Skin Unlocked Notification
        let skinBadge = null;
        if (newSkin) {
            skinBadge = this.add.text(0, 68, `🎉 NEW SKIN UNLOCKED: ${newSkin.name}!`, {
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '12px',
                fontStyle: 'bold',
                color: '#0d7a1e',
                backgroundColor: '#d8f5d0',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5);
        }

        // Restart Button
        const restartBtn = this.add.container(-65, cardH / 2 + 38);
        const rBg = this.add.graphics();
        rBg.fillStyle(0x55cc22, 1);
        rBg.fillRoundedRect(-55, -24, 110, 48, 14);
        rBg.lineStyle(3, 0xffffff, 1);
        rBg.strokeRoundedRect(-55, -24, 110, 48, 14);

        const rText = this.add.text(0, 0, 'RETRY', {
            fontFamily: 'Impact, sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#286b09',
            strokeThickness: 4
        }).setOrigin(0.5);
        restartBtn.add([rBg, rText]);
        restartBtn.setSize(110, 48).setInteractive({ useHandCursor: true });

        // Home Button
        const homeBtn = this.add.container(65, cardH / 2 + 38);
        const hBg = this.add.graphics();
        hBg.fillStyle(0x3a86ff, 1);
        hBg.fillRoundedRect(-55, -24, 110, 48, 14);
        hBg.lineStyle(3, 0xffffff, 1);
        hBg.strokeRoundedRect(-55, -24, 110, 48, 14);

        const hText = this.add.text(0, 0, 'MENU', {
            fontFamily: 'Impact, sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#104ea6',
            strokeThickness: 4
        }).setOrigin(0.5);
        homeBtn.add([hBg, hText]);
        homeBtn.setSize(110, 48).setInteractive({ useHandCursor: true });

        modal.add([
            cardBg, bannerText, medalBox, medalLabel, medalSprite,
            scoreLabel, scoreVal, bestLabel, bestVal,
            restartBtn, homeBtn
        ]);
        if (newBestBadge) modal.add(newBestBadge);
        if (skinBadge) modal.add(skinBadge);

        // Slide modal in with spring ease
        this.tweens.add({
            targets: modal,
            y: cy,
            duration: 480,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Count up score value smoothly
                let currentCountingScore = 0;
                this.time.addEvent({
                    delay: 40,
                    repeat: this.score,
                    callback: () => {
                        if (currentCountingScore <= this.score) {
                            scoreVal.setText(currentCountingScore.toString());
                            currentCountingScore++;
                        }
                    }
                });
            }
        });

        // Button Listeners
        restartBtn.on('pointerdown', () => {
            window.soundManager.playClick();
            this.scene.restart();
        });

        homeBtn.on('pointerdown', () => {
            window.soundManager.playClick();
            this.scene.start('MenuScene');
        });

        // Spacebar quick restart
        this.input.keyboard.once('keydown-SPACE', () => {
            window.soundManager.playClick();
            this.scene.restart();
        });
    }

    update() {
        if (!this.isGameOver) {
            // Parallax continuous scroll
            this.clouds.tilePositionX += 0.25;
            this.hills.tilePositionX += 0.6;
            this.ground.tilePositionX += 2.6;

            // Clamp ceiling
            if (this.bird.y < -15) {
                this.bird.y = -15;
                this.bird.body.setVelocityY(0);
            }

            // Smooth Bird Rotation Physics (dips down when falling, points up when flapping)
            if (this.gameStarted) {
                const targetAngle = Phaser.Math.Clamp(this.bird.body.velocity.y * 0.08, -25, 75);
                this.bird.angle = Phaser.Math.Linear(this.bird.angle, targetAngle, 0.12);
            }

            // Clean up out-of-bounds pipes
            this.pipes.getChildren().forEach(pipe => {
                if (pipe.x < -100) {
                    pipe.destroy();
                }
            });
        }
    }
}

// ------------------------------------------------------------
// PHASER CONFIGURATION & BOOTSTRAP
// ------------------------------------------------------------
const phaserConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        pixelArt: false,
        antialias: true,
        powerPreference: 'high-performance'
    },
    scene: [PreloadScene, MenuScene, GameScene]
};

window.onload = () => {
    window.game = new Phaser.Game(phaserConfig);
};
