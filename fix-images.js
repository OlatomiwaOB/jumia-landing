const fs = require('fs');
const path = require('path');

const mockedFile = './src/utils/mocked-products.ts';
let content = fs.readFileSync(mockedFile, 'utf-8');

const publicDir = path.join(__dirname, 'public');

// Find all picture: "/something.jpg"
const regex = /picture:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const imgPath = match[1];
  const fullPath = path.join(publicDir, imgPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Missing image: ${imgPath}`);
    // Replace the exact match
    content = content.replace(`picture: "${imgPath}"`, `picture: "/placeholder-image.png"`);
  }
}

fs.writeFileSync(mockedFile, content);
console.log('Fixed missing images!');
