import sys, os, time
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

OUT_DIR = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch'

print("=== STARTING FIRE DRAGON VERIFICATION TEST ===")
c = CDP()
c.goto()
c.sleep(1.0)

# 1. Orientation & Config Check
width = c.js("game.config.width")
height = c.js("game.config.height")
gravity_y = c.js("game.config.physics.arcade.gravity.y")
active_scene = c.js("game.scene.getScenes(true)[0].scene.key")
print(f"1. Canvas resolution: {width} x {height} (Portrait orientation: {height > width})")
print(f"   Arcade Gravity Y: {gravity_y}")
print(f"   Active Scene: {active_scene}")

assert width == 400 and height == 700, f"Expected 400x700, got {width}x{height}"
assert gravity_y == 0, f"Expected 0 gravity, got {gravity_y}"
assert active_scene == 'DragonFlightScene', f"Expected DragonFlightScene, got {active_scene}"

# 2. Baby Fire Dragon Check
stage_idx = c.js("game.scene.getScene('DragonFlightScene').currentStageIndex")
dragon_texture = c.js("game.scene.getScene('DragonFlightScene').dragon.texture.key")
dragon_x = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
dragon_y = c.js("game.scene.getScene('DragonFlightScene').dragon.y")
print(f"\n2. Baby Fire Dragon initial state:")
print(f"   Stage Index: {stage_idx} (0 = Baby)")
print(f"   Texture: {dragon_texture}")
print(f"   Position: ({dragon_x:.1f}, {dragon_y:.1f})")

assert stage_idx == 0, "Initial stage should be 0 (Baby)"
assert dragon_texture == 'dragon_baby', f"Expected dragon_baby, got {dragon_texture}"

c.shot(os.path.join(OUT_DIR, "dragon_test_1_baby_initial.png"))

# 3. Test Dragging Baby Dragon
print(f"\n3. Testing dragging Baby Dragon across the screen...")
# Drag from (200, 350) to (120, 220)
c.js("""
(() => {
    const scene = game.scene.getScene('DragonFlightScene');
    scene.input.emit('pointerdown', { x: scene.currentX, y: scene.currentY });
    scene.input.emit('pointermove', { x: 120, y: 220 });
})()
""")
c.sleep(0.5)

new_x = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
new_y = c.js("game.scene.getScene('DragonFlightScene').dragon.y")
print(f"   Dragged position after pointermove: ({new_x:.1f}, {new_y:.1f})")
assert abs(new_x - 120) < 30 and abs(new_y - 220) < 30, f"Dragon should have moved near (120, 220), got ({new_x}, {new_y})"

# 4. Test Zero Gravity (Release and check if it falls)
print(f"\n4. Testing Zero Gravity: Releasing dragon and waiting 1.5 seconds...")
c.js("game.scene.getScene('DragonFlightScene').input.emit('pointerup');")
c.sleep(1.5)

after_release_y = c.js("game.scene.getScene('DragonFlightScene').dragon.y")
print(f"   Position 1.5s after release: Y = {after_release_y:.1f}")
# If gravity existed, it would have fallen down (Y > 500 or offscreen)
assert abs(after_release_y - 220) < 25, f"Dragon should NOT fall due to gravity! Expected ~220, got {after_release_y}"
print("   PASS: Dragon hovers gracefully in place with ZERO falling/gravity!")

c.shot(os.path.join(OUT_DIR, "dragon_test_2_baby_hover.png"))

# 5. Test Teen Fire Dragon Evolution
print(f"\n5. Testing Teen Fire Dragon Evolution (Button 2)...")
c.js("game.scene.getScene('DragonFlightScene').setDragonStage(1);")
c.sleep(0.6)

teen_stage = c.js("game.scene.getScene('DragonFlightScene').currentStageIndex")
teen_tex = c.js("game.scene.getScene('DragonFlightScene').dragon.texture.key")
teen_w = c.js("game.scene.getScene('DragonFlightScene').dragon.displayWidth")
teen_h = c.js("game.scene.getScene('DragonFlightScene').dragon.displayHeight")
print(f"   Teen stage: {teen_stage}, texture: {teen_tex}, display size: ({teen_w:.1f}, {teen_h:.1f})")

assert teen_stage == 1, "Expected stage 1 for Teen"
assert teen_tex == 'dragon_teen', f"Expected dragon_teen, got {teen_tex}"
assert teen_w > 100, f"Teen dragon should be visibly larger than baby, got width {teen_w}"

# Drag Teen Dragon to a new spot
c.js("""
(() => {
    const scene = game.scene.getScene('DragonFlightScene');
    scene.input.emit('pointerdown', { x: scene.currentX, y: scene.currentY });
    scene.input.emit('pointermove', { x: 280, y: 380 });
    scene.input.emit('pointerup');
})()
""")
c.sleep(0.5)
c.shot(os.path.join(OUT_DIR, "dragon_test_3_teen_stage.png"))

# 6. Test Mature Fire Dragon Evolution
print(f"\n6. Testing Mature Fire Dragon Evolution (Button 3)...")
c.js("game.scene.getScene('DragonFlightScene').setDragonStage(2);")
c.sleep(0.6)

mature_stage = c.js("game.scene.getScene('DragonFlightScene').currentStageIndex")
mature_tex = c.js("game.scene.getScene('DragonFlightScene').dragon.texture.key")
mature_w = c.js("game.scene.getScene('DragonFlightScene').dragon.displayWidth")
mature_h = c.js("game.scene.getScene('DragonFlightScene').dragon.displayHeight")
print(f"   Mature stage: {mature_stage}, texture: {mature_tex}, display size: ({mature_w:.1f}, {mature_h:.1f})")

assert mature_stage == 2, "Expected stage 2 for Mature"
assert mature_tex == 'dragon_mature', f"Expected dragon_mature, got {mature_tex}"
assert mature_w > teen_w, f"Mature dragon should be visibly larger than Teen ({mature_w} vs {teen_w})"

# Drag Mature Dragon to center
c.js("""
(() => {
    const scene = game.scene.getScene('DragonFlightScene');
    scene.input.emit('pointerdown', { x: scene.currentX, y: scene.currentY });
    scene.input.emit('pointermove', { x: 200, y: 320 });
    scene.input.emit('pointerup');
})()
""")
c.sleep(0.5)
c.shot(os.path.join(OUT_DIR, "dragon_test_4_mature_stage.png"))

# 7. Check for absence of old bird game mechanics
print(f"\n7. Checking absence of old bird mechanics...")
has_old_birds = c.js("typeof window.BIRDS !== 'undefined'")
has_old_pipes = c.js("typeof window.MATERIALS !== 'undefined'")
has_old_slingshot = c.js("typeof window.GAME_STATE !== 'undefined' && typeof window.GAME_STATE.SLINGSHOT_READY !== 'undefined'")
print(f"   Old BIRDS global exists: {has_old_birds}")
print(f"   Old MATERIALS global exists: {has_old_pipes}")
print(f"   Old SLINGSHOT state exists: {has_old_slingshot}")

assert not has_old_birds, "Old BIRDS definition should not be present"
assert not has_old_pipes, "Old MATERIALS definition should not be present"
assert not has_old_slingshot, "Old slingshot state should not be present"

print("\n=== ALL FIRE DRAGON VERIFICATION TESTS PASSED SUCCESSFULLY! ===")
