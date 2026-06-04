from PIL import Image
import numpy as np

# Load image
img = Image.open('/Users/olatomiwa/Documents/Idowu_latomiwa/Internship/Dimensionlogic-templates/public/premium_suya_special.png').convert("RGBA")
data = np.array(img)

# The background color is a dark grey. Let's sample the top-left corner pixel.
bg_color = data[0, 0, :3]
print("Background color:", bg_color)

# Find all pixels that are very close to the background color
threshold = 30
diff = np.abs(data[:, :, :3].astype(int) - bg_color.astype(int))
mask = np.all(diff < threshold, axis=-1)

# Make those pixels transparent
data[mask, 3] = 0

# Save
Image.fromarray(data).save('/Users/olatomiwa/Documents/Idowu_latomiwa/Internship/Dimensionlogic-templates/public/premium_suya_special_transparent.png')
print("Saved transparent image.")
