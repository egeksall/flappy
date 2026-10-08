from PIL import Image

baby = Image.open('assets/dragon_rear/dragon_rear_baby_sheet.png')
teen = Image.open('assets/dragon_rear/dragon_rear_teen_sheet.png')
mature = Image.open('assets/dragon_rear/dragon_rear_mature_sheet.png')

preview = Image.new('RGB', (900, 360), (20, 24, 38))
# Crop frame 0 (mid) from each
baby_f0 = baby.crop((0, 0, 104, 86))
teen_f0 = teen.crop((0, 0, 152, 120))
mature_f0 = mature.crop((0, 0, 216, 165))

preview.paste(baby_f0, (80, 180 - baby_f0.height // 2), baby_f0)
preview.paste(teen_f0, (320, 180 - teen_f0.height // 2), teen_f0)
preview.paste(mature_f0, (600, 180 - mature_f0.height // 2), mature_f0)

preview.save('scratch/rear_dragons_preview.png')
print("Saved scratch/rear_dragons_preview.png")
