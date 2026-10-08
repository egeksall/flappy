import sys, os, time, json

# Ensure utf-8 stdout encoding for Windows console
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
print("TEST 1: Starting bird remains selected bird initially")
print("==================================================")

# Test selection for all 3 birds
for bird_idx, (b_name, b_id, btn_x) in enumerate([
    ("Yellow Bird", "bird_yellow", 200),
    ("Black Bird", "bird_black", 314),
    ("Blue Bird", "bird_blue", 86)
]):
    c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
    c.sleep(0.4)
    c.click(btn_x, 385)
    c.sleep(0.2)
    c.click(200, 505) # Launch button
    c.sleep(0.5)
    
    current_id = c.js("game.scene.getScene('GameScene').currentBird.id")
    current_tex = c.js("game.scene.getScene('GameScene').bird.texture.key")
    cleared = c.js("game.scene.getScene('GameScene').obstaclesCleared")
    print(f"Selected {b_name} -> In game bird: {current_id}, texture: {current_tex}, cleared: {cleared}")
    assert current_id == b_id, f"Expected {b_id}, got {current_id}"
    assert current_tex == b_id, f"Expected texture {b_id}, got {current_tex}"
    assert cleared == 0, f"Expected 0 obstacles cleared initially, got {cleared}"

print("\n[PASS] Test 1 passed: Starting bird matches selection initially for all 3 birds.\n")

print("==================================================")
print("TEST 2: Surprise Transformation after 5, 10, 15 obstacles")
print("Starting as Yellow Bird")
print("==================================================")

# Start game as Yellow Bird
c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
c.sleep(0.4)
c.click(200, 385) # Select Yellow
c.sleep(0.2)
c.click(200, 505) # Launch
c.sleep(0.5)
c.drag(105, 474, 40, 520, steps=15) # Pull & release slingshot
c.sleep(0.4)

# Verify flying state
state = c.js("game.scene.getScene('GameScene').gameState")
start_bird = c.js("game.scene.getScene('GameScene').currentBird.id")
print(f"Game State: {state}, Initial Bird: {start_bird}")
assert start_bird == "bird_yellow", "Must start as yellow bird"

# Pause background timer so obstacles are spawned and cleared deterministically by the test
c.js("const sc = game.scene.getScene('GameScene'); if (sc.obstacleTimer) sc.obstacleTimer.paused = true; sc.obstacles.clear(true, true);")

# Simulate clearing obstacles 1 to 5 one by one
transformation_history = []

def clear_next_obstacle():
    # Spawns or uses an obstacle and simulates bird breaking through compatible section
    res = c.js("""(() => {
        const scene = game.scene.getScene('GameScene');
        // Keep bird airborne in flying state
        scene.gameState = 'FLYING';
        scene.bird.y = 300;
        if (scene.bird.body) {
            scene.bird.body.setVelocityY(0);
            scene.bird.body.allowGravity = false;
        }
        
        // Clear previously broken obstacles so they don't drift into bird
        scene.obstacles.clear(true, true);

        // Spawn fresh obstacle
        scene.spawnMixedObstacle();
        const obs = scene.obstacles.getChildren();
        const currentBreaker = scene.currentBird.id;
        const matchSec = obs.find(s => s.material && s.material.breakerBirdId === currentBreaker && !s.isBroken);
        if (!matchSec) return { error: 'No matching section found for ' + currentBreaker };
        
        const preCleared = scene.obstaclesCleared;
        const preBird = scene.currentBird.id;
        
        // Trigger collision
        scene.handleObstacleCollision(scene.bird, matchSec);
        
        return {
            preCleared: preCleared,
            postCleared: scene.obstaclesCleared,
            preBird: preBird,
            postBird: scene.currentBird.id,
            postTexture: scene.bird.texture.key,
            postBreaks: scene.currentBird.targetMaterial.id
        };
    })()""")
    return res

print("\n--- Clearing Obstacles 1 through 5 ---")
for i in range(1, 6):
    r = clear_next_obstacle()
    c.sleep(0.2)
    print(f"Obstacle {i}: preCleared={r['preCleared']}, postCleared={r['postCleared']}, preBird={r['preBird']}, postBird={r['postBird']}, texture={r['postTexture']}")
    assert r['postCleared'] == i, f"Expected {i} obstacles cleared"
    
    if i < 5:
        # Bird should NOT change before 5
        assert r['postBird'] == "bird_yellow", f"Bird changed prematurely at obstacle {i}!"
    else:
        # At obstacle 5, bird MUST transform!
        print(f"-> At obstacle 5: Transformed from {r['preBird']} to {r['postBird']}!")
        assert r['postBird'] != "bird_yellow", "Bird did not change after 5 obstacles!"
        assert r['postBird'] in ["bird_blue", "bird_black"], f"Invalid new bird {r['postBird']}!"
        assert r['postTexture'] == r['postBird'], f"Bird sprite texture mismatch: {r['postTexture']}"
        transformation_history.append((r['preBird'], r['postBird']))

# Capture screenshot of transformed bird in flight
c.sleep(0.4)
c.shot(r"C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch\transform_obstacle_5.png")

bird_at_5 = c.js("game.scene.getScene('GameScene').currentBird.id")
print(f"\n[PASS] Transformed at obstacle 5 to: {bird_at_5}")

print("\n--- Verifying Material Breaker Ability on Obstacle 6 ---")
# The transformed bird must now break its new material immediately!
r6 = clear_next_obstacle()
print(f"Obstacle 6: r6={r6}")
assert r6['postCleared'] == 6
assert r6['postBird'] == bird_at_5, "Bird should not change at obstacle 6"

print("\n--- Clearing Obstacles 7 through 10 ---")
for i in range(7, 11):
    r = clear_next_obstacle()
    c.sleep(0.2)
    print(f"Obstacle {i}: cleared={r['postCleared']}, preBird={r['preBird']}, postBird={r['postBird']}")
    assert r['postCleared'] == i
    if i < 10:
        assert r['postBird'] == bird_at_5, f"Bird changed prematurely at obstacle {i}!"
    else:
        # At obstacle 10, must transform again!
        print(f"-> At obstacle 10: Transformed from {r['preBird']} to {r['postBird']}!")
        assert r['postBird'] != r['preBird'], "Bird transformed into itself at obstacle 10!"
        assert r['postBird'] in ["bird_yellow", "bird_blue", "bird_black"]
        assert r['postTexture'] == r['postBird']
        transformation_history.append((r['preBird'], r['postBird']))

bird_at_10 = c.js("game.scene.getScene('GameScene').currentBird.id")
print(f"\n[PASS] Transformed at obstacle 10 to: {bird_at_10}")

print("\n--- Clearing Obstacles 11 through 15 ---")
for i in range(11, 16):
    r = clear_next_obstacle()
    c.sleep(0.2)
    print(f"Obstacle {i}: cleared={r['postCleared']}, preBird={r['preBird']}, postBird={r['postBird']}")
    assert r['postCleared'] == i
    if i < 15:
        assert r['postBird'] == bird_at_10, f"Bird changed prematurely at obstacle {i}!"
    else:
        # At obstacle 15, must transform again!
        print(f"-> At obstacle 15: Transformed from {r['preBird']} to {r['postBird']}!")
        assert r['postBird'] != r['preBird'], "Bird transformed into itself at obstacle 15!"
        assert r['postTexture'] == r['postBird']
        transformation_history.append((r['preBird'], r['postBird']))

bird_at_15 = c.js("game.scene.getScene('GameScene').currentBird.id")
print(f"\n[PASS] Transformed at obstacle 15 to: {bird_at_15}")

c.shot(r"C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch\transform_obstacle_15.png")

print("\n==================================================")
print("TEST 3: Randomness & 'Never Same Bird' Across Multiple Runs")
print("==================================================")

# Run 100 simulated transformations from each of the 3 birds
for start_id in ["bird_yellow", "bird_blue", "bird_black"]:
    js_code = """(() => {
        const scene = game.scene.getScene('GameScene');
        scene.gameState = 'FLYING';
        const birds = BIRDS;
        const initial = birds.find(b => b.id === 'START_ID');
        const counts = {};
        for (let i = 0; i < 60; i++) {
            scene.currentBird = initial;
            scene.triggerBirdTransformation();
            const picked = scene.currentBird.id;
            counts[picked] = (counts[picked] || 0) + 1;
        }
        return counts;
    })()""".replace('START_ID', start_id)
    results = c.js(js_code)
    print(f"Starting from {start_id} (60 trials): picks = {results}")
    # Must NEVER pick start_id
    assert start_id not in results or results[start_id] == 0, f"{start_id} transformed into itself!"
    # Must pick BOTH other birds
    other_birds = [b for b in ["bird_yellow", "bird_blue", "bird_black"] if b != start_id]
    for ob in other_birds:
        assert ob in results and results[ob] > 10, f"Bird {ob} was not picked enough: {results}"

print("\n[ALL TESTS PASSED SUCCESSFULLY!]")
