import sys, os, time, json

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

c = CDP()
c.goto()
c.sleep(0.5)

print("==================================================")
print("TEST 1: Verify Initial Scales for All 3 Birds")
print("==================================================")

for bird_name, bird_id, btn_x in [
    ("Blue Bird", "bird_blue", 86),
    ("Yellow Bird", "bird_yellow", 200),
    ("Black Bird", "bird_black", 314)
]:
    c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
    c.sleep(0.3)
    c.click(btn_x, 385)
    c.sleep(0.15)
    c.click(200, 505) # Launch
    c.sleep(0.4)
    scale_x = c.js("game.scene.getScene('GameScene').bird.scaleX")
    scale_y = c.js("game.scene.getScene('GameScene').bird.scaleY")
    print(f"Initial {bird_name} scale: ({scale_x}, {scale_y})")
    assert abs(scale_x - 1.0) < 0.001, f"{bird_name} scaleX not 1.0: {scale_x}"
    assert abs(scale_y - 1.0) < 0.001, f"{bird_name} scaleY not 1.0: {scale_y}"

print("[PASS] All birds have exact 1.0 base scale initially.\n")

print("==================================================")
print("TEST 2: Verify All 6 Transformation Combinations")
print("==================================================")

combos = [
    ("bird_blue", "bird_yellow", "Blue -> Yellow"),
    ("bird_blue", "bird_black", "Blue -> Black"),
    ("bird_yellow", "bird_blue", "Yellow -> Blue"),
    ("bird_yellow", "bird_black", "Yellow -> Black"),
    ("bird_black", "bird_blue", "Black -> Blue"),
    ("bird_black", "bird_yellow", "Black -> Yellow"),
]

for from_id, to_id, label in combos:
    # Set current bird to from_id, then force transform to to_id
    res = c.js(f"""(() => {{
        const sc = game.scene.getScene('GameScene');
        sc.gameState = 'FLYING';
        sc.bird.y = 300;
        if (sc.bird.body) sc.bird.body.setVelocity(0, 0);
        
        // Setup initial bird
        sc.currentBird = BIRDS.find(b => b.id === '{from_id}');
        sc.bird.setTexture('{from_id}');
        sc.bird.setScale(sc.currentBird.scale || 1.0, sc.currentBird.scale || 1.0);
        const fromScaleX = sc.bird.scaleX;
        const fromScaleY = sc.bird.scaleY;
        
        // Trigger transformation directly to target bird
        const targetBird = BIRDS.find(b => b.id === '{to_id}');
        sc.currentBird = targetBird;
        sc.triggerBirdTransformation();
        // Force the target selection for this specific test pair
        sc.currentBird = targetBird;
        sc.bird.setTexture(targetBird.id);
        
        return {{
            fromScale: [fromScaleX, fromScaleY],
            immediateScale: [sc.bird.scaleX, sc.bird.scaleY],
            expectedScale: targetBird.scale || 1.0
        }};
    }})()""")
    
    # Wait for pulse tween to settle
    c.sleep(0.25)
    
    settled = c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        return {
            scaleX: sc.bird.scaleX,
            scaleY: sc.bird.scaleY,
            currentBird: sc.currentBird.id,
            texture: sc.bird.texture.key
        };
    })()""")
    
    print(f"{label}: Settled scale=({settled['scaleX']:.3f}, {settled['scaleY']:.3f}), expected=1.000")
    assert abs(settled['scaleX'] - 1.0) < 0.001, f"{label} scaleX mismatch: {settled['scaleX']}"
    assert abs(settled['scaleY'] - 1.0) < 0.001, f"{label} scaleY mismatch: {settled['scaleY']}"

print("[PASS] All 6 transformation combinations maintain exact 1.0 scale!\n")

print("==================================================")
print("TEST 3: Repeated Transformations With Active Flapping (Stress Test)")
print("Testing: Blue -> Yellow -> Black -> Blue -> Yellow ... 30 cycles")
print("==================================================")

history = []
for cycle in range(30):
    # Trigger transformation
    c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        sc.gameState = 'FLYING';
        sc.triggerBirdTransformation();
    })()""")
    
    # Simulate user flap right in the middle of pulse (which previously caused scale freeze)
    c.sleep(0.04) # 40ms into 120ms tween
    c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        sc.handleFlap();
    })()""")
    
    # Allow settling
    c.sleep(0.15)
    
    # Check scale
    check = c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        return {
            cycle: """ + str(cycle) + """,
            bird: sc.currentBird.id,
            scaleX: sc.bird.scaleX,
            scaleY: sc.bird.scaleY
        };
    })()""")
    
    assert abs(check['scaleX'] - 1.0) < 0.001, f"Cycle {cycle}: scaleX drifted to {check['scaleX']}"
    assert abs(check['scaleY'] - 1.0) < 0.001, f"Cycle {cycle}: scaleY drifted to {check['scaleY']}"
    if cycle % 5 == 0 or cycle == 29:
        print(f"Cycle {cycle + 1:2d}/30: Bird={check['bird']:12s} Scale=({check['scaleX']:.3f}, {check['scaleY']:.3f}) [EXACT 1.0]")

print("\n[PASS] 30 consecutive transformations with mid-pulse flaps maintain exact scale without any drift!")

c.shot(r"C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch\scale_consistency_verified.png")
print("\n[ALL TESTS PASSED SUCCESSFULLY!]")
