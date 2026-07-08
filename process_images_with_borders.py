import os
from PIL import Image, ImageDraw

def process_image_with_border(img_name, border_color, margin=10, radius=45, border_width=6):
    img_path = os.path.join("images", img_name)
    if not os.path.exists(img_path):
        print(f"Source file {img_path} not found.")
        return
        
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    
    # Target canvas size: 1000x900 (10:9 aspect ratio)
    target_w, target_h = 1000, 900
    resampling_filter = getattr(Image, 'Resampling', Image).LANCZOS
    
    # Create canvas with slide background color (7, 8, 13)
    canvas = Image.new("RGBA", (target_w, target_h), (7, 8, 13, 255))
    
    if img_name == "universal_vehicles_india.jpg":
        # Fit to width (letterbox) to avoid cropping any text or content
        new_w = target_w - 2 * margin
        new_h = int(new_w * h / w)
        img_resized = img.resize((new_w, new_h), resampling_filter)
        
        y_offset = (target_h - new_h) // 2
        bbox = (margin, y_offset, margin + new_w, y_offset + new_h)
        
        # Create mask of the scaled size
        mask_resized = Image.new("L", (new_w, new_h), 0)
        draw_mr = ImageDraw.Draw(mask_resized)
        draw_mr.rounded_rectangle((0, 0, new_w, new_h), radius=radius, fill=255)
        
        # Paste image onto canvas using mask
        canvas.paste(img_resized, (margin, y_offset), mask=mask_resized)
        
        # Draw colored border outline on canvas
        draw_canvas = ImageDraw.Draw(canvas)
        draw_canvas.rounded_rectangle(
            bbox,
            radius=radius,
            outline=border_color,
            width=border_width
        )
    else:
        # Perform center crop to fill (for other slide illustrations)
        target_ratio = target_w / target_h
        current_ratio = w / h
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            offset = (w - new_w) // 2
            img_cropped = img.crop((offset, 0, offset + new_w, h))
        else:
            new_h = int(w / target_ratio)
            offset = (h - new_h) // 2
            img_cropped = img.crop((0, offset, w, offset + new_h))
            
        img_resized = img_cropped.resize((target_w, target_h), resampling_filter)
        
        bbox = (margin, margin, target_w - margin, target_h - margin)
        
        # Create mask for rounded image content
        mask = Image.new("L", (target_w, target_h), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.rounded_rectangle(bbox, radius=radius, fill=255)
        
        # Paste image onto canvas using mask
        canvas.paste(img_resized, (0, 0), mask=mask)
        
        # Draw colored border outline on canvas
        draw_canvas = ImageDraw.Draw(canvas)
        draw_canvas.rounded_rectangle(
            bbox,
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
        ("energy_transition_challenge.png", ORANGE),
        ("infrastructure_protection.png", CYAN),
        ("ethanol_damage.png", ORANGE),
        ("molecular_shield.png", CYAN),
        ("performance_surge.png", GREEN),
        ("piston_wear.png", CYAN),
        ("drivetrain_wear.png", CYAN),
        ("clean_emissions.png", GREEN),
        ("longevity_road.png", GREEN),
        ("universal_vehicles_india.jpg", CYAN)
    ]
    
    for img_name, color in tasks:
        process_image_with_border(img_name, color)

if __name__ == "__main__":
    main()
