import os
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets', exist_ok=True)

# -------------------------------------------------------------
# 1. OBSTACLE PILLARS (Solid Vertical Walls: 64px wide x 600px high)
# -------------------------------------------------------------

# A. 🪟 GLASS PILLAR
def generate_glass_pillar():
    w, h = 64, 600
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Icy cyan crystalline glass gradient with transparency
    c_glass_base = (70, 200, 245, 175)
    c_glass_light = (195, 245, 255, 220)
    c_glass_dark = (30, 140, 200, 195)
    c_frame = (140, 220, 255, 240)

    # Base fill
    draw.rectangle([0, 0, w, h], fill=c_glass_base)

    # Glass panes / panels (segments every 60px)
    for y in range(0, h, 60):
        # Panel frame horizontal seam
        draw.line([(0, y), (w, y)], fill=c_frame, width=3)
        draw.line([(0, y + 2), (w, y + 2)], fill=(20, 90, 150, 160), width=1)

        # Diagonal reflection gleam in each pane
        draw.polygon([(8, y + 8), (22, y + 8), (48, y + 52), (34, y + 52)], fill=(255, 255, 255, 110))
        draw.polygon([(26, y + 8), (32, y + 8), (56, y + 52), (50, y + 52)], fill=(255, 255, 255, 80))

        # Diamond reinforcement crystal in center of pane
        draw.polygon([(32, y + 24), (38, y + 30), (32, y + 36), (26, y + 30)], fill=(220, 250, 255, 200))

    # Outer vertical bevel edges
    draw.line([(0, 0), (0, h)], fill=c_glass_light, width=3)
    draw.line([(w - 1, 0), (w - 1, h)], fill=c_glass_dark, width=3)

    img.save('assets/obstacle_glass.png')
    print("Generated assets/obstacle_glass.png")

# B. 🪵 WOOD PILLAR
def generate_wood_pillar():
    w, h = 64, 600
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rich wooden planks texture
    c_wood_base = (165, 100, 48, 255)
    c_wood_dark = (115, 62, 25, 255)
    c_wood_light = (205, 142, 85, 255)
    c_bracket = (75, 75, 85, 255)
    c_rivet = (220, 220, 230, 255)

    # Base plank fill with vertical grain lines
    draw.rectangle([0, 0, w, h], fill=c_wood_base)
    for x in range(4, w, 6):
        col = c_wood_dark if x % 12 == 0 else c_wood_light
        draw.line([(x, 0), (x, h)], fill=col, width=1)

    # Cross beams / metal reinforcement brackets every 75px
    for y in range(0, h, 75):
        # Wooden beam seam
        draw.line([(0, y), (w, y)], fill=(60, 30, 10, 255), width=3)

        # Iron reinforcement bracket band
        draw.rectangle([2, y + 8, w - 3, y + 26], fill=c_bracket)
        draw.rectangle([3, y + 9, w - 4, y + 12], fill=(120, 120, 135, 255)) # highlight

        # Steel rivets on bracket
        draw.ellipse([8, y + 13, 16, y + 21], fill=c_rivet)
        draw.ellipse([28, y + 13, 36, y + 21], fill=c_rivet)
        draw.ellipse([48, y + 13, 56, y + 21], fill=c_rivet)

    # Bark rim borders
    draw.line([(0, 0), (0, h)], fill=(85, 45, 15, 255), width=3)
    draw.line([(w - 1, 0), (w - 1, h)], fill=(85, 45, 15, 255), width=3)

    img.save('assets/obstacle_wood.png')
    print("Generated assets/obstacle_wood.png")

# C. 🪨 STONE PILLAR
def generate_stone_pillar():
    w, h = 64, 600
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    c_stone_base = (130, 138, 148, 255)
    c_stone_dark = (85, 92, 102, 255)
    c_stone_light = (185, 195, 205, 255)
    c_mortar = (60, 65, 75, 255)

    draw.rectangle([0, 0, w, h], fill=c_stone_base)

    # Masonry stone bricks pattern
    brick_h = 40
    row = 0
    for y in range(0, h, brick_h):
        # Horizontal mortar line
        draw.line([(0, y), (w, y)], fill=c_mortar, width=3)

        # Alternating vertical mortar seams
        offset = (w // 2) if (row % 2 == 1) else 0
        draw.line([(offset, y), (offset, y + brick_h)], fill=c_mortar, width=3)
        if offset > 0:
            draw.line([(0, y), (0, y + brick_h)], fill=c_mortar, width=2)
            draw.line([(w - 1, y), (w - 1, y + brick_h)], fill=c_mortar, width=2)

        # Chiseled stone texture & cracks
        draw.line([(8, y + 8), (w - 10, y + 8)], fill=c_stone_light, width=1)
        draw.line([(8, y + brick_h - 4), (w - 10, y + brick_h - 4)], fill=c_stone_dark, width=1)
        row += 1

    # Rugged granite edges
    draw.line([(0, 0), (0, h)], fill=c_stone_dark, width=3)
    draw.line([(w - 1, 0), (w - 1, h)], fill=c_stone_dark, width=3)

    img.save('assets/obstacle_stone.png')
    print("Generated assets/obstacle_stone.png")

# -------------------------------------------------------------
# 2. MATERIAL DEBRIS / SHARDS FOR BREAK EFFECTS
# -------------------------------------------------------------
def generate_shards():
    # Glass shard (cyan triangle with shine)
    glass_shard = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw_g = ImageDraw.Draw(glass_shard)
    draw_g.polygon([(3, 20), (12, 2), (21, 16)], fill=(120, 225, 255, 240))
    draw_g.polygon([(6, 18), (12, 5), (15, 14)], fill=(240, 255, 255, 255))
    glass_shard.save('assets/shard_glass.png')

    # Wood splinter (brown jagged sliver)
    wood_shard = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw_w = ImageDraw.Draw(wood_shard)
    draw_w.polygon([(2, 10), (18, 4), (22, 14), (8, 20)], fill=(185, 115, 55, 255))
    draw_w.line([(4, 11), (20, 8)], fill=(235, 165, 95, 255), width=2)
    wood_shard.save('assets/shard_wood.png')

    # Stone chunk (gray angular pebble)
    stone_shard = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(stone_shard)
    draw_s.polygon([(4, 12), (10, 3), (20, 7), (18, 19), (8, 21)], fill=(120, 128, 138, 255))
    draw_s.polygon([(6, 12), (11, 6), (17, 8)], fill=(180, 190, 200, 255))
    stone_shard.save('assets/shard_stone.png')

    print("Generated shard assets")

generate_glass_pillar()
generate_wood_pillar()
generate_stone_pillar()
generate_shards()
