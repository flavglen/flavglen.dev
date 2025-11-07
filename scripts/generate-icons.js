const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = path.join(__dirname, '../public/gp-logo.png');
const outputDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Check if input image exists
    if (!fs.existsSync(inputImage)) {
      console.error(`Error: Input image not found at ${inputImage}`);
      console.log('Please ensure gp-logo.png exists in the public folder');
      process.exit(1);
    }

    console.log('Generating PWA icons...');
    
    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }
    
    console.log('\n✅ All icons generated successfully!');
    console.log(`Icons saved to: ${outputDir}`);
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

