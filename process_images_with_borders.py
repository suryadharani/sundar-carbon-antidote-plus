import os
from PIL import Image, ImageDraw

def process_image_with_border(img_name, border_color, margin=10, radius=45, border_width=6):
    img_path = os.path.join("images", img_name)
    if not os.path.exists(img_path):
        print(f"Source file {img_path} not found.")
        return
        
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    
    # Target aspect ratio: 5.0 / 4.5 = 1.1111 (10:9)
    target_w, target_h = 1000, 900
    target_ratio = target_w / target_h
    
    # Perform center crop
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, h))
    else:
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        img = img.crop((0, offset, w, offset + new_h))
        
    # Resize image
    resampling_filter = getattr(Image, 'Resampling', Image).LANCZOS
    img = img.resize((target_w, target_h), resampling_filter)
    
    # Create canvas with slide background color (7, 8, 13)
    canvas = Image.new("RGBA", (target_w, target_h), (7, 8, 13, 255))
    
    # Create mask for rounded image content
    mask = Image.new("L", (target_w, target_h), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle(
        (margin, margin, target_w - margin, target_h - margin),
        radius=radius,
        fill=255
    )
    
    # Paste image onto canvas using mask
    canvas.paste(img, (0, 0), mask=mask)
    
    # Draw colored border outline on canvas
    draw_canvas = ImageDraw.Draw(canvas)
    draw_canvas.rounded_rectangle(
        (margin, margin, target_w - margin, target_h - margin),
        radius=radius,
        outline=border_color,
        width=border_width
    )
    
    # Save processed image
    base_name = os.path.splitext(img_name)[0]
    out_path = os.path.join("images", f"{base_name}_bordered.png")
    canvas.save(out_path, "PNG")
    print(f"Processed and saved bordered image: {out_path}")

def main():
    # Define images and their corresponding border colors (RGBA)
    ORANGE = (255, 136, 0, 255)
    CYAN = (0, 240, 255, 255)
    GREEN = (0, 255, 102, 255)
    
    tasks = [
        ("ethanol_damage.png", ORANGE),
        ("molecular_shield.png", CYAN),
        ("performance_surge.png", GREEN),
        ("piston_wear.png", CYAN),
        ("drivetrain_wear.png", CYAN),
        ("clean_emissions.png", GREEN),
        ("longevity_road.png", GREEN),
        ("universal_vehicles_india.png", CYAN)
    ]
    
    for img_name, color in tasks:
        process_image_with_border(img_name, color)

if __name__ == "__main__":
    main()
