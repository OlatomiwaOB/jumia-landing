const fs = require('fs');

const mockedFile = './src/utils/mocked-products.ts';
let content = fs.readFileSync(mockedFile, 'utf-8');

const replacements = {
  'mock-knorr-chic': '/knorr-beef.png',
  'mock-maggi-chic': '/maggi-cubes.png',
  'mock-maggi-cray': '/maggi-cubes.png',
  'mock-maggi-star': '/maggi-cubes.png',
  'mock-royco': '/knorr-beef.png',
  'mock-onga-chic': '/spicity-jollof.png',
  'mock-onga-clas': '/spicity-fried.png',
  'mock-onga-stew': '/tasty-cube.png',
  'mock-ducros': '/ducros-thyme.png',
  'mock-lion-curry': '/tiger-masala.png',
  'mock-lion-thyme': '/tiger-masala.png',
  'mock-vp-jollof': '/party-jollof.png'
};

for (const [id, img] of Object.entries(replacements)) {
  // Replace the image strictly for that ID
  const regex = new RegExp(`picture:\\s*"/([^"]+)"(?=.*id:\\s*"${id}")`, 'g');
  content = content.replace(regex, `picture: "${img}"`);
}

fs.writeFileSync(mockedFile, content);
console.log('Replaced with similar images!');
