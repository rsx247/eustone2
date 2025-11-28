import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "@/components/hero-carousel";
import FeaturedProductsSection from "@/components/featured-products";
import { RecentlyViewedSection } from "@/components/recently-viewed-section";
import { prisma } from "@/lib/prisma";

// Enable caching for faster loads (revalidate every 60 seconds)
export const revalidate = 60;

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 12,
    where: { 
      stock: { gt: 0 },
      images: { not: { contains: 'placeholder' } } // Prefer products with real images
    },
    include: { category: true },
    orderBy: { price: 'asc' }
  });
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: { products: { _count: 'desc' } },
  });

  // Use optimized category placeholder images
  const categoriesWithImages = categories.map((cat) => {
    // Use optimized category-specific placeholder image
    const categoryPlaceholder = `/images/categories/${cat.slug}.webp`;
    
    return {
      ...cat,
      image: categoryPlaceholder
    };
  });

  return categoriesWithImages;
}


export default async function HomePage() {
  // Run database queries in parallel for faster loading
  const [products, categoriesWithImages] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  // Serialize products to avoid "Decimal objects are not supported" error
  const serializedProducts = products.map(product => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* --- HERO CAROUSEL --- */}
      <HeroCarousel />

      {/* --- VISUAL CATEGORIES --- */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">Explore Our Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesWithImages.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/products?category=${cat.slug}`}
                className="group relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <Image 
                  src={cat.image} 
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority={true}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                  <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                  <span className="text-sm font-medium border-b border-white/0 group-hover:border-white transition-all">View Products</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- RECENTLY VIEWED --- */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <RecentlyViewedSection />
        </div>
      </section>

      {/* --- FEATURED PRODUCTS (CATALOG MODE) --- */}
      <section className="py-16 bg-stone-50">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-stone-900">Featured Products</h2>
            <Button variant="link" asChild>
              <Link href="/products">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          
          <FeaturedProductsSection products={serializedProducts} />
        </div>
      </section>
    </div>
  );
}
