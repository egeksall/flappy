import sys, os
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

c = CDP()
c.goto()
c.click(200, 505) # Start GameScene
c.sleep(0.5)

info = c.js("""
(() => {
    const s = game.scene.getScene('GameScene');
    s.gameState = GAME_STATE.FLYING;
    s.spawnVerticalObstacle(MATERIALS.WOOD);
    const p = s.obstacles.getChildren()[0];
    return {
        initialX: p.x,
        initialBodyX: p.body.x,
        vxAfterSpawn: p.body.velocity.x
    };
})()
""")
print('Spawn info:', info)

c.sleep(0.5)

after = c.js("""
(() => {
    const s = game.scene.getScene('GameScene');
    const p = s.obstacles.getChildren()[0];
    return {
        x: p.x,
        bodyX: p.body.x,
        vx: p.body.velocity.x
    };
})()
""")
print('After 0.5s:', after)
