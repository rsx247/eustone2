/**
 * Script to fix missing product images
 * 
 * Run with: npx ts-node scripts/fix-missing-images.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const IMAGE_DIR = path.join(process.cwd(), 'public/images/legacy');
const PLACEHOLDER_IMAGE = '/placeholder.jpg';

async function main() {
  console.log('🔍 Analyzing products with missing images...\n');

  // Get all products with placeholder images
  const productsWithPlaceholder = await prisma.product.findMany({
    where: {
      images: {
        contains: PLACEHOLDER_IMAGE
      }
    },
    include: {
      category: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  console.log(`Found ${productsWithPlaceholder.length} products with placeholder images\n`);

  // Get all available image files
  const availableImages = fs.readdirSync(IMAGE_DIR);
  console.log(`Total image files in legacy folder: ${availableImages.length}\n`);

  // Group by source for better analysis
  const bySource: Record<string, any[]> = {
    'Arsenius': [],
    'Marmermarkt': [],
    'Unknown': []
  };

  productsWithPlaceholder.forEach(product => {
    const source = product.source || 'Unknown';
    bySource[source].push(product);
  });

  console.log('📊 Breakdown by Source:');
  Object.entries(bySource).forEach(([source, products]) => {
    console.log(`  ${source}: ${products.length} products`);
  });
  console.log('');

  // Try fuzzy matching for some products
  console.log('🔎 Attempting fuzzy image matching...\n');
  let foundCount = 0;
  let notFoundCount = 0;

  for (const product of productsWithPlaceholder.slice(0, 20)) { // Sample first 20
    const slug = product.slug;
    const name = product.name.toLowerCase();
    
    // Try different matching strategies
    const possibleMatches: string[] = [];
    
    // Strategy 1: Exact slug match
    const exactMatches = availableImages.filter(img => 
      img.toLowerCase().includes(slug.toLowerCase().split('-').slice(0, 3).join('-'))
    );
    possibleMatches.push(...exactMatches);
    
    // Strategy 2: Match by key words from name
    const keywords = name
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3);
    
    if (keywords.length > 0) {
      const keywordMatches = availableImages.filter(img => {
        const imgLower = img.toLowerCase();
        return keywords.some(keyword => imgLower.includes(keyword));
      });
      possibleMatches.push(...keywordMatches);
    }

    // Remove duplicates
    const uniqueMatches = [...new Set(possibleMatches)];

    if (uniqueMatches.length > 0) {
      console.log(`✅ ${product.name}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   Possible images: ${uniqueMatches.slice(0, 3).join(', ')}`);
      foundCount++;
    } else {
      console.log(`❌ ${product.name}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   Source: ${product.source || 'Unknown'}`);
      notFoundCount++;
    }
    console.log('');
  }

  console.log(`\n📈 Summary (sample of 20):`);
  console.log(`  ✅ Found possible matches: ${foundCount}`);
  console.log(`  ❌ No matches found: ${notFoundCount}`);

  // Generate CSV export for manual review
  console.log('\n📄 Generating CSV export...');
  const csvPath = path.join(process.cwd(), 'missing-images-report.csv');
  const csvLines = [
    'Product ID,Name,Slug,Category,Source,Admin Edit Link'
  ];

  productsWithPlaceholder.forEach(product => {
    csvLines.push([
      product.id,
      `"${product.name.replace(/"/g, '""')}"`,
      product.slug,
      product.category.name,
      product.source || 'Unknown',
      `http://localhost:3003/admin/products/${product.id}/edit`
    ].join(','));
  });

  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf-8');
  console.log(`✅ Report saved to: ${csvPath}`);

  console.log('\n🎯 Recommended Actions:');
  console.log('1. Review the CSV file to see all products with missing images');
  console.log('2. For Arsenius products: Visit arsenius.nl and download images');
  console.log('3. For Marmermarkt products: Visit marmermarkt.com and download images');
  console.log('4. For Unknown source: Check the original SQL database');
  console.log('5. Use the admin edit link to manually update each product');
  console.log('\n💡 Tip: You can also use the /admin/verify dashboard to see all issues at once');
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



