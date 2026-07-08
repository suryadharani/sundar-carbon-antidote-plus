import os
from PIL import Image, ImageDraw

def process_image(img_name, radius_pct=0.06):
    img_path = os.path.join("images", img_name)
    if not os.path.exists(img_path):
        print(f"Source file {img_path} not found.")
        return
        
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    
    # Target aspect ratio: 5.0 / 4.5 = 1.1111
    target_ratio = 5.0 / 4.5
    
    # Perform center crop
    current_ratio = w / h
    if current_ratio > target_ratio:
        # Too wide, crop left/right edges
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, h))
    else:
        # Too tall, crop top/bottom edges
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        img = img.crop((0, offset, w, offset + new_h))
        
    # Resize to a consistent high resolution
    target_w, target_h = 1000, 900
    resampling_filter = getattr(Image, 'Resampling', Image).LANCZOS
    img = img.resize((target_w, target_h), resampling_filter)
    
    # Apply rounded corner mask
    radius = int(target_w * radius_pct) # 60px radius
    mask = Image.new("L", (target_w, target_h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, target_w, target_h), radius=radius, fill=255)
    
    img.putalpha(mask)
    
    # Save processed image
    base_name = os.path.splitext(img_name)[0]
    out_path = os.path.join("images", f"{base_name}_rounded.png")
    img.save(out_path, "PNG")
    print(f"Processed and saved: {out_path}")

def main():
    images_to_process = [
        "ethanol_damage.png",
        "molecular_shield.png",
        "performance_surge.png",
        "piston_wear.png",
        "drivetrain_wear.png",
        "clean_emissions.png",
        "longevity_road.png",
        "universal_vehicles_india.png"
    ]
    
    for img_name in images_to_process:
        process_image(img_name)

if __name__ == "__main__":
    main()
