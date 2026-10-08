// ============================================================
// ANGRY FLAPPY - FLAPPY BIRD + ANGRY BIRDS HYBRID ENGINE
// Core Mechanics: Slingshot Launch + Flappy Flight + Material Obstacles
// ============================================================

const CONFIG = {
    GAME_WIDTH: 400,
    GAME_HEIGHT: 700,
    GROUND_Y: 590,

    // Slingshot Placement & Ground Anchoring
    SLING_X: 105,
    SLING_Y: 474,
    SLING_BASE_Y: 594, // Sits firmly on ground
    SLING_MAX_PULL: 95,
    LAUNCH_POWER_X: 6.2,
    LAUNCH_POWER_Y: 6.2,
    MIN_PULL_THRESHOLD: 14,

    // Flying / Flappy Physics
    GRAVITY: 960,
    FLAP_POWER: -350,
    CRUISE_SPEED_X: 200,

    // Vertical Obstacles
    OBSTACLE_WIDTH: 52,
    OBSTACLE_SPEED: -175,
    OBSTACLE_INTERVAL: 2500, // ms between obstacle walls

    // World Scroll Speeds
    GROUND_SCROLL_SPEED: 2.8,
    HILLS_SCROLL_SPEED: 0.8,
    CLOUDS_SCROLL_SPEED: 0.35,
};

// ============================================================
// 3 OBSTACLE MATERIALS (Solid Vertical Structures - No Openings)
// ============================================================
const MATERIALS = {
    GLASS: {
        id: 'glass',
        name: 'Glass',
        icon: '🪟',
        color: '#38bdf8',
        colorHex: 0x38bdf8,
        texture: 'obstacle_glass',
        shardTexture: 'shard_glass',
        breakerBirdId: 'bird_blue',
        breakerBirdName: 'Blue Bird',
        breakSound: 'playGlassBreak',
        shatterText: '💥 GLASS SHATTERED!'
    },
    WOOD: {
        id: 'wood',
        name: 'Wood',
        icon: '🪵',
        color: '#f59e0b',
        colorHex: 0xf59e0b,
        texture: 'obstacle_wood',
        shardTexture: 'shard_wood',
        breakerBirdId: 'bird_yellow',
        breakerBirdName: 'Yellow Bird',
        breakSound: 'playWoodBreak',
        shatterText: '💥 WOOD SPLINTERED!'
    },
    STONE: {
        id: 'stone',
        name: 'Stone',
        icon: '🪨',
        color: '#94a3b8',
        colorHex: 0x94a3b8,
        texture: 'obstacle_stone',
        shardTexture: 'shard_stone',
        breakerBirdId: 'bird_black',
        breakerBirdName: 'Black Bird',
        breakSound: 'playStoneBreak',
        shatterText: '💥 STONE SMASHED!'
    }
};

const MATERIAL_LIST = [MATERIALS.GLASS, MATERIALS.WOOD, MATERIALS.STONE];

// ============================================================
// 3 PLAYABLE BIRDS DEFINITIONS
// Each bird is specialized for ONE specific material
// ============================================================
const BIRDS = [
    {
        id: 'bird_blue',
        name: 'Blue Bird',
        icon: '🔵',
        color: '#38bdf8',
        accentColor: 0x2994f2,
        lightColor: 0xbae6fd,
        targetMaterial: MATERIALS.GLASS,
        tag: 'Glass Breaker',
        desc: 'Shatters Glass 🪟 with swift agility',
        scale: 1.0,
        bodyWidth: 34,
        bodyHeight: 28,
        offsetX: 15,
        offsetY: 10
    },
    {
        id: 'bird_yellow',
        name: 'Yellow Bird',
        icon: '🟡',
        color: '#facc15',
        accentColor: 0xeab308,
        lightColor: 0xfef08a,
        targetMaterial: MATERIALS.WOOD,
        tag: 'Wood Breaker',
        desc: 'Splinters Wood 🪵 with piercing speed',
        scale: 1.0,
        bodyWidth: 34,
        bodyHeight: 28,
        offsetX: 15,
        offsetY: 10
    },
    {
        id: 'bird_black',
        name: 'Black Bird',
        icon: '⚫',
        color: '#94a3b8',
        accentColor: 0x475569,
        lightColor: 0xe2e8f0,
        targetMaterial: MATERIALS.STONE,
        tag: 'Stone Breaker',
        desc: 'Crushes Stone 🪨 with heavy force',
        scale: 1.0,
        bodyWidth: 34,
        bodyHeight: 28,
        offsetX: 15,
        offsetY: 10
    }
];

// Persistent bird selection state
let selectedBirdIndex = parseInt(localStorage.getItem('angry_flappy_selected_bird') || '0', 10);
if (isNaN(selectedBirdIndex) || selectedBirdIndex < 0 || selectedBirdIndex >= BIRDS.length) {
    selectedBirdIndex = 0;
}

// Game State Enum
const GAME_STATE = {
    SLINGSHOT_READY: 'SLINGSHOT_READY',
    SLINGSHOT_AIMING: 'SLINGSHOT_AIMING',
    FLYING: 'FLYING',
    CRASHED: 'CRASHED',
    LANDED: 'LANDED'
};

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

        this.add.text(cx, cy - 30, 'ANGRY FLAPPY', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#0e3a6c',
            strokeThickness: 6
        }).setOrigin(0.5);

        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        progressBox.fillStyle(0x111e33, 0.7);
        progressBox.fillRoundedRect(cx - 110, cy + 20, 220, 16, 8);

        this.load.on('progress', (val) => {
            progressBar.clear();
            progressBar.fillStyle(0x38bdf8, 1);
            progressBar.fillRoundedRect(cx - 108, cy + 22, 216 * val, 12, 6);
        });

        // Environment Textures
        this.load.image('bg_sky', 'assets/bg_sky.png');
        this.load.image('bg_clouds', 'assets/bg_clouds.png');
        this.load.image('bg_hills', 'assets/bg_hills.png');
        this.load.image('ground', 'assets/ground.png');

        // Slingshot Assets
        this.load.image('slingshot', 'assets/slingshot.png');
        this.load.image('slingshot_front', 'assets/slingshot_front.png');
        this.load.image('slingshot_back', 'assets/slingshot_back.png');
        this.load.image('pouch', 'assets/pouch.png');
        this.load.image('trajectory_dot', 'assets/trajectory_dot.png');

        // Particle & FX Textures
        this.load.image('feather', 'assets/feather.png');
        this.load.image('sparkle', 'assets/sparkle.png');
        this.load.image('puff', 'assets/puff.png');

        // Obstacle Pillars & Breaking Shards
        this.load.image('obstacle_glass', 'assets/obstacle_glass.png');
        this.load.image('obstacle_wood', 'assets/obstacle_wood.png');
        this.load.image('obstacle_stone', 'assets/obstacle_stone.png');
        this.load.image('shard_glass', 'assets/shard_glass.png');
        this.load.image('shard_wood', 'assets/shard_wood.png');
        this.load.image('shard_stone', 'assets/shard_stone.png');

        // 3 Playable Birds Spritesheets (3 frames: 64x48)
        BIRDS.forEach(bird => {
            this.load.spritesheet(bird.id, `assets/${bird.id}.png`, {
                frameWidth: 64,
                frameHeight: 48
            });
        });
    }

    create() {
        BIRDS.forEach(bird => {
            this.anims.create({
                key: `${bird.id}_fly`,
                frames: this.anims.generateFrameNumbers(bird.id, { start: 0, end: 2 }),
                frameRate: 11,
                repeat: -1,
                yoyo: true
            });
        });

        this.scene.start('MenuScene');
    }
}

// ------------------------------------------------------------
// 2. MAIN MENU SCENE (BIRD SELECTION & GAME START)
// ------------------------------------------------------------
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const cx = CONFIG.GAME_WIDTH / 2;

        // Backgrounds with parallax
        this.add.image(cx, CONFIG.GAME_HEIGHT / 2, 'bg_sky').setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        this.clouds = this.add.tileSprite(cx, 160, CONFIG.GAME_WIDTH, 220, 'bg_clouds').setAlpha(0.9);
        this.hills = this.add.tileSprite(cx, CONFIG.GROUND_Y - 90, CONFIG.GAME_WIDTH, 240, 'bg_hills');
        this.ground = this.add.tileSprite(cx, CONFIG.GROUND_Y + 56, CONFIG.GAME_WIDTH, 112, 'ground').setDepth(10);

        // Sound Toggle Button
        this.createSoundButton();

        // Title Header
        const titleContainer = this.add.container(cx, 95);
        const titleText = this.add.text(0, 0, 'ANGRY FLAPPY', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#1e3a8a',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 5, color: '#091e42', blur: 6, fill: true }
        }).setOrigin(0.5);

        const subText = this.add.text(0, 36, 'SELECT YOUR BIRD & LAUNCH', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '12px',
            fontStyle: '900',
            color: '#ffd124',
            stroke: '#613b00',
            strokeThickness: 3,
            letterSpacing: 2
        }).setOrigin(0.5);

        titleContainer.add([titleText, subText]);

        this.tweens.add({
            targets: titleContainer,
            y: 90,
            duration: 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Bird Showcase Container (Selected Bird & Ability Details)
        this.createBirdShowcase(cx, 235);

        // Interactive 3-Bird Selection Cards (Rock-solid Click Handlers)
        this.createBirdSelector(cx, 385);

        // Launch Slingshot CTA Button
        this.createPlayButton(cx, 505);

        // Bottom Material Guide
        this.createMaterialLegend(cx, 620);
    }

    createSoundButton() {
        const btn = this.add.container(CONFIG.GAME_WIDTH - 38, 38).setDepth(30);
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.45);
        bg.fillCircle(0, 0, 20);

        const text = this.add.text(0, 0, window.soundManager.isMuted() ? '🔇' : '🔊', {
            fontSize: '18px'
        }).setOrigin(0.5);

        btn.add([bg, text]);
        btn.setSize(40, 40).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            const muted = window.soundManager.toggleMute();
            text.setText(muted ? '🔇' : '🔊');
            if (!muted) window.soundManager.playClick();
        });
    }

    createBirdShowcase(cx, cy) {
        this.showcaseContainer = this.add.container(cx, cy);

        // Pedestal glow
        this.pedestalGlow = this.add.graphics();

        const currentBird = BIRDS[selectedBirdIndex];

        // Animated showcase bird sprite (clickable to cycle birds)
        this.birdPreview = this.add.sprite(0, -20, currentBird.id, 1)
            .setScale(1.8)
            .setInteractive({ useHandCursor: true });
        this.birdPreview.play(`${currentBird.id}_fly`);
        this.birdPreview.on('pointerdown', () => {
            this.selectBird((selectedBirdIndex + 1) % BIRDS.length);
        });

        // Floating motion
        this.tweens.add({
            targets: this.birdPreview,
            y: -30,
            duration: 750,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Bird Name Label (also clickable)
        this.birdNameText = this.add.text(0, 32, currentBird.name, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.birdNameText.on('pointerdown', () => {
            this.selectBird((selectedBirdIndex + 1) % BIRDS.length);
        });

        // Material Breaker Badge Pill
        this.materialBadge = this.add.text(0, 62, `DESTROYS: ${currentBird.targetMaterial.icon} ${currentBird.targetMaterial.name.toUpperCase()}`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontStyle: '900',
            color: '#ffffff',
            backgroundColor: currentBird.color,
            padding: { x: 12, y: 5 }
        }).setOrigin(0.5);

        // Left / Right Navigation Arrows on Showcase
        const leftArrow = this.add.text(-120, -10, '◀', {
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const rightArrow = this.add.text(120, -10, '▶', {
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        leftArrow.on('pointerdown', () => {
            const nextIdx = (selectedBirdIndex - 1 + BIRDS.length) % BIRDS.length;
            this.selectBird(nextIdx);
        });

        rightArrow.on('pointerdown', () => {
            const nextIdx = (selectedBirdIndex + 1) % BIRDS.length;
            this.selectBird(nextIdx);
        });

        this.showcaseContainer.add([
            this.pedestalGlow,
            this.birdPreview,
            this.birdNameText,
            this.materialBadge,
            leftArrow,
            rightArrow
        ]);

        this.updatePedestalGlow();
    }

    updatePedestalGlow() {
        const currentBird = BIRDS[selectedBirdIndex];
        this.pedestalGlow.clear();
        this.pedestalGlow.fillStyle(currentBird.accentColor, 0.3);
        this.pedestalGlow.fillEllipse(0, 20, 140, 40);
        this.pedestalGlow.lineStyle(2.5, currentBird.accentColor, 0.85);
        this.pedestalGlow.strokeEllipse(0, 20, 140, 40);
    }

    // ------------------------------------------------------------
    // BULLETPROOF BIRD SELECTOR CARDS
    // Every element on the card handles pointerdown reliably
    // ------------------------------------------------------------
    createBirdSelector(cx, cy) {
        this.birdButtons = [];
        const spacing = 114;
        const startX = cx - spacing;

        BIRDS.forEach((bird, idx) => {
            const btnX = startX + idx * spacing;
            const btn = this.add.container(btnX, cy);

            const cardW = 98;
            const cardH = 88;

            // Background graphics
            const bg = this.add.graphics();

            // Miniature bird sprite
            const miniBird = this.add.sprite(0, -16, bird.id, 1).setScale(1.15);
            miniBird.play(`${bird.id}_fly`);

            // Name Label
            const label = this.add.text(0, 14, bird.name.split(' ')[0], {
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '13px',
                fontStyle: '900',
                color: '#ffffff'
            }).setOrigin(0.5);

            // Material Target Tag
            const targetTag = this.add.text(0, 31, `${bird.targetMaterial.icon} ${bird.targetMaterial.name}`, {
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '10px',
                fontStyle: 'bold',
                color: bird.color
            }).setOrigin(0.5);

            // Active checkmark badge
            const activeBadge = this.add.text(0, -cardH / 2 + 1, '✔ SELECTED', {
                fontFamily: 'system-ui, sans-serif',
                fontSize: '9px',
                fontStyle: '900',
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: { x: 5, y: 1 }
            }).setOrigin(0.5);

            // Full-size interactive Hit Zone covering entire card area
            const hitZone = this.add.rectangle(0, 0, cardW, cardH, 0x000000, 0.001)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            const triggerSelect = () => {
                this.selectBird(idx);
            };

            hitZone.on('pointerdown', triggerSelect);

            // Container itself is also interactive as a safety net
            btn.setSize(cardW, cardH).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', triggerSelect);

            // Hover effects via alpha and subtle highlight
            hitZone.on('pointerover', () => {
                if (idx !== selectedBirdIndex) {
                    bg.alpha = 0.9;
                }
            });
            hitZone.on('pointerout', () => {
                if (idx !== selectedBirdIndex) {
                    bg.alpha = 0.7;
                }
            });

            btn.add([bg, miniBird, label, targetTag, activeBadge, hitZone]);

            this.birdButtons.push({
                container: btn,
                bg: bg,
                label: label,
                targetTag: targetTag,
                activeBadge: activeBadge,
                bird: bird
            });

            this.renderBirdCardBg(bg, bird, idx === selectedBirdIndex, activeBadge, btn);
        });
    }

    renderBirdCardBg(graphics, bird, isSelected, activeBadge, container) {
        graphics.clear();
        const w = 98;
        const h = 88;
        const r = 16;

        if (isSelected) {
            // Selected vibrant highlighted card
            graphics.fillStyle(bird.accentColor, 0.45);
            graphics.fillRoundedRect(-w / 2, -h / 2, w, h, r);
            graphics.lineStyle(3, 0xffffff, 1);
            graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, r);

            if (activeBadge) activeBadge.setVisible(true);
            if (container) container.setScale(1.06);
        } else {
            // Inactive card
            graphics.fillStyle(0x0f172a, 0.7);
            graphics.fillRoundedRect(-w / 2, -h / 2, w, h, r);
            graphics.lineStyle(1.5, 0x475569, 0.6);
            graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, r);

            if (activeBadge) activeBadge.setVisible(false);
            if (container) container.setScale(1.0);
        }
    }

    selectBird(index) {
        selectedBirdIndex = index;
        localStorage.setItem('angry_flappy_selected_bird', selectedBirdIndex);
        window.soundManager.playClick();

        const bird = BIRDS[selectedBirdIndex];

        // Update Central Showcase Preview
        this.birdPreview.setTexture(bird.id);
        this.birdPreview.play(`${bird.id}_fly`);
        this.birdNameText.setText(bird.name);
        this.materialBadge.setText(`DESTROYS: ${bird.targetMaterial.icon} ${bird.targetMaterial.name.toUpperCase()}`);
        this.materialBadge.setBackgroundColor(bird.color);
        this.updatePedestalGlow();

        // Bounce showcase
        this.birdPreview.setScale(2.2);
        this.tweens.add({
            targets: this.birdPreview,
            scaleX: 1.8,
            scaleY: 1.8,
            duration: 250,
            ease: 'Back.easeOut'
        });

        // Update All Card Visuals
        this.birdButtons.forEach((item, idx) => {
            const isSelected = (idx === selectedBirdIndex);
            this.renderBirdCardBg(item.bg, item.bird, isSelected, item.activeBadge, item.container);
        });
    }

    createPlayButton(cx, cy) {
        const playBtn = this.add.container(cx, cy);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x22c55e, 1);
        btnBg.fillRoundedRect(-110, -28, 220, 56, 28);
        btnBg.lineStyle(4, 0xffffff, 1);
        btnBg.strokeRoundedRect(-110, -28, 220, 56, 28);

        const btnText = this.add.text(0, -2, 'LAUNCH SLINGSHOT', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#15803d',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Explicit hitZone on button
        const hitZone = this.add.rectangle(0, 0, 220, 56, 0x000000, 0.001)
            .setInteractive({ useHandCursor: true });

        playBtn.add([btnBg, btnText, hitZone]);

        this.tweens.add({
            targets: playBtn,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 750,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const startGame = () => {
            window.soundManager.playClick();
            // Explicitly pass selected bird index to GameScene
            this.scene.start('GameScene', { birdIndex: selectedBirdIndex });
        };

        hitZone.on('pointerdown', startGame);
        playBtn.setSize(220, 56).setInteractive({ useHandCursor: true });
        playBtn.on('pointerdown', startGame);
        this.input.keyboard.on('keydown-SPACE', startGame);
        this.input.keyboard.on('keydown-UP', startGame);
    }

    createMaterialLegend(cx, cy) {
        const container = this.add.container(cx, cy).setDepth(20);

        const bg = this.add.graphics();
        bg.fillStyle(0x0a0f1d, 0.85);
        bg.fillRoundedRect(-170, -24, 340, 48, 14);
        bg.lineStyle(1.5, 0x334155, 0.8);
        bg.strokeRoundedRect(-170, -24, 340, 48, 14);

        const text = this.add.text(0, 0, '🔵 Blue → 🪟 Glass   🟡 Yellow → 🪵 Wood   ⚫ Black → 🪨 Stone', {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#f8fafc'
        }).setOrigin(0.5);

        container.add([bg, text]);
    }

    update() {
        this.clouds.tilePositionX += CONFIG.CLOUDS_SCROLL_SPEED;
        this.hills.tilePositionX += CONFIG.HILLS_SCROLL_SPEED;
        this.ground.tilePositionX += CONFIG.GROUND_SCROLL_SPEED;
    }
}

// ------------------------------------------------------------
// 3. GAME SCENE (SLINGSHOT + FLAPPY FLIGHT + VERTICAL OBSTACLES)
// ------------------------------------------------------------
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        // Read explicitly passed birdIndex or fallback to localStorage
        this.selectedBirdIndex = (data && typeof data.birdIndex === 'number')
            ? data.birdIndex
            : parseInt(localStorage.getItem('angry_flappy_selected_bird') || '0', 10);

        if (isNaN(this.selectedBirdIndex) || this.selectedBirdIndex < 0 || this.selectedBirdIndex >= BIRDS.length) {
            this.selectedBirdIndex = 0;
        }

        this.startingBirdIndex = this.selectedBirdIndex;
        this.currentBird = BIRDS[this.selectedBirdIndex];

        this.gameState = GAME_STATE.SLINGSHOT_READY;
        this.isDragging = false;
        this.flapsCount = 0;
        this.destroyedCount = 0;
        this.obstaclesCleared = 0;
        this.lastStretchSoundTime = 0;
        this.obstaclesSpawned = 0;
    }

    create() {
        const cx = CONFIG.GAME_WIDTH / 2;

        // Visual Parallax Layers
        this.add.image(cx, CONFIG.GAME_HEIGHT / 2, 'bg_sky').setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        this.clouds = this.add.tileSprite(cx, 160, CONFIG.GAME_WIDTH, 220, 'bg_clouds').setAlpha(0.9);
        this.hills = this.add.tileSprite(cx, CONFIG.GROUND_Y - 90, CONFIG.GAME_WIDTH, 240, 'bg_hills');

        // Scrolling Ground (Physically Solid)
        this.ground = this.add.tileSprite(cx, CONFIG.GROUND_Y + 56, CONFIG.GAME_WIDTH, 112, 'ground').setDepth(20);
        this.physics.add.existing(this.ground, true);
        this.ground.body.setSize(CONFIG.GAME_WIDTH, 112).setOffset(0, 0);

        // Sound Toggle Button
        this.createSoundButton();

        // Particles
        this.initParticles();

        // Obstacles GameObject Group (using add.group avoids physics defaults wiping child velocities)
        this.obstacles = this.add.group();

        // Initialize Slingshot System
        this.initSlingshot();

        // Initialize Playable Bird (Using the selected bird)
        this.initBird();

        // Prompt Banners & HUD
        this.initPrompts();

        // Input Setup (Slingshot Drag & Tap-to-Flap)
        this.initInputHandlers();

        // Colliders
        this.physics.add.collider(this.bird, this.ground, this.handleGroundCollision, null, this);
        this.physics.add.overlap(this.bird, this.obstacles, this.handleObstacleCollision, null, this);
    }

    createSoundButton() {
        const btn = this.add.container(CONFIG.GAME_WIDTH - 38, 38).setDepth(35);
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.45);
        bg.fillCircle(0, 0, 20);

        const text = this.add.text(0, 0, window.soundManager.isMuted() ? '🔇' : '🔊', {
            fontSize: '18px'
        }).setOrigin(0.5);

        btn.add([bg, text]);
        btn.setSize(40, 40).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            const muted = window.soundManager.toggleMute();
            text.setText(muted ? '🔇' : '🔊');
            if (!muted) window.soundManager.playClick();
        });
    }

    initParticles() {
        // Feathers on flap
        this.featherEmitter = this.add.particles(0, 0, 'feather', {
            lifespan: 500,
            speed: { min: 40, max: 100 },
            scale: { start: 0.8, end: 0.1 },
            alpha: { start: 1, end: 0 },
            gravityY: 160,
            emitting: false
        }).setDepth(25);

        // Dust puff on slingshot launch / ground impact
        this.puffEmitter = this.add.particles(0, 0, 'puff', {
            lifespan: 450,
            speed: { min: 60, max: 150 },
            scale: { start: 0.9, end: 0.1 },
            alpha: { start: 0.9, end: 0 },
            emitting: false
        }).setDepth(24);

        // Material Shard Emitters for Breaking Obstacles
        this.glassShardEmitter = this.add.particles(0, 0, 'shard_glass', {
            lifespan: 750,
            speed: { min: 90, max: 280 },
            scale: { start: 1.1, end: 0.2 },
            rotate: { min: 0, max: 360 },
            alpha: { start: 1, end: 0 },
            gravityY: 550,
            emitting: false
        }).setDepth(26);

        this.woodShardEmitter = this.add.particles(0, 0, 'shard_wood', {
            lifespan: 750,
            speed: { min: 90, max: 280 },
            scale: { start: 1.1, end: 0.2 },
            rotate: { min: 0, max: 360 },
            alpha: { start: 1, end: 0 },
            gravityY: 550,
            emitting: false
        }).setDepth(26);

        this.stoneShardEmitter = this.add.particles(0, 0, 'shard_stone', {
            lifespan: 750,
            speed: { min: 90, max: 280 },
            scale: { start: 1.1, end: 0.2 },
            rotate: { min: 0, max: 360 },
            alpha: { start: 1, end: 0 },
            gravityY: 550,
            emitting: false
        }).setDepth(26);
    }

    initSlingshot() {
        this.slingX = CONFIG.SLING_X;
        this.slingY = CONFIG.SLING_Y;
        this.slingBaseY = CONFIG.SLING_BASE_Y;

        // Slingshot Prongs attachment tips
        this.prongLeftX = this.slingX - 26;
        this.prongLeftY = 468;
        this.prongRightX = this.slingX + 26;
        this.prongRightY = 468;

        // 1. Back Fork Layer
        this.slingshotBack = this.add.image(this.slingX, this.slingBaseY, 'slingshot_back')
            .setOrigin(0.5, 1)
            .setDepth(8);

        // 2. Back Rubber Band (Graphics)
        this.bandBack = this.add.graphics().setDepth(9);

        // 3. Leather Pouch
        this.pouch = this.add.image(this.slingX, this.slingY, 'pouch')
            .setOrigin(0.5)
            .setDepth(10);

        // 4. Front Rubber Band (Graphics)
        this.bandFront = this.add.graphics().setDepth(14);

        // 5. Front Fork & Trunk Layer
        this.slingshotFront = this.add.image(this.slingX, this.slingBaseY, 'slingshot_front')
            .setOrigin(0.5, 1)
            .setDepth(16);

        // 6. Trajectory Arc Dots (Pool of 14 dots)
        this.trajectoryDots = [];
        for (let i = 0; i < 14; i++) {
            const dot = this.add.image(0, 0, 'trajectory_dot')
                .setOrigin(0.5)
                .setDepth(11)
                .setVisible(false);
            this.trajectoryDots.push(dot);
        }

        this.updateRubberBands(this.slingX, this.slingY);
    }

    initBird() {
        // Create bird sprite placed inside slingshot using the selected bird
        this.bird = this.physics.add.sprite(this.slingX, this.slingY, this.currentBird.id);
        const baseScale = this.currentBird.scale || 1.0;
        this.bird.setScale(baseScale, baseScale);
        this.bird.play(`${this.currentBird.id}_fly`);
        this.bird.setDepth(12);
        this.bird.body.setSize(this.currentBird.bodyWidth || 34, this.currentBird.bodyHeight || 28)
            .setOffset(this.currentBird.offsetX || 15, this.currentBird.offsetY || 10);
        this.bird.body.allowGravity = false;
        this.transformTween = null;
        this.flapAngleTween = null;

        // Slingshot idle breathing motion
        this.idleTween = this.tweens.add({
            targets: this.bird,
            y: this.slingY - 4,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                if (this.gameState === GAME_STATE.SLINGSHOT_READY && !this.isDragging) {
                    this.updateRubberBands(this.bird.x, this.bird.y);
                }
            }
        });
    }

    initPrompts() {
        const cx = CONFIG.GAME_WIDTH / 2;

        // Slingshot Aim Guide Banner with Bird ability reminder
        this.aimPrompt = this.add.container(cx, 160).setDepth(30);

        const bannerBg = this.add.graphics();
        bannerBg.fillStyle(0x0f172a, 0.85);
        bannerBg.fillRoundedRect(-145, -34, 290, 68, 18);
        bannerBg.lineStyle(2.5, this.currentBird.accentColor, 0.95);
        bannerBg.strokeRoundedRect(-145, -34, 290, 68, 18);

        const bannerTitle = this.add.text(0, -11, `🎯 PULL TO LAUNCH ${this.currentBird.name.toUpperCase()}`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '19px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const bannerSub = this.add.text(0, 15, `Aim for the ${this.currentBird.targetMaterial.icon} ${this.currentBird.targetMaterial.name} section of each obstacle!`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: this.currentBird.color
        }).setOrigin(0.5);

        this.aimPrompt.add([bannerBg, bannerTitle, bannerSub]);

        this.tweens.add({
            targets: this.aimPrompt,
            scaleX: 1.04,
            scaleY: 1.04,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Flying HUD Guide (Shown after launch)
        this.flyingPrompt = this.add.container(cx, 90).setDepth(30).setAlpha(0);

        const flyBg = this.add.graphics();
        flyBg.fillStyle(0x000000, 0.6);
        flyBg.fillRoundedRect(-110, -22, 220, 44, 14);

        const flyText = this.add.text(0, 0, '👆 TAP / CLICK TO FLAP', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '18px',
            color: '#ffd124',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.flyingPrompt.add([flyBg, flyText]);

        // Destroyed Obstacles Counter HUD
        this.hudScoreText = this.add.text(24, 30, '', {
            fontFamily: 'Impact, sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setDepth(35).setAlpha(0);
    }

    initInputHandlers() {
        this.input.on('pointerdown', (pointer) => {
            window.soundManager.init();

            if (this.gameState === GAME_STATE.SLINGSHOT_READY) {
                const distToBird = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.bird.x, this.bird.y);
                const distToSling = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.slingX, this.slingY);

                if (distToBird < 75 || distToSling < 85) {
                    this.startAiming(pointer);
                }
            } else if (this.gameState === GAME_STATE.FLYING) {
                this.handleFlap();
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging && this.gameState === GAME_STATE.SLINGSHOT_AIMING) {
                this.updateAiming(pointer);
            }
        });

        this.input.on('pointerup', () => {
            if (this.isDragging && this.gameState === GAME_STATE.SLINGSHOT_AIMING) {
                this.releaseSlingshot();
            }
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            window.soundManager.init();
            if (this.gameState === GAME_STATE.FLYING) {
                this.handleFlap();
            }
        });

        this.input.keyboard.on('keydown-UP', () => {
            window.soundManager.init();
            if (this.gameState === GAME_STATE.FLYING) {
                this.handleFlap();
            }
        });
    }

    // ------------------------------------------------------------
    // SLINGSHOT DRAG & AIM
    // ------------------------------------------------------------
    startAiming(pointer) {
        this.gameState = GAME_STATE.SLINGSHOT_AIMING;
        this.isDragging = true;
        if (this.idleTween) this.idleTween.stop();

        this.updateAiming(pointer);
    }

    updateAiming(pointer) {
        const dx = pointer.x - this.slingX;
        const dy = pointer.y - this.slingY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const clampedDist = Math.min(dist, CONFIG.SLING_MAX_PULL);
        const angle = Math.atan2(dy, dx);

        const birdX = this.slingX + Math.cos(angle) * clampedDist;
        const birdY = this.slingY + Math.sin(angle) * clampedDist;

        this.bird.setPosition(birdX, birdY);
        this.pouch.setPosition(birdX, birdY);

        this.bird.rotation = angle + Math.PI;

        this.updateRubberBands(birdX, birdY);

        const pullDx = this.slingX - birdX;
        const pullDy = this.slingY - birdY;
        const pullDist = Math.sqrt(pullDx * pullDx + pullDy * pullDy);

        if (pullDist >= CONFIG.MIN_PULL_THRESHOLD) {
            this.renderTrajectory(birdX, birdY, pullDx * CONFIG.LAUNCH_POWER_X, pullDy * CONFIG.LAUNCH_POWER_Y);
        } else {
            this.hideTrajectory();
        }

        const now = this.time.now;
        if (now - this.lastStretchSoundTime > 140) {
            window.soundManager.playSlingshotStretch(clampedDist / CONFIG.SLING_MAX_PULL);
            this.lastStretchSoundTime = now;
        }
    }

    updateRubberBands(birdX, birdY) {
        if (!this.bandBack || !this.bandFront) return;

        const pullDist = Phaser.Math.Distance.Between(this.slingX, this.slingY, birdX, birdY);
        const stretchRatio = Math.min(1, pullDist / CONFIG.SLING_MAX_PULL);
        const bandWidth = Phaser.Math.Linear(5.5, 3.2, stretchRatio);

        const bandColor = 0x3d1f0e;
        const bandHighlight = 0x613619;

        // Back Band (Left prong to pouch)
        this.bandBack.clear();
        this.bandBack.lineStyle(bandWidth + 1.5, bandColor, 0.95);
        this.bandBack.lineBetween(this.prongLeftX, this.prongLeftY, birdX - 5, birdY);
        this.bandBack.lineStyle(bandWidth * 0.5, bandHighlight, 0.6);
        this.bandBack.lineBetween(this.prongLeftX, this.prongLeftY - 1, birdX - 5, birdY - 1);

        // Front Band (Right prong to pouch)
        this.bandFront.clear();
        this.bandFront.lineStyle(bandWidth + 1.5, bandColor, 0.95);
        this.bandFront.lineBetween(this.prongRightX, this.prongRightY, birdX + 5, birdY);
        this.bandFront.lineStyle(bandWidth * 0.5, bandHighlight, 0.6);
        this.bandFront.lineBetween(this.prongRightX, this.prongRightY - 1, birdX + 5, birdY - 1);

        this.pouch.setPosition(birdX, birdY);
    }

    renderTrajectory(startX, startY, vx, vy) {
        const gravity = CONFIG.GRAVITY;
        const timeStep = 0.055;

        for (let i = 0; i < this.trajectoryDots.length; i++) {
            const t = (i + 1) * timeStep;
            const x = startX + vx * t;
            const y = startY + vy * t + 0.5 * gravity * t * t;

            const dot = this.trajectoryDots[i];
            if (y < CONFIG.GROUND_Y) {
                dot.setPosition(x, y);
                dot.setScale(Phaser.Math.Linear(1.0, 0.5, i / this.trajectoryDots.length));
                dot.setAlpha(Phaser.Math.Linear(0.9, 0.25, i / this.trajectoryDots.length));
                dot.setVisible(true);
            } else {
                dot.setVisible(false);
            }
        }
    }

    hideTrajectory() {
        this.trajectoryDots.forEach(dot => dot.setVisible(false));
    }

    releaseSlingshot() {
        this.isDragging = false;
        this.hideTrajectory();

        const pullDx = this.slingX - this.bird.x;
        const pullDy = this.slingY - this.bird.y;
        const pullDist = Math.sqrt(pullDx * pullDx + pullDy * pullDy);

        if (pullDist < CONFIG.MIN_PULL_THRESHOLD) {
            this.gameState = GAME_STATE.SLINGSHOT_READY;

            this.tweens.add({
                targets: [this.bird, this.pouch],
                x: this.slingX,
                y: this.slingY,
                rotation: 0,
                duration: 220,
                ease: 'Back.easeOut',
                onUpdate: () => {
                    this.updateRubberBands(this.bird.x, this.bird.y);
                }
            });
            return;
        }

        // ============================================================
        // LAUNCH THE BIRD INTO FLIGHT
        // ============================================================
        this.gameState = GAME_STATE.FLYING;

        const launchVx = pullDx * CONFIG.LAUNCH_POWER_X;
        const launchVy = pullDy * CONFIG.LAUNCH_POWER_Y;

        this.bird.body.allowGravity = true;
        this.bird.body.setGravityY(CONFIG.GRAVITY);
        this.bird.body.setVelocity(launchVx, launchVy);

        window.soundManager.playSlingshotLaunch();
        this.puffEmitter.explode(14, this.slingX, this.slingY);

        this.bandBack.clear();
        this.bandFront.clear();

        // Fade out aim prompt, show flying prompt
        this.tweens.add({
            targets: this.aimPrompt,
            alpha: 0,
            y: 120,
            duration: 250,
            onComplete: () => this.aimPrompt.destroy()
        });

        this.tweens.add({
            targets: this.flyingPrompt,
            alpha: 1,
            duration: 300
        });

        // Show HUD counter
        this.hudScoreText.setText(`💥 OBSTACLES: 0`);
        this.tweens.add({
            targets: this.hudScoreText,
            alpha: 1,
            duration: 300
        });

        // ============================================================
        // SLINGSHOT DISAPPEARS FROM SCREEN
        // "Once the bird has been launched, the slingshot should disappear"
        // ============================================================
        const slingshotGroup = [this.slingshotFront, this.slingshotBack, this.pouch];
        this.tweens.add({
            targets: slingshotGroup,
            alpha: 0,
            y: '+=70',
            duration: 360,
            ease: 'Quad.easeIn',
            onComplete: () => {
                slingshotGroup.forEach(obj => {
                    if (obj && obj.destroy) obj.destroy();
                });
                if (this.bandBack) this.bandBack.destroy();
                if (this.bandFront) this.bandFront.destroy();
            }
        });

        // ============================================================
        // START MIXED-MATERIAL VERTICAL OBSTACLES (EVERY OBSTACLE HAS GLASS, WOOD & STONE)
        // ============================================================
        // Spawn first obstacle at a comfortable distance
        this.time.delayedCall(1100, () => {
            if (this.gameState === GAME_STATE.FLYING) {
                this.spawnMixedObstacle();
            }
        });

        // Periodic obstacle spawner
        this.obstacleTimer = this.time.addEvent({
            delay: CONFIG.OBSTACLE_INTERVAL,
            callback: () => {
                if (this.gameState === GAME_STATE.FLYING) {
                    this.spawnMixedObstacle();
                }
            },
            loop: true
        });
    }

    // ------------------------------------------------------------
    // MIXED-MATERIAL VERTICAL OBSTACLES (GLASS, WOOD, AND STONE IN EVERY OBSTACLE)
    // ------------------------------------------------------------
    spawnMixedObstacle() {
        if (this.gameState !== GAME_STATE.FLYING) return;

        this.obstaclesSpawned++;
        const spawnX = CONFIG.GAME_WIDTH + 60;
        const obstacleH = CONFIG.GROUND_Y; // 590px total height, zero gaps

        // 3 continuous vertical sections spanning ceiling (0) to ground (590)
        const sectionDefs = [
            { y: 0, h: 196 },     // Top section (0 - 196)
            { y: 196, h: 197 },   // Middle section (196 - 393)
            { y: 393, h: 197 }    // Bottom section (393 - 590)
        ];

        // Every obstacle contains ALL THREE materials: Glass, Wood, and Stone
        let materials;
        if (this.obstaclesSpawned === 1) {
            // First obstacle: place compatible material in the middle for an inviting first impact
            const others = MATERIAL_LIST.filter(m => m.id !== this.currentBird.targetMaterial.id);
            materials = [others[0], this.currentBird.targetMaterial, others[1]];
        } else {
            // Shuffle so all 3 materials appear at different heights on each obstacle
            materials = Phaser.Utils.Array.Shuffle([...MATERIAL_LIST]);
        }

        sectionDefs.forEach((sec, idx) => {
            const material = materials[idx];
            const section = this.add.container(spawnX, sec.y);

            // 1. Solid material texture tile
            const wallSprite = this.add.tileSprite(0, 0, CONFIG.OBSTACLE_WIDTH, sec.h, material.texture)
                .setOrigin(0.5, 0);

            // 2. Clear section boundary & border
            const border = this.add.graphics();
            border.lineStyle(2, material.colorHex, 0.95);
            border.strokeRect(-CONFIG.OBSTACLE_WIDTH / 2, 0, CONFIG.OBSTACLE_WIDTH, sec.h);
            // Metallic divider brackets between segments
            border.fillStyle(0x0f172a, 0.95);
            border.fillRect(-CONFIG.OBSTACLE_WIDTH / 2 - 2, 0, CONFIG.OBSTACLE_WIDTH + 4, 3);
            border.fillRect(-CONFIG.OBSTACLE_WIDTH / 2 - 2, sec.h - 3, CONFIG.OBSTACLE_WIDTH + 4, 3);

            // 3. Material identification badge pill in center of section
            const badgeBg = this.add.graphics();
            badgeBg.fillStyle(0x0f172a, 0.92);
            badgeBg.fillRoundedRect(-38, sec.h / 2 - 14, 76, 28, 8);
            badgeBg.lineStyle(1.5, material.colorHex, 1);
            badgeBg.strokeRoundedRect(-38, sec.h / 2 - 14, 76, 28, 8);

            const badgeText = this.add.text(0, sec.h / 2, `${material.icon} ${material.name.toUpperCase()}`, {
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '11px',
                fontStyle: '900',
                color: material.color
            }).setOrigin(0.5);

            section.add([wallSprite, border, badgeBg, badgeText]);
            section.setDepth(15);

            // 4. Physics Body for this specific material section
            this.physics.add.existing(section);
            section.body.setAllowGravity(false);
            section.body.setImmovable(true);
            section.body.setSize(CONFIG.OBSTACLE_WIDTH, sec.h);
            section.body.setOffset(-CONFIG.OBSTACLE_WIDTH / 2, 0);

            // 5. Section metadata
            section.material = material;
            section.isBroken = false;
            section.wallSprite = wallSprite;
            section.obstacleId = this.obstaclesSpawned;
            section.sectionIndex = idx;

            this.obstacles.add(section);

            // Ensure velocity is set on the body after adding to group
            section.body.setVelocityX(CONFIG.OBSTACLE_SPEED);
        });
    }

    // ------------------------------------------------------------
    // BIRD VS MATERIAL INTERACTION
    // ------------------------------------------------------------
    handleObstacleCollision(bird, pillar) {
        if (this.gameState !== GAME_STATE.FLYING || pillar.isBroken) return;

        const material = pillar.material;
        const canBreak = (material.breakerBirdId === this.currentBird.id);

        if (canBreak) {
            // ============================================================
            // ✅ COMPATIBLE: BREAK & DESTROY ENTIRE OBSTACLE!
            // ============================================================
            this.destroyedCount++;
            this.obstaclesCleared++;
            this.hudScoreText.setText(`💥 OBSTACLES: ${this.obstaclesCleared}`);

            // Find all sections belonging to this obstacle structure and destroy all of them
            const obstacleSections = this.obstacles.getChildren().filter(sec => sec.obstacleId === pillar.obstacleId);
            obstacleSections.forEach(sec => {
                sec.isBroken = true;
                if (sec.body) sec.body.destroy();
                this.tweens.add({
                    targets: sec,
                    alpha: 0,
                    scaleX: 1.2,
                    duration: 220,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        sec.destroy();
                    }
                });
            });

            // Play material breaking sound
            if (window.soundManager[material.breakSound]) {
                window.soundManager[material.breakSound]();
            }

            // Explode material shards at bird collision point
            const hitY = Phaser.Math.Clamp(this.bird.y, 40, CONFIG.GROUND_Y - 40);

            if (material.id === 'glass') {
                this.glassShardEmitter.explode(22, pillar.x, hitY);
            } else if (material.id === 'wood') {
                this.woodShardEmitter.explode(22, pillar.x, hitY);
            } else if (material.id === 'stone') {
                this.stoneShardEmitter.explode(22, pillar.x, hitY);
            }

            // Screen micro-shake & white flash
            this.cameras.main.shake(140, 0.014);

            // Floating banner text
            const shatterNotice = this.add.text(pillar.x, hitY - 30, material.shatterText, {
                fontFamily: 'Impact, sans-serif',
                fontSize: '20px',
                color: material.color,
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(32);

            this.tweens.add({
                targets: shatterNotice,
                y: shatterNotice.y - 45,
                alpha: 0,
                scale: 1.25,
                duration: 650,
                ease: 'Quad.easeOut',
                onComplete: () => shatterNotice.destroy()
            });

            // Boost bird slightly so player feels the explosive impact satisfaction
            this.bird.body.setVelocityY(Math.min(this.bird.body.velocity.y, -120));

            // ============================================================
            // 🔄 SURPRISE BIRD TRANSFORMATION EVERY 5 OBSTACLES!
            // ============================================================
            if (this.obstaclesCleared > 0 && this.obstaclesCleared % 5 === 0) {
                this.triggerBirdTransformation();
            }
        } else {
            // ============================================================
            // ❌ INCOMPATIBLE: CANNOT BREAK SOLID STRUCTURE!
            // ============================================================
            this.triggerSolidCrash(pillar, material);
        }
    }

    triggerSolidCrash(pillar, material) {
        this.gameState = GAME_STATE.CRASHED;
        const crashedBird = this.currentBird;

        if (this.obstacleTimer) this.obstacleTimer.remove();

        // Audio & Haptics
        window.soundManager.playSolidImpact();
        window.soundManager.playHit();
        this.time.delayedCall(160, () => window.soundManager.playDie());

        // Impact Camera FX
        this.cameras.main.flash(180, 255, 255, 255);
        this.cameras.main.shake(260, 0.024);

        // Feather explosion
        this.featherEmitter.explode(20, this.bird.x, this.bird.y);

        // Stop bird flight physics and set rebound tumble
        this.bird.stop();
        this.bird.body.setVelocityX(-90);
        this.bird.body.setVelocityY(-140);
        this.bird.setAngularVelocity(360);

        // Stop all obstacles from moving
        this.obstacles.getChildren().forEach(obs => {
            if (obs.body) obs.body.setVelocityX(0);
        });

        // Delay before showing flight finished modal
        this.time.delayedCall(800, () => {
            this.showCrashedModal(material, crashedBird);
        });
    }

    // ------------------------------------------------------------
    // 🔄 SURPRISE BIRD TRANSFORMATION MECHANIC (EVERY 5 OBSTACLES)
    // ------------------------------------------------------------
    triggerBirdTransformation() {
        if (this.gameState !== GAME_STATE.FLYING) return;

        // Choose randomly between the two birds that are different from the current bird
        const candidateBirds = BIRDS.filter(b => b.id !== this.currentBird.id);
        const newBird = Phaser.Utils.Array.GetRandom(candidateBirds);
        const oldBird = this.currentBird;

        // Immediately update game state to the new bird
        this.currentBird = newBird;
        this.selectedBirdIndex = BIRDS.findIndex(b => b.id === newBird.id);

        // Audio fanfare & shimmer
        if (window.soundManager && window.soundManager.playTransformation) {
            window.soundManager.playTransformation();
        }

        // Stop any running transformation scale tween
        if (this.transformTween) {
            this.transformTween.stop();
            this.transformTween = null;
        }

        // Explicitly set the new bird's texture and fixed, independent base scale
        const baseScale = newBird.scale || 1.0;
        this.bird.setTexture(newBird.id);
        this.bird.setScale(baseScale, baseScale);
        this.bird.play(`${newBird.id}_fly`);
        this.bird.body.setSize(newBird.bodyWidth || 34, newBird.bodyHeight || 28)
            .setOffset(newBird.offsetX || 15, newBird.offsetY || 10);

        // Exciting particle bursts: dust puff + feathers
        this.puffEmitter.explode(22, this.bird.x, this.bird.y);
        this.featherEmitter.explode(22, this.bird.x, this.bird.y);

        // Morph pulse scale tween strictly bounded by baseScale
        this.transformTween = this.tweens.add({
            targets: this.bird,
            scaleX: { from: baseScale, to: baseScale * 1.35 },
            scaleY: { from: baseScale, to: baseScale * 1.35 },
            duration: 60,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                if (this.bird && this.bird.active) {
                    this.bird.setScale(baseScale, baseScale);
                }
                this.transformTween = null;
            }
        });

        // Camera white flash for surprise impact
        this.cameras.main.flash(220, 255, 255, 255, false);

        // Floating surprise announcement banner
        this.showTransformationBanner(newBird);
    }

    showTransformationBanner(newBird) {
        const cx = CONFIG.GAME_WIDTH / 2;
        const banner = this.add.container(cx, 130).setDepth(36).setAlpha(0);

        const bannerBg = this.add.graphics();
        bannerBg.fillStyle(0x0a0f1d, 0.94);
        bannerBg.fillRoundedRect(-165, -34, 330, 68, 16);
        bannerBg.lineStyle(2.5, newBird.accentColor, 1);
        bannerBg.strokeRoundedRect(-165, -34, 330, 68, 16);

        const titleText = this.add.text(0, -12, `⚡ SURPRISE TRANSFORM! ⚡`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '19px',
            color: '#facc15',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        const descText = this.add.text(0, 15, `${newBird.icon} ${newBird.name.toUpperCase()}  ➔  BREAKS ${newBird.targetMaterial.icon} ${newBird.targetMaterial.name.toUpperCase()}`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '12px',
            fontStyle: '900',
            color: newBird.color
        }).setOrigin(0.5);

        banner.add([bannerBg, titleText, descText]);

        this.tweens.add({
            targets: banner,
            alpha: 1,
            scaleX: { from: 0.6, to: 1.05 },
            scaleY: { from: 0.6, to: 1.05 },
            duration: 220,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: banner,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    onComplete: () => {
                        this.time.delayedCall(1600, () => {
                            this.tweens.add({
                                targets: banner,
                                alpha: 0,
                                y: 95,
                                duration: 320,
                                ease: 'Quad.easeIn',
                                onComplete: () => {
                                    if (banner && banner.destroy) banner.destroy();
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    // ------------------------------------------------------------
    // FLAPPY BIRD FLYING MECHANIC
    // ------------------------------------------------------------
    handleFlap() {
        if (this.gameState !== GAME_STATE.FLYING) return;

        // Dismiss flying guide prompt on first flap
        if (this.flyingPrompt && this.flyingPrompt.alpha > 0) {
            this.tweens.killTweensOf(this.flyingPrompt);
            this.tweens.add({
                targets: this.flyingPrompt,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    if (this.flyingPrompt && this.flyingPrompt.destroy) {
                        this.flyingPrompt.destroy();
                    }
                }
            });
        }

        // Apply upward Flappy Bird flap impulse
        this.bird.body.setVelocityY(CONFIG.FLAP_POWER);
        this.flapsCount++;

        // Flap feather particles
        this.featherEmitter.explode(5, this.bird.x - 14, this.bird.y + 4);

        // Audio
        window.soundManager.playFlap();

        // Punchy upward tilt (stop only flap angle tween so transformation pulse is not interrupted)
        if (this.flapAngleTween) {
            this.flapAngleTween.stop();
        }
        this.flapAngleTween = this.tweens.add({
            targets: this.bird,
            angle: -22,
            duration: 100,
            ease: 'Quad.easeOut'
        });
    }

    // ------------------------------------------------------------
    // GROUND TOUCH / LANDING
    // ------------------------------------------------------------
    handleGroundCollision() {
        if (this.gameState === GAME_STATE.CRASHED || this.gameState === GAME_STATE.LANDED) return;

        this.gameState = GAME_STATE.LANDED;
        if (this.obstacleTimer) this.obstacleTimer.remove();

        this.bird.body.setVelocity(0, 0);
        this.bird.body.allowGravity = false;
        this.bird.y = CONFIG.GROUND_Y - 14;

        window.soundManager.playLand();
        this.puffEmitter.explode(10, this.bird.x, this.bird.y + 10);

        this.tweens.add({
            targets: this.bird,
            angle: 15,
            duration: 200,
            ease: 'Bounce.easeOut'
        });

        this.cameras.main.shake(180, 0.012);

        this.obstacles.getChildren().forEach(obs => {
            if (obs.body) obs.body.setVelocityX(0);
        });

        this.time.delayedCall(500, () => {
            this.showLandedModal();
        });
    }

    // ------------------------------------------------------------
    // MODALS: CRASH VS NORMAL FLIGHT FINISHED
    // ------------------------------------------------------------
    showCrashedModal(hitMaterial, crashedBird = this.currentBird) {
        const cx = CONFIG.GAME_WIDTH / 2;
        const cy = CONFIG.GAME_HEIGHT / 2 - 20;

        const modal = this.add.container(cx, cy + 280).setDepth(40);

        const cardW = 320;
        const cardH = 260;
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x000000, 0.45);
        cardBg.fillRoundedRect(-cardW / 2 + 4, -cardH / 2 + 6, cardW, cardH, 20);
        cardBg.fillStyle(0x0f172a, 0.95);
        cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
        cardBg.lineStyle(3, 0xef4444, 0.9);
        cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);

        // Crash Banner
        const title = this.add.text(0, -cardH / 2 + 28, `💥 CRASHED INTO ${hitMaterial.name.toUpperCase()}!`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '24px',
            color: '#f87171',
            stroke: '#7f1d1d',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Compatibility Explanation
        const reasonText = this.add.text(0, -18, `${crashedBird.name} cannot break ${hitMaterial.name}!`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#fca5a5'
        }).setOrigin(0.5);

        const tipBox = this.add.graphics();
        tipBox.fillStyle(0x1e293b, 0.85);
        tipBox.fillRoundedRect(-140, 6, 280, 50, 10);
        tipBox.lineStyle(1.5, hitMaterial.colorHex, 0.8);
        tipBox.strokeRoundedRect(-140, 6, 280, 50, 10);

        const tipText = this.add.text(0, 31, `💡 HINT: Select ${hitMaterial.breakerBirdName} in the\nmenu to smash through ${hitMaterial.icon} ${hitMaterial.name}!`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#f8fafc',
            align: 'center'
        }).setOrigin(0.5);

        // Buttons
        const retryBtn = this.createModalButton(-65, cardH / 2 - 38, 'RETRY', 0x22c55e, 0x15803d, () => {
            this.scene.restart({ birdIndex: this.startingBirdIndex });
        });

        const menuBtn = this.createModalButton(65, cardH / 2 - 38, 'BIRDS', 0x0284c7, 0x0369a1, () => {
            this.scene.start('MenuScene');
        });

        modal.add([cardBg, title, reasonText, tipBox, tipText, retryBtn, menuBtn]);

        this.tweens.add({
            targets: modal,
            y: cy,
            duration: 450,
            ease: 'Back.easeOut'
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            window.soundManager.playClick();
            this.scene.restart({ birdIndex: this.startingBirdIndex });
        });
    }

    showLandedModal() {
        const cx = CONFIG.GAME_WIDTH / 2;
        const cy = CONFIG.GAME_HEIGHT / 2 - 20;

        const modal = this.add.container(cx, cy + 280).setDepth(40);

        const cardW = 310;
        const cardH = 220;
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x000000, 0.45);
        cardBg.fillRoundedRect(-cardW / 2 + 4, -cardH / 2 + 6, cardW, cardH, 20);
        cardBg.fillStyle(0x0f172a, 0.95);
        cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
        cardBg.lineStyle(3, 0x38bdf8, 0.85);
        cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);

        const title = this.add.text(0, -cardH / 2 + 30, 'FLIGHT FINISHED', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '30px',
            color: '#ffffff',
            stroke: '#0284c7',
            strokeThickness: 5
        }).setOrigin(0.5);

        const birdInfo = this.add.text(0, -10, `${this.currentBird.icon} ${this.currentBird.name}`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: this.currentBird.color
        }).setOrigin(0.5);

        const statsInfo = this.add.text(0, 18, `💥 Obstacles: ${this.obstaclesCleared}  •  Flaps: ${this.flapsCount}`, {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            color: '#cbd5e1'
        }).setOrigin(0.5);

        const retryBtn = this.createModalButton(-65, cardH / 2 - 38, 'RETRY', 0x22c55e, 0x15803d, () => {
            this.scene.restart({ birdIndex: this.startingBirdIndex });
        });

        const menuBtn = this.createModalButton(65, cardH / 2 - 38, 'BIRDS', 0x0284c7, 0x0369a1, () => {
            this.scene.start('MenuScene');
        });

        modal.add([cardBg, title, birdInfo, statsInfo, retryBtn, menuBtn]);

        this.tweens.add({
            targets: modal,
            y: cy,
            duration: 450,
            ease: 'Back.easeOut'
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            window.soundManager.playClick();
            this.scene.restart({ birdIndex: this.startingBirdIndex });
        });
    }

    createModalButton(x, y, label, fillCol, strokeCol, onClick) {
        const btn = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(fillCol, 1);
        bg.fillRoundedRect(-55, -22, 110, 44, 14);
        bg.lineStyle(3, 0xffffff, 1);
        bg.strokeRoundedRect(-55, -22, 110, 44, 14);

        const text = this.add.text(0, 0, label, {
            fontFamily: 'Impact, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            stroke: strokeCol,
            strokeThickness: 4
        }).setOrigin(0.5);

        const hitZone = this.add.rectangle(0, 0, 110, 44, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitZone.on('pointerdown', () => {
            window.soundManager.playClick();
            onClick();
        });

        btn.add([bg, text, hitZone]);
        return btn;
    }

    // ------------------------------------------------------------
    // FRAME UPDATE LOOP
    // ------------------------------------------------------------
    update(time, delta) {
        if (this.gameState === GAME_STATE.FLYING) {
            // Parallax Environment Scroll
            this.clouds.tilePositionX += CONFIG.CLOUDS_SCROLL_SPEED * 1.5;
            this.hills.tilePositionX += CONFIG.HILLS_SCROLL_SPEED * 1.8;
            this.ground.tilePositionX += CONFIG.GROUND_SCROLL_SPEED * 1.8;

            // Clamp ceiling so bird doesn't vanish off top of screen
            if (this.bird.y < 20) {
                this.bird.y = 20;
                if (this.bird.body.velocity.y < 0) {
                    this.bird.body.setVelocityY(0);
                }
            }

            // Smooth forward cruise stabilization
            if (this.bird.x > 130) {
                this.bird.body.velocity.x = Phaser.Math.Linear(this.bird.body.velocity.x, 0, 0.04);
                this.bird.x = Phaser.Math.Linear(this.bird.x, 130, 0.03);
            }

            // Flappy Bird Rotation Physics
            const targetAngle = Phaser.Math.Clamp(this.bird.body.velocity.y * 0.1, -25, 75);
            this.bird.angle = Phaser.Math.Linear(this.bird.angle, targetAngle, 0.12);

            // Enforce fixed, consistent bird scale when not in transformation pulse
            if (this.bird && this.bird.active && !this.transformTween) {
                const expectedScale = this.currentBird.scale || 1.0;
                if (this.bird.scaleX !== expectedScale || this.bird.scaleY !== expectedScale) {
                    this.bird.setScale(expectedScale, expectedScale);
                }
            }

            // Maintain obstacle velocities & clean up off-screen obstacles
            this.obstacles.getChildren().forEach(pillar => {
                if (!pillar.isBroken && pillar.body && this.gameState === GAME_STATE.FLYING) {
                    pillar.body.setVelocityX(CONFIG.OBSTACLE_SPEED);
                }
                if (pillar.x < -100) {
                    pillar.destroy();
                }
            });
        } else if (this.gameState === GAME_STATE.SLINGSHOT_READY || this.gameState === GAME_STATE.SLINGSHOT_AIMING) {
            this.clouds.tilePositionX += CONFIG.CLOUDS_SCROLL_SPEED * 0.4;
            this.hills.tilePositionX += CONFIG.HILLS_SCROLL_SPEED * 0.3;
        }
    }
}

// ------------------------------------------------------------
// PHASER ENGINE CONFIGURATION & BOOTSTRAP
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
