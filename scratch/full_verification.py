import sys, os, time
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

OUT_DIR = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch'

print("=== STARTING FULL VERIFICATION SUITE ===")
c = CDP()
c.goto()
c.sleep(0.5)

results = {
    'bird_blue': False,
    'bird_yellow': False,
    'bird_black': False,
    'obstacle_spawned': False,
    'obstacle_moving': False,
    'obstacle_multiple': False,
    'obstacle_visible_on_screen': False
}

# -------------------------------------------------------------
# TEST 1: BIRD SELECTION (BLUE, YELLOW, BLACK) WITH REAL CLICKS
# -------------------------------------------------------------
for bird_idx, bird_name, bird_id, card_x in [
    (0, 'Blue Bird', 'bird_blue', 86),
    (1, 'Yellow Bird', 'bird_yellow', 200),
    (2, 'Black Bird', 'bird_black', 314)
]:
    print(f"\n--- Testing Selection for {bird_name} (index {bird_idx}) ---")
    # Ensure on MenuScene
    current_scenes = c.js("game.scene.getScenes(true).map(s => s.scene.key)")
    if 'GameScene' in current_scenes:
        c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
        c.sleep(0.5)

    # Click card with real mouse click
    c.click(card_x, 385)
    c.sleep(0.3)
    selected_in_menu = c.js("selectedBirdIndex")
    preview_key = c.js("game.scene.getScene('MenuScene').birdPreview.texture.key")
    print(f"  Menu selectedBirdIndex: {selected_in_menu}, preview texture: {preview_key}")
    assert selected_in_menu == bird_idx, f"Expected {bird_idx}, got {selected_in_menu}"

    # Click Launch Slingshot button with real mouse click (200, 505)
    c.click(200, 505)
    c.sleep(0.6)

    # Verify GameScene has loaded the chosen bird
    gs_bird = c.js("game.scene.getScene('GameScene').bird ? game.scene.getScene('GameScene').bird.texture.key : null")
    gs_curr = c.js("game.scene.getScene('GameScene').currentBird ? game.scene.getScene('GameScene').currentBird.id : null")
    print(f"  GameScene bird sprite texture: {gs_bird}, currentBird.id: {gs_curr}")

    assert gs_bird == bird_id, f"FAIL: Expected {bird_id} in GameScene, got {gs_bird}"
    assert gs_curr == bird_id, f"FAIL: Expected {bird_id} currentBird, got {gs_curr}"
    results[bird_id] = True
    print(f"  PASS: {bird_name} correctly launched into slingshot!")

    shot_path = os.path.join(OUT_DIR, f"{bird_id}_verified.png")
    c.shot(shot_path)

# -------------------------------------------------------------
# TEST 2: OBSTACLES APPEARANCE & MOVEMENT
# -------------------------------------------------------------
print("\n--- Testing Vertical Obstacles Appearance & Movement ---")
# Slingshot launch: drag from (105, 474) backwards to (40, 520) and release
c.drag(105, 474, 40, 520, steps=15)
c.sleep(0.2)
state = c.js("game.scene.getScene('GameScene').gameState")
print(f"  State after slingshot launch: {state}")

# Flap and monitor obstacles as they spawn and move
positions_seen = []
shot_taken = False

for step in range(16):
    # Tap to flap
    c.click(200, 320)
    c.sleep(0.35)

    obs_data = c.js("""
    (() => {
        const s = game.scene.getScene('GameScene');
        if (!s || !s.obstacles) return null;
        return s.obstacles.getChildren().map(o => ({
            id: o.material ? o.material.id : 'unknown',
            name: o.material ? o.material.name : 'unknown',
            x: Math.round(o.x),
            vx: o.body ? Math.round(o.body.velocity.x) : 0,
            visible: o.visible
        }));
    })()
    """)

    state = c.js("game.scene.getScene('GameScene').gameState")
    print(f"  t~{(step+1)*0.35:.1f}s | state={state} | obstacles={obs_data}")

    if obs_data and len(obs_data) > 0:
        results['obstacle_spawned'] = True
        for o in obs_data:
            positions_seen.append(o['x'])
            if 0 < o['x'] < 400: # On screen!
                results['obstacle_visible_on_screen'] = True
                if not shot_taken:
                    c.shot(os.path.join(OUT_DIR, "obstacle_visible.png"))
                    shot_taken = True
        if len(obs_data) >= 2:
            results['obstacle_multiple'] = True

# Check if obstacle moved across the screen
if len(positions_seen) >= 2:
    min_x = min(positions_seen)
    max_x = max(positions_seen)
    print(f"  Obstacle X positions range: min={min_x}, max={max_x}")
    if min_x < max_x:
        results['obstacle_moving'] = True

print("\n=== FINAL TEST RESULTS ===")
for k, v in results.items():
    print(f"  [{'OK' if v else 'FAIL'}] {k}: {v}")

assert all(results.values()), f"Some tests failed: {results}"
print("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!")
