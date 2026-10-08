import os
import math
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets', exist_ok=True)

# -------------------------------------------------------------
# 1. PLAYABLE BIRDS (Blue, Yellow, Black)
# 3 frames each: 64x48 per frame => 192x48 spritesheet
# -------------------------------------------------------------
def generate_playable_bird(filename, bird_type):
    frame_w, frame_h = 64, 48
    sheet = Image.new('RGBA', (frame_w * 3, frame_h), (0, 0, 0, 0))

    wing_offsets = [
        (-8, -12),  # Frame 0: Wing up
        (0, 0),     # Frame 1: Wing mid
        (6, 10),    # Frame 2: Wing down
    ]

    for i in range(3):
        img = Image.new('RGBA', (frame_w, frame_h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        cx, cy = 30, 25

        if bird_type == 'blue':
            # 🔵 BLUE BIRD (Playful, round, sky blue)
            base_color = (45, 145, 245, 255)
            belly_color = (165, 225, 255, 255)
            wing_color = (25, 110, 210, 255)
            beak_color = (255, 150, 20, 255)
            eye_rim = (15, 60, 120, 240)
            tail_color = (20, 95, 190, 255)

            # Shadow
            draw.ellipse([cx - 18, cy - 15, cx + 16, cy + 15], fill=(10, 30, 60, 60))
            # Body
            draw.ellipse([cx - 17, cy - 16, cx + 15, cy + 14], fill=base_color)
            # Belly
            draw.ellipse([cx - 12, cy - 4, cx + 9, cy + 13], fill=belly_color)

            # Head crest / tuft feathers
            draw.polygon([(cx - 8, cy - 15), (cx - 14, cy - 23), (cx - 3, cy - 17)], fill=base_color)
            draw.polygon([(cx - 2, cy - 16), (cx + 1, cy - 24), (cx + 5, cy - 16)], fill=wing_color)

            # Tail feathers
            draw.polygon([(cx - 16, cy - 2), (cx - 24, cy - 6), (cx - 19, cy + 1)], fill=tail_color)
            draw.polygon([(cx - 16, cy + 1), (cx - 25, cy + 4), (cx - 18, cy + 7)], fill=tail_color)

            # Cheerful blush cheek
            draw.ellipse([cx + 1, cy + 2, cx + 8, cy + 8], fill=(255, 130, 150, 120))

            # Big expressive eye
            draw.ellipse([cx + 2, cy - 13, cx + 15, cy + 1], fill=(255, 255, 255, 255))
            draw.ellipse([cx + 1, cy - 14, cx + 16, cy + 2], outline=eye_rim, width=1)
            # Pupil
            draw.ellipse([cx + 7, cy - 9, cx + 14, cy - 1], fill=(20, 25, 35, 255))
            # Eye specular glints
            draw.ellipse([cx + 9, cy - 9, cx + 13, cy - 5], fill=(255, 255, 255, 255))
            draw.ellipse([cx + 7, cy - 4, cx + 9, cy - 2], fill=(255, 255, 255, 200))

            # Beak
            draw.polygon([(cx + 12, cy - 3), (cx + 25, cy + 1), (cx + 12, cy + 6)], fill=beak_color)
            draw.line([(cx + 12, cy + 1), (cx + 23, cy + 1)], fill=(190, 70, 0, 220), width=1)

        elif bird_type == 'yellow':
            # 🟡 YELLOW BIRD (Sleek, aerodynamic speedster Chuck-style)
            base_color = (255, 215, 20, 255)
            belly_color = (255, 245, 155, 255)
            wing_color = (235, 175, 10, 255)
            beak_color = (255, 105, 15, 255)
            eye_rim = (120, 80, 10, 240)
            tail_color = (30, 30, 35, 255)

            # Shadow
            draw.polygon([(cx - 20, cy + 14), (cx + 16, cy + 14), (cx + 6, cy - 18), (cx - 16, cy - 10)], fill=(60, 50, 10, 50))

            # Triangular / Sleek Body
            # Back curve to top point to front chest
            body_points = [
                (cx - 18, cy + 13),
                (cx + 14, cy + 12),
                (cx + 15, cy - 2),
                (cx + 6, cy - 19),
                (cx - 2, cy - 17),
                (cx - 17, cy - 4)
            ]
            draw.polygon(body_points, fill=base_color)
            # Rounded corners overlay
            draw.ellipse([cx - 18, cy - 8, cx + 14, cy + 14], fill=base_color)

            # Light belly
            draw.ellipse([cx - 12, cy - 2, cx + 11, cy + 13], fill=belly_color)

            # Sleek Black Tuft on Top (Chuck signature)
            draw.polygon([(cx + 4, cy - 17), (cx - 6, cy - 26), (cx - 1, cy - 18)], fill=(30, 30, 35, 255))
            draw.polygon([(cx + 2, cy - 18), (cx - 12, cy - 24), (cx - 4, cy - 17)], fill=(45, 45, 50, 255))

            # Spiky Black Tail
            draw.polygon([(cx - 17, cy + 1), (cx - 27, cy - 3), (cx - 19, cy + 5)], fill=tail_color)
            draw.polygon([(cx - 18, cy + 5), (cx - 26, cy + 8), (cx - 18, cy + 10)], fill=tail_color)

            # Confident eyebrows
            draw.line([(cx + 2, cy - 14), (cx + 15, cy - 10)], fill=(180, 50, 10, 255), width=2)

            # Eye
            draw.ellipse([cx + 3, cy - 12, cx + 15, cy], fill=(255, 255, 255, 255))
            draw.ellipse([cx + 2, cy - 13, cx + 16, cy + 1], outline=eye_rim, width=1)
            # Pupil
            draw.ellipse([cx + 7, cy - 9, cx + 14, cy - 2], fill=(25, 25, 30, 255))
            # Glint
            draw.ellipse([cx + 9, cy - 9, cx + 13, cy - 5], fill=(255, 255, 255, 255))

            # Long Sharp Beak
            draw.polygon([(cx + 12, cy - 4), (cx + 28, cy + 1), (cx + 12, cy + 6)], fill=beak_color)
            draw.line([(cx + 12, cy + 1), (cx + 26, cy + 1)], fill=(180, 40, 0, 220), width=1)

        elif bird_type == 'black':
            # ⚫ BLACK BIRD (Heavy, round, bomb-style with top fuse feather)
            base_color = (38, 40, 48, 255)
            belly_color = (75, 78, 90, 255)
            wing_color = (25, 26, 32, 255)
            beak_color = (255, 145, 15, 255)
            eye_rim = (15, 15, 20, 255)
            tail_color = (20, 20, 25, 255)

            # Shadow
            draw.ellipse([cx - 20, cy - 17, cx + 18, cy + 17], fill=(10, 10, 15, 70))
            # Big Round Body
            draw.ellipse([cx - 19, cy - 18, cx + 17, cy + 16], fill=base_color)
            # Subtle Charcoal/Slate Belly
            draw.ellipse([cx - 13, cy - 4, cx + 11, cy + 14], fill=belly_color)

            # Top Fuse Feather with Glowing Tip
            draw.line([(cx - 2, cy - 17), (cx - 4, cy - 25)], fill=(30, 30, 35, 255), width=3)
            # Glowing Fuse Spark / Yellow-Orange Tip
            draw.ellipse([cx - 8, cy - 29, cx - 1, cy - 22], fill=(255, 210, 30, 255))
            draw.ellipse([cx - 6, cy - 27, cx - 3, cy - 24], fill=(255, 255, 200, 255))

            # Short sturdy tail
            draw.polygon([(cx - 18, cy - 1), (cx - 26, cy - 5), (cx - 21, cy + 4)], fill=tail_color)
            draw.polygon([(cx - 18, cy + 3), (cx - 25, cy + 7), (cx - 19, cy + 9)], fill=tail_color)

            # Red / Crimson Determined Brow Marking
            draw.polygon([(cx + 1, cy - 16), (cx + 16, cy - 12), (cx + 14, cy - 9), (cx + 2, cy - 12)], fill=(235, 60, 40, 255))

            # Eye
            draw.ellipse([cx + 3, cy - 11, cx + 15, cy + 1], fill=(255, 255, 255, 255))
            draw.ellipse([cx + 2, cy - 12, cx + 16, cy + 2], outline=eye_rim, width=1)
            # Pupil (determined, slightly forward)
            draw.ellipse([cx + 8, cy - 8, cx + 14, cy - 1], fill=(15, 15, 20, 255))
            # Glint
            draw.ellipse([cx + 9, cy - 8, cx + 13, cy - 5], fill=(255, 255, 255, 255))

            # Robust Beak
            draw.polygon([(cx + 12, cy - 3), (cx + 26, cy + 2), (cx + 12, cy + 7)], fill=beak_color)
            draw.line([(cx + 12, cy + 2), (cx + 24, cy + 2)], fill=(180, 50, 0, 220), width=1)

        # Flapping Wing for all birds
        wo_x, wo_y = wing_offsets[i]
        wx, wy = cx - 4 + wo_x * 0.4, cy + wo_y * 0.5
        if i == 0:  # UP
            draw.polygon([(wx - 8, wy + 4), (wx - 2, wy - 14), (wx + 8, wy - 10), (wx + 5, wy + 5)], fill=wing_color)
            draw.polygon([(wx - 4, wy + 2), (wx, wy - 10), (wx + 6, wy - 8)], fill=belly_color)
        elif i == 1:  # MID
            draw.ellipse([wx - 10, wy - 6, wx + 6, wy + 6], fill=wing_color)
            draw.ellipse([wx - 6, wy - 4, wx + 3, wy + 4], fill=belly_color)
        else:  # DOWN
            draw.polygon([(wx - 8, wy - 6), (wx + 4, wy - 4), (wx + 2, wy + 14), (wx - 6, wy + 10)], fill=wing_color)
            draw.polygon([(wx - 5, wy - 4), (wx + 2, wy - 2), (wx, wy + 10)], fill=belly_color)

        sheet.paste(img, (i * frame_w, 0))

    sheet.save(filename)
    print(f"Generated {filename}")

# Generate the 3 playable birds
generate_playable_bird('assets/bird_blue.png', 'blue')
generate_playable_bird('assets/bird_yellow.png', 'yellow')
generate_playable_bird('assets/bird_black.png', 'black')

# -------------------------------------------------------------
# 2. SLINGSHOT ASSET (Iconic wooden fork with grain & fork depth)
# -------------------------------------------------------------
def generate_slingshot():
    # Width 80, Height 140
    w, h = 80, 140
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Slingshot wood colors
    c_wood_dark = (95, 52, 20, 255)
    c_wood_mid = (145, 85, 38, 255)
    c_wood_light = (190, 122, 65, 255)
    c_leather = (65, 38, 18, 255)

    # Main Trunk base (x: 32 to 48, y: 55 to 140)
    # Ground shadow
    draw.ellipse([20, 130, 60, 139], fill=(0, 0, 0, 70))

    # Base stem
    draw.polygon([(34, 55), (46, 55), (48, 135), (32, 135)], fill=c_wood_mid)
    # Base highlight and shadow stripes
    draw.line([(35, 55), (33, 135)], fill=c_wood_dark, width=2)
    draw.line([(40, 55), (39, 135)], fill=c_wood_light, width=3)
    draw.line([(45, 55), (47, 135)], fill=c_wood_dark, width=2)

    # Left Prong (branches out to top left: x: 12, y: 15)
    draw.polygon([(34, 65), (38, 50), (18, 12), (10, 16), (28, 62)], fill=c_wood_mid)
    draw.line([(11, 16), (29, 62)], fill=c_wood_dark, width=2)
    draw.line([(15, 14), (33, 56)], fill=c_wood_light, width=2)

    # Right Prong (branches out to top right: x: 68, y: 15)
    draw.polygon([(42, 50), (46, 65), (52, 62), (70, 16), (62, 12)], fill=c_wood_mid)
    draw.line([(69, 16), (51, 62)], fill=c_wood_dark, width=2)
    draw.line([(65, 14), (47, 56)], fill=c_wood_light, width=2)

    # Fork joint junction cap
    draw.ellipse([32, 48, 48, 66], fill=c_wood_mid)
    draw.ellipse([34, 50, 46, 64], fill=c_wood_light)

    # Leather attachment bands on prongs
    # Left attachment band
    draw.ellipse([8, 10, 20, 22], fill=c_leather)
    draw.ellipse([10, 12, 18, 20], fill=(130, 80, 40, 255))
    # Right attachment band
    draw.ellipse([60, 10, 72, 22], fill=c_leather)
    draw.ellipse([62, 12, 70, 20], fill=(130, 80, 40, 255))

    img.save('assets/slingshot.png')
    print("Generated assets/slingshot.png")

    # Also generate Slingshot Front & Back Fork for layered rendering
    # Back prong only (renders behind the bird and rubber band)
    img_back = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw_b = ImageDraw.Draw(img_back)
    draw_b.polygon([(34, 65), (38, 50), (18, 12), (10, 16), (28, 62)], fill=c_wood_mid)
    draw_b.line([(11, 16), (29, 62)], fill=c_wood_dark, width=2)
    draw_b.line([(15, 14), (33, 56)], fill=c_wood_light, width=2)
    draw_b.ellipse([8, 10, 20, 22], fill=c_leather)
    img_back.save('assets/slingshot_back.png')

    # Front prong and stem (renders in front of bird and back band)
    img_front = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw_f = ImageDraw.Draw(img_front)
    draw_f.ellipse([20, 130, 60, 139], fill=(0, 0, 0, 70))
    draw_f.polygon([(34, 55), (46, 55), (48, 135), (32, 135)], fill=c_wood_mid)
    draw_f.line([(35, 55), (33, 135)], fill=c_wood_dark, width=2)
    draw_f.line([(40, 55), (39, 135)], fill=c_wood_light, width=3)
    draw_f.line([(45, 55), (47, 135)], fill=c_wood_dark, width=2)
    draw_f.ellipse([32, 48, 48, 66], fill=c_wood_mid)
    draw_f.polygon([(42, 50), (46, 65), (52, 62), (70, 16), (62, 12)], fill=c_wood_mid)
    draw_f.line([(69, 16), (51, 62)], fill=c_wood_dark, width=2)
    draw_f.line([(65, 14), (47, 56)], fill=c_wood_light, width=2)
    draw_f.ellipse([60, 10, 72, 22], fill=c_leather)
    img_front.save('assets/slingshot_front.png')
    print("Generated assets/slingshot_front.png and slingshot_back.png")

generate_slingshot()

# -------------------------------------------------------------
# 3. TRAJECTORY DOT & POUCH & PUFF
# -------------------------------------------------------------
def generate_particles():
    # Trajectory Dot (14x14 glow dot)
    dot = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    draw_d = ImageDraw.Draw(dot)
    draw_d.ellipse([1, 1, 14, 14], fill=(255, 255, 255, 230))
    draw_d.ellipse([3, 3, 12, 12], fill=(255, 235, 80, 255))
    draw_d.ellipse([5, 5, 10, 10], fill=(255, 255, 255, 255))
    dot.save('assets/trajectory_dot.png')

    # Leather Pouch (22x26)
    pouch = Image.new('RGBA', (24, 28), (0, 0, 0, 0))
    draw_p = ImageDraw.Draw(pouch)
    draw_p.ellipse([2, 2, 21, 25], fill=(70, 40, 20, 255))
    draw_p.ellipse([4, 4, 19, 23], fill=(110, 65, 32, 255))
    draw_p.line([(3, 14), (20, 14)], fill=(50, 28, 12, 255), width=2)
    pouch.save('assets/pouch.png')

    # Smoke / Launch Puff (32x32)
    puff = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw_f = ImageDraw.Draw(puff)
    draw_f.ellipse([4, 4, 28, 28], fill=(240, 245, 255, 200))
    draw_f.ellipse([8, 8, 24, 24], fill=(255, 255, 255, 255))
    puff.save('assets/puff.png')
    print("Generated trajectory_dot, pouch, puff")

generate_particles()
