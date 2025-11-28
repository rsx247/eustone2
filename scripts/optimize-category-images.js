const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const categoriesDir = path.join(__dirname, '../public/images/categories');
const images = [
  { input: 'tiles-placeholder.jpg', output: 'tiles.webp', width: 800, height: 600 },
  { input: 'marble-placeholder.jpg', output: 'marble.webp', width: 800, height: 600 },
  { input: 'tools-placeholder.jpg', output: 'tools.webp', width: 800, height: 600 },
  { input: 'sinks-placeholder.jpg', output: 'sinks.webp', width: 800, height: 600 },
  { input: 'travertin-placeholder.jpg', output: 'travertin.webp', width: 800, height: 600 },
  { input: 'quartzite-placeholder.jpg', output: 'quartzite.webp', width: 800, height: 600 },
  { input: 'granite-placeholder.jpg', output: 'granite.webp', width: 800, height: 600 },
  { input: 'onyx-placeholder.jpg', output: 'onyx.webp', width: 800, height: 600 },
];

async function optimizeImages() {
  console.log('🖼️  Optimizing category images...\n');
  
  for (const img of images) {
    const inputPath = path.join(categoriesDir, img.input);
    const outputPath = path.join(categoriesDir, img.output);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${img.input} - file not found`);
      continue;
    }
    
    try {
      await sharp(inputPath)
        .resize(img.width, img.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const originalStats = fs.statSync(inputPath);
      const savings = ((1 - stats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${img.output} - ${(stats.size / 1024).toFixed(1)}KB (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${img.input}:`, error.message);
    }
  }
  
  console.log('\n✨ Optimization complete!');
}

optimizeImages().catch(console.error);

