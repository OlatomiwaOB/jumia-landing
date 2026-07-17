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
        print(f"Skipping {img_path}")
        continue
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)
    
    # Use top-left pixel as the background color
    bg_color = data[0, 0, :3]
    
    # Find all pixels close to the background color
    threshold = 15
    diff = np.abs(data[:, :, :3].astype(int) - bg_color.astype(int))
    mask = np.all(diff < threshold, axis=-1)
    
    # Make background pixels purely white so mix-blend-multiply completely hides it
    data[mask, 0] = 255
    data[mask, 1] = 255
    data[mask, 2] = 255
    
    Image.fromarray(data).save(img_path)
    print(f"Processed {img_path}")
