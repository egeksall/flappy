import os
import math
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets', exist_ok=True)

def create_gradient_radial(draw, center, radius, color_center, color_edge):
    for r in range(radius, 0, -1):
        ratio = r / radius
        r_c = int(color_center[0] * (1 - ratio) + color_edge[0] * ratio)
        g_c = int(color_center[1] * (1 - ratio) + color_edge[1] * ratio)
        b_c = int(color_center[2] * (1 - ratio) + color_edge[2] * ratio)
        a_c = int(color_center[3] * (1 - ratio) + color_edge[3] * ratio)
        draw.ellipse([center[0]-r, center[1]-r, center[0]+r, center[1]+r], fill=(r_c, g_c, b_c, a_c))

# -------------------------------------------------------------
# 1. BIRD SPRITESHEETS (3 frames each: 64x48 per frame => 192x48)
# -------------------------------------------------------------
def generate_bird_spritesheet(filename, base_color, belly_color, wing_color, beak_color, eye_color, special=None):
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
        cx, cy = 30, 24

        # Body shadow/outline
        draw.ellipse([cx - 20, cy - 17, cx + 18, cy + 17], fill=(20, 20, 25, 60))
        # Main Body
        draw.ellipse([cx - 19, cy - 18, cx + 17, cy + 16], fill=base_color)

        # Belly highlight
        draw.ellipse([cx - 15, cy - 6, cx + 10, cy + 15], fill=belly_color)

        # Tail feathers
        draw.polygon([(cx - 18, cy - 2), (cx - 27, cy - 8), (cx - 22, cy + 2)], fill=wing_color)
        draw.polygon([(cx - 18, cy + 2), (cx - 28, cy + 5), (cx - 21, cy + 8)], fill=wing_color)

        # Cheerful blush cheek
        draw.ellipse([cx + 2, cy + 2, cx + 9, cy + 8], fill=(255, 120, 140, 140))

        # Big expressive eye
        draw.ellipse([cx + 2, cy - 14, cx + 16, cy + 2], fill=(255, 255, 255, 255))
        draw.ellipse([cx + 1, cy - 15, cx + 17, cy + 3], outline=(40, 30, 30, 220), width=1)
        # Pupil
        draw.ellipse([cx + 7, cy - 10, cx + 15, cy - 1], fill=eye_color)
        # Specular glint
        draw.ellipse([cx + 10, cy - 10, cx + 14, cy - 6], fill=(255, 255, 255, 255))
        draw.ellipse([cx + 7, cy - 4, cx + 9, cy - 2], fill=(255, 255, 255, 220))

        # Beak
        draw.polygon([(cx + 13, cy - 3), (cx + 27, cy + 2), (cx + 13, cy + 7)], fill=beak_color)
        draw.line([(cx + 13, cy + 2), (cx + 25, cy + 2)], fill=(180, 50, 0, 200), width=1)

        # Animated Wing
        wo_x, wo_y = wing_offsets[i]
        wx, wy = cx - 4 + wo_x * 0.4, cy + wo_y * 0.5
        # Wing shape changes with flap state
        if i == 0:  # UP
            draw.polygon([(wx - 8, wy + 4), (wx - 2, wy - 14), (wx + 8, wy - 10), (wx + 5, wy + 5)], fill=wing_color)
            draw.polygon([(wx - 4, wy + 2), (wx, wy - 10), (wx + 6, wy - 8)], fill=belly_color)
        elif i == 1:  # MID
            draw.ellipse([wx - 10, wy - 6, wx + 6, wy + 6], fill=wing_color)
            draw.ellipse([wx - 6, wy - 4, wx + 3, wy + 4], fill=belly_color)
        else:  # DOWN
            draw.polygon([(wx - 8, wy - 6), (wx + 4, wy - 4), (wx + 2, wy + 14), (wx - 6, wy + 10)], fill=wing_color)
            draw.polygon([(wx - 5, wy - 4), (wx + 2, wy - 2), (wx, wy + 10)], fill=belly_color)

        # Special cosmetics
        if special == 'cyber':
            # Neon Visor
            draw.line([(cx + 4, cy - 6), (cx + 17, cy - 6)], fill=(0, 255, 255, 230), width=3)
            draw.line([(cx - 15, cy - 3), (cx + 8, cy - 3)], fill=(255, 0, 160, 200), width=1)
        elif special == 'crown':
            # Golden Crown
            draw.polygon([(cx + 2, cy - 18), (cx + 16, cy - 18), (cx + 18, cy - 26), 
                          (cx + 11, cy - 21), (cx + 9, cy - 27), (cx + 7, cy - 21), (cx, cy - 25)], 
                         fill=(255, 215, 0, 255))
            draw.ellipse([cx + 8, cy - 22, cx + 10, cy - 20], fill=(255, 50, 50, 255))

        sheet.paste(img, (i * frame_w, 0))

    sheet.save(filename)
    print(f"Saved {filename}")

# Generate Bird Skins
generate_bird_spritesheet('assets/bird_classic.png', 
                          base_color=(255, 208, 38, 255), 
                          belly_color=(255, 240, 130, 255), 
                          wing_color=(235, 168, 12, 255), 
                          beak_color=(255, 95, 30, 255), 
                          eye_color=(30, 20, 20, 255))

generate_bird_spritesheet('assets/bird_cyber.png', 
                          base_color=(40, 190, 255, 255), 
                          belly_color=(160, 240, 255, 255), 
                          wing_color=(20, 120, 240, 255), 
                          beak_color=(255, 30, 180, 255), 
                          eye_color=(0, 255, 220, 255), 
                          special='cyber')

generate_bird_spritesheet('assets/bird_crimson.png', 
                          base_color=(255, 65, 50, 255), 
                          belly_color=(255, 175, 100, 255), 
                          wing_color=(200, 30, 20, 255), 
                          beak_color=(255, 190, 0, 255), 
                          eye_color=(40, 20, 20, 255))

generate_bird_spritesheet('assets/bird_golden.png', 
                          base_color=(255, 215, 0, 255), 
                          belly_color=(255, 250, 180, 255), 
                          wing_color=(218, 165, 32, 255), 
                          beak_color=(255, 120, 20, 255), 
                          eye_color=(70, 40, 0, 255), 
                          special='crown')


# -------------------------------------------------------------
# 2. PIPES (Glossy Arcade Style with Highlights & Rim Lip)
# -------------------------------------------------------------
def generate_pipes():
    pipe_w = 76
    cap_h = 36
    body_h = 480

    # Colors
    c_main = (92, 205, 50)
    c_light = (164, 238, 98)
    c_dark = (50, 140, 25)
    c_rim = (30, 95, 15)

    def draw_pipe_body(draw, x0, y0, w, h):
        for x in range(w):
            ratio = x / w
            if ratio < 0.15: # Dark left edge
                t = ratio / 0.15
                r = int(c_dark[0] * (1-t) + c_main[0] * t)
                g = int(c_dark[1] * (1-t) + c_main[1] * t)
                b = int(c_dark[2] * (1-t) + c_main[2] * t)
            elif ratio < 0.35: # Bright highlight stripe
                t = (ratio - 0.15) / 0.2
                r = int(c_main[0] * (1-t) + c_light[0] * t)
                g = int(c_main[1] * (1-t) + c_light[1] * t)
                b = int(c_main[2] * (1-t) + c_light[2] * t)
            elif ratio < 0.5: # Blend back to main
                t = (ratio - 0.35) / 0.15
                r = int(c_light[0] * (1-t) + c_main[0] * t)
                g = int(c_light[1] * (1-t) + c_main[1] * t)
                b = int(c_light[2] * (1-t) + c_main[2] * t)
            else: # Gradient to darker right side
                t = (ratio - 0.5) / 0.5
                r = int(c_main[0] * (1-t) + c_dark[0] * t)
                g = int(c_main[1] * (1-t) + c_dark[1] * t)
                b = int(c_main[2] * (1-t) + c_dark[2] * t)
            draw.line([(x0 + x, y0), (x0 + x, y0 + h)], fill=(r, g, b, 255))
        # Subtle rim borders
        draw.line([(x0, y0), (x0, y0 + h)], fill=(*c_rim, 255), width=2)
        draw.line([(x0 + w - 1, y0), (x0 + w - 1, y0 + h)], fill=(*c_rim, 255), width=2)

    # Bottom Pipe (cap at top, body below)
    img_bottom = Image.new('RGBA', (pipe_w + 10, body_h), (0, 0, 0, 0))
    draw_b = ImageDraw.Draw(img_bottom)
    # Stem
    draw_pipe_body(draw_b, 5, cap_h, pipe_w, body_h - cap_h)
    # Cap (slightly wider)
    draw_pipe_body(draw_b, 0, 0, pipe_w + 10, cap_h)
    # Cap bottom lip shadow
    draw_b.line([(0, cap_h), (pipe_w + 10, cap_h)], fill=(20, 60, 10, 200), width=3)
    # Cap bevel highlight
    draw_b.line([(2, 2), (pipe_w + 8, 2)], fill=(210, 255, 160, 220), width=2)
    img_bottom.save('assets/pipe_bottom.png')

    # Top Pipe (body at top, cap at bottom)
    img_top = Image.new('RGBA', (pipe_w + 10, body_h), (0, 0, 0, 0))
    draw_t = ImageDraw.Draw(img_top)
    # Stem
    draw_pipe_body(draw_t, 5, 0, pipe_w, body_h - cap_h)
    # Cap
    draw_pipe_body(draw_t, 0, body_h - cap_h, pipe_w + 10, cap_h)
    # Cap top lip shadow
    draw_t.line([(0, body_h - cap_h), (pipe_w + 10, body_h - cap_h)], fill=(20, 60, 10, 200), width=3)
    # Cap bottom highlight
    draw_t.line([(2, body_h - 2), (pipe_w + 8, body_h - 2)], fill=(210, 255, 160, 220), width=2)
    img_top.save('assets/pipe_top.png')
    print("Saved pipe assets")

generate_pipes()


# -------------------------------------------------------------
# 3. GROUND TILE (Smooth rolling ground with grass rim)
# -------------------------------------------------------------
def generate_ground():
    w, h = 120, 112
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Base earth fill
    c_dirt_light = (222, 192, 126)
    c_dirt_dark = (200, 168, 102)
    for y in range(20, h):
        ratio = (y - 20) / (h - 20)
        r = int(c_dirt_light[0] * (1-ratio) + c_dirt_dark[0] * ratio)
        g = int(c_dirt_light[1] * (1-ratio) + c_dirt_dark[1] * ratio)
        b = int(c_dirt_light[2] * (1-ratio) + c_dirt_dark[2] * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Striped sandy texture
    for offset in range(-h, w, 24):
        draw.polygon([(offset, h), (offset + 12, h), (offset + 32, 20), (offset + 20, 20)], 
                     fill=(190, 155, 92, 120))

    # Grass top border (lush green 3D rounded blades)
    draw.rectangle([0, 0, w, 16], fill=(115, 200, 45, 255))
    draw.rectangle([0, 0, w, 4], fill=(160, 240, 85, 255)) # Grass highlight
    # Small grass tufts
    for gx in range(0, w, 15):
        draw.polygon([(gx, 16), (gx + 7, 22), (gx + 14, 16)], fill=(95, 175, 35, 255))
    # Drop shadow under grass
    draw.line([(0, 22), (w, 22)], fill=(120, 95, 50, 100), width=2)

    img.save('assets/ground.png')
    print("Saved ground.png")

generate_ground()


# -------------------------------------------------------------
# 4. BACKGROUND LAYERS (Parallax Sky, Hills, Clouds)
# -------------------------------------------------------------
def generate_backgrounds():
    # Sky Gradient (480 x 800)
    w, h = 480, 800
    sky = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(sky)
    top_c = (56, 173, 235)
    mid_c = (142, 218, 252)
    bot_c = (215, 243, 255)
    for y in range(h):
        ratio = y / h
        if ratio < 0.6:
            t = ratio / 0.6
            r = int(top_c[0] * (1-t) + mid_c[0] * t)
            g = int(top_c[1] * (1-t) + mid_c[1] * t)
            b = int(top_c[2] * (1-t) + mid_c[2] * t)
        else:
            t = (ratio - 0.6) / 0.4
            r = int(mid_c[0] * (1-t) + bot_c[0] * t)
            g = int(mid_c[1] * (1-t) + bot_c[1] * t)
            b = int(mid_c[2] * (1-t) + bot_c[2] * t)
        draw_s.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Sun glow
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw_g = ImageDraw.Draw(glow)
    draw_g.ellipse([w - 120, 40, w + 40, 200], fill=(255, 255, 220, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(25))
    sky.paste(glow, (0, 0), glow)
    sky.save('assets/bg_sky.png')

    # Parallax Clouds Layer (seamless tileable width 480 x 200)
    clouds = Image.new('RGBA', (480, 220), (0, 0, 0, 0))
    draw_c = ImageDraw.Draw(clouds)
    cloud_defs = [
        (40, 90, 80, 40), (120, 60, 110, 50), (220, 100, 70, 35),
        (320, 50, 130, 55), (420, 85, 90, 45), (480, 90, 80, 40)
    ]
    for cx, cy, cw, ch in cloud_defs:
        # Cloud soft base/shadow
        draw_c.ellipse([cx - cw, cy - ch + 6, cx + cw, cy + ch + 6], fill=(210, 230, 250, 160))
        # Cloud puff
        draw_c.ellipse([cx - cw, cy - ch, cx + cw, cy + ch], fill=(255, 255, 255, 210))
        # Extra top puffs
        draw_c.ellipse([cx - cw*0.4, cy - ch*1.3, cx + cw*0.4, cy], fill=(255, 255, 255, 230))
    clouds.save('assets/bg_clouds.png')

    # Parallax Hills / Horizon Layer (480 x 240)
    hills = Image.new('RGBA', (480, 240), (0, 0, 0, 0))
    draw_h = ImageDraw.Draw(hills)
    # Distant mountains
    draw_h.polygon([(0, 240), (0, 120), (80, 60), (180, 140), (280, 50), (390, 130), (480, 70), (480, 240)], 
                   fill=(135, 195, 215, 140))
    # Near lush green rolling hills
    draw_h.ellipse([-50, 110, 260, 320], fill=(130, 205, 115, 210))
    draw_h.ellipse([180, 90, 520, 310], fill=(108, 190, 95, 210))
    draw_h.ellipse([80, 130, 380, 340], fill=(148, 222, 132, 230))
    hills.save('assets/bg_hills.png')
    print("Saved background layers")

generate_backgrounds()


# -------------------------------------------------------------
# 5. MEDAL ICONS (Bronze, Silver, Gold, Platinum)
# -------------------------------------------------------------
def generate_medals():
    medals = {
        'medal_bronze': ((205, 127, 50), (240, 175, 110)),
        'medal_silver': ((192, 192, 205), (245, 245, 255)),
        'medal_gold': ((255, 200, 20), (255, 245, 140)),
        'medal_platinum': ((140, 215, 240), (230, 250, 255)),
    }
    for name, (c_base, c_shine) in medals.items():
        img = Image.new('RGBA', (56, 56), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        # Drop shadow
        draw.ellipse([5, 7, 51, 53], fill=(0, 0, 0, 60))
        # Outer ring
        draw.ellipse([4, 4, 50, 50], fill=(40, 35, 30, 200))
        # Inner metallic base
        draw.ellipse([6, 6, 48, 48], fill=(*c_base, 255))
        # Shimmer gradient highlight
        draw.ellipse([10, 8, 44, 28], fill=(*c_shine, 160))
        # Center Star / Emblem
        cx, cy = 27, 27
        star_pts = []
        for a in range(10):
            angle = a * math.pi / 5 - math.pi / 2
            r = 11 if a % 2 == 0 else 5
            star_pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        draw.polygon(star_pts, fill=(255, 255, 255, 240))
        img.save(f'assets/{name}.png')
    print("Saved medal icons")

generate_medals()


# -------------------------------------------------------------
# 6. PARTICLES & EFFECTS (Feather, Sparkle, Coin)
# -------------------------------------------------------------
def generate_particles():
    # Feather particle
    f_img = Image.new('RGBA', (20, 20), (0, 0, 0, 0))
    f_draw = ImageDraw.Draw(f_img)
    f_draw.ellipse([4, 2, 16, 18], fill=(255, 230, 100, 220))
    f_draw.line([(10, 2), (10, 18)], fill=(255, 255, 255, 240), width=1)
    f_img.save('assets/feather.png')

    # Sparkle / Star particle
    s_img = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(s_img)
    s_draw.polygon([(12, 1), (15, 9), (23, 12), (15, 15), (12, 23), (9, 15), (1, 12), (9, 9)], 
                   fill=(255, 255, 255, 255))
    s_draw.ellipse([8, 8, 16, 16], fill=(255, 235, 120, 240))
    s_img.save('assets/sparkle.png')
    print("Saved particle assets")

generate_particles()
