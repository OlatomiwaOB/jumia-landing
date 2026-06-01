const fs = require('fs');
const path = require('path');

const mockedFile = './src/utils/mocked-products.ts';
let content = fs.readFileSync(mockedFile, 'utf-8');

const replacements = {
  'mock-knorr-chic': '/knorr-chicken.png',
  'mock-maggi-chic': '/maggi-chicken.png',
  'mock-maggi-cray': '/maggi-crayfish.png',
  'mock-maggi-star': '/maggi-star.png',
  'mock-royco': '/royco-chicken.png',
  'mock-onga-chic': '/onga-chicken.png',
  'mock-onga-clas': '/onga-classic.png',
  'mock-onga-stew': '/onga-stew.png',
  'mock-ducros': '/ducros-curry.png',
  'mock-lion-curry': '/lion-curry.png',
  'mock-lion-thyme': '/lion-thyme.png',
  'mock-vp-jollof': '/vp-jollof.png'
};

for (const [id, img] of Object.entries(replacements)) {
  // Regex to match the product line with the specific ID and replace the picture
  const regex = new RegExp(`picture:\\s*"/placeholder-image\\.png"(?=.*id:\\s*"${id}")`, 'g');
  content = content.replace(regex, `picture: "${img}"`);
}

fs.writeFileSync(mockedFile, content);
console.log('Reverted images via regex!');
