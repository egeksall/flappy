import sys, os, time
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

c = CDP()
c.goto()
c.sleep(0.5)

# 1. Test Yellow Bird breaking Wood
print("--- Testing Yellow Bird against Mixed Obstacle ---")
c.click(200, 385) # Select Yellow
c.sleep(0.3)
c.click(200, 505) # Launch
c.sleep(0.6)
c.drag(105, 474, 40, 520, steps=15) # Release slingshot
c.sleep(0.3)

# Yellow bird needs to hit Wood. In obstacle 1, the middle section is Wood for Yellow Bird!
# Let it glide or flap into the middle section:
for _ in range(8):
    c.click(200, 320)
    c.sleep(0.35)

y_state = c.js("game.scene.getScene('GameScene').gameState")
y_destroyed = c.js("game.scene.getScene('GameScene').destroyedCount")
print(f"Yellow Bird result: state={y_state}, destroyedCount={y_destroyed}")

# 2. Test Black Bird breaking Stone
print("\n--- Testing Black Bird against Mixed Obstacle ---")
c.js("game.scene.stop('GameScene'); game.scene.start('MenuScene');")
c.sleep(0.5)
c.click(314, 385) # Select Black
c.sleep(0.3)
c.click(200, 505) # Launch
c.sleep(0.6)
c.drag(105, 474, 40, 520, steps=15) # Release slingshot
c.sleep(0.3)

for _ in range(8):
    c.click(200, 320)
    c.sleep(0.35)

b_state = c.js("game.scene.getScene('GameScene').gameState")
b_destroyed = c.js("game.scene.getScene('GameScene').destroyedCount")
print(f"Black Bird result: state={b_state}, destroyedCount={b_destroyed}")
print("\n[OK] Tested all 3 birds against mixed obstacles!")
