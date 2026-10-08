// ============================================================
// FIRE DRAGON - FREE FLIGHT & EVOLUTION ENGINE
// Vertical 2D Game • Free Touch/Mouse Drag • No Gravity • No Flapping
// ============================================================

const CONFIG = {
    GAME_WIDTH: 400,
    GAME_HEIGHT: 700,

    // Dragon flight boundaries (padding from screen edges)
    BOUNDS_PAD_X: 45,
    BOUNDS_PAD_Y: 55,

    // Natural hover / idle float motion
    HOVER_AMPLITUDE: 6.0,
    HOVER_FREQUENCY: 0.0035,

    // Drag responsiveness
    DRAG_LERP: 0.22,
    BANK_LERP: 0.12,
    MAX_BANK_ANGLE: 0.22, // radians (~12.6 degrees)
};

// ============================================================
// FIRE DRAGON - 3 EVOLUTIONARY STAGES
// Same species, progressively larger, more powerful and majestic
// ============================================================
const DRAGON_STAGES = [
    {
        stage: 1,
        id: 'baby',
        name: 'Baby Fire Dragon',
        shortName: 'Baby',
        icon: '🐣',
        tag: 'Hatchling Stage',
        desc: 'Small cute body, curious sapphire eyes, tiny fire tail',
        textureKey: 'dragon_baby',
        assetPath: 'assets/dragon/dragon_baby_game.png',
        displayScale: 1.0,
        hitRadius: 42,
        titleColor: '#fde047',
        badgeColor: '#eab308',
        tailOffset: { x: -35, y: 15 },
        emberRate: 1.0
    },
    {
        stage: 2,
        id: 'teen',
        name: 'Teen Fire Dragon',
        shortName: 'Teen',
        icon: '⚡',
        tag: 'Adolescent Stage',
        desc: 'Developing horns, expanding wings, energetic fiery breath',
        textureKey: 'dragon_teen',
        assetPath: 'assets/dragon/dragon_teen_game.png',
        displayScale: 1.0,
        hitRadius: 60,
        titleColor: '#fb923c',
        badgeColor: '#f97316',
        tailOffset: { x: -55, y: 25 },
        emberRate: 1.5
    },
    {
        stage: 3,
        id: 'mature',
        name: 'Mature Fire Dragon',
        shortName: 'Mature',
        icon: '👑',
        tag: 'Apex Elder Stage',
        desc: 'Massive wings, sweeping crown horns, blazing inferno tail',
        textureKey: 'dragon_mature',
        assetPath: 'assets/dragon/dragon_mature_game.png',
        displayScale: 1.0,
        hitRadius: 82,
        titleColor: '#f87171',
        badgeColor: '#ef4444',
        tailOffset: { x: -80, y: 35 },
        emberRate: 2.2
    }
];

// ------------------------------------------------------------
// 1. PRELOAD SCENE
// ------------------------------------------------------------
class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        const cx = CONFIG.GAME_WIDTH / 2;
        const cy = CONFIG.GAME_HEIGHT / 2;

        this.add.text(cx, cy - 30, 'FIRE DRAGON', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#f97316',
            stroke: '#1e0802',
            strokeThickness: 6
        }).setOrigin(0.5);

        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        progressBox.fillStyle(0x180b1e, 0.8);
        progressBox.fillRoundedRect(cx - 110, cy + 20, 220, 16, 8);

        this.load.on('progress', (val) => {
            progressBar.clear();
            progressBar.fillStyle(0xf97316, 1);
            progressBar.fillRoundedRect(cx - 108, cy + 22, 216 * val, 12, 6);
        });

        // Load 3 Dragon Stages
        DRAGON_STAGES.forEach(s => {
            this.load.image(s.textureKey, s.assetPath);
        });

        // Load Background & Ember Particle
        this.load.image('dragon_bg', 'assets/dragon/dragon_bg.png');
        this.load.image('ember', 'assets/dragon/ember.png');
    }

    create() {
        this.scene.start('DragonFlightScene');
    }
}

// ------------------------------------------------------------
// 2. MAIN DRAGON FLIGHT SCENE
// ------------------------------------------------------------
class DragonFlightScene extends Phaser.Scene {
    constructor() {
        super('DragonFlightScene');
    }

    create() {
        this.currentStageIndex = 0; // Starts at Baby Fire Dragon (Stage 1)
        this.isDragging = false;
        this.targetX = CONFIG.GAME_WIDTH / 2;
        this.targetY = CONFIG.GAME_HEIGHT / 2;
        this.currentX = this.targetX;
        this.currentY = this.targetY;
        this.currentAngle = 0;
        this.hoverTime = 0;

        // Sound manager
        if (window.soundManager) {
            window.soundManager.init();
        }

        // 1. Atmospheric Background
        this.bg = this.add.image(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 'dragon_bg');
        this.bg.setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        // 2. Background ambient floating embers
        this.createAmbientEmbers();

        // 3. Dragon Tail Ember Emitter
        this.tailEmitter = this.add.particles(this.currentX, this.currentY, 'ember', {
            speed: { min: 20, max: 60 },
            angle: { min: 140, max: 220 },
            scale: { start: 0.5, end: 0.05 },
            alpha: { start: 0.9, end: 0 },
            lifespan: 650,
            blendMode: 'ADD',
            frequency: 70
        });

        // 4. Dragon Sprite
        this.dragon = this.add.image(this.currentX, this.currentY, DRAGON_STAGES[0].textureKey);
        this.dragon.setOrigin(0.5, 0.5);
        this.dragon.setInteractive({ useHandCursor: true });

        // Grab / Drag Touch Indicator Ring
        this.grabRing = this.add.graphics();
        this.grabRing.setDepth(5);
        this.grabRing.setVisible(false);

        // 5. Setup Drag Controls (Mouse & Touch)
        this.setupDragControls();

        // 6. Evolution Particle Burst Emitter (for stage evolution)
        this.evolveEmitter = this.add.particles(0, 0, 'ember', {
            speed: { min: 80, max: 260 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.9, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            blendMode: 'ADD',
            emitting: false
        });
        this.evolveEmitter.setDepth(20);

        // 7. UI Overlay: Header & Evolution Stage Switcher
        this.createUI();

        // Flash banner welcome
        this.showEvolutionToast(DRAGON_STAGES[0]);
    }

    // ------------------------------------------------------------
    // AMBIENT EMBERS
    // ------------------------------------------------------------
    createAmbientEmbers() {
        this.ambientEmbers = this.add.particles(0, 0, 'ember', {
            x: { min: 0, max: CONFIG.GAME_WIDTH },
            y: { min: CONFIG.GAME_HEIGHT + 20, max: CONFIG.GAME_HEIGHT + 60 },
            speedY: { min: -40, max: -90 },
            speedX: { min: -15, max: 25 },
            scale: { start: 0.35, end: 0.05 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 7000,
            blendMode: 'ADD',
            frequency: 450
        });
        this.ambientEmbers.setDepth(2);
    }

    // ------------------------------------------------------------
    // DRAG CONTROLS (DESKTOP MOUSE + MOBILE TOUCH)
    // ------------------------------------------------------------
    setupDragControls() {
        // Pointer down on dragon or near dragon
        this.input.on('pointerdown', (pointer) => {
            const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.currentX, this.currentY);
            const currentStage = DRAGON_STAGES[this.currentStageIndex];
            
            // Allow grab if clicked on/near dragon (within hit radius + generous margin for mobile fingers)
            if (dist <= currentStage.hitRadius + 35) {
                this.isDragging = true;
                this.dragOffsetX = this.currentX - pointer.x;
                this.dragOffsetY = this.currentY - pointer.y;

                // Subtle scale punch feedback on grab
                this.tweens.add({
                    targets: this.dragon,
                    scaleX: currentStage.displayScale * 1.08,
                    scaleY: currentStage.displayScale * 1.08,
                    duration: 120,
                    yoyo: true
                });

                if (window.soundManager && window.soundManager.playDragonGrab) {
                    window.soundManager.playDragonGrab();
                }
            }
        });

        // Pointer move updates target position when dragging
        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                // Apply drag offset so it doesn't snap abruptly to center of finger
                let nx = pointer.x + (this.dragOffsetX || 0);
                let ny = pointer.y + (this.dragOffsetY || 0);

                // Clamp within vertical screen bounds so dragon stays on screen
                const padX = CONFIG.BOUNDS_PAD_X;
                const padY = CONFIG.BOUNDS_PAD_Y + 40; // Top header space
                const botPad = CONFIG.BOUNDS_PAD_Y + 60; // Bottom UI space
                
                this.targetX = Phaser.Math.Clamp(nx, padX, CONFIG.GAME_WIDTH - padX);
                this.targetY = Phaser.Math.Clamp(ny, padY, CONFIG.GAME_HEIGHT - botPad);
            }
        });

        // Pointer up releases dragon
        this.input.on('pointerup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.grabRing.setVisible(false);
            }
        });

        this.input.on('pointerupoutside', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.grabRing.setVisible(false);
            }
        });
    }

    // ------------------------------------------------------------
    // EVOLUTION STAGE TRANSITION
    // ------------------------------------------------------------
    setDragonStage(stageIndex) {
        if (stageIndex < 0 || stageIndex >= DRAGON_STAGES.length) return;
        this.currentStageIndex = stageIndex;
        const stage = DRAGON_STAGES[stageIndex];

        // 1. Fiery explosion particle burst at dragon position
        this.evolveEmitter.emitParticleAt(this.currentX, this.currentY, 40);

        // 2. Play evolution sound
        if (window.soundManager && window.soundManager.playDragonEvolve) {
            window.soundManager.playDragonEvolve();
        }

        // 3. Texture swap and growth transition tween
        this.dragon.setTexture(stage.textureKey);

        this.dragon.setScale(0.3);
        this.tweens.add({
            targets: this.dragon,
            scaleX: stage.displayScale,
            scaleY: stage.displayScale,
            duration: 380,
            ease: 'Back.easeOut'
        });

        // 4. Update tail particles rate & offset
        this.tailEmitter.setFrequency(Math.max(25, 75 / stage.emberRate));

        // 5. Update UI Buttons & Banner
        this.updateStageUI();
        this.showEvolutionToast(stage);
    }

    // ------------------------------------------------------------
    // UI OVERLAY: HEADER & EVOLUTION SELECTOR
    // ------------------------------------------------------------
    createUI() {
        const topY = 24;

        // Top Glass Container
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x0a0a14, 0.7);
        headerBg.fillRoundedRect(16, 12, CONFIG.GAME_WIDTH - 32, 54, 14);
        headerBg.lineStyle(1, 0xffaa44, 0.3);
        headerBg.strokeRoundedRect(16, 12, CONFIG.GAME_WIDTH - 32, 54, 14);
        headerBg.setDepth(30);

        // Title Text
        this.titleText = this.add.text(CONFIG.GAME_WIDTH / 2, 28, '🔥 FIRE DRAGON', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '18px',
            color: '#f97316',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5).setDepth(31);

        // Subtitle / Drag Hint Text
        this.subtitleText = this.add.text(CONFIG.GAME_WIDTH / 2, 48, 'Drag freely anywhere • No gravity', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '11px',
            color: '#fdba74'
        }).setOrigin(0.5, 0.5).setDepth(31);

        // Bottom Evolution Selector Bar
        this.createEvolutionBar();
    }

    createEvolutionBar() {
        const barY = CONFIG.GAME_HEIGHT - 66;

        const barBg = this.add.graphics();
        barBg.fillStyle(0x0c0c16, 0.88);
        barBg.fillRoundedRect(16, barY - 14, CONFIG.GAME_WIDTH - 32, 64, 18);
        barBg.lineStyle(1, 0xf97316, 0.4);
        barBg.strokeRoundedRect(16, barY - 14, CONFIG.GAME_WIDTH - 32, 64, 18);
        barBg.setDepth(30);

        this.stageButtons = [];
        const btnWidth = 110;
        const spacing = 10;
        const totalW = (btnWidth * 3) + (spacing * 2);
        const startX = (CONFIG.GAME_WIDTH - totalW) / 2 + (btnWidth / 2);

        DRAGON_STAGES.forEach((stage, idx) => {
            const bx = startX + idx * (btnWidth + spacing);
            const by = barY + 18;

            const btnContainer = this.add.container(bx, by).setDepth(32);

            const btnBg = this.add.graphics();
            btnContainer.add(btnBg);

            const label = this.add.text(0, 0, `${stage.icon} ${stage.shortName}`, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '14px',
                color: '#ffffff'
            }).setOrigin(0.5, 0.5);
            btnContainer.add(label);

            btnContainer.setSize(btnWidth, 38);
            btnContainer.setInteractive({ useHandCursor: true });

            btnContainer.on('pointerdown', () => {
                this.setDragonStage(idx);
            });

            this.stageButtons.push({
                container: btnContainer,
                bg: btnBg,
                label: label,
                stage: stage
            });
        });

        this.updateStageUI();
    }

    updateStageUI() {
        const currentStage = DRAGON_STAGES[this.currentStageIndex];

        // Update Title and Subtitle
        if (this.titleText) {
            this.titleText.setText(`🔥 ${currentStage.name.toUpperCase()}`);
            this.titleText.setColor(currentStage.titleColor);
        }

        // Highlight selected evolution button
        this.stageButtons.forEach((btn, idx) => {
            const isSelected = idx === this.currentStageIndex;
            btn.bg.clear();

            if (isSelected) {
                btn.bg.fillStyle(0xf97316, 1);
                btn.bg.fillRoundedRect(-55, -19, 110, 38, 12);
                btn.bg.lineStyle(2, 0xffedd5, 0.9);
                btn.bg.strokeRoundedRect(-55, -19, 110, 38, 12);
                btn.label.setColor('#ffffff');
            } else {
                btn.bg.fillStyle(0x27192b, 0.8);
                btn.bg.fillRoundedRect(-55, -19, 110, 38, 12);
                btn.bg.lineStyle(1, 0xffaa44, 0.2);
                btn.bg.strokeRoundedRect(-55, -19, 110, 38, 12);
                btn.label.setColor('#cbd5e1');
            }
        });
    }

    showEvolutionToast(stage) {
        if (this.toastContainer) {
            this.toastContainer.destroy();
        }

        this.toastContainer = this.add.container(CONFIG.GAME_WIDTH / 2, 95).setDepth(40);

        const toastBg = this.add.graphics();
        toastBg.fillStyle(0x180b1e, 0.92);
        toastBg.fillRoundedRect(-140, -18, 280, 36, 18);
        toastBg.lineStyle(1.5, 0xf97316, 0.8);
        toastBg.strokeRoundedRect(-140, -18, 280, 36, 18);
        this.toastContainer.add(toastBg);

        const toastText = this.add.text(0, 0, `✨ Stage ${stage.stage}: ${stage.name}`, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fef08a'
        }).setOrigin(0.5, 0.5);
        this.toastContainer.add(toastText);

        this.toastContainer.setAlpha(0);
        this.tweens.add({
            targets: this.toastContainer,
            alpha: 1,
            y: 90,
            duration: 250,
            yoyo: true,
            hold: 1800,
            onComplete: () => {
                if (this.toastContainer) this.toastContainer.destroy();
            }
        });
    }

    // ------------------------------------------------------------
    // GAME LOOP (FRAME UPDATE)
    // ------------------------------------------------------------
    update(time, delta) {
        this.hoverTime += delta;
        const currentStage = DRAGON_STAGES[this.currentStageIndex];

        // 1. Hover / floating sinusoidal motion
        // Gentle organic bobbing while hovering
        const hoverOffsetY = Math.sin(this.hoverTime * CONFIG.HOVER_FREQUENCY) * CONFIG.HOVER_AMPLITUDE;

        // 2. Smooth Dragon Position Following (LERP)
        const prevX = this.currentX;
        const prevY = this.currentY;

        this.currentX += (this.targetX - this.currentX) * CONFIG.DRAG_LERP;
        this.currentY += (this.targetY - this.currentY) * CONFIG.DRAG_LERP;

        // 3. Dynamic banking/pitch based on horizontal and vertical drag velocity
        const vx = this.currentX - prevX;
        const vy = this.currentY - prevY;

        // Dragon tilts slightly up when ascending, down when descending, and banks forward when moving right
        let targetAngle = 0;
        if (this.isDragging) {
            targetAngle = Phaser.Math.Clamp(vy * 0.04, -CONFIG.MAX_BANK_ANGLE, CONFIG.MAX_BANK_ANGLE);
        } else {
            // Gentle hovering breathing tilt
            targetAngle = Math.sin(this.hoverTime * CONFIG.HOVER_FREQUENCY * 0.7) * 0.03;
        }

        this.currentAngle += (targetAngle - this.currentAngle) * CONFIG.BANK_LERP;
        this.dragon.setRotation(this.currentAngle);

        // Apply position with hover
        this.dragon.setPosition(this.currentX, this.currentY + hoverOffsetY);

        // 4. Update Tail Particle Emitter position relative to dragon rotation & stage offset
        const cos = Math.cos(this.currentAngle);
        const sin = Math.sin(this.currentAngle);
        const tox = currentStage.tailOffset.x;
        const toy = currentStage.tailOffset.y;

        const tailWorldX = this.currentX + (tox * cos - toy * sin);
        const tailWorldY = (this.currentY + hoverOffsetY) + (tox * sin + toy * cos);
        this.tailEmitter.setPosition(tailWorldX, tailWorldY);

        // 5. Update grab indicator ring when dragging
        if (this.isDragging) {
            this.grabRing.setVisible(true);
            this.grabRing.clear();
            this.grabRing.lineStyle(2, 0xf97316, 0.45);
            this.grabRing.strokeCircle(this.currentX, this.currentY + hoverOffsetY, currentStage.hitRadius + 10);
        } else {
            this.grabRing.setVisible(false);
        }
    }
}

// ============================================================
// PHASER GAME CONFIGURATION
// ============================================================
const gameConfig = {
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
            gravity: { y: 0 }, // STRICTLY ZERO GRAVITY
            debug: false
        }
    },
    scene: [PreloadScene, DragonFlightScene]
};

// Initialize Game
window.game = new Phaser.Game(gameConfig);
const game = window.game;
