const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertLogos() {
  const publicDir = path.join(__dirname, '../public');
  
  // Convert logo-white.svg to webp
  const logoWhiteSvg = path.join(publicDir, 'logo-white.svg');
  const logoWhiteWebp = path.join(publicDir, 'logo-white.webp');
  
  if (fs.existsSync(logoWhiteSvg)) {
    try {
      await sharp(logoWhiteSvg)
        .resize(600, null, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({ quality: 90 })
        .toFile(logoWhiteWebp);
      
      const stats = fs.statSync(logoWhiteWebp);
      console.log(`✅ Created logo-white.webp - ${(stats.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('❌ Error converting logo-white.svg:', error.message);
    }
  } else {
    console.log('⚠️  logo-white.svg not found');
  }
  
  // Convert logo.svg to webp
  const logoSvg = path.join(publicDir, 'logo.svg');
  const logoWebp = path.join(publicDir, 'logo.webp');
  
  if (fs.existsSync(logoSvg)) {
    try {
      await sharp(logoSvg)
        .resize(600, null, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .webp({ quality: 90 })
        .toFile(logoWebp);
      
      const stats = fs.statSync(logoWebp);
      console.log(`✅ Created logo.webp - ${(stats.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('❌ Error converting logo.svg:', error.message);
    }
  } else {
    console.log('⚠️  logo.svg not found');
  }
  
  console.log('\n✨ Logo conversion complete!');
}

convertLogos().catch(console.error);

