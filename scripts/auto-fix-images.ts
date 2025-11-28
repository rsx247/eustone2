/**
 * Automatically fix product images using fuzzy matching
 * 
 * Run with: npx ts-node scripts/auto-fix-images.ts
 * 
 * This script will:
 * 1. Find products with placeholder images
 * 2. Try to match them with existing image files using fuzzy logic
 * 3. Update the database if a confident match is found
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const IMAGE_DIR = path.join(process.cwd(), 'public/images/legacy');
const PLACEHOLDER_IMAGE = '/placeholder.jpg';
const DRY_RUN = process.argv.includes('--dry-run'); // Add --dry-run to test without updating

async function main() {
  console.log('🔧 Auto-fixing product images with fuzzy matching...\n');
  console.log(`Mode: ${DRY_RUN ? '🧪 DRY RUN (no changes will be made)' : '✏️  LIVE UPDATE'}\n`);

  const productsWithPlaceholder = await prisma.product.findMany({
    where: {
      images: {
        contains: PLACEHOLDER_IMAGE
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  console.log(`Found ${productsWithPlaceholder.length} products with placeholder images\n`);

  const availableImages = fs.readdirSync(IMAGE_DIR);
  console.log(`Scanning ${availableImages.length} image files...\n`);

  let fixedCount = 0;
  let skippedCount = 0;

  for (const product of productsWithPlaceholder) {
    const matches = findImageMatches(product.name, product.slug, availableImages);
    
    if (matches.length > 0) {
      const imagePaths = matches
        .slice(0, 3) // Take up to 3 images
        .map(img => `/images/legacy/${img}`);

      console.log(`✅ ${product.name}`);
      console.log(`   Matched: ${matches.slice(0, 3).join(', ')}`);

      if (!DRY_RUN) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: JSON.stringify(imagePaths)
          }
        });
      }

      fixedCount++;
    } else {
      console.log(`⏭️  ${product.name} - No confident match`);
      skippedCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Fixed: ${fixedCount}`);
  console.log(`  ⏭️  Skipped: ${skippedCount}`);

  if (DRY_RUN) {
    console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Database updated successfully!');
  }
}

/**
 * Find image files that match a product name/slug using fuzzy logic
 */
function findImageMatches(name: string, slug: string, availableImages: string[]): string[] {
  const nameLower = name.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const slugParts = slug.toLowerCase().split('-').filter(part => part.length > 2);
  
  // Extract significant keywords from name
  const keywords = nameLower
    .split(/\s+/)
    .filter(word => word.length > 3 && !['slab', 'polished', 'marble', 'with'].includes(word))
    .slice(0, 4);

  const matches: Array<{ file: string; score: number }> = [];

  for (const image of availableImages) {
    const imageLower = image.toLowerCase();
    let score = 0;

    // Strategy 1: Check for slug parts (highest confidence)
    const matchingSlugParts = slugParts.filter(part => imageLower.includes(part));
    score += matchingSlugParts.length * 10;

    // Strategy 2: Check for keywords from name
    const matchingKeywords = keywords.filter(keyword => imageLower.includes(keyword));
    score += matchingKeywords.length * 5;

    // Strategy 3: Bonus for numbered variants (-1, -2, -3, -main)
    if (score > 15) {
      if (imageLower.includes('-main') || imageLower.includes('-1')) {
        score += 3;
      }
      if (imageLower.includes('-2') || imageLower.includes('-3')) {
        score += 1;
      }
    }

    // Only consider matches with a reasonable confidence score
    if (score >= 15) {
      matches.push({ file: image, score });
    }
  }

  // Sort by score (highest first) and return file names
  return matches
    .sort((a, b) => b.score - a.score)
    .map(m => m.file);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });



