import os
from PIL import Image, ImageDraw, ImageFilter

def apply_glow_and_feather():
    img_path = os.path.join("images", "product_showcase.png")
    if not os.path.exists(img_path):
        print("Source product showcase image not found.")
        return
        
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    
    # 1. Create a soft ambient glow layer behind the bottles
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_glow = ImageDraw.Draw(glow)
    
    # Draw green and cyan soft ellipses representing glowing backlights
    draw_glow.ellipse((int(w * 0.15), int(h * 0.2), int(w * 0.85), int(h * 0.8)), fill=(0, 255, 102, 60))
    draw_glow.ellipse((int(w * 0.25), int(h * 0.3), int(w * 0.75), int(h * 0.7)), fill=(0, 240, 255, 80))
    
    # Apply a heavy blur to make the backlights highly diffuse
    glow = glow.filter(ImageFilter.GaussianBlur(radius=55))
    
    # 2. Create a feathered mask to fade the hard square borders
    margin = int(w * 0.08) # 8% margin around edges
    mask_content = Image.new("L", (w, h), 0)
    draw_mc = ImageDraw.Draw(mask_content)
    draw_mc.rounded_rectangle((margin, margin, w - margin, h - margin), radius=45, fill=255)
    
    # Blur the mask to create a soft, feathered boundary transition
    mask_feathered = mask_content.filter(ImageFilter.GaussianBlur(radius=30))
    
    # Blend the feathered mask with the original image alpha channel
    orig_alpha = img.split()[3]
    combined_alpha = Image.blend(Image.new("L", (w, h), 0), orig_alpha, 1.0)
    
    # Multiply the two masks together: combined = orig_alpha * mask_feathered / 255
    # We can do this safely using Image.composite or pixel math
    final_alpha = Image.new("L", (w, h), 0)
    final_alpha.paste(mask_feathered, (0, 0), mask=orig_alpha)
    
    img_feathered = img.copy()
    img_feathered.putalpha(final_alpha)
    
    # 3. Combine backlights and feathered product can
    final_canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    final_canvas.paste(glow, (0, 0))
    final_canvas.paste(img_feathered, (0, 0), mask=img_feathered)
    
    output_path = os.path.join("images", "product_showcase_glow.png")
    final_canvas.save(output_path, "PNG")
    print(f"Glow and feathered product image saved at: {output_path}")

if __name__ == "__main__":
    apply_glow_and_feather()
