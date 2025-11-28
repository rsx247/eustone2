import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

const CATEGORIES_FILE = "/Users/admin/Documents/EUSTONE/Cursor/Products Scraper/1. USER MASTER/Categories SQL Export - Live Database.sql";
const PRODUCTS_FILE = "/Users/admin/Documents/EUSTONE/Cursor/Products Scraper/1. USER MASTER/Full Live Database Export SQL 20102025-1113.sql";
const IMAGE_DIR = "/Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini/public/images/legacy";

// Helper to find all image variations for a product
function findProductImages(productSlug: string): string[] {
  const images: string[] = [];
  
  try {
    const files = fs.readdirSync(IMAGE_DIR);
    
    // Find all images that start with the product slug
    // e.g., for "bouwemmer-12l-zwart" we want:
    //   - bouwemmer-12l-zwart-main.jpg
    //   - bouwemmer-12l-zwart-1.webp
    //   - bouwemmer-12l-zwart-2.jpg
    //   - etc.
    
    const matchingFiles = files
      .filter(file => file.startsWith(productSlug) && !file.includes('-thumb'))
      .sort(); // Sort so -main comes after -1, -2, etc.
    
    // Prioritize -main image first if it exists
    const mainImage = matchingFiles.find(f => f.includes('-main'));
    if (mainImage) {
      images.push(`/images/legacy/${mainImage}`);
    }
    
    // Add numbered variations (-1, -2, -3)
    const numberedImages = matchingFiles
      .filter(f => /-(1|2|3)\.(webp|jpg|jpeg|png)$/i.test(f))
      .slice(0, 3); // Max 3 additional images
    
    for (const img of numberedImages) {
      if (!images.includes(`/images/legacy/${img}`)) {
        images.push(`/images/legacy/${img}`);
      }
    }
    
    // If still no images, try the slug itself
    if (images.length === 0) {
      const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
      for (const ext of extensions) {
        const filename = `${productSlug}${ext}`;
        if (files.includes(filename)) {
          images.push(`/images/legacy/${filename}`);
          break;
        }
      }
    }
    
  } catch (e) {
    console.error(`Error finding images for ${productSlug}:`, e);
  }
  
  // Return found images or placeholder
  return images.length > 0 ? images : ['/placeholder.jpg'];
}

// Helper to determine source based on product name
function detectSource(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('titan') || lower.includes('kalekim') || lower.includes('schonox') || lower.includes('ox trade')) {
    return 'Arsenius';
  }
  if (lower.includes('wasbak') || lower.includes('wastafel') || lower.includes('hammam')) {
    return 'Marmermarkt';
  }
  return 'Unknown';
}

async function main() {
  console.log('--- FULL DATABASE IMPORT WITH ENHANCEMENTS ---\n');
  
  try {
    // 1. Import Categories from dedicated file
    console.log('Step 1: Importing Categories...');
    const catContent = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    const catMap = new Map<number, string>();
    
    const catMatch = catContent.match(/INSERT INTO `categories`[\s\S]*?VALUES\s*([\s\S]*?);/);
    if (catMatch) {
        const catValues = catMatch[1];
        const catRows = catValues.split(/\),\s*\(/);
        
        for (const row of catRows) {
            const clean = row.replace(/^\(/, '').replace(/\)$/, '');
            const matches = clean.match(/(?:'(?:[^'\\]|\\.)*'|NULL|[\d.]+)/g);
            
            if (matches && matches.length > 3) {
                const legacyId = parseInt(matches[0]);
                const name = matches[1].replace(/^'|'$/g, '').replace(/\\'/g, "'");
                const slug = matches[2].replace(/^'|'$/g, '').replace(/\\'/g, "'");
                
                const c = await prisma.category.upsert({
                    where: { slug: slug },
                    update: { name },
                    create: { name, slug }
                });
                catMap.set(legacyId, c.id);
            }
        }
    }
    console.log(`✓ ${catMap.size} categories imported\n`);

    // 2. Import Products from main file
    console.log('Step 2: Importing Products with Enhanced Data...');
    const prodContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    
    const productRegex = /INSERT INTO `products`[^;]*VALUES\s*([\s\S]*?);/g;
    let match;
    let totalProducts = 0;
    let toolsCount = 0;
    let sinksCount = 0;
    let tilesCount = 0;
    let marbleCount = 0;
    let graniteCount = 0;
    let travertinCount = 0;
    let onyxCount = 0;
    let quartziteCount = 0;
    let multiImageCount = 0;
    
    while ((match = productRegex.exec(prodContent)) !== null) {
        const valuesBlock = match[1];
        const rows = valuesBlock.split(/\),\s*\(/);
        
        for (const row of rows) {
            const clean = row.replace(/^\(/, '').replace(/\)$/, '');
            const matches = clean.match(/(?:'(?:[^'\\]|\\.)*'|NULL|[\d.]+)/g);
            
            if (!matches || matches.length < 45) continue;

            const name = matches[3]?.replace(/^'|'$/g, '').replace(/\\'/g, "'");
            const slug = matches[4]?.replace(/^'|'$/g, '').replace(/\\'/g, "'");
            const legacyCatId = parseInt(matches[7] || '0');
            const price = parseFloat(matches[35] || '0');
            const stock = parseInt(matches[42] || '0');
            const details = matches[44]?.replace(/^'|'$/g, '').replace(/\\'/g, "'") || "";
            
            if (!name || !slug) continue;

            // ENHANCED: Find all product images
            const productImages = findProductImages(slug);
            if (productImages.length > 1 && !productImages[0].includes('unsplash')) {
                multiImageCount++;
            }
            
            // ENHANCED: Detect source
            const source = detectSource(name);

            // INTELLIGENT CATEGORY MAPPING
            let prismaCatId = catMap.get(legacyCatId);
            
            if (!prismaCatId) {
                const lowerName = name.toLowerCase();
                const lowerDesc = details.toLowerCase();
                const combined = `${lowerName} ${lowerDesc}`;
                
                // PRIORITY 1: Natural Stone Types (check FIRST, most specific)
                // Marble - check name AND description
                if (combined.includes('marmer') || combined.includes('marble')) {
                    const marbleCat = await prisma.category.findFirst({ where: { slug: 'marble' } });
                    if (marbleCat) {
                        prismaCatId = marbleCat.id;
                        marbleCount++;
                    }
                }
                // Travertine
                else if (combined.includes('travertin') || combined.includes('travertine')) {
                    const travertinCat = await prisma.category.findFirst({ where: { slug: 'travertin' } });
                    if (travertinCat) {
                        prismaCatId = travertinCat.id;
                        travertinCount++;
                    }
                }
                // Granite
                else if (combined.includes('graniet') || combined.includes('granite')) {
                    const graniteCat = await prisma.category.findFirst({ where: { slug: 'granite' } });
                    if (graniteCat) {
                        prismaCatId = graniteCat.id;
                        graniteCount++;
                    }
                }
                // Onyx
                else if (combined.includes('onyx')) {
                    const onyxCat = await prisma.category.findFirst({ where: { slug: 'onyx' } });
                    if (onyxCat) {
                        prismaCatId = onyxCat.id;
                        onyxCount++;
                    }
                }
                // Quartzite (specific stone type, not a sink!)
                else if (combined.includes('quartzite') || combined.includes('kwartsiet') || combined.includes('afyon')) {
                    const quartziteCat = await prisma.category.findFirst({ where: { slug: 'quartzite' } });
                    if (quartziteCat) {
                        prismaCatId = quartziteCat.id;
                        quartziteCount++;
                    }
                }
                
                // PRIORITY 2: Sinks (check BEFORE tools, as some sinks might have tool keywords)
                if (!prismaCatId && (lowerName.includes('wasbak') || lowerName.includes('wastafel') || lowerName.includes('sink') || lowerName.includes('gootsteen') || lowerName.includes('hammam') || lowerName.includes('badkuip') || lowerName.includes('douchebak'))) {
                    const sinksCat = await prisma.category.findFirst({ where: { slug: 'sinks' } });
                    if (sinksCat) {
                        prismaCatId = sinksCat.id;
                        sinksCount++;
                    }
                }
                
                // PRIORITY 3: Tiles
                if (!prismaCatId && (lowerName.includes('tegel') || lowerName.includes('tile') || lowerName.includes('vloer') || lowerName.includes('wand') || lowerName.includes('metro') || lowerName.includes('mosaïek') || lowerName.includes('houtlook'))) {
                    const tilesCat = await prisma.category.findFirst({ where: { slug: 'tiles' } });
                    if (tilesCat) {
                        prismaCatId = tilesCat.id;
                        tilesCount++;
                    }
                }
                
                // PRIORITY 4: Tools & Supplies (check LAST, most generic)
                if (!prismaCatId && (
                    lowerName.includes('bouwemmer') || 
                    lowerName.includes('emmer') ||
                    lowerName.includes('speciekuip') ||
                    lowerName.includes('tegelkruis') || 
                    lowerName.includes('lijm') || 
                    lowerName.includes('kit') || 
                    lowerName.includes('profiel') ||
                    lowerName.includes('level') ||
                    lowerName.includes('spaan') ||
                    lowerName.includes('titan') ||
                    lowerName.includes('schonox') ||
                    lowerName.includes('kalekim') ||
                    lowerName.includes('eltex') ||
                    lowerName.includes('dorpel') ||
                    lowerName.includes('voeg') ||
                    lowerName.includes('boor') ||
                    lowerName.includes('rol') ||
                    lowerName.includes('ox trade') ||
                    lowerName.includes('gereedschap')
                )) {
                    const toolsCat = await prisma.category.findFirst({ where: { slug: 'tools' } });
                    if (toolsCat) {
                        prismaCatId = toolsCat.id;
                        toolsCount++;
                    }
                }
                
                // Fallback to first available category
                if (!prismaCatId) {
                    const firstCat = await prisma.category.findFirst();
                    if (firstCat) prismaCatId = firstCat.id;
                }
            }

            if (prismaCatId) {
                await prisma.product.upsert({
                    where: { slug: slug },
                    update: { 
                        price, 
                        stock: isNaN(stock) ? 0 : stock,
                        images: JSON.stringify(productImages),
                        source,
                        legacyCategoryId: legacyCatId
                    },
                    create: {
                        name,
                        slug,
                        description: details.substring(0, 500),
                        price,
                        stock: isNaN(stock) ? 0 : stock,
                        images: JSON.stringify(productImages),
                        category: { connect: { id: prismaCatId } },
                        unit: 'piece',
                        isLot: false,
                        verified: false,
                        source,
                        legacyCategoryId: legacyCatId
                    }
                });
                totalProducts++;
                if (totalProducts % 100 === 0) console.log(`   ... ${totalProducts} products`);
            }
        }
    }
    
    console.log(`\n╔═══════════════════════════════════════╗`);
    console.log(`║     IMPORT COMPLETE                   ║`);
    console.log(`╠═══════════════════════════════════════╣`);
    console.log(`║ Total Products:       ${totalProducts.toString().padStart(15)} ║`);
    console.log(`║ Multi-Image Products: ${multiImageCount.toString().padStart(15)} ║`);
    console.log(`║                                       ║`);
    console.log(`║ Intelligently Categorized:            ║`);
    console.log(`║   → Marble:           ${marbleCount.toString().padStart(15)} ║`);
    console.log(`║   → Travertin:        ${travertinCount.toString().padStart(15)} ║`);
    console.log(`║   → Granite:          ${graniteCount.toString().padStart(15)} ║`);
    console.log(`║   → Onyx:             ${onyxCount.toString().padStart(15)} ║`);
    console.log(`║   → Quartzite:        ${quartziteCount.toString().padStart(15)} ║`);
    console.log(`║   → Sinks:            ${sinksCount.toString().padStart(15)} ║`);
    console.log(`║   → Tiles:            ${tilesCount.toString().padStart(15)} ║`);
    console.log(`║   → Tools:            ${toolsCount.toString().padStart(15)} ║`);
    console.log(`╚═══════════════════════════════════════╝`);

  } catch (e) {
    console.error("\n❌ IMPORT FAILED:", e);
    throw e;
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
