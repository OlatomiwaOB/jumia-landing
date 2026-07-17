from PIL import Image
import numpy as np
import os

images = [
    'public/images/mock/electro_amplifier.png',
    'public/images/mock/electro_headphones.png',
    'public/images/mock/electro_audio.png',
    'public/images/mock/electro_mic.png'
]

for img_path in images:
    if not os.path.exists(img_path):
        continue
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)
    
    # Make any pixel that is very bright (almost white/light grey) purely transparent
    # Let's say if R > 220, G > 220, B > 220, it's background
    mask = (data[:, :, 0] > 220) & (data[:, :, 1] > 220) & (data[:, :, 2] > 220)
    data[mask, 3] = 0 # Make transparent
    
    Image.fromarray(data).save(img_path)
    print(f"Processed {img_path}")
