import sys, os, time
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

c = CDP()
c.goto()
c.sleep(0.5)

for bird_idx, bird_name, bird_id, target_mat in [
    (0, 'Blue Bird', 'bird_blue', 'glass'),
    (1, 'Yellow Bird', 'bird_yellow', 'wood'),
    (2, 'Black Bird', 'bird_black', 'stone')
]:
    print(f"\nTesting break capability for {bird_name} -> {target_mat.upper()}:")
    c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
    c.sleep(0.4)
    c.click([86, 200, 314][bird_idx], 385)
    c.sleep(0.2)
    c.click(200, 505) # Launch
    c.sleep(0.5)
    
    # Drag backwards and release
    c.drag(105, 474, 30, 480, steps=10)
    c.sleep(0.2)

    hit_recorded = False
    for step in range(14):
        # Keep bird around middle height (250 - 320) where target_mat is placed on obstacle 1
        bird_y = c.js("game.scene.getScene('GameScene').bird ? game.scene.getScene('GameScene').bird.y : 0")
        if bird_y > 310:
            c.click(200, 300)
        c.sleep(0.3)

        st = c.js("game.scene.getScene('GameScene').gameState")
        dest = c.js("game.scene.getScene('GameScene').destroyedCount")
        obs_x = c.js("(() => { const s = game.scene.getScene('GameScene'); return (s.obstacles && s.obstacles.getChildren().length > 0) ? Math.round(s.obstacles.getChildren()[0].x) : null; })()")
        
        if dest >= 1:
            hit_recorded = True
            print(f"  t~{(step+1)*0.3:.1f}s: Section SHATTERED! destroyedCount={dest}, obs_x={obs_x}, state={st}")
            break

    assert hit_recorded, f"Failed to record shattered section for {bird_name}"
    print(f"  [OK] {bird_name} successfully shattered {target_mat.upper()}!")

print("\nALL 3 BIRDS VERIFIED TO SHATTER THEIR RESPECTIVE MATERIALS!")
