from PIL import Image
import numpy as np
import os

img_path = 'public/images/mock/electro_mouse.png'

if os.path.exists(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)
    
    # Make any pixel that is very bright (almost white/light grey) purely transparent
    # R > 220, G > 220, B > 220
    mask = (data[:, :, 0] > 220) & (data[:, :, 1] > 220) & (data[:, :, 2] > 220)
    data[mask, 3] = 0 # Make transparent
    
    Image.fromarray(data).save(img_path)
    print(f"Processed {img_path}")
