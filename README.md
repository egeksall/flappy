# 🏹 Angry Flappy (Flappy Bird + Angry Birds Hybrid)

> A polished hybrid arcade game combining the iconic mechanics of **Angry Birds** (slingshot aiming & launch, material destruction) and **Flappy Bird** (tap-to-flap flying & gravity). Built on **Phaser 3** and optimized for both desktop and mobile web.

---

## 🎮 Core Gameplay Flow (v1.1)

1. **Main Menu Bird Selection (Fixed & Enhanced)**:
   - 🔵 **Blue Bird**: Specializes in destroying **Glass 🪟**.
   - 🟡 **Yellow Bird**: Specializes in destroying **Wood 🪵**.
   - ⚫ **Black Bird**: Specializes in destroying **Stone 🪨**.
   - **Bulletproof Selection**: Tap/click anywhere on the bird cards or use the `◀` and `▶` arrows. The selected bird receives a vibrant active highlight, glowing pedestal, and `"✔ SELECTED"` badge. Whichever bird you choose is passed directly into the slingshot!

2. **Angry Birds Slingshot Launch**:
   - The selected bird begins loaded inside a wooden slingshot anchored on the ground.
   - **Click / Touch & Drag** the bird backward in any direction or angle.
   - Dynamic latex rubber bands stretch in real time between the slingshot prongs and leather pouch.
   - Ballistic trajectory dots preview the projected launch arc.
   - **Release** to launch the bird into flight!
   - **Slingshot Disappears**: Upon launch, the slingshot smoothly vanishes and is removed from the flight.

3. **Flappy Bird Flying & Gravity**:
   - **Tap / Click / Spacebar** to flap wings and gain upward altitude.
   - **Continuous Gravity** pulls the bird down when not flapping.
   - Smooth diving and rising rotation physics matching vertical velocity.

4. **Solid Vertical Obstacles (No Gaps / Openings)**:
   - As the bird flies, it encounters solid vertical structures spanning from ceiling to ground.
   - Three distinct materials with custom textures:
     - 🪟 **Glass**: Translucent crystal pane with cyan gleam.
     - 🪵 **Wood**: Reinforced planks with steel brackets & rivets.
     - 🪨 **Stone**: Heavy chiseled granite masonry bricks.

5. **Bird vs. Material Destruction Rules**:
   - 🔵 **Blue Bird + 🪟 Glass** → ✅ **Glass Shatters!** Explosive glass shards, crystal audio fx, and bird soars right through!
   - 🟡 **Yellow Bird + 🪵 Wood** → ✅ **Wood Splinters!** Flying wood splinters, crunchy cracking audio, and bird continues flying!
   - ⚫ **Black Bird + 🪨 Stone** → ✅ **Stone Smashed!** Flying rock rubble chunks, deep stone smash rumble, and bird breaks through!
   - ❌ **Incompatible Hits** (e.g. Blue Bird hitting Wood or Stone) → Solid barrier crash! Feathers explode, impact sound plays, and a crash modal explains which bird can break that material.

---

## 🕹️ Controls

| Action | Desktop | Mobile / Touch |
| :--- | :--- | :--- |
| **Select Bird** | Click card or `◀` `▶` arrows | Tap card or `◀` `▶` arrows |
| **Aim Slingshot** | Click & drag bird backward | Touch & drag bird backward |
| **Launch Bird** | Release mouse button | Release finger |
| **Flap Wings** | Tap screen / `Spacebar` / `Up Arrow` | Tap anywhere on screen |
| **Retry / Switch Birds** | Click buttons or press `Spacebar` | Tap on-screen buttons |

---

## 🖥️ Running Locally

Double-click `Play_Game.bat` or run:

```bash
python serve.py
```

Then open `http://localhost:8080` in your web browser.
