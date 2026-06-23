/**
 * PWA Icon Generator Script
 * 
 * This script generates PWA icons from the base SVG icon.
 * 
 * To generate icons, you can use one of these methods:
 * 
 * Method 1: Use an online tool
 * - Go to https://www.pwabuilder.com/imageGenerator
 * - Upload public/icons/icon.svg
 * - Download the generated icons
 * - Place them in public/icons/
 * 
 * Method 2: Use Sharp (Node.js)
 * - npm install sharp
 * - Run this script: node scripts/generate-icons.js
 * 
 * Method 3: Use Inkscape CLI
 * - inkscape --export-type=png --export-width=512 icon.svg
 * 
 * Required icon sizes for PWA:
 * - 72x72
 * - 96x96
 * - 128x128
 * - 144x144
 * - 152x152
 * - 192x192
 * - 384x384
 * - 512x512
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp is not installed. Please run: npm install sharp');
  console.log('Or use an online tool like https://www.pwabuilder.com/imageGenerator');
  console.log('\nCreating placeholder PNG files for development...');
  createPlaceholders();
  process.exit(0);
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('Generating PWA icons...\n');
  
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✓ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }
  
  console.log('\n✓ Icon generation complete!');
}

function createPlaceholders() {
  // Create simple placeholder text files as markers
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  sizes.forEach(size => {
    const filePath = path.join(__dirname, `../public/icons/icon-${size}x${size}.png`);
    // We can't create actual PNGs without a library, so just log the requirement
    console.log(`  → Need to create: icon-${size}x${size}.png`);
  });
  
  console.log('\nTo generate actual icons:');
  console.log('1. Install sharp: npm install sharp');
  console.log('2. Run: node scripts/generate-icons.js');
  console.log('\nOr use https://www.pwabuilder.com/imageGenerator with the SVG file');
}

generateIcons().catch(console.error);


