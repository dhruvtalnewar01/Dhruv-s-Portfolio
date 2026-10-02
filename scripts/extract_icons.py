import os
from PIL import Image

img_path = r"c:\Users\Dhruv\Downloads\Portfolio OS\Icon Design Spotlight (April 2025).jpg"
out_dir = r"c:\Users\Dhruv\Downloads\Portfolio OS\public\assets\icons"

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

try:
    img = Image.open(img_path)
    w, h = img.size
    cols, rows = 4, 4
    cw, ch = w // cols, h // rows

    for r in range(rows):
        for c in range(cols):
            box = (c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)
            cropped = img.crop(box)
            cropped.save(os.path.join(out_dir, f"icon_{r}_{c}.jpg"))
    print("Icons extracted successfully")
except Exception as e:
    print("Error extracting icons:", e)
