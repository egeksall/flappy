// ============================================================
// FIRE DRAGON - 3RD PERSON 3-LANE FLIGHT & EVOLUTION ENGINE
// 16:9 Landscape • Rear Camera • Forward Flight • 3 Fixed Lanes
// High-Resolution 1600x900 Crisp Presentation
// ============================================================

const CONFIG = {
    GAME_WIDTH: 1600,
    GAME_HEIGHT: 900,

    // Horizon & 3D Projection
    HORIZON_Y: 310,
    VANISHING_X: 800,

    // 3 Fixed Flight Lanes (Left, Middle, Right) at Dragon Depth (Y = 600)
    DRAGON_Y: 600,
    LANE_X: [490, 800, 1110], // 0: Left, 1: Middle, 2: Right
    LANE_NAMES: ['LEFT', 'MIDDLE', 'RIGHT'],

    // Forward Flight Speed (Pseudo-3D runway scroll)
    FORWARD_SPEED: 0.85,
    LANE_TWEEN_DURATION: 190, // ms for smooth lane change
    BANK_ANGLE: 0.18, // radians roll tilt on lane shift

    // Wing flap animation frame rate
    FLAP_FPS: 7
};

// ============================================================
// 3 FIRE DRAGON EVOLUTION STAGES (Authentic Character Art)
// ============================================================
const DRAGON_STAGES = [
    {
        stage: 1,
        id: 'baby',
        name: 'Baby Fire Dragon',
        shortName: 'Baby',
        icon: '🐣',
        tag: 'Hatchling Form',
        sheetKey: 'dragon_rear_baby',
        sheetPath: 'assets/dragon_rear/dragon_rear_baby_sheet.png',
        sideKey: 'dragon_baby',
        sidePath: 'assets/dragon/dragon_baby.png',
        frameWidth: 257,
        frameHeight: 219,
        tailOffset: { x: 0, y: 78 },
        flameParticleScale: 0.75,
        titleColor: '#fde047'
    },
    {
        stage: 2,
        id: 'teen',
        name: 'Teen Fire Dragon',
        shortName: 'Teen',
        icon: '⚡',
        tag: 'Adolescent Form',
        sheetKey: 'dragon_rear_teen',
        sheetPath: 'assets/dragon_rear/dragon_rear_teen_sheet.png',
        sideKey: 'dragon_teen',
        sidePath: 'assets/dragon/dragon_teen.png',
        frameWidth: 340,
        frameHeight: 282,
        tailOffset: { x: 0, y: 110 },
        flameParticleScale: 1.1,
        titleColor: '#fb923c'
    },
    {
        stage: 3,
        id: 'mature',
        name: 'Mature Fire Dragon',
        shortName: 'Mature',
        icon: '👑',
        tag: 'Apex Elder Form',
        sheetKey: 'dragon_rear_mature',
        sheetPath: 'assets/dragon_rear/dragon_rear_mature_sheet.png',
        sideKey: 'dragon_mature',
        sidePath: 'assets/dragon/dragon_mature.png',
        frameWidth: 486,
        frameHeight: 351,
        tailOffset: { x: 0, y: 145 },
        flameParticleScale: 1.6,
        titleColor: '#f87171'
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

        this.add.text(cx, cy - 60, 'FIRE DRAGON', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '64px',
            color: '#f97316',
            stroke: '#180702',
            strokeThickness: 10
        }).setOrigin(0.5);

        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        progressBox.fillStyle(0x180b1e, 0.9);
        progressBox.fillRoundedRect(cx - 260, cy + 40, 520, 28, 14);

        this.load.on('progress', (val) => {
            progressBar.clear();
            progressBar.fillStyle(0xf97316, 1);
            progressBar.fillRoundedRect(cx - 256, cy + 44, 512 * val, 20, 10);
        });

        // Load 3 Rear-View Dragon Spritesheets
        DRAGON_STAGES.forEach(s => {
            this.load.spritesheet(s.sheetKey, s.sheetPath, {
                frameWidth: s.frameWidth,
                frameHeight: s.frameHeight
            });
            this.load.image(s.sideKey, s.sidePath);
        });

        // Load Landscape Background & Particles
        this.load.image('landscape_bg', 'assets/dragon_rear/landscape_bg.png');
        this.load.image('ember', 'assets/dragon/ember.png');
    }

    create() {
        // Create Wing Flap Animations for all 3 rear dragon stages
        DRAGON_STAGES.forEach(s => {
            this.anims.create({
                key: `${s.sheetKey}_fly`,
                frames: this.anims.generateFrameNumbers(s.sheetKey, { frames: [0, 1, 0, 2] }),
                frameRate: CONFIG.FLAP_FPS,
                repeat: -1
            });
        });

        this.scene.start('DragonFlightScene');
    }
}

// ------------------------------------------------------------
// 2. THIRD-PERSON 3-LANE FLIGHT SCENE
// ------------------------------------------------------------
class DragonFlightScene extends Phaser.Scene {
    constructor() {
        super('DragonFlightScene');
    }

    create() {
        // State
        this.currentStageIndex = 0; // Starts at Baby Fire Dragon (Stage 1)
        this.currentLane = 1;       // Starts in MIDDLE Lane (0: Left, 1: Middle, 2: Right)
        this.isLaneTransitioning = false;
        this.flightDistance = 0;
        this.hoverTime = 0;

        // Sound manager
        if (window.soundManager) {
            window.soundManager.init();
        }

        // 1. Static Sky & Mountain Backdrop
        this.bg = this.add.image(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 'landscape_bg');
        this.bg.setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        // 2. Pseudo-3D Runway / Canyon Ground Lines (Forward Motion)
        this.groundGraphics = this.add.graphics();
        this.initForwardRunway();

        // 3. Fast Forward Speed Streaks & Embers
        this.createSpeedParticles();

        // 4. Tail Flame Ember Particle Emitter
        this.tailEmitter = this.add.particles(CONFIG.LANE_X[this.currentLane], CONFIG.DRAGON_Y, 'ember', {
            speed: { min: 80, max: 220 },
            angle: { min: 70, max: 110 }, // Streams downward/towards camera
            scale: { start: 1.0, end: 0.1 },
            alpha: { start: 0.95, end: 0 },
            lifespan: 550,
            blendMode: 'ADD',
            frequency: 40
        });
        this.tailEmitter.setDepth(15);

        // 5. Dragon Sprite (Rear View, Centered in Middle Lane)
        const initialStage = DRAGON_STAGES[this.currentStageIndex];
        this.dragon = this.add.sprite(CONFIG.LANE_X[this.currentLane], CONFIG.DRAGON_Y, initialStage.sheetKey);
        this.dragon.setOrigin(0.5, 0.5);
        this.dragon.setDepth(20);
        this.dragon.play(`${initialStage.sheetKey}_fly`);

        // 6. Setup Keyboard Controls (Left/Right Arrows & A/D)
        this.setupKeyboardControls();

        // 7. On-Screen Touch Controls (Left & Right Arrow Buttons) & High-Res HUD
        this.createOnScreenControls();
        this.createHUD();

        // Welcome Toast
        this.showEvolutionToast(initialStage);
    }

    // ------------------------------------------------------------
    // PSEUDO-3D FORWARD RUNWAY / CANYON PERSPECTIVE
    // ------------------------------------------------------------
    initForwardRunway() {
        this.runwayTies = [];
        const count = 18;
        for (let i = 0; i < count; i++) {
            this.runwayTies.push((i / count));
        }
    }

    updateForwardRunway(delta) {
        this.groundGraphics.clear();

        const H_Y = CONFIG.HORIZON_Y;
        const V_X = CONFIG.VANISHING_X;
        const B_Y = CONFIG.GAME_HEIGHT;

        // Advance ties towards camera
        const speed = 0.00045 * delta;
        for (let i = 0; i < this.runwayTies.length; i++) {
            this.runwayTies[i] += speed;
            if (this.runwayTies[i] >= 1.0) {
                this.runwayTies[i] -= 1.0;
            }
        }

        // 1. Draw 3-Lane Perspective Guidelines
        // 4 boundary lines at bottom of canvas: Left Outer, Left/Mid, Mid/Right, Right Outer
        const bottomXs = [140, 580, 1020, 1460];
        
        // Magma canyon floor base
        this.groundGraphics.fillStyle(0x180914, 0.92);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(V_X - 120, H_Y);
        this.groundGraphics.lineTo(V_X + 120, H_Y);
        this.groundGraphics.lineTo(bottomXs[3] + 80, B_Y);
        this.groundGraphics.lineTo(bottomXs[0] - 80, B_Y);
        this.groundGraphics.closePath();
        this.groundGraphics.fillPath();

        // Active Lane Glow Floor Highlight under current lane
        const lIdx = this.currentLane;
        const laneLeftBX = bottomXs[lIdx];
        const laneRightBX = bottomXs[lIdx + 1];
        const topLX = V_X - 70 + lIdx * 46;
        const topRX = V_X - 70 + (lIdx + 1) * 46;

        this.groundGraphics.fillStyle(0xf97316, 0.14);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(topLX, H_Y);
        this.groundGraphics.lineTo(topRX, H_Y);
        this.groundGraphics.lineTo(laneRightBX, B_Y);
        this.groundGraphics.lineTo(laneLeftBX, B_Y);
        this.groundGraphics.closePath();
        this.groundGraphics.fillPath();

        // Draw Lane Divider Lines
        for (let j = 0; j < bottomXs.length; j++) {
            const bx = bottomXs[j];
            const tx = V_X - 80 + j * 53;
            const isOuter = (j === 0 || j === bottomXs.length - 1);

            this.groundGraphics.lineStyle(isOuter ? 6 : 4, isOuter ? 0xf97316 : 0xfb923c, isOuter ? 0.85 : 0.45);
            this.groundGraphics.lineBetween(tx, H_Y, bx, B_Y);
        }

        // 2. Draw Moving Horizontal Magma Ridge Ties
        for (let t of this.runwayTies) {
            const progress = Math.pow(t, 2.3);
            const curY = H_Y + (B_Y - H_Y) * progress;
            const curWidth = 160 + (1480 - 160) * progress;
            const curLeft = V_X - curWidth / 2;
            const curRight = V_X + curWidth / 2;

            const alpha = Math.min(1.0, progress * 1.5) * 0.75;
            const thickness = Math.max(2, Math.floor(progress * 10));

            this.groundGraphics.lineStyle(thickness, 0xf97316, alpha);
            this.groundGraphics.lineBetween(curLeft, curY, curRight, curY);

            // Glowing magma dots on lane dividers
            const dotStep = curWidth / 3;
            for (let d = 1; d <= 2; d++) {
                const dotX = curLeft + d * dotStep;
                this.groundGraphics.fillStyle(0xffedd5, alpha);
                this.groundGraphics.fillCircle(dotX, curY, Math.max(3, progress * 8));
            }
        }
    }

    // ------------------------------------------------------------
    // SPEED STREAKS & EMBERS
    // ------------------------------------------------------------
    createSpeedParticles() {
        this.speedParticles = this.add.particles(0, 0, 'ember', {
            x: { min: 500, max: 1100 },
            y: { min: CONFIG.HORIZON_Y + 20, max: CONFIG.HORIZON_Y + 80 },
            speedX: { min: -360, max: 360 },
            speedY: { min: 280, max: 640 },
            scale: { start: 0.25, end: 1.4 },
            alpha: { start: 0.85, end: 0 },
            lifespan: 1100,
            blendMode: 'ADD',
            frequency: 70
        });
        this.speedParticles.setDepth(10);
    }

    // ------------------------------------------------------------
    // 3-LANE MOVEMENT LOGIC
    // ------------------------------------------------------------
    shiftLane(direction) {
        // direction: -1 (LEFT) or +1 (RIGHT)
        const targetLane = this.currentLane + direction;

        // 1. Boundary Check: Cannot move beyond Left (0) or Right (2)
        if (targetLane < 0 || targetLane > 2) {
            this.tweens.add({
                targets: this.dragon,
                x: this.dragon.x + direction * 18,
                duration: 60,
                yoyo: true,
                ease: 'Quad.easeInOut'
            });
            return false;
        }

        // 2. Strict Single-Lane Step (cannot skip lanes)
        this.currentLane = targetLane;
        const targetX = CONFIG.LANE_X[this.currentLane];

        // 3. Audio & Haptic Feedback
        if (window.soundManager && window.soundManager.playDragonGrab) {
            window.soundManager.playDragonGrab();
        }

        // 4. Smooth Transition Tween with Banking Roll
        this.isLaneTransitioning = true;
        const bankRoll = direction * CONFIG.BANK_ANGLE;

        this.tweens.killTweensOf(this.dragon);

        // Move to target lane X
        this.tweens.add({
            targets: this.dragon,
            x: targetX,
            duration: CONFIG.LANE_TWEEN_DURATION,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.isLaneTransitioning = false;
            }
        });

        // Roll into banking tilt, then level out
        this.dragon.setRotation(bankRoll);
        this.tweens.add({
            targets: this.dragon,
            rotation: 0,
            duration: CONFIG.LANE_TWEEN_DURATION * 1.3,
            ease: 'Sine.easeOut'
        });

        // Update HUD
        this.updateLaneHUD();
        return true;
    }

    // ------------------------------------------------------------
    // KEYBOARD CONTROLS (LEFT / RIGHT ARROWS + A / D)
    // ------------------------------------------------------------
    setupKeyboardControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Single press event listeners
        this.input.keyboard.on('keydown-LEFT', () => this.shiftLane(-1));
        this.input.keyboard.on('keydown-A', () => this.shiftLane(-1));

        this.input.keyboard.on('keydown-RIGHT', () => this.shiftLane(+1));
        this.input.keyboard.on('keydown-D', () => this.shiftLane(+1));
    }

    // ------------------------------------------------------------
    // HIGH-RESOLUTION ON-SCREEN TOUCH CONTROLS
    // ------------------------------------------------------------
    createOnScreenControls() {
        const btnY = CONFIG.GAME_HEIGHT - 120;
        const btnW = 210;
        const btnH = 115;

        // Left Arrow Button (Bottom-Left)
        this.btnLeft = this.createDirectionButton(160, btnY, '◀ LEFT', -1, btnW, btnH);

        // Right Arrow Button (Bottom-Right)
        this.btnRight = this.createDirectionButton(CONFIG.GAME_WIDTH - 160, btnY, 'RIGHT ▶', +1, btnW, btnH);
    }

    createDirectionButton(x, y, labelText, direction, w, h) {
        const container = this.add.container(x, y).setDepth(35);

        const bg = this.add.graphics();
        bg.fillStyle(0x0e0816, 0.88);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
        bg.lineStyle(3.5, 0xf97316, 0.8);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
        container.add(bg);

        const text = this.add.text(0, 0, labelText, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#ffffff',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        container.add(text);

        container.setSize(w, h);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            bg.clear();
            bg.fillStyle(0xf97316, 0.95);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
            bg.lineStyle(3.5, 0xffedd5, 1);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
            text.setColor('#180702');

            this.shiftLane(direction);
        });

        const resetBtn = () => {
            bg.clear();
            bg.fillStyle(0x0e0816, 0.88);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
            bg.lineStyle(3.5, 0xf97316, 0.8);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
            text.setColor('#ffffff');
        };

        container.on('pointerup', resetBtn);
        container.on('pointerout', resetBtn);

        return container;
    }

    // ------------------------------------------------------------
    // EVOLUTION STAGE SWITCHER & HIGH-RES HUD
    // ------------------------------------------------------------
    setDragonStage(stageIndex) {
        if (stageIndex < 0 || stageIndex >= DRAGON_STAGES.length) return;
        this.currentStageIndex = stageIndex;
        const stage = DRAGON_STAGES[stageIndex];

        // Sound & FX
        if (window.soundManager && window.soundManager.playDragonEvolve) {
            window.soundManager.playDragonEvolve();
        }

        // Texture Swap to new Rear-View Stage
        this.dragon.setTexture(stage.sheetKey);
        this.dragon.play(`${stage.sheetKey}_fly`);

        // Scale punch animation
        this.dragon.setScale(0.5);
        this.tweens.add({
            targets: this.dragon,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 320,
            ease: 'Back.easeOut'
        });

        // Tail particle adjustment
        this.tailEmitter.setScale({ start: stage.flameParticleScale, end: 0.1 });

        this.updateStageUI();
        this.showEvolutionToast(stage);
    }

    createHUD() {
        // Top Header Bar
        const topBg = this.add.graphics();
        topBg.fillStyle(0x0a0812, 0.88);
        topBg.fillRoundedRect(320, 20, 960, 92, 24);
        topBg.lineStyle(2.5, 0xf97316, 0.6);
        topBg.strokeRoundedRect(320, 20, 960, 92, 24);
        topBg.setDepth(30);

        // Title / Lane status
        this.titleText = this.add.text(800, 48, '🔥 FIRE DRAGON • MIDDLE LANE', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#f97316',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5).setDepth(31);

        this.subtitleText = this.add.text(800, 84, 'Press ◀ Left / Right ▶ Arrows or Touch Buttons to Change Lanes', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '18px',
            color: '#fdba74'
        }).setOrigin(0.5, 0.5).setDepth(31);

        // Bottom Evolution Stage Selector Buttons
        this.createStageSelectorButtons();
    }

    createStageSelectorButtons() {
        const btnW = 180;
        const btnH = 68;
        const startX = 520;
        const btnY = CONFIG.GAME_HEIGHT - 65;

        this.stageButtons = [];
        DRAGON_STAGES.forEach((stage, idx) => {
            const bx = startX + idx * (btnW + 24);
            const container = this.add.container(bx, btnY).setDepth(35);

            const bg = this.add.graphics();
            container.add(bg);

            const label = this.add.text(0, 0, `${stage.icon} ${stage.shortName}`, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '24px',
                color: '#ffffff',
                letterSpacing: 1
            }).setOrigin(0.5, 0.5);
            container.add(label);

            container.setSize(btnW, btnH);
            container.setInteractive({ useHandCursor: true });

            container.on('pointerdown', () => {
                this.setDragonStage(idx);
            });

            this.stageButtons.push({ container, bg, label, stage, w: btnW, h: btnH });
        });

        this.updateStageUI();
    }

    updateStageUI() {
        const stage = DRAGON_STAGES[this.currentStageIndex];
        this.updateLaneHUD();

        this.stageButtons.forEach((b, idx) => {
            const isSelected = idx === this.currentStageIndex;
            b.bg.clear();
            if (isSelected) {
                b.bg.fillStyle(0xf97316, 1);
                b.bg.fillRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.bg.lineStyle(3, 0xffedd5, 0.95);
                b.bg.strokeRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.label.setColor('#ffffff');
            } else {
                b.bg.fillStyle(0x180b1e, 0.88);
                b.bg.fillRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.bg.lineStyle(2, 0xf97316, 0.4);
                b.bg.strokeRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.label.setColor('#cbd5e1');
            }
        });
    }

    updateLaneHUD() {
        const stage = DRAGON_STAGES[this.currentStageIndex];
        const laneName = CONFIG.LANE_NAMES[this.currentLane];
        if (this.titleText) {
            this.titleText.setText(`🔥 ${stage.name.toUpperCase()} • ${laneName} LANE`);
            this.titleText.setColor(stage.titleColor);
        }
    }

    showEvolutionToast(stage) {
        if (this.toastContainer) this.toastContainer.destroy();

        this.toastContainer = this.add.container(800, 155).setDepth(40);
        const toastBg = this.add.graphics();
        toastBg.fillStyle(0x180b1e, 0.94);
        toastBg.fillRoundedRect(-260, -32, 520, 64, 32);
        toastBg.lineStyle(2.5, 0xf97316, 0.9);
        toastBg.strokeRoundedRect(-260, -32, 520, 64, 32);
        this.toastContainer.add(toastBg);

        const toastText = this.add.text(0, 0, `✨ Stage ${stage.stage}: ${stage.name}`, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#fef08a'
        }).setOrigin(0.5, 0.5);
        this.toastContainer.add(toastText);

        this.toastContainer.setAlpha(0);
        this.tweens.add({
            targets: this.toastContainer,
            alpha: 1,
            y: 150,
            duration: 250,
            yoyo: true,
            hold: 1800,
            onComplete: () => {
                if (this.toastContainer) this.toastContainer.destroy();
            }
        });
    }

    // ------------------------------------------------------------
    // FRAME UPDATE
    // ------------------------------------------------------------
    update(time, delta) {
        this.hoverTime += delta;
        const stage = DRAGON_STAGES[this.currentStageIndex];

        // 1. Update Pseudo-3D Forward Runway (Continuous Forward Motion)
        this.updateForwardRunway(delta);

        // 2. Flight bobbing (Subtle vertical hover oscillation)
        const hoverOffsetY = Math.sin(this.hoverTime * 0.004) * 8.0;
        this.dragon.y = CONFIG.DRAGON_Y + hoverOffsetY;

        // 3. Update Tail Ember Emitter Position to follow dragon
        const tx = this.dragon.x + stage.tailOffset.x;
        const ty = this.dragon.y + stage.tailOffset.y;
        this.tailEmitter.setPosition(tx, ty);
    }
}

// ============================================================
// PHASER GAME CONFIGURATION (16:9 LANDSCAPE HIGH-RES)
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
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [PreloadScene, DragonFlightScene]
};

// Initialize Game
window.game = new Phaser.Game(gameConfig);
const game = window.game;
