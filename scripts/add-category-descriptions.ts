import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryDescriptions: Record<string, string> = {
  marble: 'Discover our premium collection of marble slabs and tiles. Marble is a timeless natural stone known for its elegant veining and luxurious appearance, perfect for both residential and commercial applications.',
  tools: 'Professional stone installation tools and accessories. From leveling systems to adhesives, find everything you need for flawless stone and tile installations.',
  tiles: 'Explore our extensive range of natural stone and ceramic tiles. From classic marble tiles to modern designs, find the perfect tiles for floors, walls, and backsplashes.',
  sinks: 'Luxurious marble and stone sinks for bathrooms and kitchens. Handcrafted from premium natural stone, our sinks combine functionality with timeless elegance.',
  travertin: 'Beautiful travertine stone in various finishes. This natural stone offers a warm, earthy aesthetic with unique patterns, ideal for creating stunning interior and exterior spaces.',
  granite: 'Durable and beautiful granite slabs and tiles. Known for its strength and resistance, granite is perfect for high-traffic areas and outdoor applications.',
  onyx: 'Exotic onyx stone with stunning translucency. This rare natural stone creates dramatic lighting effects and adds a touch of luxury to any space.',
  quartzite: 'Premium quartzite slabs with exceptional durability. This natural stone offers the beauty of marble with the strength of granite, perfect for countertops and high-end applications.',
};

async function main() {
  console.log('Adding category descriptions...\n');

  for (const [slug, description] of Object.entries(categoryDescriptions)) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
      });

      if (category) {
        await prisma.category.update({
          where: { slug },
          data: { description },
        });
        console.log(`✓ Added description to "${category.name}"`);
      } else {
        console.log(`⚠ Category "${slug}" not found`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${slug}:`, error);
    }
  }

  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

