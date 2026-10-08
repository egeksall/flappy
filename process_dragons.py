import os
from PIL import Image, ImageFilter
import numpy as np

images = {
    'dragon_baby': r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\baby_fire_dragon_1791456063375.jpg',
    'dragon_teen': r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\teen_fire_dragon_1791456085985.jpg',
    'dragon_mature': r'C:\Users\user\.gemini\antigravity-ide\brain\6b5b41b6-4d54-4050-ba5f-ca3ae2186546\mature_fire_dragon_1791456110220.jpg',
}

os.makedirs('assets/dragon', exist_ok=True)

for name, path in images.items():
    img = Image.open(path).convert('RGB')
    arr = np.array(img, dtype=np.float32)

    # The background is dark grey/black (around (40, 45, 50) or darker)
    # Let's inspect corner pixels to get background color
    corners = np.concatenate([
        arr[:30, :30].reshape(-1, 3),
        arr[:30, -30:].reshape(-1, 3),
        arr[-30:, :30].reshape(-1, 3),
        arr[-30:, -30:].reshape(-1, 3),
    ])
    bg_color = np.median(corners, axis=0)
    print(f"{name}: estimated bg_color = {bg_color}")

    # Color distance from bg_color
    diff = np.linalg.norm(arr - bg_color, axis=2)
    # Also consider brightness or saturation: the dragon is warm orange/yellow/red, bg is dark neutral
    # Chroma/warmth:
    is_warm = (arr[:, :, 0] > arr[:, :, 2] + 20) | (arr[:, :, 0] > 70)
    
    # Thresholding for alpha mask
    # Background distance typically < 30
    mask = np.zeros(diff.shape, dtype=np.uint8)
    mask[diff > 38] = 255
    # Smooth edges
    alpha_img = Image.fromarray(mask, mode='L').filter(ImageFilter.GaussianBlur(1.0))
    
    # Create RGBA
    rgba = img.convert('RGBA')
    rgba.putalpha(alpha_img)
    
    # Find bounding box where alpha > 20
    bbox = rgba.getbbox()
    if bbox:
        cropped = rgba.crop(bbox)
        # Pad slightly
        w, h = cropped.size
        padded = Image.new('RGBA', (w + 10, h + 10), (0, 0, 0, 0))
        padded.paste(cropped, (5, 5))
        padded.save(f'assets/dragon/{name}.png')
        print(f"Saved assets/dragon/{name}.png with size {padded.size}")
