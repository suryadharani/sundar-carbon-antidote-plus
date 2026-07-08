import os
from PIL import Image

def convert_logo():
    # Try using ourlogo.png or logo.jpg
    logo_path = os.path.join("images", "logo.jpg")
    if not os.path.exists(logo_path):
        logo_path = "ourlogo.png"
        
    if not os.path.exists(logo_path):
        print("Logo file not found!")
        return
        
    img = Image.open(logo_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    newData = []
    
    # Iterate through pixels and make white/near-white transparent
    for item in datas:
        # If the pixel is very close to white (R, G, B > 235), set alpha to 0
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    output_path = os.path.join("images", "logo_transparent.png")
    img.save(output_path, "PNG")
    print(f"Transparent logo saved successfully at {output_path}")

if __name__ == "__main__":
    convert_logo()
