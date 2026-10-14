// ============================================================
// FIRE DRAGON - 3RD PERSON 3-LANE FLIGHT & EVOLUTION ENGINE
// 9:16 Portrait • Rear Camera • 3D Forward Flight • 3 Fixed Lanes
// Subway Surfers / Temple Run Perspective • Touch & Swipe Controls
// ============================================================

const CONFIG = {
    GAME_WIDTH: 720,
    GAME_HEIGHT: 1280,

    // Horizon & 3D Projection
    HORIZON_Y: 310,
    VANISHING_X: 360,

    // 3 Fixed Flight Lanes (Left: 120, Middle: 360, Right: 600) at Dragon Depth (Y = 980) - Extra wide lanes
    DRAGON_Y: 980,
    LANE_X: [120, 360, 600], // 0: Left, 1: Middle, 2: Right
    TOP_LANE_X: [310, 360, 410], // Lane centers at Horizon (Y = 310)
    TOP_DIVIDERS_X: [285, 335, 385, 435], // Perspective divider lines at Horizon
    BOTTOM_DIVIDERS_X: [-128, 198, 522, 848], // Perspective divider lines at Screen Bottom
    LANE_NAMES: ['LEFT', 'MIDDLE', 'RIGHT'],

    // Forward Flight Speed (Pseudo-3D runway scroll)
    FORWARD_SPEED: 0.85,
    LANE_TWEEN_DURATION: 180, // ms for smooth lane change
    BANK_ANGLE: 0.18, // radians roll tilt on lane shift

    // Wing flap animation frame rate
    FLAP_FPS: 7,

    // Attack Fireball Settings
    ATTACK_COOLDOWN: 240, // ms between fireball blasts

    // Enemy Progression Cycle (Enemies level up and hit harder every 45s, tuned down for balanced scaling)
    ENEMY_LEVEL_CYCLE_SEC: 45
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
        sheetPath: 'assets/dragons/fire/dragon_rear_baby_sheet.png',
        sideKey: 'dragon_baby',
        sidePath: 'assets/dragons/fire/dragon_baby.png',
        fireballKey: 'fireball_baby',
        attackDamage: 150, // Baby fireball deals 150 damage (+50)
        spriteScale: 0.86,
        fireballScale: 0.88,
        fireballSpeed: 520,
        mouthOffsetY: 96,
        frameWidth: 257,
        frameHeight: 219,
        tailOffset: { x: 0, y: 64 },
        flameParticleScale: 0.88,
        titleColor: '#fde047',
        element: 'fire',
        particleKey: 'ember'
    },
    {
        stage: 2,
        id: 'teen',
        name: 'Teen Fire Dragon',
        shortName: 'Teen',
        icon: '⚡',
        tag: 'Adolescent Form',
        sheetKey: 'dragon_rear_teen',
        sheetPath: 'assets/dragons/fire/dragon_rear_teen_sheet.png',
        sideKey: 'dragon_teen',
        sidePath: 'assets/dragons/fire/dragon_teen.png',
        fireballKey: 'fireball_teen',
        attackDamage: 200, // Teen fireball deals 200 damage (+50)
        spriteScale: 0.82,
        fireballScale: 1.10,
        fireballSpeed: 490,
        mouthOffsetY: 122,
        frameWidth: 340,
        frameHeight: 282,
        tailOffset: { x: 0, y: 92 },
        flameParticleScale: 1.25,
        titleColor: '#fb923c',
        element: 'fire',
        particleKey: 'ember'
    },
    {
        stage: 3,
        id: 'mature',
        name: 'Mature Fire Dragon',
        shortName: 'Mature',
        icon: '👑',
        tag: 'Apex Elder Form',
        sheetKey: 'dragon_rear_mature',
        sheetPath: 'assets/dragons/fire/dragon_rear_mature_sheet.png',
        sideKey: 'dragon_mature',
        sidePath: 'assets/dragons/fire/dragon_mature.png',
        fireballKey: 'fireball_mature',
        attackDamage: 250, // Mature fireball deals 250 damage (+50)
        spriteScale: 0.76,
        fireballScale: 1.45,
        fireballSpeed: 460,
        mouthOffsetY: 148,
        frameWidth: 486,
        frameHeight: 351,
        tailOffset: { x: 0, y: 118 },
        flameParticleScale: 1.75,
        titleColor: '#f87171',
        element: 'fire',
        particleKey: 'ember'
    }
];

// ============================================================
// 3 WATER DRAGON EVOLUTION STAGES (Aquatic Serpentine Leviathans)
// ============================================================
const WATER_DRAGON_STAGES = [
    {
        stage: 1,
        id: 'water_baby',
        name: 'Baby Water Dragon',
        shortName: 'Baby',
        icon: '🌊',
        tag: 'Hatchling Leviathan',
        sheetKey: 'water_rear_baby',
        sheetPath: 'assets/dragons/water/water_rear_baby_sheet.png?v=10.0',
        sideKey: 'water_baby_side',
        sidePath: 'assets/dragons/water/baby_side.png?v=10.0',
        fireballKey: 'waterball_baby',
        attackDamage: 150, // Baby waterball deals 150 damage (+50)
        spriteScale: 0.95,
        fireballScale: 0.60,
        fireballSpeed: 520,
        mouthOffsetY: 110,
        frameWidth: 140,
        frameHeight: 300,
        tailOffset: { x: 0, y: 72 },
        flameParticleScale: 0.85,
        titleColor: '#38bdf8',
        element: 'water',
        particleKey: 'water_droplet'
    },
    {
        stage: 2,
        id: 'water_teen',
        name: 'Teen Water Dragon',
        shortName: 'Teen',
        icon: '⚡',
        tag: 'Adolescent Serpent',
        sheetKey: 'water_rear_teen',
        sheetPath: 'assets/dragons/water/water_rear_teen_sheet.png?v=10.0',
        sideKey: 'water_teen_side',
        sidePath: 'assets/dragons/water/teen_side.png?v=10.0',
        fireballKey: 'waterball_teen',
        attackDamage: 200, // Teen waterball deals 200 damage (+50)
        spriteScale: 0.88,
        fireballScale: 0.50,
        fireballSpeed: 490,
        mouthOffsetY: 135,
        frameWidth: 200,
        frameHeight: 360,
        tailOffset: { x: 0, y: 105 },
        flameParticleScale: 1.20,
        titleColor: '#0ea5e9',
        element: 'water',
        particleKey: 'water_droplet'
    },
    {
        stage: 3,
        id: 'water_mature',
        name: 'Mature Water Dragon',
        shortName: 'Mature',
        icon: '👑',
        tag: 'Apex Leviathan King',
        sheetKey: 'water_rear_mature',
        sheetPath: 'assets/dragons/water/water_rear_mature_sheet.png?v=10.0',
        sideKey: 'water_mature_side',
        sidePath: 'assets/dragons/water/mature_side.png?v=10.0',
        fireballKey: 'waterball_mature',
        attackDamage: 250, // Mature waterball deals 250 damage (+50)
        spriteScale: 0.82,
        fireballScale: 0.45,
        fireballSpeed: 460,
        mouthOffsetY: 145,
        frameWidth: 420,
        frameHeight: 360,
        tailOffset: { x: 0, y: 125 },
        flameParticleScale: 1.65,
        titleColor: '#0284c7',
        element: 'water',
        particleKey: 'water_droplet'
    }
];

const DRAGON_FAMILIES = {
    fire: DRAGON_STAGES,
    water: WATER_DRAGON_STAGES
};


// ============================================================
// 3 ENEMY HUMAN CLASSES (Advancing Enemies with Health Bars)
// ============================================================
const HUMAN_CLASSES = [
    {
        id: 'mage',
        name: 'Arch-Mage',
        title: '🔮 Mage',
        spriteKey: 'human_mage',
        projKey: 'proj_magic_orb',
        maxHp: 500, // 500 HP as specified!
        fireRateMin: 2200,
        fireRateMax: 3200,
        color: '#c084fc',
        score: 300,
        sizeScale: 0.82
    },
    {
        id: 'archer',
        name: 'Royal Archer',
        title: '🏹 Archer',
        spriteKey: 'human_archer',
        projKey: 'proj_arrow',
        maxHp: 650, // Higher HP
        fireRateMin: 2000,
        fireRateMax: 2900,
        color: '#4ade80',
        score: 200,
        sizeScale: 0.80
    },
    {
        id: 'knight',
        name: 'Iron Guard',
        title: '🛡️ Knight',
        spriteKey: 'human_knight',
        projKey: 'proj_javelin',
        maxHp: 800, // Armored soldier with most HP
        fireRateMin: 2400,
        fireRateMax: 3400,
        color: '#f87171',
        score: 250,
        sizeScale: 0.84
    }
];

// ============================================================
// 9 CURATED DRAGON BLESSINGS & LEVEL-UP UPGRADES
// ============================================================
const DRAGON_UPGRADES = [
    {
        id: 'health_boost',
        name: 'Vitality Surge',
        icon: '❤️',
        tier: 'DEFENSE',
        tagColor: '#ef4444',
        desc: '+150 Max HP & immediately heals +250 HP',
        apply: (scene) => {
            scene.dragonMaxHp += 150;
            scene.dragonHp = Math.min(scene.dragonMaxHp, scene.dragonHp + 250);
            scene.upgrades.health_boost = (scene.upgrades.health_boost || 0) + 1;
        }
    },
    {
        id: 'attack_boost',
        name: 'Draconic Wrath',
        icon: '⚔️',
        tier: 'OFFENSE',
        tagColor: '#f97316',
        desc: '+40 Damage to all dragon breath attacks',
        apply: (scene) => {
            scene.bonusDamage = (scene.bonusDamage || 0) + 40;
            scene.upgrades.attack_boost = (scene.upgrades.attack_boost || 0) + 1;
        }
    },
    {
        id: 'regeneration',
        name: 'Phoenix Blood',
        icon: '💚',
        tier: 'SURVIVAL',
        tagColor: '#22c55e',
        desc: 'Passively regenerate +8 HP every second',
        apply: (scene) => {
            scene.hpRegenPerSec = (scene.hpRegenPerSec || 0) + 8;
            scene.upgrades.regeneration = (scene.upgrades.regeneration || 0) + 1;
        }
    },
    {
        id: 'multishot',
        name: 'Multi-Shot',
        icon: '⚡',
        tier: 'LEGENDARY [5%]',
        tagColor: '#f59e0b',
        desc: 'Fires +1 extra rapid projectile per attack (Stacks: 2 shots, 3 shots, 4 shots...)',
        apply: (scene) => {
            scene.multiShotCount = (scene.multiShotCount || 0) + 1;
            scene.hasMultiLayer = true;
            scene.upgrades.multishot = scene.multiShotCount;
            scene.upgrades.multi_layer = scene.multiShotCount;
        }
    },
    {
        id: 'dot',
        name: 'Elemental Scorch',
        icon: '🔥',
        tier: 'STATUS EFFECT',
        tagColor: '#f43f5e',
        desc: 'Attacks inflict DoT: 35 dmg every 0.5s for 3s (210 extra dmg)',
        apply: (scene) => {
            scene.hasDoT = true;
            scene.dotDamage = (scene.dotDamage || 0) + 35;
            scene.upgrades.dot = (scene.upgrades.dot || 0) + 1;
        }
    },
    {
        id: 'attack_speed',
        name: 'Tempest Wings',
        icon: '⏩',
        tier: 'UTILITY [MAX 2]',
        tagColor: '#a855f7',
        maxStacks: 2,
        desc: 'Reduces breath cooldown by 25% for rapid casting (Max 2 purchases)',
        apply: (scene) => {
            scene.attackCooldownMult = (scene.attackCooldownMult || 1.0) * 0.75;
            scene.upgrades.attack_speed = (scene.upgrades.attack_speed || 0) + 1;
        }
    },
    {
        id: 'baby_companion',
        name: 'Hatchling Ally',
        icon: '🐲',
        tier: 'COMPANION [LV 5+]',
        tagColor: '#38bdf8',
        minLevel: 5,
        maxStacks: 3,
        desc: 'Summons a loyal baby dragon helper that flies beside you & auto-attacks the nearest enemy in your lane',
        apply: (scene) => {
            scene.hasBabyCompanion = true;
            scene.babyCompanionLevel = (scene.babyCompanionLevel || 0) + 1;
            scene.upgrades.baby_companion = scene.babyCompanionLevel;
            scene.spawnOrUpdateBabyCompanion();
        }
    },
    {
        id: 'sheep_feast',
        name: 'Gluttonous Feast',
        icon: '🍖',
        tier: 'GROWTH',
        tagColor: '#10b981',
        desc: 'Sheep heal +150 extra HP (+250 total) & give +50 bonus EXP',
        apply: (scene) => {
            scene.sheepHealBonus = (scene.sheepHealBonus || 0) + 150;
            scene.sheepExpBonus = (scene.sheepExpBonus || 0) + 50;
            scene.upgrades.sheep_feast = (scene.upgrades.sheep_feast || 0) + 1;
        }
    },
    {
        id: 'armor',
        name: 'Titanium Scales',
        icon: '🛡️',
        tier: 'DEFENSE',
        tagColor: '#64748b',
        desc: 'Hardened scales reduce all incoming enemy damage by 20%',
        apply: (scene) => {
            scene.armorReduction = Math.min(0.60, (scene.armorReduction || 0) + 0.20);
            scene.upgrades.armor = (scene.upgrades.armor || 0) + 1;
        }
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

        this.add.text(cx, cy - 80, 'FIRE DRAGON', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '56px',
            color: '#f97316',
            stroke: '#180702',
            strokeThickness: 10
        }).setOrigin(0.5);

        this.add.text(cx, cy - 20, '3D FORWARD RUNNER', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#fde047',
            letterSpacing: 2
        }).setOrigin(0.5);

        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        progressBox.fillStyle(0x180b1e, 0.9);
        progressBox.fillRoundedRect(cx - 240, cy + 40, 480, 26, 13);

        this.load.on('progress', (val) => {
            progressBar.clear();
            progressBar.fillStyle(0xf97316, 1);
            progressBar.fillRoundedRect(cx - 236, cy + 44, 472 * val, 18, 9);
        });

        // Load 3 Rear-View Dragon Spritesheets & Side Icons (Fire)
        DRAGON_STAGES.forEach(s => {
            this.load.spritesheet(s.sheetKey, s.sheetPath, {
                frameWidth: s.frameWidth,
                frameHeight: s.frameHeight
            });
            this.load.image(s.sideKey, s.sidePath);
        });

        // Load 3 Rear-View Dragon Spritesheets & Side Icons (Water)
        WATER_DRAGON_STAGES.forEach(s => {
            this.load.spritesheet(s.sheetKey, s.sheetPath, {
                frameWidth: s.frameWidth,
                frameHeight: s.frameHeight
            });
            this.load.image(s.sideKey, s.sidePath);
        });

        // Load 3 Fireball Attack Sprites
        this.load.image('fireball_baby', 'assets/dragons/fire/fireball_baby.png');
        this.load.image('fireball_teen', 'assets/dragons/fire/fireball_teen.png?v=8.9');
        this.load.image('fireball_mature', 'assets/dragons/fire/fireball_mature.png?v=8.9');

        // Load Water Projectile Sprites (Custom user projectile art - rotated 0-deg vertical alignment)
        this.load.image('waterball_baby', 'assets/dragons/water/waterball_baby.png?v=10.2');
        this.load.image('waterball_teen', 'assets/dragons/water/waterball_teen.png?v=10.2');
        this.load.image('waterball_mature', 'assets/dragons/water/waterball_mature.png?v=10.2');
        this.load.image('water_droplet', 'assets/dragons/water/water_droplet.png?v=10.2');

        // Load Sheep Sprite (Food)
        this.load.image('sheep', 'assets/world/sheep.png');

        // Load 3 Human Enemy Classes & Defenses
        this.load.image('human_archer', 'assets/enemies/human_archer.png?v=8.7');
        this.load.image('human_knight', 'assets/enemies/human_knight.png');
        this.load.image('human_mage', 'assets/enemies/human_mage.png');
        this.load.image('barricade', 'assets/enemies/barricade.png');

        // Load Enemy Projectiles
        this.load.image('proj_arrow', 'assets/enemies/arrow.png');
        this.load.image('proj_javelin', 'assets/enemies/javelin.png');
        this.load.image('proj_magic_orb', 'assets/enemies/magic_orb.png');

        // Load Portrait Background & Particles
        this.load.image('portrait_bg', 'assets/world/portrait_bg.png');
        this.load.image('ember', 'assets/dragons/fire/ember.png');

        // Explicit baby_side alias for Dragon Select Panel
        this.load.image('baby_side', 'assets/dragons/fire/dragon_baby.png');

        // Animated baby fire dragon menu spritesheet
        this.load.spritesheet('baby_menu_sheet', 'assets/dragons/fire/dragon_baby_menu_sheet.png?v=9.1', {
            frameWidth: 276,
            frameHeight: 246
        });

        // Animated baby water dragon menu spritesheet (9 frames: rest, blinks, undulation wave)
        this.load.spritesheet('water_baby_menu_sheet', 'assets/dragons/water/water_baby_menu_sheet.png?v=9.7', {
            frameWidth: 180,
            frameHeight: 160
        });
    }

    create() {
        // Create Wing Flap Animations for all 3 fire dragon rear stages
        DRAGON_STAGES.forEach(s => {
            this.anims.create({
                key: `${s.sheetKey}_fly`,
                frames: this.anims.generateFrameNumbers(s.sheetKey, { frames: [0, 1, 0, 2] }),
                frameRate: CONFIG.FLAP_FPS,
                repeat: -1
            });
        });

        // Create Serpentine Undulation Animations for all 3 water dragon rear stages
        WATER_DRAGON_STAGES.forEach(s => {
            this.anims.create({
                key: `${s.sheetKey}_fly`,
                frames: this.anims.generateFrameNumbers(s.sheetKey, { frames: [0, 1, 0, 2] }),
                frameRate: CONFIG.FLAP_FPS,
                repeat: -1
            });
        });

        // Create Menu Baby Dragon animations (Fire Dragon)
        if (!this.anims.exists('baby_menu_move')) {
            this.anims.create({
                key: 'baby_menu_move',
                frames: this.anims.generateFrameNumbers('baby_menu_sheet', { frames: [0, 1, 2, 3, 0, 4, 5, 0] }),
                frameRate: 8,
                repeat: 0
            });
        }
        if (!this.anims.exists('baby_menu_blink')) {
            this.anims.create({
                key: 'baby_menu_blink',
                frames: this.anims.generateFrameNumbers('baby_menu_sheet', { frames: [6, 7, 6, 0] }),
                frameRate: 12,
                repeat: 0
            });
        }

        // Create Menu Baby Dragon animations (Water Dragon)
        // 1. Independent Body Movement (undulating serpentine swim: tail slowly goes down [3,4,5,6,7,8], then slowly rises back [7,6,5,4,3,0])
        if (this.anims.exists('water_baby_menu_move')) {
            this.anims.remove('water_baby_menu_move');
        }
        this.anims.create({
            key: 'water_baby_menu_move',
            frames: this.anims.generateFrameNumbers('water_baby_menu_sheet', { frames: [3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 0] }),
            frameRate: 7,
            repeat: 0
        });
        // 2. Independent Eye Blinking (smooth eyelid blink on stationary resting body)
        if (!this.anims.exists('water_baby_menu_blink')) {
            this.anims.create({
                key: 'water_baby_menu_blink',
                frames: this.anims.generateFrameNumbers('water_baby_menu_sheet', { frames: [0, 1, 2, 1, 0] }),
                frameRate: 12,
                repeat: 0
            });
        }

        // Start at Main Menu with Dragon Select Panel
        this.scene.start('MainMenuScene');
    }
}

// ------------------------------------------------------------
// 2. MAIN MENU & DRAGON SELECT SCENE (PORTRAIT 9:16)
// ------------------------------------------------------------
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        // Sound manager init
        if (window.soundManager) {
            window.soundManager.init();
        }

        this.selectedDragonType = 'fire';
        this.currentIdleAnim = 'baby_menu_idle';
        this.currentBlinkAnim = 'baby_menu_blink';

        // 1. Cinematic Background with Obsidian Dark Gradient Overlay
        this.bg = this.add.image(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 'portrait_bg');
        this.bg.setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        const darkOverlay = this.add.graphics();
        darkOverlay.fillStyle(0x07040d, 0.78);
        darkOverlay.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        // 2. Ambient Rising Ember Particles
        this.embers = this.add.particles(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT + 20, 'ember', {
            x: { min: -320, max: 320 },
            y: 0,
            speedY: { min: -120, max: -240 },
            speedX: { min: -40, max: 40 },
            scale: { start: 0.8, end: 0.1 },
            alpha: { start: 0.85, end: 0 },
            lifespan: 2500, max: 4500,
            blendMode: 'ADD',
            frequency: 110
        }).setDepth(5);

        // 3. Header / Title Banner
        this.createTitleBanner();

        // 4. Dragon Select Panel (Fire Dragon Active)
        this.createDragonSelectPanel();

        // 5. Start Game Button (Interactive CTA)
        this.createStartButton();

        // 6. Camera Fade In
        this.cameras.main.fadeIn(350, 8, 4, 14);
    }

    createTitleBanner() {
        const titleY = 120;

        // Glowing Subtitle Badge
        const badgeBg = this.add.graphics();
        badgeBg.fillStyle(0xf97316, 0.22);
        badgeBg.fillRoundedRect(CONFIG.GAME_WIDTH / 2 - 140, titleY - 60, 280, 36, 18);
        badgeBg.lineStyle(1.5, 0xf97316, 0.7);
        badgeBg.strokeRoundedRect(CONFIG.GAME_WIDTH / 2 - 140, titleY - 60, 280, 36, 18);

        this.add.text(CONFIG.GAME_WIDTH / 2, titleY - 42, '⚡ 3D FLIGHT RUNNER ⚡', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '17px',
            color: '#fde047',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);

        // Epic Main Title
        const title = this.add.text(CONFIG.GAME_WIDTH / 2, titleY + 10, 'DRAGON EVOLUTION', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '52px',
            color: '#ffedd5',
            stroke: '#180702',
            strokeThickness: 10,
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);

        // Gentle breathing glow on title
        this.tweens.add({
            targets: title,
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 1600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Tagline
        this.add.text(CONFIG.GAME_WIDTH / 2, titleY + 62, 'AIR COMBAT & PREHISTORIC LEVIATHANS', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '17px',
            fontWeight: 'bold',
            color: '#fb923c',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
    }

    createDragonSelectPanel() {
        const panelW = 620;
        const panelH = 680;
        const panelX = CONFIG.GAME_WIDTH / 2;
        const panelY = 570;

        const panelContainer = this.add.container(panelX, panelY).setDepth(10);

        // Panel Background Glass Card
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x130a1c, 0.94);
        panelBg.fillRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 28);
        panelBg.lineStyle(3, 0xf97316, 0.85);
        panelBg.strokeRoundedRect(-panelW / 2, -panelH / 2, panelW, panelH, 28);
        panelContainer.add(panelBg);
        this.panelBg = panelBg;

        // Inner glowing border accent
        const innerBorder = this.add.graphics();
        innerBorder.lineStyle(1.5, 0xfde047, 0.35);
        innerBorder.strokeRoundedRect(-panelW / 2 + 10, -panelH / 2 + 10, panelW - 20, panelH - 20, 20);
        panelContainer.add(innerBorder);

        // Section Title: "CHOOSE YOUR DRAGON"
        const sectionTitle = this.add.text(0, -panelH / 2 + 38, '✦ DRAGON SELECT ✦', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '24px',
            color: '#fde047',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        panelContainer.add(sectionTitle);

        // Dragon Tabs / Elements (Fire Dragon Active, Other Locked)
        const tabW = 250;
        const tabH = 40;
        const tabsY = -panelH / 2 + 82;

        const tabsData = [
            { id: 'fire', label: '🔥 FIRE DRAGON', color: 0xf97316, textCol: '#ffffff' },
            { id: 'water', label: '🌊 WATER DRAGON', color: 0x0284c7, textCol: '#ffffff' }
        ];

        this.menuTabs = [];
        tabsData.forEach((tab, idx) => {
            const tx = (idx === 0) ? -130 : 130;
            const tabContainer = this.add.container(tx, tabsY);
            const tabG = this.add.graphics();
            tabContainer.add(tabG);

            const tabText = this.add.text(0, 0, tab.label, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '16px',
                color: tab.textCol,
                letterSpacing: 1
            }).setOrigin(0.5, 0.5);
            tabContainer.add(tabText);

            tabContainer.setSize(tabW, tabH);
            panelContainer.add(tabContainer);

            const tabObj = { id: tab.id, container: tabContainer, graphics: tabG, text: tabText, data: tab, w: tabW, h: tabH };
            this.menuTabs.push(tabObj);

            tabContainer.setInteractive({ useHandCursor: true });
            tabContainer.on('pointerdown', () => {
                if (this.selectedDragonType !== tab.id) {
                    if (window.soundManager && window.soundManager.playFlap) {
                        window.soundManager.playFlap();
                    }
                    this.updateDragonTheme(tab.id);
                }
            });
        });

        // Dragon Showcase Display Box (Pedestal / Aura)
        const boxW = 540;
        const boxH = 260;
        const boxY = -60;

        const showcaseBox = this.add.graphics();
        showcaseBox.fillStyle(0x0a0512, 0.9);
        showcaseBox.fillRoundedRect(-boxW / 2, boxY - boxH / 2, boxW, boxH, 20);
        showcaseBox.lineStyle(2, 0xf97316, 0.5);
        showcaseBox.strokeRoundedRect(-boxW / 2, boxY - boxH / 2, boxW, boxH, 20);
        panelContainer.add(showcaseBox);
        this.showcaseBox = showcaseBox;

        // Radiant pedestal glow
        this.glowCircle = this.add.circle(0, boxY + 25, 95, 0xf97316, 0.22);
        panelContainer.add(this.glowCircle);
        this.tweens.add({
            targets: this.glowCircle,
            scaleX: 1.18,
            scaleY: 1.18,
            alpha: 0.35,
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 🐉 Dragon Art: Animated Baby Dragon resting in idle pose with gentle floating hover
        this.dragonMenuSprite = this.add.sprite(0, boxY - 10, 'baby_menu_sheet', 0);
        this.dragonMenuSprite.setDisplaySize(200, 170);
        panelContainer.add(this.dragonMenuSprite);

        this.currentSheetKey = 'baby_menu_sheet';
        this.currentBlinkAnim = 'baby_menu_blink';
        this.currentMoveAnim = 'baby_menu_move';
        this.isMenuAnimPlaying = false;

        // Independent triggering with 8s cooldown for Eye Blinking
        const triggerBlink = () => {
            if (!this.dragonMenuSprite || !this.dragonMenuSprite.active) return;
            if (this.isMenuAnimPlaying) {
                // If body movement is active, re-check shortly
                this.time.delayedCall(1000, triggerBlink);
                return;
            }
            this.isMenuAnimPlaying = true;
            this.dragonMenuSprite.play(this.currentBlinkAnim);
            this.dragonMenuSprite.once('animationcomplete', () => {
                if (!this.dragonMenuSprite || !this.dragonMenuSprite.active) return;
                this.dragonMenuSprite.stop();
                this.dragonMenuSprite.setTexture(this.currentSheetKey, 0);
                if (this.selectedDragonType === 'water') {
                    this.dragonMenuSprite.setDisplaySize(280, 248);
                } else {
                    this.dragonMenuSprite.setDisplaySize(200, 170);
                }
                this.isMenuAnimPlaying = false;

                // 8 second cooldown after blinking ends before it can blink again
                this.time.delayedCall(8000, triggerBlink);
            });
        };

        // Independent triggering with 8s cooldown for Body Movement
        const triggerMove = () => {
            if (!this.dragonMenuSprite || !this.dragonMenuSprite.active) return;
            if (this.isMenuAnimPlaying) {
                // If blinking is active, re-check shortly
                this.time.delayedCall(1000, triggerMove);
                return;
            }
            this.isMenuAnimPlaying = true;
            this.dragonMenuSprite.play(this.currentMoveAnim);
            this.dragonMenuSprite.once('animationcomplete', () => {
                if (!this.dragonMenuSprite || !this.dragonMenuSprite.active) return;
                this.dragonMenuSprite.stop();
                this.dragonMenuSprite.setTexture(this.currentSheetKey, 0);
                if (this.selectedDragonType === 'water') {
                    this.dragonMenuSprite.setDisplaySize(280, 248);
                } else {
                    this.dragonMenuSprite.setDisplaySize(200, 170);
                }
                this.isMenuAnimPlaying = false;

                // 8 second cooldown after movement ends before it can move again
                this.time.delayedCall(8000, triggerMove);
            });
        };

        // Stagger initial activation so they trigger independently
        this.time.delayedCall(2500, triggerBlink);
        this.time.delayedCall(6000, triggerMove);

        // Floating hover animation for Baby Dragon
        this.tweens.add({
            targets: this.dragonMenuSprite,
            y: boxY - 22,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Form Selection Status Pill
        const formTagG = this.add.graphics();
        formTagG.fillStyle(0x16a34a, 0.95);
        formTagG.fillRoundedRect(-140, boxY + boxH / 2 - 38, 280, 32, 16);
        formTagG.lineStyle(2, 0xbbf7d0, 0.85);
        formTagG.strokeRoundedRect(-140, boxY + boxH / 2 - 38, 280, 32, 16);
        panelContainer.add(formTagG);

        const formTagText = this.add.text(0, boxY + boxH / 2 - 22, '✓ SELECTED: BABY FORM', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        panelContainer.add(formTagText);

        // Dragon Title & Details
        this.dragonName = this.add.text(0, 105, '🐣 BABY FIRE DRAGON', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '28px',
            color: '#fde047',
            letterSpacing: 1.5
        }).setOrigin(0.5, 0.5);
        panelContainer.add(this.dragonName);

        this.dragonRole = this.add.text(0, 138, 'Starting Stage • Agile Ember Caster', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fed7aa'
        }).setOrigin(0.5, 0.5);
        panelContainer.add(this.dragonRole);

        // Stats Card Grid
        const statsY = 210;
        const statBoxes = [
            { icon: '⚔️', label: 'BASE ATK', value: '100 DMG', sub: 'Upgrades & Perks' },
            { icon: '❤️', label: 'HEALTH', value: '500 HP', sub: 'Eat Sheep to Heal' },
            { icon: '⭐', label: 'EVOLVE', value: 'LV. 5 & 10', sub: 'Teen (5) • Mature (10)' }
        ];

        const sW = 175;
        const sH = 92;
        statBoxes.forEach((s, idx) => {
            const sx = (idx - 1) * 186;
            const sbG = this.add.graphics();
            sbG.fillStyle(0x0e0717, 0.85);
            sbG.fillRoundedRect(sx - sW / 2, statsY - sH / 2, sW, sH, 14);
            sbG.lineStyle(1.5, 0xf97316, 0.45);
            sbG.strokeRoundedRect(sx - sW / 2, statsY - sH / 2, sW, sH, 14);
            panelContainer.add(sbG);

            const sIcon = this.add.text(sx, statsY - 26, s.icon, { fontSize: '20px' }).setOrigin(0.5, 0.5);
            const sLabel = this.add.text(sx, statsY - 4, s.label, {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#94a3b8'
            }).setOrigin(0.5, 0.5);
            const sVal = this.add.text(sx, statsY + 16, s.value, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                letterSpacing: 1
            }).setOrigin(0.5, 0.5);
            const sSub = this.add.text(sx, statsY + 34, s.sub, {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '10px',
                color: '#f97316'
            }).setOrigin(0.5, 0.5);

            panelContainer.add([sIcon, sLabel, sVal, sSub]);
        });

        // Evolution Preview Footnote
        this.evoHint = this.add.text(0, panelH / 2 - 34, 'Evolves: Baby (100 DMG) ➔ Teen (150 DMG) ➔ Mature (200 DMG)', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '13px',
            color: '#fb923c'
        }).setOrigin(0.5, 0.5);
        panelContainer.add(this.evoHint);
    }

    updateDragonTheme(dragonType) {
        this.selectedDragonType = dragonType || 'fire';
        const isFire = (this.selectedDragonType === 'fire');

        // Update tabs
        if (this.menuTabs) {
            this.menuTabs.forEach(t => {
                const active = (t.id === this.selectedDragonType);
                t.graphics.clear();
                t.graphics.fillStyle(t.data.color, active ? 0.95 : 0.35);
                t.graphics.fillRoundedRect(-t.w / 2, -t.h / 2, t.w, t.h, 12);
                if (active) {
                    t.graphics.lineStyle(2, 0xffffff, 0.95);
                    t.graphics.strokeRoundedRect(-t.w / 2, -t.h / 2, t.w, t.h, 12);
                }
                t.text.setColor(active ? '#ffffff' : '#94a3b8');
            });
        }

        if (isFire) {
            this.currentSheetKey = 'baby_menu_sheet';
            this.currentBlinkAnim = 'baby_menu_blink';
            this.currentMoveAnim = 'baby_menu_move';
            if (this.dragonMenuSprite) {
                this.dragonMenuSprite.stop();
                this.dragonMenuSprite.setTexture('baby_menu_sheet', 0);
                this.dragonMenuSprite.setDisplaySize(200, 170);
            }
            this.isMenuAnimPlaying = false;

            if (this.panelBg) {
                this.panelBg.lineStyle(3, 0xf97316, 0.85);
                this.panelBg.strokeRoundedRect(-310, -340, 620, 680, 28);
            }
            if (this.showcaseBox) {
                this.showcaseBox.lineStyle(2, 0xf97316, 0.5);
                this.showcaseBox.strokeRoundedRect(-270, -190, 540, 260, 20);
            }
            if (this.glowCircle) {
                this.glowCircle.setFillStyle(0xf97316, 0.22);
            }
            if (this.dragonName) {
                this.dragonName.setText('🐣 BABY FIRE DRAGON');
                this.dragonName.setColor('#fde047');
            }
            if (this.dragonRole) {
                this.dragonRole.setText('Starting Stage • Agile Ember Caster');
                this.dragonRole.setColor('#fed7aa');
            }
            if (this.evoHint) {
                this.evoHint.setText('Evolves: Baby (100 DMG) ➔ Teen (150 DMG) ➔ Mature (200 DMG)');
                this.evoHint.setColor('#fb923c');
            }
            if (this.startBtnBg) {
                this.startBtnBg.clear();
                this.startBtnBg.fillStyle(0xf97316, 1);
                this.startBtnBg.fillRoundedRect(-this.btnW / 2, -this.btnH / 2, this.btnW, this.btnH, 26);
                this.startBtnBg.lineStyle(3, 0xffedd5, 0.95);
                this.startBtnBg.strokeRoundedRect(-this.btnW / 2, -this.btnH / 2, this.btnW, this.btnH, 26);
            }
            if (this.startBtnGlow) {
                this.startBtnGlow.clear();
                this.startBtnGlow.fillStyle(0xf97316, 0.35);
                this.startBtnGlow.fillRoundedRect(-this.btnW / 2 - 8, -this.btnH / 2 - 8, this.btnW + 16, this.btnH + 16, 32);
            }
            if (this.startBtnText) {
                this.startBtnText.setText('🔥 START GAME ▶');
            }
        } else {
            // Water Dragon Selection
            this.currentSheetKey = 'water_baby_menu_sheet';
            this.currentBlinkAnim = 'water_baby_menu_blink';
            this.currentMoveAnim = 'water_baby_menu_move';
            if (this.dragonMenuSprite) {
                this.dragonMenuSprite.stop();
                this.dragonMenuSprite.setTexture('water_baby_menu_sheet', 0);
                this.dragonMenuSprite.setDisplaySize(280, 248);
            }
            this.isMenuAnimPlaying = false;

            if (this.panelBg) {
                this.panelBg.lineStyle(3, 0x0284c7, 0.85);
                this.panelBg.strokeRoundedRect(-310, -340, 620, 680, 28);
            }
            if (this.showcaseBox) {
                this.showcaseBox.lineStyle(2, 0x0ea5e9, 0.5);
                this.showcaseBox.strokeRoundedRect(-270, -190, 540, 260, 20);
            }
            if (this.glowCircle) {
                this.glowCircle.setFillStyle(0x0ea5e9, 0.28);
            }
            if (this.dragonName) {
                this.dragonName.setText('🌊 BABY WATER DRAGON');
                this.dragonName.setColor('#38bdf8');
            }
            if (this.dragonRole) {
                this.dragonRole.setText('Starting Stage • Aquatic Tidal Serpent');
                this.dragonRole.setColor('#bae6fd');
            }
            if (this.evoHint) {
                this.evoHint.setText('Evolves: Baby (100 DMG) ➔ Teen (150 DMG) ➔ Mature (200 DMG)');
                this.evoHint.setColor('#38bdf8');
            }
            if (this.startBtnBg) {
                this.startBtnBg.clear();
                this.startBtnBg.fillStyle(0x0284c7, 1);
                this.startBtnBg.fillRoundedRect(-this.btnW / 2, -this.btnH / 2, this.btnW, this.btnH, 26);
                this.startBtnBg.lineStyle(3, 0xe0f2fe, 0.95);
                this.startBtnBg.strokeRoundedRect(-this.btnW / 2, -this.btnH / 2, this.btnW, this.btnH, 26);
            }
            if (this.startBtnGlow) {
                this.startBtnGlow.clear();
                this.startBtnGlow.fillStyle(0x0284c7, 0.4);
                this.startBtnGlow.fillRoundedRect(-this.btnW / 2 - 8, -this.btnH / 2 - 8, this.btnW + 16, this.btnH + 16, 32);
            }
            if (this.startBtnText) {
                this.startBtnText.setText('🌊 START GAME ▶');
            }
        }
    }

    createStartButton() {
        const btnW = 540;
        const btnH = 92;
        const btnX = CONFIG.GAME_WIDTH / 2;
        const btnY = 1040;
        this.btnW = btnW;
        this.btnH = btnH;

        const startBtn = this.add.container(btnX, btnY).setDepth(20);

        const btnGlow = this.add.graphics();
        btnGlow.fillStyle(0xf97316, 0.35);
        btnGlow.fillRoundedRect(-btnW / 2 - 8, -btnH / 2 - 8, btnW + 16, btnH + 16, 32);
        startBtn.add(btnGlow);
        this.startBtnGlow = btnGlow;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xf97316, 1);
        btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 26);
        btnBg.lineStyle(3, 0xffedd5, 0.95);
        btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 26);
        startBtn.add(btnBg);
        this.startBtnBg = btnBg;

        const btnText = this.add.text(0, -2, '🔥 START GAME ▶', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '38px',
            color: '#180702',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        startBtn.add(btnText);
        this.startBtnText = btnText;

        const hintText = this.add.text(0, 30, 'PRESS SPACE OR TAP TO FLY', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#431407',
            letterSpacing: 1.5
        }).setOrigin(0.5, 0.5);
        startBtn.add(hintText);

        // Breathing pulse animation
        this.tweens.add({
            targets: [btnGlow, startBtn],
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Interactivity
        startBtn.setSize(btnW, btnH);
        startBtn.setInteractive({ useHandCursor: true });

        const launchGame = () => {
            // Play launching sound
            if (window.soundManager) {
                if (window.soundManager.playDragonEvolve) {
                    window.soundManager.playDragonEvolve();
                } else if (window.soundManager.playFlap) {
                    window.soundManager.playFlap();
                }
            }

            // Punch button scale
            this.tweens.add({
                targets: startBtn,
                scaleX: 0.92,
                scaleY: 0.92,
                duration: 90,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.cameras.main.fade(280, 10, 4, 18, false, (cam, complete) => {
                        if (complete) {
                            this.scene.start('DragonFlightScene', { dragonType: this.selectedDragonType });
                        }
                    });
                }
            });
        };

        startBtn.on('pointerdown', launchGame);

        // Also allow Spacebar or Enter to start
        this.input.keyboard.on('keydown-SPACE', launchGame);
        this.input.keyboard.on('keydown-ENTER', launchGame);

        // Footer version info
        this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT - 65, 'Touch / Swipe / Keyboard Controls Supported', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '15px',
            fontWeight: '500',
            color: '#a8a29e'
        }).setOrigin(0.5, 0.5).setDepth(20);
    }
}

// ------------------------------------------------------------
// 3. THIRD-PERSON 3-LANE FLIGHT SCENE (PORTRAIT 9:16)
// ------------------------------------------------------------
class DragonFlightScene extends Phaser.Scene {
    constructor() {
        super('DragonFlightScene');
    }

    init(data) {
        this.selectedDragonType = (data && data.dragonType) ? data.dragonType : 'fire';
    }

    create() {
        this.stages = DRAGON_FAMILIES[this.selectedDragonType] || DRAGON_STAGES;

        // State
        this.currentStageIndex = 0; // Starts at Baby Form (Stage 1)
        this.currentLane = 1;       // Starts in MIDDLE Lane (0: Left, 1: Middle, 2: Right)
        this.isLaneTransitioning = false;
        this.flightDistance = 0;
        this.hoverTime = 0;
        this.lastAttackTime = 0;
        this.activeFireballs = [];

        // Sheep Food Healing System (Heals Dragon HP & Grants EXP)
        this.sheepList = [];
        this.sheepEaten = 0;
        this.nextSheepSpawnTime = 1600;

        // Dragon RPG Progression: Health, EXP & Upgrades
        this.dragonMaxHp = 500;
        this.dragonHp = 500;
        this.dragonLevel = 1;
        this.maxDragonLevel = 20;
        this.dragonExp = 0;
        this.dragonExpNeeded = this.getExpRequiredForLevel(1);
        this.pendingLevelUps = 0;
        this.isLevelUpPaused = false;

        // Perks & Combat Upgrades
        this.upgrades = {};
        this.bonusDamage = 0;
        this.hpRegenPerSec = 0;
        this.regenTimer = 0;
        this.hasMultiShot = false;
        this.hasMultiLayer = false;
        this.multiShotCount = 0;
        this.hasDoT = false;
        this.dotDamage = 0;
        this.attackCooldownMult = 1.0;
        this.sheepHealBonus = 0;
        this.sheepExpBonus = 0;
        this.armorReduction = 0;

        this.humansKilled = 0;
        this.totalHumansKilled = 0;
        this.isGameOver = false;
        this.invulnerableUntil = 0; // Timestamp based invulnerability (immune to tween interruptions)

        // Super Ability System: Charges with 5 kills!
        this.superCharge = 0;
        this.superMaxCharge = 5;
        this.isSuperActive = false;
        this.superTimer = 0;
        this.superDuration = 3000;
        this.superTickTimer = 0;
        this.superBeamGfx = this.add.graphics().setDepth(23);

        // Baby Dragon Companion Ally (Available from Level 5)
        this.hasBabyCompanion = false;
        this.babyCompanion = null;
        this.babyCompanionLevel = 0;
        this.babyAttackTimer = 0;

        // Human Enemies, Projectiles & Barricades System
        this.humanEnemies = [];
        this.enemyProjectiles = [];
        this.barricades = [];
        this.laneWarnings = [0, 0, 0]; // 500ms attack tell timestamps for lanes 0, 1, 2
        this.nextHumanSpawnTime = 1800;
        this.nextBarricadeSpawnTime = 7000;

        // Dynamic Difficulty & Survival Time System
        this.survivalTime = 0;
        this.currentDangerLevel = 1;

        // Sound manager
        if (window.soundManager) {
            window.soundManager.init();
        }

        // 1. Static Sky & Mountain Backdrop (Portrait 720x1280)
        this.bg = this.add.image(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 'portrait_bg');
        this.bg.setDisplaySize(CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);

        // 2. Pseudo-3D Runway / Canyon Ground Lines (Forward Motion)
        this.groundGraphics = this.add.graphics();
        this.initForwardRunway();

        // 3. Fast Forward Speed Streaks & Embers
        this.createSpeedParticles();

        // 4. Tail Flame / Hydro Splash Particle Emitter
        const isWater = (this.selectedDragonType === 'water');
        const particleKey = isWater ? 'water_droplet' : 'ember';
        this.tailEmitter = this.add.particles(CONFIG.LANE_X[this.currentLane], CONFIG.DRAGON_Y, particleKey, {
            speed: { min: 80, max: 220 },
            angle: { min: 70, max: 110 },
            scale: { start: 1.0, end: 0.1 },
            alpha: { start: 0.95, end: 0 },
            lifespan: 550,
            blendMode: 'ADD',
            frequency: 40
        });
        this.tailEmitter.setDepth(15);

        // 5. Dragon Sprite (Rear View, Centered in Middle Lane)
        const initialStage = this.stages[this.currentStageIndex];
        this.dragon = this.add.sprite(CONFIG.LANE_X[this.currentLane], CONFIG.DRAGON_Y, initialStage.sheetKey);
        this.dragon.setOrigin(0.5, 0.5);
        this.dragon.setScale(initialStage.spriteScale);
        this.dragon.setDepth(20);
        this.dragon.play(`${initialStage.sheetKey}_fly`);

        // 6. Setup Controls (Keyboard + Touch UI + Swipes)
        this.setupKeyboardControls();
        this.setupTouchControls();
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

        // 1. Draw 3-Lane Perspective Guidelines (Spanning the Portrait width)
        const topXs = CONFIG.TOP_DIVIDERS_X;
        const bottomXs = CONFIG.BOTTOM_DIVIDERS_X;
        
        // Magma canyon floor base
        this.groundGraphics.fillStyle(0x180914, 0.92);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(topXs[0] - 15, H_Y);
        this.groundGraphics.lineTo(topXs[3] + 15, H_Y);
        this.groundGraphics.lineTo(bottomXs[3] + 20, B_Y);
        this.groundGraphics.lineTo(bottomXs[0] - 20, B_Y);
        this.groundGraphics.closePath();
        this.groundGraphics.fillPath();

        // Active Lane Glow Floor Highlight under current lane
        const lIdx = this.currentLane;
        const laneLeftBX = bottomXs[lIdx];
        const laneRightBX = bottomXs[lIdx + 1];
        const topLX = topXs[lIdx];
        const topRX = topXs[lIdx + 1];

        this.groundGraphics.fillStyle(0xf97316, 0.16);
        this.groundGraphics.beginPath();
        this.groundGraphics.moveTo(topLX, H_Y);
        this.groundGraphics.lineTo(topRX, H_Y);
        this.groundGraphics.lineTo(laneRightBX, B_Y);
        this.groundGraphics.lineTo(laneLeftBX, B_Y);
        this.groundGraphics.closePath();
        this.groundGraphics.fillPath();

        // Lane Danger Warning Highlight (Red pulsing beam when enemy in lane is about to shoot)
        if (this.laneWarnings) {
            const now = this.time.now;
            for (let l = 0; l < 3; l++) {
                if (this.laneWarnings[l] > now) {
                    const remain = (this.laneWarnings[l] - now) / 500;
                    const pulse = (Math.sin(now * 0.035) * 0.10 + 0.30) * Math.max(0.1, remain);
                    this.groundGraphics.fillStyle(0xef4444, pulse);
                    this.groundGraphics.beginPath();
                    this.groundGraphics.moveTo(topXs[l], H_Y);
                    this.groundGraphics.lineTo(topXs[l + 1], H_Y);
                    this.groundGraphics.lineTo(bottomXs[l + 1], B_Y);
                    this.groundGraphics.lineTo(bottomXs[l], B_Y);
                    this.groundGraphics.closePath();
                    this.groundGraphics.fillPath();
                }
            }
        }

        // Draw Lane Divider Lines
        for (let j = 0; j < bottomXs.length; j++) {
            const bx = bottomXs[j];
            const tx = topXs[j];
            const isOuter = (j === 0 || j === bottomXs.length - 1);

            this.groundGraphics.lineStyle(isOuter ? 5 : 3, isOuter ? 0xf97316 : 0xfb923c, isOuter ? 0.85 : 0.45);
            this.groundGraphics.lineBetween(tx, H_Y, bx, B_Y);
        }

        // 2. Draw Moving Horizontal Magma Ridge Ties
        for (let t of this.runwayTies) {
            const progress = Math.pow(t, 2.2);
            const curY = H_Y + (B_Y - H_Y) * progress;
            const curWidth = 150 + (976 - 150) * progress;
            const curLeft = V_X - curWidth / 2;
            const curRight = V_X + curWidth / 2;

            const alpha = Math.min(1.0, progress * 1.5) * 0.75;
            const thickness = Math.max(2, Math.floor(progress * 8));

            this.groundGraphics.lineStyle(thickness, 0xf97316, alpha);
            this.groundGraphics.lineBetween(curLeft, curY, curRight, curY);

            // Glowing magma dots on lane dividers
            const dotStep = curWidth / 3;
            for (let d = 1; d <= 2; d++) {
                const dotX = curLeft + d * dotStep;
                this.groundGraphics.fillStyle(0xffedd5, alpha);
                this.groundGraphics.fillCircle(dotX, curY, Math.max(2, progress * 6));
            }
        }
    }

    // ------------------------------------------------------------
    // SPEED STREAKS & EMBERS
    // ------------------------------------------------------------
    createSpeedParticles() {
        this.speedParticles = this.add.particles(0, 0, 'ember', {
            x: { min: CONFIG.VANISHING_X - 160, max: CONFIG.VANISHING_X + 160 },
            y: { min: CONFIG.HORIZON_Y + 20, max: CONFIG.HORIZON_Y + 80 },
            speedX: { min: -180, max: 180 },
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
    // 3-LANE MOVEMENT & BANKING PHYSICS
    // ------------------------------------------------------------
    shiftLane(direction) {
        if (this.isGameOver) return;
        const newLane = this.currentLane + direction;
        if (newLane < 0 || newLane > 2) {
            // Screen edge bump recoil
            this.tweens.add({
                targets: this.dragon,
                x: this.dragon.x + direction * 14,
                duration: 60,
                yoyo: true,
                ease: 'Quad.easeInOut'
            });
            return;
        }

        this.currentLane = newLane;
        const targetX = CONFIG.LANE_X[this.currentLane];

        // Sound effect
        if (window.soundManager && window.soundManager.playFlap) {
            window.soundManager.playFlap();
        }

        // Lane Change Horizontal Tween
        this.isLaneTransitioning = true;
        const bankRoll = direction * CONFIG.BANK_ANGLE;

        this.tweens.killTweensOf(this.dragon);

        this.tweens.add({
            targets: this.dragon,
            x: targetX,
            duration: CONFIG.LANE_TWEEN_DURATION,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.isLaneTransitioning = false;
            }
        });

        // Aerodynamic Banking Roll tilt & restore
        this.tweens.add({
            targets: this.dragon,
            rotation: bankRoll,
            duration: CONFIG.LANE_TWEEN_DURATION * 0.45,
            ease: 'Quad.easeOut',
            yoyo: true,
            hold: CONFIG.LANE_TWEEN_DURATION * 0.15,
            onComplete: () => {
                this.dragon.rotation = 0;
            }
        });
    }

    // ------------------------------------------------------------
    // ------------------------------------------------------------
    // FIREBALL ATTACK MECHANICS (BABY / TEEN / MATURE)
    // ------------------------------------------------------------
    attack() {
        if (this.isGameOver || this.isLevelUpPaused) return;
        const now = this.time.now;
        const effectiveCooldown = CONFIG.ATTACK_COOLDOWN * (this.attackCooldownMult || 1.0);
        if (now - this.lastAttackTime < effectiveCooldown) return;
        this.lastAttackTime = now;

        const stage = this.stages[this.currentStageIndex];
        const totalDamage = stage.attackDamage + (this.bonusDamage || 0);

        // 1. Sound & Dragon Recoil animation
        if (window.soundManager && window.soundManager.playFireball) {
            window.soundManager.playFireball(this.currentStageIndex);
        }

        // Quick cast punch
        this.tweens.add({
            targets: this.dragon,
            y: this.dragon.y - 14,
            scaleY: stage.spriteScale * 1.06,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.dragon.setScale(stage.spriteScale);
            }
        });

        // 1. Primary projectile in dragon's current lane
        this.fireSingleProjectile(stage, this.currentLane, totalDamage);

        // 2. Multi-Shot Barrage: +1 extra projectile per multishot upgrade in current lane
        // 1 upgrade = 2 shots total, 2 upgrades = 3 shots total, 3 upgrades = 4 shots total, etc.
        const extraShots = this.multiShotCount || (this.upgrades && (this.upgrades.multishot || this.upgrades.multi_layer)) || 0;
        if (extraShots > 0) {
            const burstDmg = Math.round(totalDamage * 0.65);
            const delayStep = Math.max(55, Math.round(180 / Math.max(2, extraShots)));
            for (let i = 1; i <= extraShots; i++) {
                this.time.delayedCall(i * delayStep, () => {
                    if (this.isGameOver || !this.dragon || !this.dragon.active) return;
                    this.fireSingleProjectile(stage, this.currentLane, burstDmg);
                });
            }
        }
    }

    fireSingleProjectile(stage, targetLane, damage) {
        const startY = this.dragon.y - stage.mouthOffsetY;
        const t = Math.max(0, (startY - CONFIG.HORIZON_Y) / (CONFIG.DRAGON_Y - CONFIG.HORIZON_Y));
        const laneCenterX = CONFIG.LANE_X[targetLane];
        const startX = CONFIG.VANISHING_X + (laneCenterX - CONFIG.VANISHING_X) * t;

        const fireball = this.add.sprite(startX, startY, stage.fireballKey);
        fireball.setDepth(22);
        fireball.setScale(stage.fireballScale);
        fireball.setOrigin(0.5, 0.5);
        fireball.lane = targetLane;
        fireball.damage = damage;
        this.activeFireballs.push(fireball);

        // Muzzle spawn spark flash
        const isWater = (stage && stage.element === 'water') || (this.selectedDragonType === 'water');
        const particleKey = isWater ? 'water_droplet' : 'ember';
        const spawnBurst = this.add.particles(startX, startY, particleKey, {
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

        // Target vanishing point along current flight lane into distance
        const endLaneX = CONFIG.TOP_LANE_X[targetLane];
        const endY = CONFIG.HORIZON_Y - 40;

        // Perspective trajectory angle (0 in center lane, subtle tilt along converging lane lines in left/right lanes)
        const laneAngle = Math.atan2(endLaneX - startX, startY - endY);
        if (isWater) {
            fireball.setRotation(laneAngle);
        }

        // 3. Perspective Flight Tween (Shrinks into distance)
        const flightTween = {
            targets: fireball,
            x: endLaneX,
            y: endY,
            scaleX: 0.14,
            scaleY: 0.14,
            duration: stage.fireballSpeed,
            ease: 'Quad.easeIn',
            onComplete: () => {
                if (fireball.active) {
                    const idx = this.activeFireballs.indexOf(fireball);
                    if (idx !== -1) this.activeFireballs.splice(idx, 1);
                    fireball.destroy();
                }
            }
        };

        if (!isWater) {
            flightTween.rotation = Math.PI * 4;
        } else {
            // Water balls do not spin at all (0 degree spin rate; stays static at lane trajectory angle)
            flightTween.rotation = laneAngle;
        }

        this.tweens.add(flightTween);
    }

    consumeFireball(fb) {
        if (!fb || !fb.active) return;
        this.tweens.killTweensOf(fb);
        const idx = this.activeFireballs.indexOf(fb);
        if (idx !== -1) {
            this.activeFireballs.splice(idx, 1);
        }
        fb.destroy();
    }

    createFireballExplosion(x, y, stage) {
        const isWater = (stage && stage.element === 'water') || (this.selectedDragonType === 'water');
        const shockColor = isWater ? 0x38bdf8 : 0xf97316;
        const particleKey = isWater ? 'water_droplet' : 'ember';

        // Impact Shockwave Ring
        const shock = this.add.circle(x, y, 14, shockColor, 0.85);
        shock.setDepth(23);
        this.tweens.add({
            targets: shock,
            alpha: 0,
            scaleX: stage.stage * 1.8,
            scaleY: stage.stage * 1.8,
            duration: 220,
            onComplete: () => shock.destroy()
        });

        // Fiery or Hydro burst particles
        const burst = this.add.particles(x, y, particleKey, {
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

        // Super Ability hotkeys: E, F, or Shift
        this.input.keyboard.on('keydown-E', () => this.activateSuperAbility());
        this.input.keyboard.on('keydown-F', () => this.activateSuperAbility());
        this.input.keyboard.on('keydown-SHIFT', () => this.activateSuperAbility());
    }

    // ------------------------------------------------------------
    // TOUCH, TAP & MOBILE SWIPE CONTROLS
    // ------------------------------------------------------------
    setupTouchControls() {
        let touchStartX = null;
        let touchStartY = null;
        let touchStartTime = 0;

        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < 160 || pointer.y > CONFIG.GAME_HEIGHT - 170) return;
            touchStartX = pointer.x;
            touchStartY = pointer.y;
            touchStartTime = this.time.now;
        });

        this.input.on('pointerup', (pointer) => {
            if (touchStartX === null) return;
            const dx = pointer.x - touchStartX;
            const dy = pointer.y - touchStartY;
            const dt = this.time.now - touchStartTime;
            const sx = touchStartX;
            touchStartX = null;

            // Swipe gesture to steer
            if (dt < 400 && Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.1) {
                if (dx < 0) {
                    this.shiftLane(-1);
                } else {
                    this.shiftLane(+1);
                }
                return;
            }

            // Quick Tap on runway to steer or attack
            if (dt < 300 && Math.abs(dx) < 25 && Math.abs(dy) < 25) {
                if (sx < CONFIG.GAME_WIDTH * 0.33) {
                    this.shiftLane(-1);
                } else if (sx > CONFIG.GAME_WIDTH * 0.67) {
                    this.shiftLane(+1);
                } else {
                    this.attack();
                }
            }
        });
    }

    // ------------------------------------------------------------
    // TOP EVOLUTION SELECTOR BAR (Portrait 720w)
    // ------------------------------------------------------------
    createTopEvolutionBar() {
        const topBarW = 540;
        const topBarH = 70;
        const barY = 60;

        const barContainer = this.add.container(CONFIG.GAME_WIDTH / 2, barY).setDepth(35);

        const barBg = this.add.graphics();
        barBg.fillStyle(0x0a0812, 0.88);
        barBg.fillRoundedRect(-topBarW / 2, -topBarH / 2, topBarW, topBarH, 22);
        barBg.lineStyle(2.5, 0xf97316, 0.65);
        barBg.strokeRoundedRect(-topBarW / 2, -topBarH / 2, topBarW, topBarH, 22);
        barContainer.add(barBg);

        this.stageButtons = [];
        const btnW = 155;
        const btnH = 52;
        const spacing = 170;

        this.stages.forEach((stage, idx) => {
            const btnX = (idx - 1) * spacing;
            const container = this.add.container(btnX, 0);

            const bg = this.add.graphics();
            container.add(bg);

            const label = this.add.text(0, -7, `${stage.icon} ${stage.shortName}`, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                letterSpacing: 1
            }).setOrigin(0.5, 0.5);
            container.add(label);

            const subLabel = this.add.text(0, 13, (idx === 0) ? 'Lv. 1' : (idx === 1) ? 'Lv. 5' : 'Lv. 10', {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#fed7aa'
            }).setOrigin(0.5, 0.5);
            container.add(subLabel);

            container.setSize(btnW, btnH);
            container.setInteractive({ useHandCursor: true });

            container.on('pointerdown', () => {
                if (idx > this.currentStageIndex) {
                    const req = (idx === 1) ? 5 : 10;
                    this.createFloatingFoodNotice(CONFIG.GAME_WIDTH / 2, 220, `🔒 Unlocks at Level ${req}! Slay enemies!`);
                } else {
                    this.createFloatingFoodNotice(CONFIG.GAME_WIDTH / 2, 220, `✨ ${stage.name} Active!`);
                }
            });

            barContainer.add(container);
            this.stageButtons.push({ container, bg, label, subLabel, stage, idx, w: btnW, h: btnH });
        });

        this.updateStageUI();

        // 🏠 Return to Main Menu Button (Top Left)
        const homeBtn = this.add.container(48, barY).setDepth(36);
        const homeBg = this.add.graphics();
        homeBg.fillStyle(0x0a0812, 0.9);
        homeBg.fillRoundedRect(-32, -26, 64, 52, 16);
        homeBg.lineStyle(2, 0xf97316, 0.7);
        homeBg.strokeRoundedRect(-32, -26, 64, 52, 16);
        homeBtn.add(homeBg);

        const homeIcon = this.add.text(0, -1, '🏠', {
            fontSize: '24px'
        }).setOrigin(0.5, 0.5);
        homeBtn.add(homeIcon);

        homeBtn.setSize(64, 52);
        homeBtn.setInteractive({ useHandCursor: true });
        homeBtn.on('pointerdown', () => {
            if (window.soundManager && window.soundManager.playFlap) {
                window.soundManager.playFlap();
            }
            this.cameras.main.fade(200, 10, 4, 18, false, (cam, complete) => {
                if (complete) {
                    this.scene.start('MainMenuScene');
                }
            });
        });

        // ⏱️ Danger & Survival Timer Capsule (Top Right)
        this.createSurvivalTimerUI(barY);
    }

    createSurvivalTimerUI(barY) {
        const timerContainer = this.add.container(CONFIG.GAME_WIDTH - 54, barY).setDepth(36);
        const timerBg = this.add.graphics();
        timerBg.fillStyle(0x0a0812, 0.9);
        timerBg.fillRoundedRect(-38, -26, 76, 52, 16);
        timerBg.lineStyle(2, 0xf97316, 0.7);
        timerBg.strokeRoundedRect(-38, -26, 76, 52, 16);
        timerContainer.add(timerBg);

        this.timerText = this.add.text(0, -7, '00:00', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '15px',
            color: '#ffffff',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        timerContainer.add(this.timerText);

        this.dangerLevelText = this.add.text(0, 12, 'LVL 1', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '12px',
            color: '#fde047',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        timerContainer.add(this.dangerLevelText);
        this.timerBg = timerBg;
    }

    updateSurvivalTimerUI() {
        if (!this.timerText) return;
        const totalSec = Math.floor(this.survivalTime / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        this.timerText.setText(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);

        // Danger escalates every 30 seconds
        const newLvl = 1 + Math.floor(totalSec / 30);
        if (newLvl !== this.currentDangerLevel) {
            this.currentDangerLevel = newLvl;
            this.dangerLevelText.setText(`LVL ${newLvl}`);
            if (newLvl >= 3) {
                this.dangerLevelText.setColor('#ef4444');
            } else if (newLvl >= 2) {
                this.dangerLevelText.setColor('#f97316');
            }
            this.triggerDangerEscalation(newLvl);
        }
    }

    triggerDangerEscalation(level) {
        if (this.isGameOver) return;
        if (window.soundManager && window.soundManager.playEnemyWindup) {
            window.soundManager.playEnemyWindup('mage');
        }

        // Pulse the timer badge with alert glow
        if (this.timerBg) {
            this.timerBg.clear();
            this.timerBg.fillStyle(0x3a0808, 0.95);
            this.timerBg.fillRoundedRect(-38, -26, 76, 52, 16);
            this.timerBg.lineStyle(2, 0xef4444, 0.95);
            this.timerBg.strokeRoundedRect(-38, -26, 76, 52, 16);
            this.time.delayedCall(800, () => {
                if (!this.timerBg) return;
                this.timerBg.clear();
                this.timerBg.fillStyle(0x0a0812, 0.9);
                this.timerBg.fillRoundedRect(-38, -26, 76, 52, 16);
                this.timerBg.lineStyle(2, 0xf97316, 0.7);
                this.timerBg.strokeRoundedRect(-38, -26, 76, 52, 16);
            });
        }

        // Cinematic Alert Toast Banner across upper screen
        const bannerW = 560;
        const bannerH = 74;
        const banner = this.add.container(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT * 0.35).setDepth(45);

        const bBg = this.add.graphics();
        bBg.fillStyle(0x180505, 0.94);
        bBg.fillRoundedRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 20);
        bBg.lineStyle(2.5, 0xef4444, 0.95);
        bBg.strokeRoundedRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 20);
        banner.add(bBg);

        const bTitle = this.add.text(0, -12, `⚠️ ENEMY REINFORCEMENTS: LEVEL ${level}!`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '22px',
            color: '#f87171',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        banner.add(bTitle);

        const bSub = this.add.text(0, 16, `Enemies now deal ${100 + (level - 1) * 25} DMG & grant higher EXP!`, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fed7aa',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        banner.add(bSub);

        banner.setScale(0.8);
        banner.setAlpha(0);
        this.tweens.add({
            targets: banner,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 250,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(1600, () => {
                    this.tweens.add({
                        targets: banner,
                        alpha: 0,
                        y: banner.y - 30,
                        duration: 300,
                        onComplete: () => banner.destroy()
                    });
                });
            }
        });
    }

    // ------------------------------------------------------------
    // RPG HEALTH, EXP & EVOLUTION STATUS CAPSULE
    // ------------------------------------------------------------
    createFoodEvolutionMeter() {
        const meterW = 560;
        const meterH = 68;
        const meterY = 132;

        this.foodMeterContainer = this.add.container(CONFIG.GAME_WIDTH / 2, meterY).setDepth(35);

        this.foodMeterBg = this.add.graphics();
        this.foodMeterBg.fillStyle(0x0a0514, 0.94);
        this.foodMeterBg.fillRoundedRect(-meterW / 2, -meterH / 2, meterW, meterH, 20);
        this.foodMeterBg.lineStyle(2, 0xf97316, 0.7);
        this.foodMeterBg.strokeRoundedRect(-meterW / 2, -meterH / 2, meterW, meterH, 20);
        this.foodMeterContainer.add(this.foodMeterBg);

        // HP Bar Fill Graphics
        this.hpBarGfx = this.add.graphics();
        this.foodMeterContainer.add(this.hpBarGfx);

        // HP Bar Text
        this.hpBarText = this.add.text(0, -15, '', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#180702',
            strokeThickness: 3,
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        this.foodMeterContainer.add(this.hpBarText);

        // EXP Bar Fill Graphics
        this.expBarGfx = this.add.graphics();
        this.foodMeterContainer.add(this.expBarGfx);

        // EXP Bar Text
        this.expBarText = this.add.text(0, 16, '', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '14px',
            color: '#fde047',
            stroke: '#180702',
            strokeThickness: 3,
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        this.foodMeterContainer.add(this.expBarText);

        // Active Perks Tray (just under capsule at Y = 180)
        this.perksText = this.add.text(CONFIG.GAME_WIDTH / 2, 180, '', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#fed7aa',
            stroke: '#0e0414',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5).setDepth(35);

        this.updateFoodEvolutionMeter();
    }

    updateFoodEvolutionMeter() {
        if (!this.hpBarText || !this.expBarText) return;

        const meterW = 560;
        const barInnerW = meterW - 32;

        // 1. Health Bar
        const hpRatio = Math.max(0, Math.min(1.0, this.dragonHp / this.dragonMaxHp));
        this.hpBarGfx.clear();
        // Inner track
        this.hpBarGfx.fillStyle(0x240508, 0.9);
        this.hpBarGfx.fillRoundedRect(-barInnerW / 2, -26, barInnerW, 22, 6);
        // Fill
        const hpColor = (hpRatio > 0.5) ? 0x22c55e : (hpRatio > 0.25) ? 0xf59e0b : 0xef4444;
        this.hpBarGfx.fillStyle(hpColor, 0.95);
        this.hpBarGfx.fillRoundedRect(-barInnerW / 2, -26, barInnerW * hpRatio, 22, 6);

        this.hpBarText.setText(`❤️ HP: ${this.dragonHp} / ${this.dragonMaxHp} (${Math.round(hpRatio * 100)}%)`);

        // 2. EXP Bar
        const expNeeded = this.dragonExpNeeded || 100;
        const expRatio = (this.dragonLevel >= this.maxDragonLevel) ? 1.0 : Math.max(0, Math.min(1.0, this.dragonExp / expNeeded));
        this.expBarGfx.clear();
        // Inner track
        this.expBarGfx.fillStyle(0x0e0624, 0.9);
        this.expBarGfx.fillRoundedRect(-barInnerW / 2, 6, barInnerW, 20, 6);
        // Fill
        this.expBarGfx.fillStyle(0xf59e0b, 0.95);
        this.expBarGfx.fillRoundedRect(-barInnerW / 2, 6, barInnerW * expRatio, 20, 6);

        if (this.dragonLevel >= this.maxDragonLevel) {
            this.expBarText.setText(`👑 LEVEL 20 (MAX) • APEX DRAGON`);
        } else {
            const nextGoal = (this.dragonLevel < 5) ? `➔ Teen at Lv.5` : (this.dragonLevel < 10) ? `➔ Mature at Lv.10` : `★ Max at Lv.20`;
            this.expBarText.setText(`⭐ LV. ${this.dragonLevel} • EXP: ${this.dragonExp} / ${expNeeded} (${nextGoal})`);
        }

        // 3. Active Upgrades Tray
        if (this.perksText) {
            const perksList = [];
            if (this.bonusDamage > 0) perksList.push(`⚔️+${this.bonusDamage}`);
            const extraShots = this.multiShotCount || (this.upgrades && (this.upgrades.multishot || this.upgrades.multi_layer)) || 0;
            if (extraShots > 0) perksList.push(`⚡Multi-Shot (${extraShots + 1}x)`);
            if (this.hasDoT) perksList.push(`🔥DoT(${this.dotDamage})`);
            if (this.hpRegenPerSec > 0) perksList.push(`💚${this.hpRegenPerSec}/s`);
            if (this.attackCooldownMult < 1.0) perksList.push(`⏩Rapid`);
            if (this.armorReduction > 0) perksList.push(`🛡️-${Math.round(this.armorReduction * 100)}% DMG`);
            if (this.sheepHealBonus > 0) perksList.push(`🍖Feast`);

            if (perksList.length > 0) {
                this.perksText.setText(`PERKS: ${perksList.join(' • ')}`);
                this.perksText.setVisible(true);
            } else {
                this.perksText.setText(`DEFEAT ENEMIES & EAT SHEEP TO LEVEL UP!`);
                this.perksText.setVisible(true);
            }
        }
    }

    // ------------------------------------------------------------
    // BOTTOM CONTROLS: [ ◀ LEFT ]  [ 🔥 ATTACK ]  [ RIGHT ▶ ]
    // ------------------------------------------------------------
    createBottomControls() {
        const btnY = 1170;
        const navBtnW = 180;
        const navBtnH = 96;

        // 1. Left Arrow Button (Bottom-Left)
        this.btnLeft = this.createDirectionButton(125, btnY, '◀ LEFT', -1, navBtnW, navBtnH);

        // 2. Attack Button (Bottom-Middle)
        const atkBtnW = 240;
        const atkBtnH = 100;
        const atkLabel = (this.selectedDragonType === 'water') ? '🌊 ATTACK' : '🔥 ATTACK';
        this.btnAttack = this.createAttackButton(CONFIG.GAME_WIDTH / 2, btnY, atkLabel, atkBtnW, atkBtnH);

        // 3. Right Arrow Button (Bottom-Right)
        this.btnRight = this.createDirectionButton(CONFIG.GAME_WIDTH - 125, btnY, 'RIGHT ▶', +1, navBtnW, navBtnH);

        // 4. Super Ability Button (Circular gauge above Right button)
        this.btnSuper = this.createSuperAbilityButton(595, 1045);
    }

    createDirectionButton(x, y, labelText, direction, w, h) {
        const container = this.add.container(x, y).setDepth(35);

        const bg = this.add.graphics();
        bg.fillStyle(0x0e0816, 0.88);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 22);
        bg.lineStyle(3, 0xf97316, 0.8);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 22);
        container.add(bg);

        const text = this.add.text(0, 0, labelText, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '26px',
            color: '#ffffff',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        container.add(text);

        container.setSize(w, h);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            bg.clear();
            bg.fillStyle(0xf97316, 0.95);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 22);
            bg.lineStyle(3, 0xffedd5, 1);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 22);
            text.setColor('#180702');

            this.shiftLane(direction);
        });

        const resetBtn = () => {
            bg.clear();
            bg.fillStyle(0x0e0816, 0.88);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 22);
            bg.lineStyle(3, 0xf97316, 0.8);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 22);
            text.setColor('#ffffff');
        };

        container.on('pointerup', resetBtn);
        container.on('pointerout', resetBtn);

        return container;
    }

    createAttackButton(x, y, labelText, w, h) {
        const container = this.add.container(x, y).setDepth(35);

        const bg = this.add.graphics();
        bg.fillStyle(0x8a1808, 0.92);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
        bg.lineStyle(3.5, 0xf97316, 0.95);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
        container.add(bg);

        const text = this.add.text(0, 0, labelText, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '30px',
            color: '#ffedd5',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        container.add(text);

        container.setSize(w, h);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            bg.clear();
            bg.fillStyle(0xf97316, 1);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
            bg.lineStyle(3.5, 0xffedd5, 1);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
            text.setColor('#180702');

            container.setScale(0.96);
            this.attack();
        });

        const resetBtn = () => {
            bg.clear();
            bg.fillStyle(0x8a1808, 0.92);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
            bg.lineStyle(3.5, 0xf97316, 0.95);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
            text.setColor('#ffedd5');
            container.setScale(1.0);
        };

        container.on('pointerup', resetBtn);
        container.on('pointerout', resetBtn);

        return container;
    }

    // ------------------------------------------------------------
    // ☄️ SUPER ABILITY SYSTEM: CIRCULAR BUTTON & LANE-CLEARING BEAM
    // ------------------------------------------------------------
    createSuperAbilityButton(x, y) {
        const container = this.add.container(x, y).setDepth(36);
        const radius = 38;

        const bgGfx = this.add.graphics();
        container.add(bgGfx);

        const progressGfx = this.add.graphics();
        container.add(progressGfx);

        const isWater = (this.selectedDragonType === 'water');
        const iconEmoji = isWater ? '🌊' : '🔥';

        const iconText = this.add.text(0, -9, iconEmoji, {
            fontSize: '26px'
        }).setOrigin(0.5, 0.5);
        container.add(iconText);

        const subText = this.add.text(0, 14, `0/${this.superMaxCharge}`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '13px',
            color: '#cbd5e1'
        }).setOrigin(0.5, 0.5);
        container.add(subText);

        const tagText = this.add.text(0, -radius - 12, 'SUPER (E)', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '11px',
            fontWeight: 'bold',
            color: isWater ? '#38bdf8' : '#fb923c'
        }).setOrigin(0.5, 0.5);
        container.add(tagText);

        container.setSize(radius * 2, radius * 2);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            this.activateSuperAbility();
        });

        this.superBtnElements = {
            container,
            bgGfx,
            progressGfx,
            iconText,
            subText,
            tagText,
            radius,
            pulseTween: null
        };

        this.updateSuperButtonUI();
        return container;
    }

    updateSuperButtonUI() {
        if (!this.superBtnElements) return;
        const { bgGfx, progressGfx, subText, tagText, radius, container } = this.superBtnElements;
        const isWater = (this.selectedDragonType === 'water');
        const accentColor = isWater ? 0x38bdf8 : 0xf97316;
        const goldColor = 0xfde047;

        bgGfx.clear();
        progressGfx.clear();

        // Base circle
        bgGfx.fillStyle(0x0e0816, 0.92);
        bgGfx.fillCircle(0, 0, radius);
        bgGfx.lineStyle(2.5, 0x334155, 0.7);
        bgGfx.strokeCircle(0, 0, radius);

        if (this.isSuperActive) {
            // Active countdown mode!
            const remainingSec = Math.max(0, this.superTimer / 1000).toFixed(1);
            subText.setText(`${remainingSec}s`).setColor('#ffffff');
            tagText.setText('FIRING!').setColor(isWater ? '#38bdf8' : '#f87171');

            const ratio = Math.max(0, this.superTimer / this.superDuration);
            progressGfx.lineStyle(4.5, isWater ? 0x38bdf8 : 0xf97316, 1);
            progressGfx.beginPath();
            progressGfx.arc(0, 0, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * ratio), false);
            progressGfx.strokePath();
        } else if (this.superCharge >= this.superMaxCharge) {
            // Full charge ready mode!
            subText.setText('READY!').setColor('#fde047');
            tagText.setText('TAP SUPER!').setColor('#fde047');

            // Golden glowing complete circle
            progressGfx.lineStyle(4.5, goldColor, 1);
            progressGfx.strokeCircle(0, 0, radius);

            if (!this.superBtnElements.pulseTween) {
                this.superBtnElements.pulseTween = this.tweens.add({
                    targets: container,
                    scaleX: 1.10,
                    scaleY: 1.10,
                    duration: 400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        } else {
            // Charging mode (e.g. 1/3, 2/3)
            if (this.superBtnElements.pulseTween) {
                this.superBtnElements.pulseTween.stop();
                this.superBtnElements.pulseTween = null;
                container.setScale(1.0);
            }
            subText.setText(`${this.superCharge}/${this.superMaxCharge}`).setColor('#cbd5e1');
            tagText.setText('SUPER (E)').setColor(isWater ? '#38bdf8' : '#fb923c');

            const ratio = this.superCharge / this.superMaxCharge;
            if (ratio > 0) {
                progressGfx.lineStyle(4, accentColor, 0.95);
                progressGfx.beginPath();
                progressGfx.arc(0, 0, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * ratio), false);
                progressGfx.strokePath();
            }
        }
    }

    addSuperCharge(amt = 1) {
        if (this.isSuperActive) return;
        const prev = this.superCharge || 0;
        this.superCharge = Math.min(this.superMaxCharge, prev + amt);
        this.updateSuperButtonUI();
        if (prev < this.superMaxCharge && this.superCharge >= this.superMaxCharge) {
            if (window.soundManager && window.soundManager.playSuperReady) {
                window.soundManager.playSuperReady();
            }
            this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 100, '⚡ SUPER ABILITY READY! (TAP OR PRESS E) ⚡');
        }
    }

    activateSuperAbility() {
        if (this.isSuperActive || this.isGameOver || this.isLevelUpPaused) return;
        if (this.superCharge < this.superMaxCharge) {
            const need = this.superMaxCharge - this.superCharge;
            this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 80, `⚡ Need ${need} more kill${need > 1 ? 's' : ''}!`);
            return;
        }

        this.superCharge = 0;
        this.isSuperActive = true;
        this.superTimer = this.superDuration;
        this.superTickTimer = 0;

        const isWater = (this.selectedDragonType === 'water');
        if (window.soundManager && window.soundManager.playSuperAbility) {
            window.soundManager.playSuperAbility(isWater);
        }

        const bannerText = isWater ? '🌊 TIDAL TSUNAMI UNLEASHED! 🌊' : '🔥 INFERNO BREATH UNLEASHED! 🔥';
        this.createFloatingFoodNotice(CONFIG.GAME_WIDTH / 2, 240, bannerText);
        this.cameras.main.shake(250, 0.012);

        this.updateSuperButtonUI();
    }

    updateSuperAbility(delta) {
        if (!this.isSuperActive) {
            if (this.superBeamGfx) {
                this.superBeamGfx.clear();
            }
            return;
        }

        this.superTimer -= delta;
        this.updateSuperButtonUI();

        if (this.superTimer <= 0) {
            this.isSuperActive = false;
            this.superTimer = 0;
            if (this.superBeamGfx) this.superBeamGfx.clear();
            this.updateSuperButtonUI();
            this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 70, '✨ Super Ended');
            return;
        }

        // Draw Super Beam in currentLane
        const stage = this.stages[this.currentStageIndex];
        const isWater = (stage && stage.element === 'water') || (this.selectedDragonType === 'water');
        const startX = this.dragon.x;
        const startY = this.dragon.y - stage.mouthOffsetY;
        const endX = CONFIG.TOP_LANE_X[this.currentLane];
        const endY = CONFIG.HORIZON_Y;

        if (this.superBeamGfx) {
            this.superBeamGfx.clear();

            // 1. Broad outer aura beam
            const outerAlpha = 0.35 + Math.sin(this.time.now * 0.02) * 0.15;
            this.superBeamGfx.lineStyle(56, isWater ? 0x0284c7 : 0xef4444, outerAlpha);
            this.superBeamGfx.lineBetween(startX, startY, endX, endY);

            // 2. Vibrant core beam
            this.superBeamGfx.lineStyle(30, isWater ? 0x38bdf8 : 0xf97316, 0.85);
            this.superBeamGfx.lineBetween(startX, startY, endX, endY);

            // 3. Blazing center laser
            this.superBeamGfx.lineStyle(12, isWater ? 0xe0f2fe : 0xffedd5, 0.95);
            this.superBeamGfx.lineBetween(startX, startY, endX, endY);

            // Mouth burst blast
            this.superBeamGfx.fillStyle(isWater ? 0x38bdf8 : 0xfde047, 0.7);
            this.superBeamGfx.fillCircle(startX, startY, 28 + Math.sin(this.time.now * 0.03) * 6);
        }

        // Particle stream rushing down lane
        const particleKey = isWater ? 'water_droplet' : 'ember';
        if (Math.random() < 0.65) {
            const burstX = startX + (Math.random() - 0.5) * 30;
            const burstY = startY - Math.random() * 80;
            const p = this.add.particles(burstX, burstY, particleKey, {
                speed: { min: 250, max: 550 },
                angle: { min: -105, max: -75 },
                scale: { start: 0.9, end: 0.1 },
                alpha: { start: 1, end: 0 },
                lifespan: 280,
                blendMode: 'ADD'
            });
            this.time.delayedCall(300, () => p.destroy());
        }

        // Continuous subtle rumble
        if (Math.random() < 0.3) {
            this.cameras.main.shake(60, 0.003);
        }

        // Periodic tick execution (every 90ms)
        this.superTickTimer = (this.superTickTimer || 0) + delta;
        if (this.superTickTimer >= 90) {
            this.superTickTimer -= 90;
            this.executeSuperTickDamage(stage, isWater);
        }
    }

    executeSuperTickDamage(stage, isWater) {
        const lane = this.currentLane;
        const tickDmg = Math.round((stage.attackDamage + (this.bonusDamage || 0)) * 0.35);

        // 1. Damage all enemies in this lane
        for (let i = this.humanEnemies.length - 1; i >= 0; i--) {
            const enemy = this.humanEnemies[i];
            if (enemy && enemy.active && enemy.lane === lane && enemy.progress >= 0.02 && enemy.progress <= 1.05) {
                enemy.hp -= tickDmg;
                this.updateEnemyHpBar(enemy);
                this.createHitSparks(enemy.container.x, enemy.container.y);
                if (enemy.hp <= 0) {
                    this.defeatHumanEnemy(enemy, i);
                }
            }
        }

        // 2. Smash all barricades/traps in this lane!
        for (let i = this.barricades.length - 1; i >= 0; i--) {
            const bar = this.barricades[i];
            if (bar && !bar.smashed && bar.lane === lane && bar.progress >= 0.02 && bar.progress <= 1.05) {
                this.smashBarricade(bar, i, true);
            }
        }

        // 3. Destroy all incoming enemy projectiles in this lane!
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = this.enemyProjectiles[i];
            if (proj && proj.active && proj.lane === lane && proj.progress <= 1.05) {
                this.destroyEnemyProjectile(proj, i);
            }
        }

        // 4. Roast any sheep in this lane
        for (let i = this.sheepList.length - 1; i >= 0; i--) {
            const sheep = this.sheepList[i];
            if (sheep && sheep.active && !sheep.eaten && sheep.lane === lane) {
                this.roastSheepWithFireball(sheep, i, null);
            }
        }
    }

    destroyEnemyProjectile(proj, index) {
        if (!proj) return;
        proj.active = false;
        if (index !== undefined && index !== -1) {
            this.enemyProjectiles.splice(index, 1);
        } else {
            const idx = this.enemyProjectiles.indexOf(proj);
            if (idx !== -1) this.enemyProjectiles.splice(idx, 1);
        }
        const px = (proj.x !== undefined) ? proj.x : (proj.container ? proj.container.x : 0);
        const py = (proj.y !== undefined) ? proj.y : (proj.container ? proj.container.y : 0);
        this.createHitSparks(px, py);
        if (proj.container && typeof proj.container.destroy === 'function') {
            proj.container.destroy();
        }
        if (typeof proj.destroy === 'function') {
            proj.destroy();
        }
    }

    // ------------------------------------------------------------
    // 🐲 BABY DRAGON COMPANION SYSTEM (Unlocked from Level 5)
    // ------------------------------------------------------------
    spawnOrUpdateBabyCompanion() {
        if (!this.hasBabyCompanion) return;

        const isWater = (this.selectedDragonType === 'water');
        const babySheet = isWater ? 'water_rear_baby' : 'dragon_rear_baby';
        const babyAnim = isWater ? 'water_rear_baby_fly' : 'dragon_rear_baby_fly';
        const targetScale = isWater ? 0.52 : 0.46;

        if (this.babyCompanion && this.babyCompanion.active) {
            this.createHitSparks(this.babyCompanion.x, this.babyCompanion.y);
            this.createFloatingFoodNotice(this.babyCompanion.x, this.babyCompanion.y - 40, `✨ HATCHLING LV.${this.babyCompanionLevel}!`);
            return;
        }

        const startX = this.dragon ? (this.dragon.x + 52) : (CONFIG.LANE_X[this.currentLane] + 52);
        const startY = this.dragon ? (this.dragon.y - 18) : (CONFIG.DRAGON_Y - 18);

        this.babyCompanion = this.add.sprite(startX, startY, babySheet);
        this.babyCompanion.setOrigin(0.5, 0.5);
        this.babyCompanion.setScale(0.1);
        this.babyCompanion.setDepth(21);

        if (this.anims.exists(babyAnim)) {
            this.babyCompanion.play(babyAnim);
        }

        this.createHitSparks(startX, startY);
        this.createFloatingFoodNotice(startX, startY - 45, '🐲 BABY DRAGON ALLY JOINED!');

        this.tweens.add({
            targets: this.babyCompanion,
            scaleX: targetScale,
            scaleY: targetScale,
            duration: 350,
            ease: 'Back.easeOut'
        });
    }

    updateBabyCompanion(delta, time) {
        if (!this.hasBabyCompanion || !this.babyCompanion || !this.babyCompanion.active || !this.dragon || !this.dragon.active) return;

        // Position: floats beside the player dragon (swaps side in lane 2 to stay on screen)
        const offsetX = (this.currentLane === 2) ? -54 : 54;
        const hoverY = Math.sin(time * 0.005) * 6;
        const targetX = this.dragon.x + offsetX;
        const targetY = this.dragon.y - 16 + hoverY;

        this.babyCompanion.x = Phaser.Math.Linear(this.babyCompanion.x, targetX, 0.16);
        this.babyCompanion.y = Phaser.Math.Linear(this.babyCompanion.y, targetY, 0.16);
        this.babyCompanion.alpha = this.dragon.alpha;

        // Auto-attack nearest enemy on the lane the user dragon is on
        const attackInterval = Math.max(750, 1400 - ((this.babyCompanionLevel || 1) - 1) * 320);
        this.babyAttackTimer = (this.babyAttackTimer || 0) + delta;

        if (this.babyAttackTimer >= attackInterval) {
            const enemiesInLane = this.humanEnemies.filter(e => 
                e && e.active && e.lane === this.currentLane && e.progress >= 0.04 && e.progress <= 0.96
            );

            if (enemiesInLane.length > 0) {
                // Nearest to dragon is highest progress (closer to bottom of screen)
                enemiesInLane.sort((a, b) => b.progress - a.progress);
                const target = enemiesInLane[0];
                this.babyAttackTimer = 0;
                this.fireBabyCompanionProjectile(target);
            }
        }
    }

    fireBabyCompanionProjectile(target) {
        if (!this.babyCompanion || !this.babyCompanion.active) return;
        const babyStage = this.stages[0];
        const isWater = (this.selectedDragonType === 'water');
        const startX = this.babyCompanion.x;
        const startY = this.babyCompanion.y - 25;
        const targetLane = this.currentLane;
        const damage = Math.round(75 + ((this.babyCompanionLevel || 1) - 1) * 35);

        const fireball = this.add.sprite(startX, startY, babyStage.fireballKey);
        fireball.setDepth(22);
        fireball.setScale(babyStage.fireballScale * 0.72);
        fireball.setOrigin(0.5, 0.5);
        fireball.lane = targetLane;
        fireball.damage = damage;
        fireball.isBabyFireball = true;
        this.activeFireballs.push(fireball);

        const particleKey = isWater ? 'water_droplet' : 'ember';
        const spawnBurst = this.add.particles(startX, startY, particleKey, {
            speed: { min: 40, max: 100 },
            scale: { start: 0.35, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 180,
            blendMode: 'ADD',
            emitting: false
        });
        spawnBurst.setDepth(23);
        spawnBurst.explode(6, startX, startY);
        this.time.delayedCall(200, () => spawnBurst.destroy());

        const endLaneX = CONFIG.TOP_LANE_X[targetLane];
        const endY = CONFIG.HORIZON_Y - 40;

        if (isWater) {
            const laneAngle = Math.atan2(endLaneX - startX, startY - endY);
            fireball.setRotation(laneAngle);
        }

        this.tweens.add({
            targets: this.babyCompanion,
            y: this.babyCompanion.y + 6,
            duration: 60,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        if (window.soundManager && window.soundManager.playShoot) {
            window.soundManager.playShoot();
        }

        const flightDuration = Math.round(520 / (babyStage.fireballSpeed / 460));
        this.tweens.add({
            targets: fireball,
            x: endLaneX,
            y: endY,
            scaleX: 0.12,
            scaleY: 0.12,
            duration: flightDuration,
            ease: 'Quad.easeIn',
            onComplete: () => {
                const idx = this.activeFireballs.indexOf(fireball);
                if (idx !== -1) {
                    this.activeFireballs.splice(idx, 1);
                }
                fireball.destroy();
            }
        });
    }

    // ------------------------------------------------------------
    // ⭐ RPG LEVELING, EXP SCALING & 3-CHOICE UPGRADE MODAL
    // ------------------------------------------------------------
    getExpRequiredForLevel(level) {
        if (level >= (this.maxDragonLevel || 20)) return 999999;
        // Exponential smooth curve from ~100 EXP at Lv 1 to ~4400 EXP at Lv 19
        return Math.round(75 + Math.pow(level, 1.75) * 25);
    }

    getEnemyLevel() {
        const elapsedSec = (this.survivalTime || 0) / 1000;
        const cycle = CONFIG.ENEMY_LEVEL_CYCLE_SEC || 45;
        const timeLevel = 1 + Math.floor(elapsedSec / cycle);
        const dragonBonus = Math.floor(Math.max(0, (this.dragonLevel || 1) - 1) / 5);
        return timeLevel + dragonBonus;
    }

    getEnemyDamage() {
        const lvl = this.getEnemyLevel();
        // Reduced base & scaling: Base 80 damage at Level 1, +15 per enemy level (was 100 + lvl * 30)
        const base = 80 + (lvl - 1) * 15;
        const afterArmor = base * (1 - (this.armorReduction || 0));
        return Math.max(15, Math.round(afterArmor));
    }

    getEnemyExp(enemyClass) {
        const lvl = this.getEnemyLevel();
        const baseExp = (enemyClass && enemyClass.id === 'knight') ? 90 :
                        (enemyClass && enemyClass.id === 'mage') ? 65 : 45;
        // Higher level enemies give more EXP (+35% per enemy level)
        return Math.round(baseExp * (1 + (lvl - 1) * 0.35));
    }

    addDragonExp(amount) {
        if (this.dragonLevel >= this.maxDragonLevel || this.isGameOver) return;
        this.dragonExp += amount;
        this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 100, `+${amount} EXP ⭐`);

        let leveledUp = false;
        while (this.dragonExp >= this.dragonExpNeeded && this.dragonLevel < this.maxDragonLevel) {
            this.dragonExp -= this.dragonExpNeeded;
            this.dragonLevel++;
            this.dragonExpNeeded = this.getExpRequiredForLevel(this.dragonLevel);
            this.pendingLevelUps++;
            leveledUp = true;

            // Evolution milestones!
            // Level 5: Evolves to Teen!
            if (this.dragonLevel >= 5 && this.dragonLevel < 10 && this.currentStageIndex < 1) {
                this.setDragonStage(1);
                this.showBigEvolutionBanner(this.stages[1]);
            }
            // Level 10: Evolves to Mature!
            else if (this.dragonLevel >= 10 && this.currentStageIndex < 2) {
                this.setDragonStage(2);
                this.showBigEvolutionBanner(this.stages[2]);
            }
        }

        if (this.dragonLevel >= this.maxDragonLevel) {
            this.dragonExp = this.dragonExpNeeded;
        }

        this.updateFoodEvolutionMeter();
        this.updateStageUI();

        if (leveledUp && !this.isLevelUpPaused) {
            this.triggerNextLevelUp();
        }
    }

    triggerNextLevelUp() {
        if (this.pendingLevelUps <= 0 || this.isGameOver) {
            this.isLevelUpPaused = false;
            return;
        }
        this.isLevelUpPaused = true;
        this.pendingLevelUps--;

        if (window.soundManager && window.soundManager.playLevelUp) {
            window.soundManager.playLevelUp();
        }

        this.cameras.main.shake(140, 0.008);
        this.showUpgradeModal();
    }

    showUpgradeModal() {
        if (this.upgradeModalContainer) {
            this.upgradeModalContainer.destroy();
        }

        const modal = this.add.container(0, 0).setDepth(100);
        this.upgradeModalContainer = modal;

        // Dark blur backdrop overlay (blocks clicks underneath)
        const backdrop = this.add.graphics();
        backdrop.fillStyle(0x05020a, 0.88);
        backdrop.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        backdrop.setInteractive(new Phaser.Geom.Rectangle(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT), Phaser.Geom.Rectangle.Contains);
        modal.add(backdrop);

        // Modal Frame Card
        const cardW = 620;
        const cardH = 740;
        const modalY = CONFIG.GAME_HEIGHT / 2 - 25;
        const modalX = CONFIG.GAME_WIDTH / 2;

        const frameBg = this.add.graphics();
        frameBg.fillStyle(0x0f071c, 0.96);
        frameBg.fillRoundedRect(modalX - cardW / 2, modalY - cardH / 2, cardW, cardH, 26);
        frameBg.lineStyle(3, 0xf59e0b, 0.9);
        frameBg.strokeRoundedRect(modalX - cardW / 2, modalY - cardH / 2, cardW, cardH, 26);
        modal.add(frameBg);

        // Header Glow & Ribbons
        const headerY = modalY - cardH / 2 + 55;
        const starTitle = this.add.text(modalX, headerY, `⭐ LEVEL UP! ⭐`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '38px',
            color: '#fde047',
            stroke: '#1f0d04',
            strokeThickness: 6,
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        modal.add(starTitle);

        const lvlSubtitle = this.add.text(modalX, headerY + 44, `DRAGON ASCENDED TO LEVEL ${this.dragonLevel}!`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#180702',
            strokeThickness: 3,
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        modal.add(lvlSubtitle);

        // Evolution Milestone notice if reached
        let evoText = 'Select 1 draconic blessing to enhance your flight:';
        if (this.dragonLevel === 5) {
            evoText = '⚡ TEEN FORM UNLOCKED! Choose your draconic power:';
        } else if (this.dragonLevel === 10) {
            evoText = '👑 MATURE APEX FORM UNLOCKED! Choose your power:';
        }

        const pickPrompt = this.add.text(modalX, headerY + 80, evoText, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            color: (this.dragonLevel === 5 || this.dragonLevel === 10) ? '#fb923c' : '#cbd5e1'
        }).setOrigin(0.5, 0.5);
        modal.add(pickPrompt);

        // Filter eligible upgrades based on level prerequisites & max stack limits:
        const isEligible = (u) => {
            if (u.id === 'attack_speed' && (this.upgrades.attack_speed || 0) >= 2) return false;
            if (u.id === 'baby_companion' && (this.dragonLevel || 1) < 5) return false;
            if (u.maxStacks && (this.upgrades[u.id] || 0) >= u.maxStacks) return false;
            return true;
        };

        const eligibleUpgrades = DRAGON_UPGRADES.filter(isEligible);
        const multishotUpgrade = eligibleUpgrades.find(u => u.id === 'multishot');
        const normalUpgrades = eligibleUpgrades.filter(u => u.id !== 'multishot');
        const rollMultiShot = (Math.random() < 0.05);

        let available = [];
        if (rollMultiShot && multishotUpgrade) {
            const normalPicks = Phaser.Utils.Array.Shuffle([...normalUpgrades]).slice(0, 2);
            available = Phaser.Utils.Array.Shuffle([multishotUpgrade, ...normalPicks]);
        } else {
            available = Phaser.Utils.Array.Shuffle([...normalUpgrades]).slice(0, 3);
        }
        const cardBoxW = 560;
        const cardBoxH = 148;
        const startCardY = headerY + 165;

        available.forEach((upg, idx) => {
            const cy = startCardY + idx * 165;
            const cardContainer = this.add.container(modalX, cy);

            const cardBg = this.add.graphics();
            const tagColorNum = Phaser.Display.Color.HexStringToColor(upg.tagColor).color;

            const drawCard = (hover = false) => {
                cardBg.clear();
                cardBg.fillStyle(hover ? 0x1e0d36 : 0x140a24, 0.95);
                cardBg.fillRoundedRect(-cardBoxW / 2, -cardBoxH / 2, cardBoxW, cardBoxH, 18);
                cardBg.lineStyle(hover ? 3.5 : 2, hover ? 0xfde047 : tagColorNum, hover ? 1 : 0.7);
                cardBg.strokeRoundedRect(-cardBoxW / 2, -cardBoxH / 2, cardBoxW, cardBoxH, 18);
            };
            drawCard(false);
            cardContainer.add(cardBg);

            // Left Icon Orb
            const orbBg = this.add.graphics();
            orbBg.fillStyle(0x0a0512, 0.9);
            orbBg.fillCircle(-215, 0, 36);
            orbBg.lineStyle(2, tagColorNum, 0.85);
            orbBg.strokeCircle(-215, 0, 36);
            cardContainer.add(orbBg);

            const iconText = this.add.text(-215, 0, upg.icon, {
                fontSize: '36px'
            }).setOrigin(0.5, 0.5);
            cardContainer.add(iconText);

            // Title & Tier
            const titleText = this.add.text(-160, -38, upg.name, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '23px',
                color: '#ffffff',
                letterSpacing: 1
            }).setOrigin(0, 0.5);
            cardContainer.add(titleText);

            const tierBadge = this.add.text(-160, -14, `[ ${upg.tier} ]`, {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '12px',
                fontWeight: 'bold',
                color: upg.tagColor
            }).setOrigin(0, 0.5);
            cardContainer.add(tierBadge);

            // Description
            const descText = this.add.text(-160, 18, upg.desc, {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14.5px',
                color: '#f1f5f9',
                wordWrap: { width: 360 }
            }).setOrigin(0, 0.5);
            cardContainer.add(descText);

            // Current Level Tag
            const currentStack = (this.upgrades[upg.id] || 0) + 1;
            const maxSuffix = upg.maxStacks ? `/${upg.maxStacks}` : '';
            const levelTag = this.add.text(cardBoxW / 2 - 25, -36, `Lv.${currentStack}${maxSuffix}`, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '18px',
                color: '#fde047'
            }).setOrigin(1, 0.5);
            cardContainer.add(levelTag);

            // Interactivity
            cardContainer.setSize(cardBoxW, cardBoxH);
            cardContainer.setInteractive({ useHandCursor: true });

            cardContainer.on('pointerover', () => {
                drawCard(true);
                cardContainer.setScale(1.02);
            });
            cardContainer.on('pointerout', () => {
                drawCard(false);
                cardContainer.setScale(1.0);
            });
            cardContainer.on('pointerdown', () => {
                cardContainer.setScale(0.97);

                if (window.soundManager && window.soundManager.playUpgradeSelect) {
                    window.soundManager.playUpgradeSelect();
                }

                upg.apply(this);
                this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 80, `✨ ${upg.name}!`);

                modal.destroy();
                this.upgradeModalContainer = null;
                this.updateFoodEvolutionMeter();

                if (this.pendingLevelUps > 0) {
                    this.time.delayedCall(220, () => this.triggerNextLevelUp());
                } else {
                    this.isLevelUpPaused = false;
                }
            });

            modal.add(cardContainer);
        });
    }

    // ------------------------------------------------------------
    // EVOLUTION STAGE SWITCHER & TOAST
    // ------------------------------------------------------------
    setDragonStage(stageIndex) {
        if (stageIndex < 0 || stageIndex >= this.stages.length) return;
        this.currentStageIndex = stageIndex;
        this.humansKilled = 0; // Reset kills for this stage
        const stage = this.stages[stageIndex];

        // Sound & FX
        if (window.soundManager && window.soundManager.playDragonEvolve) {
            window.soundManager.playDragonEvolve();
        }

        // Texture Swap to new Rear-View Stage
        this.dragon.setTexture(stage.sheetKey);
        this.dragon.play(`${stage.sheetKey}_fly`);

        // Scale punch animation
        this.dragon.setScale(stage.spriteScale * 0.5);
        this.tweens.add({
            targets: this.dragon,
            scaleX: stage.spriteScale,
            scaleY: stage.spriteScale,
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
        if (!this.stageButtons) return;
        const isWater = (this.selectedDragonType === 'water');
        const activeColor = isWater ? 0x0284c7 : 0xf97316;
        const strokeColor = isWater ? 0xbae6fd : 0xffedd5;
        this.stageButtons.forEach((b, idx) => {
            const isSelected = idx === this.currentStageIndex;
            const isUnlocked = idx <= this.currentStageIndex;
            b.bg.clear();
            if (isSelected) {
                b.bg.fillStyle(activeColor, 1);
                b.bg.fillRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.bg.lineStyle(3, strokeColor, 0.95);
                b.bg.strokeRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.label.setColor('#ffffff');
                if (b.subLabel) b.subLabel.setText('ACTIVE').setColor('#fef08a');
            } else if (isUnlocked) {
                b.bg.fillStyle(0x180b1e, 0.85);
                b.bg.fillRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.bg.lineStyle(2, activeColor, 0.45);
                b.bg.strokeRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.label.setColor('#e2e8f0');
                if (b.subLabel) b.subLabel.setText('PASSED').setColor('#94a3b8');
            } else {
                b.bg.fillStyle(0x0e0614, 0.85);
                b.bg.fillRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.bg.lineStyle(1.5, 0x475569, 0.4);
                b.bg.strokeRoundedRect(-b.w / 2, -b.h / 2, b.w, b.h, 18);
                b.label.setColor('#64748b');
                const reqLv = (idx === 1) ? '🔒 Lv.5' : '🔒 Lv.10';
                if (b.subLabel) b.subLabel.setText(reqLv).setColor('#ef4444');
            }
        });
    }

    showEvolutionToast(stage) {
        if (this.toastContainer) this.toastContainer.destroy();

        const isWater = (stage && stage.element === 'water') || (this.selectedDragonType === 'water');
        const toastBorder = isWater ? 0x38bdf8 : 0xf97316;

        this.toastContainer = this.add.container(CONFIG.GAME_WIDTH / 2, 175).setDepth(40);
        const toastBg = this.add.graphics();
        toastBg.fillStyle(0x180b1e, 0.94);
        toastBg.fillRoundedRect(-220, -26, 440, 52, 26);
        toastBg.lineStyle(2.5, toastBorder, 0.9);
        toastBg.strokeRoundedRect(-220, -26, 440, 52, 26);
        this.toastContainer.add(toastBg);

        const toastText = this.add.text(0, 0, `✨ Stage ${stage.stage}: ${stage.name}`, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '20px',
            fontWeight: 'bold',
            color: isWater ? '#bae6fd' : '#fef08a'
        }).setOrigin(0.5, 0.5);
        this.toastContainer.add(toastText);

        this.toastContainer.setAlpha(0);
        this.tweens.add({
            targets: this.toastContainer,
            alpha: 1,
            y: 170,
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
        const startX = CONFIG.TOP_LANE_X[lane];

        const sheep = this.add.sprite(startX, horizonY, 'sheep');
        sheep.setOrigin(0.5, 0.95);
        sheep.lane = lane;
        sheep.progress = 0; // 0.0 at horizon, 1.0 at dragon depth (Y = 980)
        sheep.speed = 0.00030;
        sheep.setDepth(16);
        sheep.setScale(0.08);
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
            const startX = CONFIG.TOP_LANE_X[sheep.lane];
            const endX = CONFIG.LANE_X[sheep.lane];
            const curX = startX + (endX - startX) * persp;
            const curScale = 0.08 + (0.76 - 0.08) * persp;

            sheep.x = curX;
            sheep.y = curY;
            sheep.setScale(curScale);
            sheep.setAlpha(Math.min(1.0, p * 3.5));

            // Cute walking bob
            sheep.bobPhase += delta * 0.012;
            sheep.y += Math.sin(sheep.bobPhase) * (curScale * 4);

            sheep.setDepth(curY > this.dragon.y ? 21 : 16);

            // 3. Contact Collision with Dragon (same lane or physical touch)
            const sDx = Math.abs(this.dragon.x - curX);
            const sDy = Math.abs(this.dragon.y - curY);
            const touchesDragon = (sDx < 85 && sDy < 80) || (this.currentLane === sheep.lane && p >= 0.86 && p <= 1.12);
            if (touchesDragon && !sheep.eaten) {
                this.eatSheep(sheep, i);
                continue;
            }

            // 5. Cleanup when past screen bottom
            if (p > 1.35 || sheep.y > CONFIG.GAME_HEIGHT + 100) {
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

        const stage = this.stages[this.currentStageIndex];

        // Dragon chomp animation
        this.tweens.add({
            targets: this.dragon,
            scaleX: stage.spriteScale * 1.14,
            scaleY: stage.spriteScale * 0.88,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.dragon.setScale(stage.spriteScale);
            }
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

        // Food counter: Sheep heal numerical HP and grant EXP!
        this.sheepEaten++;
        const healAmt = 100 + (this.sheepHealBonus || 0);
        const expAmt = 35 + (this.sheepExpBonus || 0);

        if (this.dragonHp < this.dragonMaxHp) {
            this.dragonHp = Math.min(this.dragonMaxHp, this.dragonHp + healAmt);
            this.createFloatingFoodNotice(sheep.x, sheep.y - 40, `+${healAmt} ❤️ HEALED!`);
        } else {
            this.createFloatingFoodNotice(sheep.x, sheep.y - 40, '❤️ FULL HP!');
        }
        this.addDragonExp(expAmt);
        this.updateFoodEvolutionMeter();
    }

    roastSheepWithFireball(sheep, index, fireball) {
        if (!sheep || sheep.eaten) return;
        sheep.eaten = true;
        const sIdx = this.sheepList.indexOf(sheep);
        if (sIdx !== -1) this.sheepList.splice(sIdx, 1);

        if (window.soundManager && window.soundManager.playEatSheep) {
            window.soundManager.playEatSheep();
        }

        const stage = this.stages[this.currentStageIndex];
        this.createFireballExplosion(sheep.x, sheep.y, stage);

        this.tweens.add({
            targets: sheep,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 100,
            onComplete: () => sheep.destroy()
        });

        this.sheepEaten++;
        const healAmt = 100 + (this.sheepHealBonus || 0);
        const expAmt = 35 + (this.sheepExpBonus || 0);

        if (this.dragonHp < this.dragonMaxHp) {
            this.dragonHp = Math.min(this.dragonMaxHp, this.dragonHp + healAmt);
            this.createFloatingFoodNotice(sheep.x, sheep.y - 40, `🔥 +${healAmt} ❤️ HEALED!`);
        } else {
            this.createFloatingFoodNotice(sheep.x, sheep.y - 40, '🔥 ROASTED! (FULL HP)');
        }
        this.addDragonExp(expAmt);
        this.updateFoodEvolutionMeter();

        // Fireball immediately stops and cannot go through the roasted sheep!
        if (fireball) {
            this.consumeFireball(fireball);
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
            duration: 650,
            ease: 'Cubic.easeOut',
            onComplete: () => foodText.destroy()
        });
    }

    showBigEvolutionBanner(stage) {
        if (this.evoBannerContainer) this.evoBannerContainer.destroy();

        this.evoBannerContainer = this.add.container(CONFIG.GAME_WIDTH / 2, 220).setDepth(45);

        const isWater = (stage && stage.element === 'water') || (this.selectedDragonType === 'water');
        const bannerBorder = isWater ? 0x0284c7 : 0xf97316;
        const bannerTextColor = isWater ? '#38bdf8' : '#f97316';

        const bannerBg = this.add.graphics();
        bannerBg.fillStyle(0x15091a, 0.96);
        bannerBg.fillRoundedRect(-260, -55, 520, 110, 24);
        bannerBg.lineStyle(4, bannerBorder, 1);
        bannerBg.strokeRoundedRect(-260, -55, 520, 110, 24);
        this.evoBannerContainer.add(bannerBg);

        const title = this.add.text(0, -20, '⚡ EVOLUTION COMPLETE! ⚡', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '34px',
            color: bannerTextColor,
            stroke: '#180702',
            strokeThickness: 6
        }).setOrigin(0.5, 0.5);
        this.evoBannerContainer.add(title);

        const sub = this.add.text(0, 22, `${stage.icon} ${stage.name} Unlocked!`, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '19px',
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
        if (this.isLevelUpPaused) {
            // Gameplay paused for 3-choice upgrade modal selection
            return;
        }

        if (this.isGameOver) {
            this.updateForwardRunway(delta * 0.15);
            return;
        }

        this.hoverTime += delta;
        this.survivalTime += delta;
        this.updateSurvivalTimerUI();

        // Passive HP Regeneration (Phoenix Blood Upgrade)
        if (this.hpRegenPerSec > 0 && this.dragonHp < this.dragonMaxHp) {
            this.regenTimer = (this.regenTimer || 0) + delta;
            if (this.regenTimer >= 1000) {
                this.regenTimer -= 1000;
                this.dragonHp = Math.min(this.dragonMaxHp, this.dragonHp + this.hpRegenPerSec);
                this.updateFoodEvolutionMeter();
                this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 70, `+${this.hpRegenPerSec} 💚 REGEN`);
            }
        }

        const stage = this.stages[this.currentStageIndex];

        // 1. Update Pseudo-3D Forward Runway (Continuous Forward Motion)
        this.updateForwardRunway(delta);

        // 2. Flight bobbing (Subtle vertical hover oscillation)
        const hoverOffsetY = Math.sin(this.hoverTime * 0.004) * 8.0;
        this.dragon.y = CONFIG.DRAGON_Y + hoverOffsetY;

        // 3. Update Tail Ember Emitter Position to follow dragon
        const tx = this.dragon.x + stage.tailOffset.x;
        const ty = this.dragon.y + stage.tailOffset.y;
        this.tailEmitter.setPosition(tx, ty);

        // 3b. Update Baby Dragon Companion Ally
        this.updateBabyCompanion(delta, this.time.now);

        // 4. Update Sheep Food Spawning, Movement & Collisions
        this.updateSheep(delta);

        // 5. Update Human Enemies, Incoming Projectiles & Terrain Barricades
        this.updateHumanEnemies(delta);
        this.updateEnemyProjectiles(delta);
        this.updateBarricades(delta);

        // 6. Update Dragon Super Ability Beam & Lane Destruction
        this.updateSuperAbility(delta);

        // 7. Unified Non-Piercing Fireball Collisions
        this.updateFireballs();

        // 7. Update Dragon Invulnerability Flash (Flashes for ~1.5s then restores full opacity)
        if (this.time.now < this.invulnerableUntil) {
            // Rapid alternating flicker between 0.30 and 0.90 during invulnerability
            const flash = (Math.floor(this.time.now / 90) % 2 === 0) ? 0.30 : 0.90;
            this.dragon.alpha = flash;
        } else {
            // Fully opaque and vulnerable again
            if (this.dragon.alpha !== 1.0) {
                this.dragon.alpha = 1.0;
            }
        }
    }

    // ------------------------------------------------------------
    // ⚔️ HUMAN ENEMIES SYSTEM (Advancing down lanes like sheep)
    // ------------------------------------------------------------
    spawnHumanEnemy() {
        const lane = Phaser.Math.Between(0, 2);
        const elapsedSec = this.survivalTime / 1000;
        const maxEnemies = Math.min(7, 3 + Math.floor(elapsedSec / 35));

        // Avoid spawning multiple humans in same lane right on top of each other
        const busyInLane = this.humanEnemies.some(e => e.lane === lane && e.progress < 0.35);
        if (busyInLane && this.humanEnemies.length < maxEnemies) return;

        const enemyClass = Phaser.Utils.Array.GetRandom(HUMAN_CLASSES);
        const startX = CONFIG.TOP_LANE_X[lane];
        const startY = CONFIG.HORIZON_Y;

        const enemyLevel = this.getEnemyLevel();
        // Tuned down dynamic Enemy HP scaling: gentler curve with time and dragon maturity
        const dragonTierBonus = Math.max(0, (this.dragonLevel || 1) - 1) * 0.10;
        const levelBonus = Math.max(0, enemyLevel - 1) * 0.18;
        const hpMultiplier = 1.0 + levelBonus + dragonTierBonus;
        const scaledMaxHp = Math.round(enemyClass.maxHp * hpMultiplier);

        // Container holding human character + health bar
        const container = this.add.container(startX, startY).setDepth(17);

        // Human enemy sprite (340px source height, nicely sized)
        const sprite = this.add.image(0, 0, enemyClass.spriteKey).setOrigin(0.5, 0.95);
        sprite.setScale(enemyClass.sizeScale);
        container.add(sprite);

        // Floating HP Bar UI
        const barW = 140;
        const barH = 16;
        const barY = -340 * enemyClass.sizeScale - 18;

        const hpBarBg = this.add.graphics();
        hpBarBg.fillStyle(0x0c0714, 0.88);
        hpBarBg.fillRoundedRect(-barW / 2, barY, barW, barH, 5);
        hpBarBg.lineStyle(1.5, 0xffedd5, 0.7);
        hpBarBg.strokeRoundedRect(-barW / 2, barY, barW, barH, 5);
        container.add(hpBarBg);

        const hpBarFill = this.add.graphics();
        container.add(hpBarFill);

        const hpText = this.add.text(0, barY + barH / 2, `${scaledMaxHp}/${scaledMaxHp}`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '11px',
            color: '#ffffff',
            stroke: '#180702',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        container.add(hpText);

        const nameTag = this.add.text(0, barY - 11, `[Lv.${enemyLevel}] ${enemyClass.title}`, {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '13px',
            color: enemyClass.color,
            stroke: '#180702',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        container.add(nameTag);

        const atkMin = Math.max(600, Math.round(900 - (elapsedSec * 5)));
        const atkMax = Math.max(1300, Math.round(2200 - (elapsedSec * 8)));

        const enemy = {
            container,
            sprite,
            hpBarFill,
            hpText,
            barW,
            barH,
            barY,
            lane,
            class: enemyClass,
            level: enemyLevel,
            hp: scaledMaxHp,
            maxHp: scaledMaxHp,
            progress: 0.02,
            speed: 0.00028,
            nextAttackTime: this.time.now + Phaser.Math.Between(atkMin, atkMax),
            isTelegraphing: false,
            tellBadge: null,
            tellRing: null,
            dotTicksRemaining: 0,
            dotTimer: 0,
            dotDamage: 0,
            active: true
        };

        this.updateEnemyHpBar(enemy);
        this.humanEnemies.push(enemy);
    }

    updateEnemyHpBar(enemy) {
        enemy.hpBarFill.clear();
        const ratio = Math.max(0, enemy.hp / enemy.maxHp);
        const fillW = Math.max(0, (enemy.barW - 4) * ratio);

        let fillColor = 0x22c55e; // Green
        if (ratio < 0.35) fillColor = 0xef4444; // Red
        else if (ratio < 0.65) fillColor = 0xf59e0b; // Orange

        enemy.hpBarFill.fillStyle(fillColor, 0.95);
        enemy.hpBarFill.fillRoundedRect(-enemy.barW / 2 + 2, enemy.barY + 2, fillW, enemy.barH - 4, 3);
        enemy.hpText.setText(`${Math.max(0, enemy.hp)}/${enemy.maxHp}`);
    }

    updateHumanEnemies(delta) {
        const now = this.time.now;
        const elapsedSec = this.survivalTime / 1000;
        const maxEnemies = Math.min(7, 3 + Math.floor(elapsedSec / 35));

        // Spawning check with dynamic interval
        if (now >= this.nextHumanSpawnTime) {
            if (this.humanEnemies.length < maxEnemies) {
                this.spawnHumanEnemy();
            }
            const spawnMin = Math.max(900, Math.round(2400 - (elapsedSec * 14)));
            const spawnMax = Math.max(1700, Math.round(4000 - (elapsedSec * 20)));
            this.nextHumanSpawnTime = now + Phaser.Math.Between(spawnMin, spawnMax);
        }

        const stage = this.stages[this.currentStageIndex];

        for (let i = this.humanEnemies.length - 1; i >= 0; i--) {
            const enemy = this.humanEnemies[i];
            if (!enemy.active) continue;

            // 1. Advance down lane towards camera like sheep
            enemy.progress += enemy.speed * delta;
            const p = enemy.progress;

            const persp = Math.pow(p, 2.1);
            const curY = CONFIG.HORIZON_Y + (CONFIG.DRAGON_Y - CONFIG.HORIZON_Y) * persp;
            const startX = CONFIG.TOP_LANE_X[enemy.lane];
            const endX = CONFIG.LANE_X[enemy.lane];
            const curX = startX + (endX - startX) * persp;
            // Grows larger and prominent as it approaches the dragon
            const curScale = 0.12 + (0.85 - 0.12) * persp;

            enemy.container.setPosition(curX, curY);
            enemy.container.setScale(curScale);
            enemy.container.setAlpha(Math.min(1.0, p * 4.0));
            enemy.container.setDepth(curY > this.dragon.y ? 21 : 16);

            // 2. Attack with telegraph "tell" so user can get ready to dodge
            if (p >= 0.04 && p <= 0.96) {
                // Show tell half a second (500ms) before shooting
                if (!enemy.isTelegraphing && now >= enemy.nextAttackTime - 500) {
                    this.startEnemyAttackTell(enemy);
                }

                // Fire projectile when attack timer expires
                if (now >= enemy.nextAttackTime) {
                    this.fireEnemyProjectile(enemy);
                    this.stopEnemyAttackTell(enemy);
                    const levelSpeedUp = Math.min(600, (enemy.level - 1) * 80);
                    const atkCooldownMin = Math.max(650, Math.round(1400 - (elapsedSec * 6) - levelSpeedUp));
                    const atkCooldownMax = Math.max(1200, Math.round(2600 - (elapsedSec * 10) - levelSpeedUp));
                    enemy.nextAttackTime = now + Phaser.Math.Between(atkCooldownMin, atkCooldownMax);
                }
            }

            // Damage Over Time (DoT) Tick Handler
            if (enemy.dotTicksRemaining > 0) {
                enemy.dotTimer = (enemy.dotTimer || 0) + delta;
                if (enemy.dotTimer >= 500) {
                    enemy.dotTimer -= 500;
                    enemy.dotTicksRemaining--;
                    enemy.hp = Math.max(0, enemy.hp - enemy.dotDamage);
                    this.updateEnemyHpBar(enemy);
                    this.createFloatingFoodNotice(curX, curY - 50, `🔥 -${enemy.dotDamage}`);
                    enemy.sprite.setTint(0xff7700);
                    this.time.delayedCall(100, () => {
                        if (enemy.sprite && enemy.sprite.active) enemy.sprite.clearTint();
                    });
                    if (enemy.hp <= 0) {
                        this.defeatHumanEnemy(enemy, i);
                        continue;
                    }
                }
            }

            // 3. Physical contact collision with Dragon (Human disappears, Dragon takes damage!)
            // Tightly tuned so contact only registers when the human is visually right on top of the dragon
            const dx = Math.abs(this.dragon.x - curX);
            const dy = Math.abs(this.dragon.y - curY);
            const isPhysicalContact = (dx < 70 && dy < 48) || (this.currentLane === enemy.lane && p >= 0.96 && p <= 1.05);

            if (isPhysicalContact) {
                this.damageDragon(this.getEnemyDamage(), enemy.class.title);
                this.createHitSparks(curX, curY);
                this.stopEnemyAttackTell(enemy);
                enemy.active = false;
                enemy.container.destroy();
                this.humanEnemies.splice(i, 1);
                continue;
            }

            // 4. Cleanup when past screen bottom
            if (p > 1.35 || curY > CONFIG.GAME_HEIGHT + 100) {
                this.stopEnemyAttackTell(enemy);
                enemy.container.destroy();
                this.humanEnemies.splice(i, 1);
            }
        }
    }

    damageHumanEnemy(enemy, index, damageAmount, fireball) {
        if (!enemy || !enemy.active) return;
        enemy.hp -= damageAmount;
        this.updateEnemyHpBar(enemy);

        // Apply DoT if unlocked
        if (this.hasDoT && enemy.active && enemy.hp > 0) {
            enemy.dotDamage = this.dotDamage || 35;
            enemy.dotTicksRemaining = 6;
            enemy.dotTimer = 0;
        }

        // Fireball immediately stops and cannot go through the human!
        if (fireball) {
            this.consumeFireball(fireball);
        }

        // Fireball impact explosion FX
        this.createFireballExplosion(enemy.container.x, enemy.container.y, this.stages[this.currentStageIndex]);

        // Floating damage number popup
        this.createFloatingFoodNotice(enemy.container.x, enemy.container.y - 50, `💥 -${damageAmount}`);

        // Red hurt flash
        enemy.sprite.setTint(0xff3333);
        this.time.delayedCall(120, () => {
            if (enemy.sprite && enemy.sprite.active) enemy.sprite.clearTint();
        });

        // Check if defeated
        if (enemy.hp <= 0) {
            this.defeatHumanEnemy(enemy, index);
        }
    }

    defeatHumanEnemy(enemy, index) {
        this.stopEnemyAttackTell(enemy);
        enemy.active = false;
        this.humanEnemies.splice(index, 1);

        const x = enemy.container.x;
        const y = enemy.container.y;

        // Defeat explosion FX
        this.createFireballExplosion(x, y, this.stages[this.currentStageIndex]);

        // Scaled EXP Reward
        const expGained = this.getEnemyExp(enemy.class);
        this.createFloatingFoodNotice(x, y - 40, `⚔️ ${enemy.class.title} SLAIN! +${expGained} EXP`);

        if (window.soundManager && window.soundManager.playBarricadeSmash) {
            window.soundManager.playBarricadeSmash();
        }

        this.tweens.add({
            targets: enemy.container,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 250,
            onComplete: () => enemy.container.destroy()
        });

        this.humansKilled++;
        this.totalHumansKilled++;
        this.addSuperCharge(1); // Charge Super Ability on kill!
        this.addDragonExp(expGained);
    }

    // ------------------------------------------------------------
    // ⚠️ 500MS ATTACK TELEGRAPH "TELL" SYSTEM
    // ------------------------------------------------------------
    startEnemyAttackTell(enemy) {
        if (!enemy || !enemy.active || enemy.isTelegraphing) return;
        enemy.isTelegraphing = true;

        // 1. Audio tell: specific wind-up sound for archer, knight, or mage
        if (window.soundManager && window.soundManager.playEnemyWindup) {
            window.soundManager.playEnemyWindup(enemy.class.id);
        }

        // 2. Flash danger in enemy's flight lane for 500ms
        if (this.laneWarnings) {
            this.laneWarnings[enemy.lane] = this.time.now + 520;
        }

        // 3. Warning pill badge above enemy's HP bar
        const badgeY = enemy.barY - 36;
        const tellBadge = this.add.container(0, badgeY);

        const badgeBg = this.add.graphics();
        badgeBg.fillStyle(0xdc2626, 0.95); // Crimson danger
        badgeBg.fillRoundedRect(-46, -15, 92, 30, 12);
        badgeBg.lineStyle(2.5, 0xfef08a, 1); // Yellow glowing border
        badgeBg.strokeRoundedRect(-46, -15, 92, 30, 12);
        tellBadge.add(badgeBg);

        const tellText = this.add.text(0, 0, '⚠️ DODGE!', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '15px',
            color: '#ffffff',
            stroke: '#180702',
            strokeThickness: 3.5,
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        tellBadge.add(tellText);

        tellBadge.setScale(0);
        enemy.container.add(tellBadge);
        enemy.tellBadge = tellBadge;

        // Punchy pop-in & pulse
        this.tweens.add({
            targets: tellBadge,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 120,
            yoyo: true,
            repeat: 1,
            ease: 'Back.easeOut'
        });

        // 4. Shrinking Targeting Reticle around weapon/torso (locks in over 500ms)
        const ringColor = Phaser.Display.Color.HexStringToColor(enemy.class.color).color;
        const tellRing = this.add.graphics();
        tellRing.lineStyle(4, ringColor, 0.95);
        tellRing.strokeCircle(0, -110, 70);
        enemy.container.add(tellRing);
        enemy.tellRing = tellRing;

        this.tweens.add({
            targets: tellRing,
            scaleX: 0.15,
            scaleY: 0.15,
            alpha: 0.3,
            duration: 490,
            ease: 'Cubic.easeIn'
        });

        // 5. Enemy sprite wind-up animation: white tint flash & anticipation pull back
        if (enemy.sprite && enemy.sprite.active) {
            enemy.sprite.setTint(0xffffff);
            this.tweens.add({
                targets: enemy.sprite,
                y: -14,
                duration: 240,
                yoyo: true,
                ease: 'Quad.easeInOut'
            });
        }
    }

    stopEnemyAttackTell(enemy) {
        if (!enemy) return;
        enemy.isTelegraphing = false;

        if (enemy.tellBadge) {
            enemy.tellBadge.destroy();
            enemy.tellBadge = null;
        }
        if (enemy.tellRing) {
            enemy.tellRing.destroy();
            enemy.tellRing = null;
        }
        if (enemy.sprite && enemy.sprite.active) {
            enemy.sprite.clearTint();
            enemy.sprite.y = 0;
        }
    }

    fireEnemyProjectile(enemy) {
        if (!enemy.active) return;

        if (window.soundManager && window.soundManager.playEnemyShoot) {
            window.soundManager.playEnemyShoot(enemy.class.id);
        }

        const startX = enemy.container.x;
        const startY = enemy.container.y - 35;

        const proj = this.add.sprite(startX, startY, enemy.class.projKey);
        proj.setOrigin(0.5, 0.5);
        proj.lane = enemy.lane;
        proj.class = enemy.class;
        proj.progress = enemy.progress; // Starts at human's current depth!
        proj.speed = 0.00078; // Flies faster than human towards dragon
        proj.setDepth(18);
        proj.setScale(0.18);
        proj.active = true;

        // Muzzle spark flash
        const flash = this.add.circle(startX, startY, 14, Phaser.Display.Color.HexStringToColor(enemy.class.color).color, 0.9);
        flash.setDepth(19);
        this.tweens.add({
            targets: flash,
            scaleX: 2.2,
            scaleY: 2.2,
            alpha: 0,
            duration: 180,
            onComplete: () => flash.destroy()
        });

        this.enemyProjectiles.push(proj);
    }

    // ------------------------------------------------------------
    // 🏹 INCOMING PROJECTILES (Dodging, Deflection & Damage)
    // ------------------------------------------------------------
    updateEnemyProjectiles(delta) {
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = this.enemyProjectiles[i];
            if (!proj.active) continue;

            proj.progress += proj.speed * delta;
            const p = proj.progress;

            // 3D perspective projection
            const persp = Math.pow(p, 2.1);
            const curY = CONFIG.HORIZON_Y + (CONFIG.DRAGON_Y - CONFIG.HORIZON_Y) * persp;
            const startX = CONFIG.TOP_LANE_X[proj.lane];
            const endX = CONFIG.LANE_X[proj.lane];
            const curX = startX + (endX - startX) * persp;
            const curScale = 0.15 + (0.90 - 0.15) * persp;

            proj.x = curX;
            proj.y = curY;
            proj.setScale(curScale);

            if (proj.class.id === 'mage') {
                proj.rotation += delta * 0.009;
            } else if (proj.class.id === 'knight') {
                proj.rotation = Math.sin(p * 10) * 0.14;
            }

            // Projectiles CANNOT BE DEFLECTED! (Player must dodge by steering into another lane)

            // 1. Collision with Dragon (Must dodge by shifting lanes!)
            const pDx = Math.abs(this.dragon.x - curX);
            const pDy = Math.abs(this.dragon.y - curY);
            const hitsDragon = (pDx < 75 && pDy < 70) || (this.currentLane === proj.lane && p >= 0.86 && p <= 1.14);

            if (hitsDragon) {
                this.damageDragon(this.getEnemyDamage(), proj.class.title);
                this.createHitSparks(proj.x, proj.y);
                proj.destroy();
                this.enemyProjectiles.splice(i, 1);
                continue;
            }

            // 2. Disappear instantly the second it gets behind the dragon
            if (p >= 1.02 || curY >= this.dragon.y + 15) {
                proj.destroy();
                this.enemyProjectiles.splice(i, 1);
            }
        }
    }

    deflectEnemyProjectile(proj, index, fireball) {
        proj.active = false;
        this.enemyProjectiles.splice(index, 1);

        if (window.soundManager && window.soundManager.playDeflect) {
            window.soundManager.playDeflect();
        }

        this.createDeflectBurst(proj.x, proj.y, proj.class.color);
        this.createFloatingFoodNotice(proj.x, proj.y - 30, '💥 DEFLECTED! +50');

        proj.destroy();
    }

    createDeflectBurst(x, y, colorHex) {
        const color = Phaser.Display.Color.HexStringToColor(colorHex).color;
        const ring = this.add.circle(x, y, 16, color, 0.9);
        ring.setDepth(24);
        this.tweens.add({
            targets: ring,
            scaleX: 2.5,
            scaleY: 2.5,
            alpha: 0,
            duration: 200,
            onComplete: () => ring.destroy()
        });

        const sparks = this.add.particles(x, y, 'ember', {
            speed: { min: 80, max: 200 },
            scale: { start: 0.7, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 280,
            blendMode: 'ADD',
            emitting: false
        });
        sparks.setDepth(25);
        sparks.explode(12, x, y);
        this.time.delayedCall(300, () => sparks.destroy());
    }

    // ------------------------------------------------------------
    // 🪵 TERRAIN BARRICADES (Direct Obstacle Collisions)
    // ------------------------------------------------------------
    spawnBarricade() {
        const lane = Phaser.Math.Between(0, 2);
        const startX = CONFIG.TOP_LANE_X[lane];
        const horizonY = CONFIG.HORIZON_Y + 10;
        const elapsedSec = this.survivalTime / 1000;

        const barricade = this.add.sprite(startX, horizonY, 'barricade');
        barricade.setOrigin(0.5, 0.8);
        barricade.lane = lane;
        barricade.progress = 0.05;
        // Slightly faster approach as difficulty ramps
        barricade.speed = 0.00028 + Math.min(0.00010, (elapsedSec / 120) * 0.00008);
        barricade.setDepth(17);
        barricade.setScale(0.12);
        barricade.smashed = false;

        this.barricades.push(barricade);
    }

    updateBarricades(delta) {
        const now = this.time.now;
        const elapsedSec = this.survivalTime / 1000;
        if (now >= this.nextBarricadeSpawnTime) {
            this.spawnBarricade();
            // Barricades spawn more frequently over time (from 9.5-15s down to 3.8-6.5s)
            const barMin = Math.max(3800, Math.round(9500 - (elapsedSec * 45)));
            const barMax = Math.max(6500, Math.round(15000 - (elapsedSec * 65)));
            this.nextBarricadeSpawnTime = now + Phaser.Math.Between(barMin, barMax);
        }

        for (let i = this.barricades.length - 1; i >= 0; i--) {
            const bar = this.barricades[i];
            if (!bar.active || bar.smashed) continue;

            bar.progress += bar.speed * delta;
            const p = bar.progress;

            const persp = Math.pow(p, 2.1);
            const curY = CONFIG.HORIZON_Y + (CONFIG.DRAGON_Y - CONFIG.HORIZON_Y) * persp;
            const startX = CONFIG.TOP_LANE_X[bar.lane];
            const endX = CONFIG.LANE_X[bar.lane];
            const curX = startX + (endX - startX) * persp;
            const curScale = 0.12 + (0.85 - 0.12) * persp;

            bar.x = curX;
            bar.y = curY;
            bar.setScale(curScale);

            // 1. Direct Dragon collision with trap (Trap disappears & Dragon takes damage!)
            const bDx = Math.abs(this.dragon.x - curX);
            const bDy = Math.abs(this.dragon.y - curY);
            const hitsDragon = (bDx < 75 && bDy < 50) || (this.currentLane === bar.lane && p >= 0.95 && p <= 1.05);

            if (hitsDragon) {
                this.damageDragon(100, 'TRAP');
                this.createHitSparks(bar.x, bar.y);
                if (window.soundManager && window.soundManager.playBarricadeSmash) {
                    window.soundManager.playBarricadeSmash();
                }
                bar.smashed = true;
                bar.destroy();
                this.barricades.splice(i, 1);
                continue;
            }

            // 2. Cleanup past screen
            if (p > 1.35 || bar.y > CONFIG.GAME_HEIGHT + 100) {
                bar.destroy();
                this.barricades.splice(i, 1);
            }
        }
    }

    smashBarricade(bar, index, byFireball = true, fireball = null) {
        if (!bar || bar.smashed) return;
        bar.smashed = true;
        const bIdx = this.barricades.indexOf(bar);
        if (bIdx !== -1) this.barricades.splice(bIdx, 1);

        if (window.soundManager && window.soundManager.playBarricadeSmash) {
            window.soundManager.playBarricadeSmash();
        }

        if (byFireball) {
            this.createFloatingFoodNotice(bar.x, bar.y - 35, '🪵 SMASHED! +100');
            if (fireball) {
                this.consumeFireball(fireball);
            }
        }

        const splinters = this.add.particles(bar.x, bar.y, 'ember', {
            speed: { min: 80, max: 220 },
            scale: { start: 0.9, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 320,
            blendMode: 'ADD',
            emitting: false
        });
        splinters.setDepth(24);
        splinters.explode(16, bar.x, bar.y);
        this.time.delayedCall(350, () => splinters.destroy());

        this.tweens.add({
            targets: bar,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 120,
            onComplete: () => bar.destroy()
        });
    }

    // ------------------------------------------------------------
    // 🔥 UNIFIED FIREBALL COLLISION ENGINE (Strict Single-Target, Never Piercing)
    // ------------------------------------------------------------
    updateFireballs() {
        const stage = this.stages[this.currentStageIndex];

        for (let f = this.activeFireballs.length - 1; f >= 0; f--) {
            const fb = this.activeFireballs[f];
            if (!fb || !fb.active) continue;

            const candidates = [];

            // 1. Sheep in this lane
            for (let i = 0; i < this.sheepList.length; i++) {
                const sheep = this.sheepList[i];
                if (sheep && sheep.active && !sheep.eaten && sheep.lane === fb.lane) {
                    const distY = Math.abs(fb.y - sheep.y);
                    if (distY < 60) {
                        candidates.push({
                            type: 'sheep',
                            target: sheep,
                            index: i,
                            y: sheep.y
                        });
                    }
                }
            }

            // 2. Human enemies in this lane
            for (let i = 0; i < this.humanEnemies.length; i++) {
                const enemy = this.humanEnemies[i];
                if (enemy && enemy.active && enemy.lane === fb.lane) {
                    const curY = enemy.container.y;
                    const distY = Math.abs(fb.y - curY);
                    if (distY < 75) {
                        candidates.push({
                            type: 'human',
                            target: enemy,
                            index: i,
                            y: curY
                        });
                    }
                }
            }

            // 3. Barricades in this lane
            for (let i = 0; i < this.barricades.length; i++) {
                const bar = this.barricades[i];
                if (bar && bar.active && !bar.smashed && bar.lane === fb.lane) {
                    const distY = Math.abs(fb.y - bar.y);
                    if (distY < 60) {
                        candidates.push({
                            type: 'barricade',
                            target: bar,
                            index: i,
                            y: bar.y
                        });
                    }
                }
            }

            if (candidates.length > 0) {
                // The fireball travels from the dragon (high Y) towards the horizon (low Y)
                // Therefore, sorting by Y descending picks the FIRST obstacle the fireball touches!
                candidates.sort((a, b) => b.y - a.y);
                const hit = candidates[0];

                if (hit.type === 'sheep') {
                    this.roastSheepWithFireball(hit.target, hit.index, fb);
                } else if (hit.type === 'human') {
                    const dmg = fb.damage || (stage.attackDamage + (this.bonusDamage || 0));
                    this.damageHumanEnemy(hit.target, hit.index, dmg, fb);
                } else if (hit.type === 'barricade') {
                    // Dragon CANNOT destroy traps! Fireball is blocked and vanishes.
                    this.createFireballExplosion(hit.target.x, hit.target.y, stage);
                    if (window.soundManager && window.soundManager.playBarricadeSmash) {
                        window.soundManager.playBarricadeSmash();
                    }
                    this.createFloatingFoodNotice(hit.target.x, hit.target.y - 35, '🛡️ BLOCKED!');
                }

                // Fireball is unconditionally consumed immediately so it NEVER pierces to targets behind it!
                this.consumeFireball(fb);
            }
        }
    }

    // ------------------------------------------------------------
    // ❤️ DRAGON HEALTH, DAMAGE & RECOVERY (Fixed Timer Invulnerability)
    // ------------------------------------------------------------
    damageDragon(amount, source) {
        const now = this.time.now;
        // Strict timestamp check: immune to tween interruptions or lane shifts!
        if (now < this.invulnerableUntil) return;
        this.invulnerableUntil = now + 1500; // 1.5s invulnerability period

        const damageToTake = (typeof amount === 'number' && amount > 1) ? amount : this.getEnemyDamage();
        this.dragonHp = Math.max(0, this.dragonHp - damageToTake);
        this.updateFoodEvolutionMeter();

        if (window.soundManager && window.soundManager.playDragonHurt) {
            window.soundManager.playDragonHurt();
        }

        // Screen shake & Hurt flash
        this.cameras.main.shake(180, 0.015);
        this.cameras.main.flash(140, 255, 30, 30, 0.45);

        // Floating hurt indicator
        this.createFloatingFoodNotice(this.dragon.x, this.dragon.y - 70, `-${damageToTake} HP! 💔`);

        // Game Over if HP drops to 0
        if (this.dragonHp <= 0) {
            this.triggerGameOver();
        }
    }

    // ------------------------------------------------------------
    // 💀 GAME OVER SCREEN & RETURN TO MAIN MENU
    // ------------------------------------------------------------
    triggerGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Stop dragon tail flames & clear incoming enemy projectiles
        if (this.tailEmitter) {
            this.tailEmitter.stop();
        }
        if (this.babyCompanion) {
            this.babyCompanion.destroy();
            this.babyCompanion = null;
        }
        this.enemyProjectiles.forEach(p => p.destroy());
        this.enemyProjectiles = [];

        // Defeat audio cue
        if (window.soundManager) {
            if (window.soundManager.playGameOver) {
                window.soundManager.playGameOver();
            } else if (window.soundManager.playDie) {
                window.soundManager.playDie();
            }
        }

        // Heavy camera shake
        this.cameras.main.shake(320, 0.018);

        // Dragon defeat fall & tint
        this.tweens.killTweensOf(this.dragon);
        this.dragon.setTint(0xef4444);
        this.tweens.add({
            targets: this.dragon,
            y: this.dragon.y + 110,
            rotation: 0.28,
            scaleX: this.dragon.scaleX * 0.8,
            scaleY: this.dragon.scaleY * 0.8,
            alpha: 0.2,
            duration: 800,
            ease: 'Cubic.easeIn'
        });

        // 1. Full-screen dark cinematic vignette overlay
        const overlay = this.add.graphics().setDepth(50);
        overlay.fillStyle(0x06020a, 0.84);
        overlay.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        overlay.setAlpha(0);
        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 350,
            ease: 'Sine.easeOut'
        });

        // 2. Central GAME OVER Card Container
        const cardW = 580;
        const cardH = 560;
        const cardContainer = this.add.container(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 20).setDepth(55);

        // Card glass background
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x130a1c, 0.96);
        cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 28);
        cardBg.lineStyle(3.5, 0xef4444, 0.95);
        cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 28);
        cardContainer.add(cardBg);

        // Inner glowing border accent
        const innerBorder = this.add.graphics();
        innerBorder.lineStyle(1.5, 0xfca5a5, 0.35);
        innerBorder.strokeRoundedRect(-cardW / 2 + 10, -cardH / 2 + 10, cardW - 20, cardH - 20, 20);
        cardContainer.add(innerBorder);

        // Skull & GAME OVER Headline
        const titleText = this.add.text(0, -cardH / 2 + 65, '💀 GAME OVER', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '54px',
            color: '#f87171',
            stroke: '#450a0a',
            strokeThickness: 8,
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        cardContainer.add(titleText);

        const subTitleText = (this.selectedDragonType === 'water') ? 'THE WATER DRAGON HAS FALLEN' : 'THE FIRE DRAGON HAS FALLEN';
        const subTitle = this.add.text(0, -cardH / 2 + 120, subTitleText, {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fecaca',
            letterSpacing: 2
        }).setOrigin(0.5, 0.5);
        cardContainer.add(subTitle);

        // Stats Summary Box
        const statsBoxW = 500;
        const statsBoxH = 185;
        const statsBoxY = 22;
        const statsBox = this.add.graphics();
        statsBox.fillStyle(0x0a0410, 0.9);
        statsBox.fillRoundedRect(-statsBoxW / 2, statsBoxY - statsBoxH / 2, statsBoxW, statsBoxH, 18);
        statsBox.lineStyle(1.5, 0xf97316, 0.4);
        statsBox.strokeRoundedRect(-statsBoxW / 2, statsBoxY - statsBoxH / 2, statsBoxW, statsBoxH, 18);
        cardContainer.add(statsBox);

        const stageName = this.stages[this.currentStageIndex].name;
        const totalSec = Math.floor(this.survivalTime / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const statLines = [
            `⭐ Dragon Level: Lv.${this.dragonLevel} / 20 (${stageName})`,
            `⏱️ Survived: ${timeStr} • Enemies Lv.${this.getEnemyLevel()}`,
            `⚔️ Humans Slain: ${this.totalHumansKilled} (${this.dragonExp} EXP)`,
            `🍖 Sheep Eaten: ${this.sheepEaten}`
        ];

        statLines.forEach((line, idx) => {
            const lineText = this.add.text(0, statsBoxY - 57 + idx * 38, line, {
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: '20px',
                color: idx === 0 ? '#38bdf8' : (idx === 3 ? '#fde047' : '#ffffff'),
                letterSpacing: 1
            }).setOrigin(0.5, 0.5);
            cardContainer.add(lineText);
        });

        // Return countdown hint
        const countdownText = this.add.text(0, cardH / 2 - 128, 'RETURNING TO MAIN MENU IN 3s...', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#fb923c',
            letterSpacing: 1
        }).setOrigin(0.5, 0.5);
        cardContainer.add(countdownText);

        // Countdown timer updates
        let remainingSec = 3;
        const timerEvent = this.time.addEvent({
            delay: 1000,
            repeat: 2,
            callback: () => {
                remainingSec--;
                if (remainingSec > 0 && countdownText.active) {
                    countdownText.setText(`RETURNING TO MAIN MENU IN ${remainingSec}s...`);
                }
            }
        });

        // Interactive "RETURN TO MENU" Button
        const btnW = 440;
        const btnH = 68;
        const btnY = cardH / 2 - 62;
        const returnBtn = this.add.container(0, btnY);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xf97316, 1);
        btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 22);
        btnBg.lineStyle(2.5, 0xffedd5, 0.9);
        btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 22);
        returnBtn.add(btnBg);

        const btnText = this.add.text(0, 0, '🏠 RETURN TO MAIN MENU', {
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: '24px',
            color: '#180702',
            letterSpacing: 1.5
        }).setOrigin(0.5, 0.5);
        returnBtn.add(btnText);

        returnBtn.setSize(btnW, btnH);
        returnBtn.setInteractive({ useHandCursor: true });

        cardContainer.add(returnBtn);

        // Entrance animation
        cardContainer.setScale(0.85);
        cardContainer.setAlpha(0);
        this.tweens.add({
            targets: cardContainer,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 350,
            ease: 'Back.easeOut'
        });

        // Function to navigate back to Main Menu safely once
        let transitioned = false;
        const returnToMenu = () => {
            if (transitioned) return;
            transitioned = true;
            timerEvent.remove();

            if (window.soundManager && window.soundManager.playFlap) {
                window.soundManager.playFlap();
            }

            this.cameras.main.fade(320, 8, 4, 14, false, (cam, complete) => {
                if (complete) {
                    this.scene.start('MainMenuScene');
                }
            });
        };

        returnBtn.on('pointerdown', returnToMenu);

        // Also allow tapping anywhere on overlay or pressing Space / Enter to return immediately
        this.input.keyboard.once('keydown-SPACE', returnToMenu);
        this.input.keyboard.once('keydown-ENTER', returnToMenu);
        this.input.once('pointerdown', returnToMenu);

        // Auto return after 3.2 seconds
        this.time.delayedCall(3200, returnToMenu);
    }

    createHitSparks(x, y) {
        const sparks = this.add.particles(x, y, 'ember', {
            speed: { min: 90, max: 240 },
            scale: { start: 1.0, end: 0.05 },
            alpha: { start: 1, end: 0 },
            lifespan: 300,
            blendMode: 'ADD',
            emitting: false
        });
        sparks.setDepth(26);
        sparks.explode(15, x, y);
        this.time.delayedCall(350, () => sparks.destroy());
    }
}

// ============================================================
// PHASER GAME CONFIGURATION (PORTRAIT 9:16 HIGH-RES)
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
    scene: [PreloadScene, MainMenuScene, DragonFlightScene]
};

// Initialize Game
window.game = new Phaser.Game(gameConfig);
const game = window.game;
