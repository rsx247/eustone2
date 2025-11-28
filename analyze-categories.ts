import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function analyzeCategoriesAndImages() {
  console.log("🔍 Analyzing categories and image usage...\n");

  // Get all categories with product counts
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  console.log("📊 Categories:\n");
  categories.forEach(cat => {
    console.log(`${cat.name} (${cat.slug}): ${cat._count.products} products`);
  });

  // Sample products with placeholders
  const allProducts = await prisma.product.findMany({
    select: {
      name: true,
      slug: true,
      images: true,
      material: true,
      category: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    take: 50
  });

  const placeholderProducts = allProducts.filter(p => {
    try {
      const images = JSON.parse(p.images);
      return images.some((img: string) => img && img.toLowerCase().includes('placeholder'));
    } catch {
      return false;
    }
  });

  console.log(`\n📦 Sample products with placeholders (${placeholderProducts.length} found in sample):\n`);
  placeholderProducts.slice(0, 10).forEach((product, idx) => {
    console.log(`${idx + 1}. ${product.name}`);
    console.log(`   Category: ${product.category?.name || 'N/A'}`);
    console.log(`   Material: ${product.material || 'N/A'}`);
    console.log(`   Images: ${product.images.substring(0, 60)}...`);
    console.log('');
  });

  // Check material field distribution
  const materialsQuery = await prisma.product.groupBy({
    by: ['material'],
    _count: true,
  });

  console.log("\n🪨 Material Distribution:\n");
  materialsQuery.forEach(m => {
    console.log(`${m.material || 'NULL'}: ${m._count} products`);
  });

  await prisma.$disconnect();
}

analyzeCategoriesAndImages().catch(console.error);



