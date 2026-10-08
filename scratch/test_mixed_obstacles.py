import sys, os, time
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

OUT_DIR = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch'

print("=== STARTING MIXED-MATERIAL OBSTACLES VERIFICATION ===")
c = CDP()
c.goto()
c.sleep(0.5)

# Select Blue Bird (index 0) and launch
c.click(86, 385)
c.sleep(0.3)
c.click(200, 505) # Launch button
c.sleep(0.6)

# Drag slingshot backwards to launch bird
c.drag(105, 474, 40, 520, steps=15)
c.sleep(0.2)
print("Slingshot launched! Bird is flying.")

shot_captured = False
obstacle_1_materials = set()
obstacle_2_materials = set()

for step in range(20):
    # Tap to flap
    c.click(200, 320)
    c.sleep(0.35)

    info = c.js("""
    (() => {
        const s = game.scene.getScene('GameScene');
        if (!s || !s.obstacles) return null;
        return s.obstacles.getChildren().map(o => ({
            obstacleId: o.obstacleId,
            sectionIndex: o.sectionIndex,
            materialId: o.material ? o.material.id : null,
            materialName: o.material ? o.material.name : null,
            x: Math.round(o.x),
            y: Math.round(o.y),
            vx: o.body ? Math.round(o.body.velocity.x) : 0,
            visible: o.visible
        }));
    })()
    """)

    state = c.js("game.scene.getScene('GameScene').gameState")
    obs_count = len(info) if info else 0
    print(f"t~{(step+1)*0.35:.1f}s | state={state} | total sections={obs_count}")

    if info:
        # Group by obstacleId
        by_obs = {}
        for sec in info:
            oid = sec['obstacleId']
            by_obs.setdefault(oid, []).append(sec)

        for oid, secs in by_obs.items():
            mat_set = {s['materialId'] for s in secs}
            print(f"   Obstacle #{oid}: {len(secs)} sections, materials={mat_set}, X={secs[0]['x']}")
            if oid == 1:
                obstacle_1_materials.update(mat_set)
            elif oid == 2:
                obstacle_2_materials.update(mat_set)

            # Capture screenshot while an obstacle is prominently on screen (X between 150 and 350)
            if not shot_captured and 120 < secs[0]['x'] < 360:
                shot_path = os.path.join(OUT_DIR, "mixed_obstacle_visible.png")
                c.shot(shot_path)
                print(f"   Captured screenshot at X={secs[0]['x']} -> {shot_path}")
                shot_captured = True

    if state == 'CRASHED' or state == 'LANDED':
        print(f"Flight ended with state: {state}")
        break

print("\n--- OBSTACLE MATERIAL CONTENT ANALYSIS ---")
print(f"Obstacle 1 materials detected: {obstacle_1_materials}")
print(f"Obstacle 2 materials detected: {obstacle_2_materials}")

expected_all_three = {'glass', 'wood', 'stone'}

assert obstacle_1_materials == expected_all_three, f"Obstacle 1 missing materials: {expected_all_three - obstacle_1_materials}"
print("[OK] Obstacle 1 contains ALL THREE materials: Glass, Wood, and Stone!")

if obstacle_2_materials:
    assert obstacle_2_materials == expected_all_three, f"Obstacle 2 missing materials: {expected_all_three - obstacle_2_materials}"
    print("[OK] Obstacle 2 also contains ALL THREE materials: Glass, Wood, and Stone!")

print("\nALL MIXED-MATERIAL OBSTACLE VERIFICATIONS PASSED!")
