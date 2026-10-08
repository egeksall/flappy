import sys, os
sys.path.insert(0, r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\scratch')
from cdp import CDP

c = CDP()
c.goto()
c.click(200, 505)
c.sleep(0.5)

test = c.js("""
(() => {
    const s = game.scene.getScene('GameScene');
    
    // Case 1: set velocity then add to physics group
    const c1 = s.add.container(400, 300);
    s.physics.add.existing(c1);
    c1.body.setVelocityX(-200);
    s.obstacles.add(c1);
    const v1 = c1.body.velocity.x;

    // Case 2: add to group then set velocity
    const c2 = s.add.container(400, 300);
    s.physics.add.existing(c2);
    s.obstacles.add(c2);
    c2.body.setVelocityX(-200);
    const v2 = c2.body.velocity.x;

    return { v1_after_add: v1, v2_after_set: v2 };
})()
""")
print('Test velocities:', test)
