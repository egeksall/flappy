import os
import math
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets/dragon_rear', exist_ok=True)

def generate_rear_dragon_frame(stage_name, scale_mult, W, H, wing_lift, horn_span, horn_h):
    SS = 4
    canvas_w = W * SS
    canvas_h = H * SS
    img = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = canvas_w // 2
    cy = int(canvas_h * 0.46) # Centered so wings span wide and tail flame fits below

    # Palette
    c_shadow = (110, 15, 15, 255)
    c_ruby_dark = (175, 30, 20, 255)
    c_ruby_base = (225, 55, 25, 255)
    c_orange_light = (255, 115, 35, 255)
    c_gold_glow = (255, 205, 50, 255)
    c_bone = (165, 28, 18, 255)
    c_horn_gold = (255, 195, 75, 255)
    c_horn_shadow = (185, 115, 30, 255)

    # 1. WINGS (Left & Right spread out from back)
    w_reach_x = int(canvas_w * 0.46)
    w_dy = int(wing_lift * SS * scale_mult)

    for side in [-1, 1]:
        # Upper shoulder attachment
        root_x = cx + side * int(12 * SS * scale_mult)
        root_y = cy - int(6 * SS * scale_mult)

        # Main elbow arch
        elbow_x = cx + side * int(w_reach_x * 0.52)
        elbow_y = cy - int(48 * SS * scale_mult) + w_dy

        # Wingtip (high outer claw)
        tip_x = cx + side * w_reach_x
        tip_y = cy - int(24 * SS * scale_mult) + w_dy

        # 3 Webbing strut tips (drooping scalloped edges)
        t1_x = cx + side * int(w_reach_x * 0.86)
        t1_y = cy + int(14 * SS * scale_mult) + int(w_dy * 0.7)

        t2_x = cx + side * int(w_reach_x * 0.60)
        t2_y = cy + int(24 * SS * scale_mult) + int(w_dy * 0.5)

        t3_x = cx + side * int(w_reach_x * 0.32)
        t3_y = cy + int(20 * SS * scale_mult) + int(w_dy * 0.3)

        # Translucent Fiery Membrane Polygon
        mem_outer = [
            (root_x, root_y),
            (elbow_x, elbow_y),
            (tip_x, tip_y),
            (t1_x, t1_y),
            (t2_x, t2_y),
            (t3_x, t3_y),
            (root_x, root_y + int(14 * SS * scale_mult))
        ]
        draw.polygon(mem_outer, fill=(240, 90, 20, 215))

        # Glowing golden inner membrane
        mem_inner = [
            (root_x, root_y + int(3 * SS)),
            (elbow_x, elbow_y + int(6 * SS)),
            (int(elbow_x * 0.6 + tip_x * 0.4), tip_y + int(8 * SS)),
            (int(elbow_x * 0.3 + t1_x * 0.7), t1_y - int(6 * SS)),
            (int(elbow_x * 0.2 + t2_x * 0.8), t2_y - int(8 * SS)),
            (root_x, root_y + int(10 * SS * scale_mult))
        ]
        draw.polygon(mem_inner, fill=(255, 205, 45, 235))

        # Scallop cutout shadow arcs between fingers
        for pA, pB in [((tip_x, tip_y), (t1_x, t1_y)),
                       ((t1_x, t1_y), (t2_x, t2_y)),
                       ((t2_x, t2_y), (t3_x, t3_y))]:
            mid_x = (pA[0] + pB[0]) // 2 - side * int(10 * SS * scale_mult)
            mid_y = (pA[1] + pB[1]) // 2 - int(8 * SS * scale_mult)
            draw.line([pA, (mid_x, mid_y), pB], fill=c_shadow, width=int(2 * SS))

        # Wing arm bones & finger struts
        draw.line([(root_x, root_y), (elbow_x, elbow_y)], fill=c_bone, width=int(5.5 * SS * scale_mult))
        draw.line([(elbow_x, elbow_y), (tip_x, tip_y)], fill=c_bone, width=int(4.5 * SS * scale_mult))
        draw.line([(elbow_x, elbow_y), (t1_x, t1_y)], fill=c_bone, width=int(3.5 * SS * scale_mult))
        draw.line([(elbow_x, elbow_y), (t2_x, t2_y)], fill=c_bone, width=int(3.5 * SS * scale_mult))
        draw.line([(elbow_x, elbow_y), (t3_x, t3_y)], fill=c_bone, width=int(3 * SS * scale_mult))

        # Bone bright ridge highlight
        draw.line([(root_x, root_y - int(2 * SS)), (elbow_x, elbow_y - int(2 * SS))], fill=c_orange_light, width=int(2 * SS))

        # Elbow & Tip Talons
        draw.polygon([
            (elbow_x, elbow_y),
            (elbow_x + side * int(5 * SS * scale_mult), elbow_y - int(10 * SS * scale_mult)),
            (elbow_x - side * int(2 * SS), elbow_y - int(2 * SS))
        ], fill=c_horn_gold)
        draw.polygon([
            (tip_x, tip_y),
            (tip_x + side * int(7 * SS * scale_mult), tip_y - int(5 * SS * scale_mult)),
            (tip_x, tip_y + int(3 * SS))
        ], fill=c_horn_gold)

    # 2. TAIL (Curving gracefully down into view toward the camera)
    tail_pts = []
    tail_len = int(38 * SS * scale_mult)
    tail_base_y = cy + int(10 * SS * scale_mult)
    segments = 12
    for i in range(segments + 1):
        t = i / segments
        ty = tail_base_y + int(t * tail_len)
        tx = cx + int(math.sin(t * math.pi) * 6 * SS * scale_mult)
        w = int((16 * (1 - t * 0.72) + 4) * SS * scale_mult)
        draw.ellipse([tx - w // 2, ty - w // 2, tx + w // 2, ty + w // 2], fill=c_ruby_dark)
        draw.ellipse([tx - w // 3, ty - w // 3, tx + w // 3, ty + w // 4], fill=c_ruby_base)
        tail_pts.append((tx, ty))

    # 3. TORSO (Back View)
    bw = int(30 * SS * scale_mult)
    bh = int(36 * SS * scale_mult)
    draw.ellipse([cx - bw // 2, cy - bh // 2, cx + bw // 2, cy + bh // 2], fill=c_shadow)
    draw.ellipse([cx - bw // 2 + int(2 * SS), cy - bh // 2 + int(2 * SS),
                  cx + bw // 2 - int(2 * SS), cy + bh // 2 - int(2 * SS)], fill=c_ruby_base)
    draw.ellipse([cx - int(bw * 0.32), cy - int(bh * 0.38),
                  cx + int(bw * 0.32), cy + int(bh * 0.15)], fill=c_orange_light)

    # Spinal armor plates / dorsal ridges
    num_ridges = 5 if stage_name != 'dragon_rear_baby' else 3
    for r_i in range(num_ridges):
        ry = cy - int((14 - r_i * 6.5) * SS * scale_mult)
        rw = int(5 * SS * scale_mult)
        rh = int(7 * SS * scale_mult)
        draw.polygon([(cx, ry - rh), (cx - rw, ry), (cx + rw, ry)], fill=c_gold_glow)
        draw.polygon([(cx, ry - rh), (cx, ry), (cx + rw, ry)], fill=c_horn_shadow)

    # 4. NECK, HEAD & HORNS (Back of head looking forward)
    head_y = cy - int(32 * SS * scale_mult)
    hw = int(24 * SS * scale_mult)
    hh = int(22 * SS * scale_mult)

    # Horns
    for side in [-1, 1]:
        h_bx = cx + side * int(7 * SS * scale_mult)
        h_by = head_y - int(4 * SS * scale_mult)
        h_tx = cx + side * int(horn_span * SS * scale_mult)
        h_ty = h_by - int(horn_h * SS * scale_mult)
        h_cx = cx + side * int((horn_span * 0.45) * SS * scale_mult)
        h_cy = h_by - int(horn_h * 0.35 * SS * scale_mult)

        draw.polygon([
            (h_bx - side * int(4 * SS), h_by),
            (h_bx + side * int(4 * SS), h_by + int(2 * SS)),
            (h_cx, h_cy),
            (h_tx, h_ty)
        ], fill=c_horn_gold)
        draw.polygon([
            (h_bx, h_by),
            (h_bx + side * int(4 * SS), h_by + int(2 * SS)),
            (h_tx, h_ty)
        ], fill=c_horn_shadow)

        if stage_name in ['dragon_rear_teen', 'dragon_rear_mature']:
            # Secondary cheek horns
            draw.polygon([
                (h_bx + side * int(2 * SS), h_by + int(6 * SS)),
                (h_bx + side * int(5 * SS), h_by + int(9 * SS)),
                (cx + side * int((horn_span * 0.75) * SS * scale_mult), h_by + int(3 * SS * scale_mult))
            ], fill=c_horn_gold)

        if stage_name == 'dragon_rear_mature':
            # Crown top spikes
            draw.polygon([
                (cx + side * int(3 * SS), head_y - int(12 * SS)),
                (cx + side * int(8 * SS), head_y - int(8 * SS)),
                (cx + side * int(8 * SS), head_y - int(18 * SS * scale_mult))
            ], fill=c_gold_glow)

    # Skull
    draw.ellipse([cx - hw // 2, head_y - hh // 2, cx + hw // 2, head_y + hh // 2], fill=c_shadow)
    draw.ellipse([cx - hw // 2 + int(2 * SS), head_y - hh // 2 + int(2 * SS),
                  cx + hw // 2 - int(2 * SS), head_y + hh // 2 - int(2 * SS)], fill=c_ruby_base)
    draw.ellipse([cx - hw // 3, head_y - hh // 3, cx + hw // 3, head_y + hh // 4], fill=c_orange_light)

    # Head central fiery frill
    draw.polygon([(cx, head_y - hh // 2 - int(9 * SS * scale_mult)),
                  (cx - int(4 * SS * scale_mult), head_y - hh // 2 + int(2 * SS)),
                  (cx + int(4 * SS * scale_mult), head_y - hh // 2 + int(2 * SS))], fill=c_gold_glow)

    # 5. TAIL FLAME (Glowing flame tip with fiery aura)
    flame_x, flame_y = tail_pts[-1]
    f_rad = int(scale_mult * 16 * SS)

    # Soft ambient fire glow
    for r_aura, a_aura in [(int(f_rad * 1.3), 50), (int(f_rad * 0.95), 110), (int(f_rad * 0.65), 180)]:
        draw.ellipse([flame_x - r_aura, flame_y - r_aura + int(4 * SS),
                      flame_x + r_aura, flame_y + r_aura + int(4 * SS)], fill=(255, 95, 20, a_aura))

    # Teardrop flame pointing up & back
    draw.polygon([
        (flame_x - int(f_rad * 0.45), flame_y - int(f_rad * 0.2)),
        (flame_x + int(f_rad * 0.45), flame_y - int(f_rad * 0.2)),
        (flame_x + int(f_rad * 0.3), flame_y + int(f_rad * 0.6)),
        (flame_x, flame_y + int(f_rad * 0.95)),
        (flame_x - int(f_rad * 0.3), flame_y + int(f_rad * 0.6))
    ], fill=(235, 50, 15, 230))

    # Bright inner core
    draw.ellipse([flame_x - int(f_rad * 0.32), flame_y - int(f_rad * 0.15),
                  flame_x + int(f_rad * 0.32), flame_y + int(f_rad * 0.45)], fill=(255, 175, 40, 245))
    draw.ellipse([flame_x - int(f_rad * 0.18), flame_y - int(f_rad * 0.05),
                  flame_x + int(f_rad * 0.18), flame_y + int(f_rad * 0.28)], fill=(255, 255, 210, 255))

    # High quality downsampling
    return img.resize((W, H), Image.Resampling.LANCZOS)

def create_stage_sheet(stage_name, scale_mult, W, H, horn_span, horn_h):
    frames = []
    # 3 wing poses (0: mid glide, 1: wings high up, 2: wings scooped down)
    lifts = [0, -18, 14]
    for lift in lifts:
        f = generate_rear_dragon_frame(stage_name, scale_mult, W, H, lift, horn_span, horn_h)
        frames.append(f)

    sheet = Image.new('RGBA', (W * 3, H), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * W, 0))

    out_file = f'assets/dragon_rear/{stage_name}_sheet.png'
    sheet.save(out_file)
    print(f"Exported {out_file} ({W * 3}x{H}, frameWidth={W})")

# Stage 1: Baby Fire Dragon (Rear)
create_stage_sheet('dragon_rear_baby', scale_mult=0.72, W=116, H=96, horn_span=16, horn_h=15)

# Stage 2: Teen Fire Dragon (Rear)
create_stage_sheet('dragon_rear_teen', scale_mult=1.05, W=168, H=138, horn_span=25, horn_h=26)

# Stage 3: Mature Fire Dragon (Rear)
create_stage_sheet('dragon_rear_mature', scale_mult=1.45, W=236, H=192, horn_span=38, horn_h=38)
