import sys, os, time
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

OUT_DIR = r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch'

print("=== STARTING LANDSCAPE 3-LANE FIRE DRAGON TEST ===")
c = CDP()
c.goto(scene_name='DragonFlightScene')
c.sleep(1.0)

# 1. Verify Landscape Orientation
width = c.js("game.config.width")
height = c.js("game.config.height")
is_landscape = width > height
print(f"1. Canvas resolution: {width} x {height} | Landscape: {is_landscape}")
assert width == 800 and height == 450, f"Expected 800x450, got {width}x{height}"
assert is_landscape, "Game must be in landscape mode"

# 2. Verify Initial Rear-View Baby Dragon & Middle Lane
active_scene = c.js("game.scene.getScenes(true)[0].scene.key")
start_lane = c.js("game.scene.getScene('DragonFlightScene').currentLane")
start_x = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
start_y = c.js("game.scene.getScene('DragonFlightScene').dragon.y")
dragon_tex = c.js("game.scene.getScene('DragonFlightScene').dragon.texture.key")

print(f"\n2. Initial State:")
print(f"   Scene: {active_scene}")
print(f"   Start Lane: {start_lane} (1 = Middle Lane)")
print(f"   Position: ({start_x:.1f}, {start_y:.1f})")
print(f"   Texture: {dragon_tex}")

assert active_scene == 'DragonFlightScene'
assert start_lane == 1, f"Expected start in Middle lane (1), got {start_lane}"
assert abs(start_x - 400) < 5, f"Expected Middle lane X ~400, got {start_x}"
assert dragon_tex == 'dragon_rear_baby', f"Expected rear baby texture, got {dragon_tex}"

c.shot(os.path.join(OUT_DIR, "landscape_1_middle_baby.png"))

# 3. Test Left Movement via Keyboard (Middle -> Left)
print(f"\n3. Testing Left Arrow: Middle -> Left Lane...")
c.js("game.scene.getScene('DragonFlightScene').input.keyboard.emit('keydown-LEFT');")
c.sleep(0.35) # Wait for smooth tween

lane_after_left = c.js("game.scene.getScene('DragonFlightScene').currentLane")
x_after_left = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
print(f"   Lane after Left Arrow: {lane_after_left} (0 = Left Lane)")
print(f"   X position: {x_after_left:.1f} (Expected ~220)")

assert lane_after_left == 0, f"Expected Left lane (0), got {lane_after_left}"
assert abs(x_after_left - 220) < 10, f"Expected X ~220, got {x_after_left}"

c.shot(os.path.join(OUT_DIR, "landscape_2_left_lane.png"))

# 4. Test Left Boundary Check (Cannot move beyond Left Lane)
print(f"\n4. Testing Left Boundary: Pressing Left at Left lane...")
c.js("game.scene.getScene('DragonFlightScene').input.keyboard.emit('keydown-LEFT');")
c.sleep(0.25)

lane_still_left = c.js("game.scene.getScene('DragonFlightScene').currentLane")
x_still_left = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
print(f"   Lane after boundary hit: {lane_still_left} (Still 0)")
assert lane_still_left == 0, f"Dragon should NOT move past Left lane, got {lane_still_left}"
assert abs(x_still_left - 220) < 15

# 5. Test Right Movement via Keyboard (Left -> Middle)
print(f"\n5. Testing Right Arrow: Left -> Middle Lane...")
c.js("game.scene.getScene('DragonFlightScene').input.keyboard.emit('keydown-RIGHT');")
c.sleep(0.35)

lane_mid = c.js("game.scene.getScene('DragonFlightScene').currentLane")
x_mid = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
print(f"   Lane after Right Arrow: {lane_mid} (1 = Middle Lane)")
print(f"   X position: {x_mid:.1f} (Expected ~400)")

assert lane_mid == 1, f"Expected Middle lane (1), got {lane_mid}"
assert abs(x_mid - 400) < 10

# 6. Test Right Movement via Keyboard (Middle -> Right)
print(f"\n6. Testing Right Arrow: Middle -> Right Lane...")
c.js("game.scene.getScene('DragonFlightScene').input.keyboard.emit('keydown-RIGHT');")
c.sleep(0.35)

lane_right = c.js("game.scene.getScene('DragonFlightScene').currentLane")
x_right = c.js("game.scene.getScene('DragonFlightScene').dragon.x")
print(f"   Lane after Right Arrow: {lane_right} (2 = Right Lane)")
print(f"   X position: {x_right:.1f} (Expected ~580)")

assert lane_right == 2, f"Expected Right lane (2), got {lane_right}"
assert abs(x_right - 580) < 10

c.shot(os.path.join(OUT_DIR, "landscape_3_right_lane.png"))

# 7. Test Right Boundary Check (Cannot move beyond Right Lane)
print(f"\n7. Testing Right Boundary: Pressing Right at Right lane...")
c.js("game.scene.getScene('DragonFlightScene').input.keyboard.emit('keydown-RIGHT');")
c.sleep(0.25)

lane_still_right = c.js("game.scene.getScene('DragonFlightScene').currentLane")
print(f"   Lane after boundary hit: {lane_still_right} (Still 2)")
assert lane_still_right == 2, f"Dragon should NOT move past Right lane, got {lane_still_right}"

# 8. Test On-Screen Button Controls (Touch / Mouse Click)
print(f"\n8. Testing On-Screen Buttons...")
# Click Left On-Screen Button to move Right -> Middle
c.js("game.scene.getScene('DragonFlightScene').btnLeft.emit('pointerdown');")
c.sleep(0.35)

btn_lane_mid = c.js("game.scene.getScene('DragonFlightScene').currentLane")
print(f"   Lane after On-Screen Left Button: {btn_lane_mid} (Expected 1)")
assert btn_lane_mid == 1, f"Expected 1, got {btn_lane_mid}"

# Click Left On-Screen Button again to move Middle -> Left
c.js("game.scene.getScene('DragonFlightScene').btnLeft.emit('pointerdown');")
c.sleep(0.35)

btn_lane_left = c.js("game.scene.getScene('DragonFlightScene').currentLane")
print(f"   Lane after second On-Screen Left Button: {btn_lane_left} (Expected 0)")
assert btn_lane_left == 0, f"Expected 0, got {btn_lane_left}"

# Click Right On-Screen Button to move Left -> Middle
c.js("game.scene.getScene('DragonFlightScene').btnRight.emit('pointerdown');")
c.sleep(0.35)
assert c.js("game.scene.getScene('DragonFlightScene').currentLane") == 1

# 9. Test Dragon Evolution in Rear-View (Teen & Mature)
print(f"\n9. Testing Rear-View Evolution Stages...")
# Evolve to Teen
c.js("game.scene.getScene('DragonFlightScene').setDragonStage(1);")
c.sleep(0.5)

teen_tex = c.js("game.scene.getScene('DragonFlightScene').dragon.texture.key")
teen_w = c.js("game.scene.getScene('DragonFlightScene').dragon.width")
print(f"   Teen Dragon Texture: {teen_tex}, Frame Width: {teen_w}")
assert teen_tex == 'dragon_rear_teen'
assert teen_w > 130, f"Teen rear view should be larger than baby, got {teen_w}"

c.shot(os.path.join(OUT_DIR, "landscape_4_teen_rear.png"))

# Evolve to Mature
c.js("game.scene.getScene('DragonFlightScene').setDragonStage(2);")
c.sleep(0.5)

mature_tex = c.js("game.scene.getScene('DragonFlightScene').dragon.texture.key")
mature_w = c.js("game.scene.getScene('DragonFlightScene').dragon.width")
print(f"   Mature Dragon Texture: {mature_tex}, Frame Width: {mature_w}")
assert mature_tex == 'dragon_rear_mature'
assert mature_w > teen_w, f"Mature rear view should be larger than teen, got {mature_w}"

c.shot(os.path.join(OUT_DIR, "landscape_5_mature_rear.png"))

# 10. Verify Continuous Forward Movement (Runway progress)
print(f"\n10. Testing Continuous Forward Flight...")
tie_0_before = c.js("game.scene.getScene('DragonFlightScene').runwayTies[0]")
c.sleep(0.5)
tie_0_after = c.js("game.scene.getScene('DragonFlightScene').runwayTies[0]")
print(f"   Runway tie advance: {tie_0_before:.4f} -> {tie_0_after:.4f}")
assert tie_0_after != tie_0_before, "Runway should continuously advance forward"

print("\n=== ALL LANDSCAPE 3-LANE FIRE DRAGON TESTS PASSED! ===")
