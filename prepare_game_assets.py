import os
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets/dragon', exist_ok=True)

# 1. Resize dragon sprites to ideal game sizes
sprites = {
    'dragon_baby': (r'assets/dragon/dragon_baby.png', 90, 72),
    'dragon_teen': (r'assets/dragon/dragon_teen.png', 135, 128),
    'dragon_mature': (r'assets/dragon/dragon_mature.png', 190, 186)
}

for name, (src_path, target_w, target_h) in sprites.items():
    img = Image.open(src_path)
    # Calculate aspect-ratio preserving dimensions
    aspect = img.width / img.height
    if aspect > (target_w / target_h):
        w = target_w
        h = int(target_w / aspect)
    else:
        h = target_h
        w = int(target_h * aspect)
    resized = img.resize((w, h), Image.Resampling.LANCZOS)
    resized.save(f'assets/dragon/{name}_game.png')
    print(f"Exported assets/dragon/{name}_game.png: {resized.size}")

# 2. Fire ember / spark particle
particle = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
p_draw = ImageDraw.Draw(particle)
for r, alpha in [(14, 30), (10, 80), (6, 180), (3, 255)]:
    p_draw.ellipse([16 - r, 16 - r, 16 + r, 16 + r], fill=(255, 180, 50, alpha))
p_draw.ellipse([14, 14, 18, 18], fill=(255, 255, 220, 255))
particle.save('assets/dragon/ember.png')
print("Exported assets/dragon/ember.png")

# 3. Fantasy Dragon Realm Background (480 x 800)
bg = Image.new('RGBA', (480, 800), (0, 0, 0, 255))
bg_draw = ImageDraw.Draw(bg)

# Sky gradient (Deep Twilight / Dragon Mountain Sunset)
for y in range(800):
    t = y / 800.0
    if t < 0.4:
        # Deep obsidian night to indigo
        f = t / 0.4
        r = int(15 * (1 - f) + 38 * f)
        g = int(12 * (1 - f) + 24 * f)
        b = int(28 * (1 - f) + 55 * f)
    elif t < 0.75:
        # Indigo to fiery sunset amber
        f = (t - 0.4) / 0.35
        r = int(38 * (1 - f) + 180 * f)
        g = int(24 * (1 - f) + 70 * f)
        b = int(55 * (1 - f) + 40 * f)
    else:
        # Sunset amber to volcanic magma glow
        f = (t - 0.75) / 0.25
        r = int(180 * (1 - f) + 90 * f)
        g = int(70 * (1 - f) + 30 * f)
        b = int(40 * (1 - f) + 20 * f)
    bg_draw.line([(0, y), (480, y)], fill=(r, g, b, 255))

# Glowing crescent moon / dragon eye in sky
bg_draw.ellipse([340, 70, 420, 150], fill=(255, 220, 160, 230))
bg_draw.ellipse([325, 60, 405, 140], fill=(25, 20, 40, 255))

# Distant jagged volcanic mountain peaks
def draw_mountain_range(draw, points_base, fill_color):
    draw.polygon(points_base, fill=fill_color)

# Layer 1: Far peaks
pts_far = [(0, 520), (70, 430), (140, 490), (220, 410), (320, 500), (410, 440), (480, 510), (480, 800), (0, 800)]
draw_mountain_range(bg_draw, pts_far, (45, 22, 35, 255))

# Layer 2: Mid volcanic ridges with subtle magma highlights
pts_mid = [(0, 600), (90, 520), (180, 580), (280, 510), (380, 570), (480, 530), (480, 800), (0, 800)]
draw_mountain_range(bg_draw, pts_mid, (30, 14, 22, 255))

# Magma veins on mid mountains
bg_draw.line([(88, 525), (110, 570), (105, 620)], fill=(255, 110, 30, 160), width=2)
bg_draw.line([(280, 515), (295, 550), (285, 600)], fill=(255, 130, 40, 180), width=2)

# Layer 3: Foreground volcanic crags
pts_fore = [(0, 700), (80, 650), (190, 710), (310, 640), (420, 690), (480, 660), (480, 800), (0, 800)]
draw_mountain_range(bg_draw, pts_fore, (18, 8, 12, 255))

bg.save('assets/dragon/dragon_bg.png')
print("Exported assets/dragon/dragon_bg.png")
