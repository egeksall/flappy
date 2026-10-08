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
print("TEST: Entire Obstacle Removal for All 3 Birds")
print("==================================================")

# Function to test full obstacle destruction for a bird
def test_bird_breaks_entire_obstacle(bird_name, bird_id, btn_x, target_material):
    print(f"\n--- Testing {bird_name} ({target_material.upper()}) ---")
    c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
    c.sleep(0.4)
    c.click(btn_x, 385)
    c.sleep(0.2)
    c.click(200, 505) # Launch
    c.sleep(0.5)
    c.drag(105, 474, 40, 520, steps=15) # Pull & release
    c.sleep(0.4)
    
    # Pause natural spawner timer to isolate this obstacle
    c.js("(() => { const sc = game.scene.getScene('GameScene'); if (sc.obstacleTimer) sc.obstacleTimer.paused = true; sc.obstacles.clear(true, true); })()")
    
    # Spawn 1 mixed obstacle containing all 3 materials
    init_info = c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        sc.gameState = 'FLYING';
        sc.bird.y = 300;
        if (sc.bird.body) {
            sc.bird.body.setVelocityY(0);
            sc.bird.body.allowGravity = false;
        }
        sc.spawnMixedObstacle();
        const obs = sc.obstacles.getChildren();
        return {
            totalSections: obs.length,
            materials: obs.map(s => s.material.id),
            obstacleIds: obs.map(s => s.obstacleId)
        };
    })()""")
    
    print(f"Spawned obstacle with {init_info['totalSections']} sections: {init_info['materials']}")
    assert init_info['totalSections'] == 3, f"Expected 3 sections, got {init_info['totalSections']}"
    assert set(init_info['materials']) == {'glass', 'wood', 'stone'}, f"Obstacle must contain all 3 materials: {init_info['materials']}"
    
    # Hit the compatible section
    break_res = c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        const obs = sc.obstacles.getChildren();
        const matchSec = obs.find(s => s.material.id === '""" + target_material + """');
        if (!matchSec) return { error: 'No matching section found' };
        
        const obsId = matchSec.obstacleId;
        sc.handleObstacleCollision(sc.bird, matchSec);
        
        return {
            hitMaterial: matchSec.material.id,
            obstacleId: obsId,
            obstaclesCleared: sc.obstaclesCleared
        };
    })()""")
    
    print(f"Hit section: {break_res['hitMaterial']}, obstaclesCleared={break_res['obstaclesCleared']}")
    assert break_res['obstaclesCleared'] == 1, "Obstacle cleared count should be 1"
    
    # Wait for the 220ms crumble tween to finish and destroy objects
    c.sleep(0.35)
    
    # Verify no sections of that obstacle exist in the game world
    remaining_info = c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        const obs = sc.obstacles.getChildren();
        return {
            remainingCount: obs.length,
            remainingMaterials: obs.map(s => s.material.id)
        };
    })()""")
    
    print(f"After break: remaining sections in game world = {remaining_info['remainingCount']} {remaining_info['remainingMaterials']}")
    assert remaining_info['remainingCount'] == 0, f"Expected 0 remaining sections, found {remaining_info['remainingCount']}!"
    print(f"[PASS] {bird_name} destroyed {target_material.upper()} -> Entire obstacle (all 3 sections) disappeared completely!")

# Test Blue Bird -> destroys glass -> entire obstacle removed
test_bird_breaks_entire_obstacle("Blue Bird", "bird_blue", 86, "glass")

# Test Yellow Bird -> destroys wood -> entire obstacle removed
test_bird_breaks_entire_obstacle("Yellow Bird", "bird_yellow", 200, "wood")

# Test Black Bird -> destroys stone -> entire obstacle removed
test_bird_breaks_entire_obstacle("Black Bird", "bird_black", 314, "stone")

print("\n==================================================")
print("TEST: Verify 5-Obstacle Transformation Still Works")
print("==================================================")
c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
c.sleep(0.4)
c.click(200, 385) # Select Yellow Bird
c.sleep(0.2)
c.click(200, 505) # Launch
c.sleep(0.5)
c.drag(105, 474, 40, 520, steps=15)
c.sleep(0.4)
c.js("(() => { const sc = game.scene.getScene('GameScene'); if (sc.obstacleTimer) sc.obstacleTimer.paused = true; })()")

for i in range(1, 6):
    r = c.js("""(() => {
        const sc = game.scene.getScene('GameScene');
        sc.gameState = 'FLYING';
        sc.bird.y = 300;
        if (sc.bird.body) { sc.bird.body.setVelocityY(0); sc.bird.body.allowGravity = false; }
        sc.obstacles.clear(true, true);
        sc.spawnMixedObstacle();
        const obs = sc.obstacles.getChildren();
        const curBreaker = sc.currentBird.id;
        const match = obs.find(s => s.material && s.material.breakerBirdId === curBreaker);
        const preBird = sc.currentBird.id;
        sc.handleObstacleCollision(sc.bird, match);
        return {
            cleared: sc.obstaclesCleared,
            preBird: preBird,
            postBird: sc.currentBird.id,
            postTexture: sc.bird.texture.key,
            activeCount: sc.obstacles.getChildren().length
        };
    })()""")
    c.sleep(0.1)
    print(f"Obstacle {i}: cleared={r['cleared']}, bird: {r['preBird']} -> {r['postBird']}")
    assert r['cleared'] == i

# Verify transformed after obstacle 5
post_5_bird = c.js("game.scene.getScene('GameScene').currentBird.id")
print(f"Bird after obstacle 5: {post_5_bird}")
assert post_5_bird in ['bird_blue', 'bird_black']
assert post_5_bird != 'bird_yellow'
print("[PASS] 5-obstacle surprise transformation works perfectly with full obstacle destruction!")

c.shot(r"C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch\full_destruction_verified.png")
print("\n[ALL VERIFICATION CHECKS PASSED!]")
