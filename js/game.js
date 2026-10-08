// ============================================================
// FIRE DRAGON - 3RD PERSON 3-LANE FLIGHT & EVOLUTION ENGINE
// 16:9 Landscape • Rear Camera • Forward Flight • 3 Fixed Lanes
// High-Resolution 1600x900 Canvas • Fireball Attacks
// ============================================================

const CONFIG = {
    GAME_WIDTH: 1600,
    GAME_HEIGHT: 900,

    // Horizon & 3D Projection
    HORIZON_Y: 310,
    VANISHING_X: 800,

    // 3 Fixed Flight Lanes (Left, Middle, Right) at Dragon Depth (Y = 560)
    DRAGON_Y: 560,
    LANE_X: [515, 800, 1085], // 0: Left, 1: Middle, 2: Right
    LANE_NAMES: ['LEFT', 'MIDDLE', 'RIGHT'],

    // Forward Flight Speed (Pseudo-3D runway scroll)
    FORWARD_SPEED: 0.85,
    LANE_TWEEN_DURATION: 190, // ms for smooth lane change
    BANK_ANGLE: 0.18, // radians roll tilt on lane shift

    // Wing flap animation frame rate
    FLAP_FPS: 7,

    // Attack Fireball Settings
    ATTACK_COOLDOWN: 240 // ms between fireball blasts
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
        fireballKey: 'fireball_baby',
        fireballScale: 0.95,
        fireballSpeed: 520,
        mouthOffsetY: 118,
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
        fireballKey: 'fireball_teen',
        fireballScale: 1.15,
        fireballSpeed: 490,
        mouthOffsetY: 148,
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
        fireballKey: 'fireball_mature',
        fireballScale: 1.45,
        fireballSpeed: 460,
        mouthOffsetY: 180,
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

        // Load 3 Rear-View Dragon Spritesheets & Side Icons
        DRAGON_STAGES.forEach(s => {
            this.load.spritesheet(s.sheetKey, s.sheetPath, {
                frameWidth: s.frameWidth,
                frameHeight: s.frameHeight
            });
            this.load.image(s.sideKey, s.sidePath);
        });

        // Load 3 Fireball Attack Sprites
        this.load.image('fireball_baby', 'assets/fireballs/fireball_baby.png');
        this.load.image('fireball_teen', 'assets/fireballs/fireball_teen.png');
        this.load.image('fireball_mature', 'assets/fireballs/fireball_mature.png');

        // Load Sheep Sprite (Food)
        this.load.image('sheep', 'assets/sheep.png');

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
        this.lastAttackTime = 0;
        this.activeFireballs = [];

        // Sheep Food & Evolution System
        this.sheepList = [];
        this.sheepEaten = 0;
        this.SHEEP_EVOLVE_TARGET = 3;
        this.nextSheepSpawnTime = 1600; // ms to first sheep spawn

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

        // 6. Setup Controls (Keyboard + Touch UI)
        this.setupKeyboardControls();
        this.createTopEvolutionBar();
        this.createFoodEvolutionMeter();
        this.createBottomControls();

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

        // 1. Boundary Check
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

        // 2. Strict Single-Lane Step
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

        this.tweens.add({
            targets: this.dragon,
            x: targetX,
            duration: CONFIG.LANE_TWEEN_DURATION,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.isLaneTransitioning = false;
            }
        });

        this.dragon.setRotation(bankRoll);
        this.tweens.add({
            targets: this.dragon,
            rotation: 0,
            duration: CONFIG.LANE_TWEEN_DURATION * 1.3,
            ease: 'Sine.easeOut'
        });

        return true;
    }

    // ------------------------------------------------------------
    // FIREBALL ATTACK MECHANICS (BABY / TEEN / MATURE)
    // ------------------------------------------------------------
    attack() {
        const now = this.time.now;
        if (now - this.lastAttackTime < CONFIG.ATTACK_COOLDOWN) return;
        this.lastAttackTime = now;

        const stage = DRAGON_STAGES[this.currentStageIndex];

        // 1. Sound & Dragon Recoil animation
        if (window.soundManager && window.soundManager.playFireball) {
            window.soundManager.playFireball(this.currentStageIndex);
        }

        // Quick cast punch
        this.tweens.add({
            targets: this.dragon,
            y: this.dragon.y - 14,
            scaleY: 1.06,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        // 2. Spawn Fireball clearly ahead of Dragon's head
        const startY = this.dragon.y - stage.mouthOffsetY;
        const t = Math.max(0, (startY - CONFIG.HORIZON_Y) / (CONFIG.DRAGON_Y - CONFIG.HORIZON_Y));
        const startX = CONFIG.VANISHING_X + (this.dragon.x - CONFIG.VANISHING_X) * t;

        const fireball = this.add.sprite(startX, startY, stage.fireballKey);
        fireball.setDepth(22);
        fireball.setScale(stage.fireballScale);
        fireball.setOrigin(0.5, 0.5);
        fireball.lane = this.currentLane;
        this.activeFireballs.push(fireball);

        // Muzzle spawn spark flash ahead of dragon
        const spawnBurst = this.add.particles(startX, startY, 'ember', {
            speed: { min: 60, max: 140 },
            scale: { start: stage.fireballScale * 0.5, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 220,
            blendMode: 'ADD',
            emitting: false
        });
        spawnBurst.setDepth(23);
        spawnBurst.explode(8, startX, startY);
        this.time.delayedCall(250, () => spawnBurst.destroy());

        // 3. Fireball Particle Trail
        const trailEmitter = this.add.particles(startX, startY, 'ember', {
            speed: { min: 40, max: 120 },
            angle: { min: 70, max: 110 },
            scale: { start: stage.fireballScale * 0.7, end: 0.05 },
            alpha: { start: 0.9, end: 0 },
            lifespan: 360,
            blendMode: 'ADD',
            frequency: 30
        });
        trailEmitter.setDepth(21);

        // Target vanishing point along current flight lane into distance
        const endLaneX = CONFIG.VANISHING_X + (this.currentLane - 1) * 35;
        const endY = CONFIG.HORIZON_Y - 40;

        // 4. Perspective Flight Tween (Shrinks into distance)
        this.tweens.add({
            targets: fireball,
            x: endLaneX,
            y: endY,
            scaleX: 0.16,
            scaleY: 0.16,
            rotation: Math.PI * 4,
            duration: stage.fireballSpeed,
            ease: 'Quad.easeIn',
            onUpdate: () => {
                trailEmitter.setPosition(fireball.x, fireball.y);
            },
            onComplete: () => {
                // Remove from active list
                const fbIdx = this.activeFireballs.indexOf(fireball);
                if (fbIdx !== -1) this.activeFireballs.splice(fbIdx, 1);

                // Horizon impact explosion burst
                this.createFireballExplosion(endLaneX, endY, stage);
                trailEmitter.stop();
                this.time.delayedCall(400, () => trailEmitter.destroy());
                fireball.destroy();
            }
        });
    }

    createFireballExplosion(x, y, stage) {
        // Shockwave ring
        const shock = this.add.graphics().setDepth(23);
        shock.lineStyle(3, 0xffedd5, 1);
        shock.strokeCircle(x, y, 10);

        this.tweens.add({
            targets: shock,
            alpha: 0,
            scaleX: stage.stage * 1.8,
            scaleY: stage.stage * 1.8,
            duration: 220,
            onComplete: () => shock.destroy()
        });

        // Fiery burst particles
        const burst = this.add.particles(x, y, 'ember', {
            speed: { min: 80, max: 240 * stage.stage * 0.7 },
            scale: { start: 0.6 * stage.stage, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 350,
            blendMode: 'ADD',
            emitting: false
        });
        burst.setDepth(24);
        burst.explode(16 + stage.stage * 8, x, y);
        this.time.delayedCall(400, () => burst.destroy());
    }

    // ------------------------------------------------------------
    // KEYBOARD CONTROLS
    // ------------------------------------------------------------
    setupKeyboardControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.input.keyboard.on('keydown-LEFT', () => this.shiftLane(-1));
        this.input.keyboard.on('keydown-A', () => this.shiftLane(-1));

        this.input.keyboard.on('keydown-RIGHT', () => this.shiftLane(+1));
        this.input.keyboard.on('keydown-D', () => this.shiftLane(+1));

        // Attack hotkeys: Spacebar & Enter
        this.input.keyboard.on('keydown-SPACE', () => this.attack());
        this.input.keyboard.on('keydown-ENTER', () => this.attack());
    }

    // ------------------------------------------------------------
    // TOP EVOLUTION SELECTOR BAR (Replaced old text header)
    // ------------------------------------------------------------
    createTopEvolutionBar() {
        const topBarW = 660;
        const topBarH = 78;
        const barY = 56;

        // Container centered at x = 800
        const barContainer = this.add.container(CONFIG.GAME_WIDTH / 2, barY).setDepth(35);

        // Sleek translucent glass background
        const barBg = this.add.graphics();
        barBg.fillStyle(0x0a0812, 0.88);
        barBg.fillRoundedRect(-topBarW / 2, -topBarH / 2, topBarW, topBarH, 24);
        barBg.lineStyle(2.5, 0xf97316, 0.65);
        barBg.strokeRoundedRect(-topBarW / 2, -topBarH / 2, topBarW, topBarH, 24);
        barContainer.add(barBg);

        // 3 Evolution Buttons positioned inside the top bar
        this.stageButtons = [];
        const btnW = 190;
        const btnH = 58;
        const spacing = 210; // offset between buttons

        DRAGON_STAGES.forEach((stage, idx) => {
            const btnX = (idx - 1) * spacing; // -210, 0, +210
            const container = this.add.container(btnX, 0);

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
                this.sheepEaten = 0;
                this.setDragonStage(idx);
            });

            barContainer.add(container);
            this.stageButtons.push({ container, bg, label, stage, w: btnW, h: btnH });
        });

        this.updateStageUI();
    }

    // ------------------------------------------------------------
    // FOOD & EVOLUTION STATUS CAPSULE
    // ------------------------------------------------------------
    createFoodEvolutionMeter() {
        const meterW = 560;
        const meterH = 38;
        const meterY = 114;

        this.foodMeterContainer = this.add.container(CONFIG.GAME_WIDTH / 2, meterY).setDepth(35);

        this.foodMeterBg = this.add.graphics();
        this.foodMeterBg.fillStyle(0x0c0714, 0.92);
        this.foodMeterBg.fillRoundedRect(-meterW / 2, -meterH / 2, meterW, meterH, 19);
        this.foodMeterBg.lineStyle(2, 0xf97316, 0.75);
        this.foodMeterBg.strokeRoundedRect(-meterW / 2, -meterH / 2, meterW, meterH, 19);
        this.foodMeterContainer.add(this.foodMeterBg);

        this.foodMeterText = this.add.text(0, 0, '', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '20px',
            color: '#ffedd5',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        this.foodMeterContainer.add(this.foodMeterText);

        this.updateFoodEvolutionMeter();
    }

    updateFoodEvolutionMeter() {
        if (!this.foodMeterText) return;

        if (this.currentStageIndex < 2) {
            const nextStage = DRAGON_STAGES[this.currentStageIndex + 1];
            let sheepIcons = '';
            for (let i = 0; i < this.SHEEP_EVOLVE_TARGET; i++) {
                sheepIcons += (i < this.sheepEaten) ? '🐑 ' : '⚪ ';
            }
            this.foodMeterText.setText(`🍖 FOOD: ${sheepIcons} (${this.sheepEaten}/${this.SHEEP_EVOLVE_TARGET} ➔ ${nextStage.shortName} ${nextStage.icon})`);
            this.foodMeterText.setColor('#ffedd5');
        } else {
            // Mature: Final Form!
            this.foodMeterText.setText(`👑 FINAL FORM: APEX MATURE DRAGON (FEAST: ${this.sheepEaten} 🐑)`);
            this.foodMeterText.setColor('#fde047');
        }
    }

    // ------------------------------------------------------------
    // BOTTOM CONTROLS: [ ◀ LEFT ]  [ 🔥 ATTACK ]  [ RIGHT ▶ ]
    // ------------------------------------------------------------
    createBottomControls() {
        const btnY = CONFIG.GAME_HEIGHT - 110;
        const navBtnW = 220;
        const navBtnH = 105;

        // 1. Left Arrow Button (Bottom-Left)
        this.btnLeft = this.createDirectionButton(180, btnY, '◀ LEFT', -1, navBtnW, navBtnH);

        // 2. Attack Button (Bottom-Middle)
        const atkBtnW = 280;
        const atkBtnH = 110;
        this.btnAttack = this.createAttackButton(CONFIG.GAME_WIDTH / 2, btnY, '🔥 ATTACK', atkBtnW, atkBtnH);

        // 3. Right Arrow Button (Bottom-Right)
        this.btnRight = this.createDirectionButton(CONFIG.GAME_WIDTH - 180, btnY, 'RIGHT ▶', +1, navBtnW, navBtnH);
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

    createAttackButton(x, y, labelText, w, h) {
        const container = this.add.container(x, y).setDepth(35);

        const bg = this.add.graphics();
        // Fiery molten red-orange base
        bg.fillStyle(0x8a1808, 0.92);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 26);
        bg.lineStyle(4, 0xf97316, 0.95);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 26);
        container.add(bg);

        const text = this.add.text(0, 0, labelText, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '34px',
            color: '#ffedd5',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        container.add(text);

        container.setSize(w, h);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            bg.clear();
            bg.fillStyle(0xf97316, 1);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 26);
            bg.lineStyle(4, 0xffedd5, 1);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 26);
            text.setColor('#180702');

            container.setScale(0.96);
            this.attack();
        });

        const resetBtn = () => {
            bg.clear();
            bg.fillStyle(0x8a1808, 0.92);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 26);
            bg.lineStyle(4, 0xf97316, 0.95);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 26);
            text.setColor('#ffedd5');
            container.setScale(1.0);
        };

        container.on('pointerup', resetBtn);
        container.on('pointerout', resetBtn);

        return container;
    }

    // ------------------------------------------------------------
    // EVOLUTION STAGE SWITCHER & TOAST
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
        this.updateFoodEvolutionMeter();
        this.showEvolutionToast(stage);
    }

    updateStageUI() {
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
                b.bg.fillStyle(0x180b1e, 0.85);
                b.bg.fillRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.bg.lineStyle(2, 0xf97316, 0.35);
                b.bg.strokeRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.label.setColor('#cbd5e1');
            }
        });
    }

    showEvolutionToast(stage) {
        if (this.toastContainer) this.toastContainer.destroy();

        this.toastContainer = this.add.container(CONFIG.GAME_WIDTH / 2, 160).setDepth(40);
        const toastBg = this.add.graphics();
        toastBg.fillStyle(0x180b1e, 0.94);
        toastBg.fillRoundedRect(-240, -28, 480, 56, 28);
        toastBg.lineStyle(2.5, 0xf97316, 0.9);
        toastBg.strokeRoundedRect(-240, -28, 480, 56, 28);
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
            y: 155,
            duration: 250,
            yoyo: true,
            hold: 1600,
            onComplete: () => {
                if (this.toastContainer) this.toastContainer.destroy();
            }
        });
    }

    // ------------------------------------------------------------
    // SHEEP SPAWNING, APPROACH & EVOLUTION MECHANICS
    // ------------------------------------------------------------
    spawnSheep() {
        const lane = Phaser.Math.Between(0, 2);
        const horizonY = CONFIG.HORIZON_Y;
        const startX = CONFIG.VANISHING_X - 70 + (lane + 0.5) * 46;

        const sheep = this.add.sprite(startX, horizonY, 'sheep');
        sheep.setOrigin(0.5, 0.95);
        sheep.lane = lane;
        sheep.progress = 0; // 0.0 at horizon, 1.0 at dragon depth (Y = 560)
        sheep.speed = 0.00034; // ~2.9 seconds to fly from horizon to dragon
        sheep.setDepth(16);
        sheep.setScale(0.12);
        sheep.setAlpha(0.2);
        sheep.bobPhase = Math.random() * Math.PI * 2;
        sheep.eaten = false;

        this.sheepList.push(sheep);
    }

    updateSheep(delta) {
        // 1. Spawning Timer
        const now = this.time.now;
        if (now >= this.nextSheepSpawnTime) {
            this.spawnSheep();
            this.nextSheepSpawnTime = now + Phaser.Math.Between(2600, 4200);
        }

        // 2. Approach, Scale & Collision
        for (let i = this.sheepList.length - 1; i >= 0; i--) {
            const sheep = this.sheepList[i];
            if (!sheep.active || sheep.eaten) continue;

            sheep.progress += sheep.speed * delta;
            const p = sheep.progress;

            // Pseudo-3D perspective projection
            const persp = Math.pow(p, 2.1);
            const curY = CONFIG.HORIZON_Y + (CONFIG.DRAGON_Y - CONFIG.HORIZON_Y) * persp;
            const startX = CONFIG.VANISHING_X - 70 + (sheep.lane + 0.5) * 46;
            const endX = CONFIG.LANE_X[sheep.lane];
            const curX = startX + (endX - startX) * persp;
            const curScale = 0.12 + (1.0 - 0.12) * persp;

            sheep.x = curX;
            sheep.y = curY;
            sheep.setScale(curScale);
            sheep.setAlpha(Math.min(1.0, p * 3.5));

            // Cute walking bob
            sheep.bobPhase += delta * 0.012;
            sheep.y += Math.sin(sheep.bobPhase) * (curScale * 4);

            // Correct depth sorting: in front of ground, and behind or in front of dragon
            sheep.setDepth(curY > this.dragon.y ? 21 : 16);

            // 3. Contact Collision with Dragon in same lane
            if (p >= 0.86 && p <= 1.10 && !sheep.eaten) {
                if (this.currentLane === sheep.lane) {
                    this.eatSheep(sheep, i);
                    continue;
                }
            }

            // 4. Fireball Attack Collision (blast in same lane)
            for (let fIdx = this.activeFireballs.length - 1; fIdx >= 0; fIdx--) {
                const fb = this.activeFireballs[fIdx];
                if (fb && fb.active && fb.lane === sheep.lane && !sheep.eaten) {
                    const distY = Math.abs(fb.y - sheep.y);
                    if (distY < 50) {
                        this.roastSheepWithFireball(sheep, i, fb);
                        break;
                    }
                }
            }

            // 5. Cleanup when past screen bottom
            if (p > 1.45 || sheep.y > CONFIG.GAME_HEIGHT + 100) {
                sheep.destroy();
                this.sheepList.splice(i, 1);
            }
        }
    }

    eatSheep(sheep, index) {
        sheep.eaten = true;
        this.sheepList.splice(index, 1);

        // Sound effect
        if (window.soundManager && window.soundManager.playEatSheep) {
            window.soundManager.playEatSheep();
        }

        // Dragon chomp animation
        this.tweens.add({
            targets: this.dragon,
            scaleX: 1.14,
            scaleY: 0.88,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        // Floating indicator
        this.createFloatingFoodNotice(sheep.x, sheep.y - 40, '+1 🍖 YUM!');

        // Sparkle bite burst
        const biteBurst = this.add.particles(sheep.x, sheep.y, 'ember', {
            speed: { min: 60, max: 180 },
            scale: { start: 0.8, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 300,
            blendMode: 'ADD',
            emitting: false
        });
        biteBurst.setDepth(25);
        biteBurst.explode(14, sheep.x, sheep.y);
        this.time.delayedCall(350, () => biteBurst.destroy());

        // Sheep squash and disappear
        this.tweens.add({
            targets: sheep,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 110,
            onComplete: () => sheep.destroy()
        });

        // Food counter & Evolution trigger
        this.sheepEaten++;
        this.updateFoodEvolutionMeter();

        // 3 sheep trigger evolution
        if (this.currentStageIndex < 2 && this.sheepEaten >= this.SHEEP_EVOLVE_TARGET) {
            this.sheepEaten = 0;
            const nextStageIndex = this.currentStageIndex + 1;
            this.setDragonStage(nextStageIndex);
            this.showBigEvolutionBanner(DRAGON_STAGES[nextStageIndex]);
        }
    }

    roastSheepWithFireball(sheep, index, fireball) {
        sheep.eaten = true;
        this.sheepList.splice(index, 1);

        if (window.soundManager && window.soundManager.playEatSheep) {
            window.soundManager.playEatSheep();
        }

        const stage = DRAGON_STAGES[this.currentStageIndex];
        this.createFireballExplosion(sheep.x, sheep.y, stage);
        this.createFloatingFoodNotice(sheep.x, sheep.y - 40, '🔥 ROASTED! +1 🍖');

        this.tweens.add({
            targets: sheep,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 100,
            onComplete: () => sheep.destroy()
        });

        this.sheepEaten++;
        this.updateFoodEvolutionMeter();

        if (this.currentStageIndex < 2 && this.sheepEaten >= this.SHEEP_EVOLVE_TARGET) {
            this.sheepEaten = 0;
            const nextStageIndex = this.currentStageIndex + 1;
            this.setDragonStage(nextStageIndex);
            this.showBigEvolutionBanner(DRAGON_STAGES[nextStageIndex]);
        }
    }

    createFloatingFoodNotice(x, y, message) {
        const foodText = this.add.text(x, y, message, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '28px',
            color: '#fef08a',
            stroke: '#180702',
            strokeThickness: 5
        }).setOrigin(0.5, 0.5).setDepth(30);

        this.tweens.add({
            targets: foodText,
            y: y - 60,
            scaleX: 1.15,
            scaleY: 1.15,
            alpha: 0,
            duration: 700,
            ease: 'Quad.easeOut',
            onComplete: () => foodText.destroy()
        });
    }

    showBigEvolutionBanner(stage) {
        if (this.evoBannerContainer) this.evoBannerContainer.destroy();

        this.evoBannerContainer = this.add.container(CONFIG.GAME_WIDTH / 2, 210).setDepth(45);
        const bg = this.add.graphics();
        bg.fillStyle(0x180702, 0.95);
        bg.fillRoundedRect(-320, -45, 640, 90, 30);
        bg.lineStyle(4, 0xf97316, 1);
        bg.strokeRoundedRect(-320, -45, 640, 90, 30);
        this.evoBannerContainer.add(bg);

        const title = this.add.text(0, -12, `⚡ EVOLUTION COMPLETE! ⚡`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '26px',
            color: '#fde047',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        this.evoBannerContainer.add(title);

        const sub = this.add.text(0, 20, `${stage.icon} ${stage.name} Unlocked!`, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5);
        this.evoBannerContainer.add(sub);

        this.evoBannerContainer.setScale(0.3);
        this.tweens.add({
            targets: this.evoBannerContainer,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 320,
            ease: 'Back.easeOut',
            hold: 1900,
            yoyo: true,
            onComplete: () => {
                if (this.evoBannerContainer) this.evoBannerContainer.destroy();
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

        // 4. Update Sheep Food Spawning, Movement & Collisions
        this.updateSheep(delta);
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
