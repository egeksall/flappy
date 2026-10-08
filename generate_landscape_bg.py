from PIL import Image, ImageDraw

# Create 800x450 Landscape Background with Twilight Volcanic Valley
W, H = 800, 450
bg = Image.new('RGBA', (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(bg)

horizon_y = 170

# 1. Sky Gradient (from deep space obsidian to fiery twilight amber)
for y in range(horizon_y):
    t = y / horizon_y
    # Color from deep dark night (14, 10, 25) to vibrant dusk crimson/amber (210, 75, 30)
    r = int(14 * (1 - t) + 210 * t)
    g = int(10 * (1 - t) + 75 * t)
    b = int(25 * (1 - t) + 30 * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# 2. Glowing Moon / Dragon Sun on Horizon
draw.ellipse([360, 50, 440, 130], fill=(255, 230, 160, 240))
draw.ellipse([375, 45, 455, 125], fill=(22, 12, 30, 255))

# 3. Distant Jagged Mountains on Horizon
pts_mountains = [
    (0, horizon_y), (60, horizon_y - 45), (140, horizon_y - 25), (240, horizon_y - 65),
    (340, horizon_y - 30), (400, horizon_y - 15), (460, horizon_y - 35), (560, horizon_y - 70),
    (680, horizon_y - 30), (750, horizon_y - 50), (W, horizon_y), (W, horizon_y + 10), (0, horizon_y + 10)
]
draw.polygon(pts_mountains, fill=(35, 15, 25, 255))

# 4. Magma Canyon / Ground Base (from horizon down)
for y in range(horizon_y, H):
    t = (y - horizon_y) / (H - horizon_y)
    # Dark basalt volcanic ground with glowing red hue
    r = int(45 * (1 - t) + 18 * t)
    g = int(18 * (1 - t) + 8 * t)
    b = int(22 * (1 - t) + 12 * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

bg.save('assets/dragon_rear/landscape_bg.png')
print("Generated assets/dragon_rear/landscape_bg.png")
