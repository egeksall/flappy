from PIL import Image, ImageDraw

bg = Image.new('RGB', (1200, 500), (20, 24, 38))
draw = ImageDraw.Draw(bg)

# Baby
baby = Image.open('assets/dragon/dragon_baby.png')
baby_thumb = baby.resize((int(baby.width * 200 / baby.height), 200), Image.Resampling.LANCZOS)
bg.paste(baby_thumb, (50, 250 - baby_thumb.height // 2), baby_thumb)
draw.text((100, 420), "1. Baby Fire Dragon", fill=(255, 200, 100))

# Teen
teen = Image.open('assets/dragon/dragon_teen.png')
teen_thumb = teen.resize((int(teen.width * 280 / teen.height), 280), Image.Resampling.LANCZOS)
bg.paste(teen_thumb, (420, 250 - teen_thumb.height // 2), teen_thumb)
draw.text((500, 420), "2. Teen Fire Dragon", fill=(255, 180, 80))

# Mature
mature = Image.open('assets/dragon/dragon_mature.png')
mature_thumb = mature.resize((int(mature.width * 360 / mature.height), 360), Image.Resampling.LANCZOS)
bg.paste(mature_thumb, (800, 250 - mature_thumb.height // 2), mature_thumb)
draw.text((880, 420), "3. Mature Fire Dragon", fill=(255, 120, 60))

bg.save('scratch/dragon_evolution_preview.png')
print("Saved scratch/dragon_evolution_preview.png")
