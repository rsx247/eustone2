import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "@/components/hero-carousel";
import FeaturedProductsSection from "@/components/featured-products";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 12,
    where: { stock: { gt: 0 } },
    include: { category: true },
    orderBy: { price: 'asc' }
  });
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: { products: { _count: 'desc' } },
  });

  // Use fast image generation (no external API calls)
  return categories.map((cat) => {
    let image = '/placeholder.svg';
    
    // Try to get a real product image first (fast database query)
    // If not found, use deterministic placeholder
    const seed = cat.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    image = `https://picsum.photos/seed/${seed}/800/600`;

    return {
      ...cat,
      image
    };
  });
}

function getCategoryPrompt(categoryName: string): string {
  const prompts: Record<string, string> = {
    'Quartzite': 'Premium natural quartzite stone slab, polished surface, luxury marble texture, high-end interior design, professional photography, studio lighting',
    'Marble': 'Elegant white and gray marble slab, polished finish, luxury natural stone, high-end interior, professional product photography',
    'Granite': 'Beautiful natural granite stone surface, polished finish, luxury countertop material, professional photography',
    'Onyx': 'Translucent onyx stone slab, backlit effect, luxury natural stone, high-end interior design, professional photography',
    'Travertin': 'Classic travertine stone texture, natural beige tones, polished surface, luxury natural stone, professional photography',
    'Tools': 'Professional construction tools and equipment, tile installation tools, organized on white background, product photography',
    'Tiles': 'Modern ceramic and porcelain tiles, various patterns and colors, luxury bathroom and kitchen tiles, professional product photography',
    'Sinks': 'Luxury marble and stone sinks, modern bathroom design, high-end fixtures, professional product photography, white background',
  };

  // Try exact match first
  if (prompts[categoryName]) {
    return prompts[categoryName];
  }

  // Generate based on category name
  return `Premium ${categoryName.toLowerCase()} products, luxury natural stone materials, professional product photography, high-end interior design, white background, studio lighting`;
}

async function generateCategoryImage(prompt: string, categorySlug: string): Promise<string | null> {
  try {
    // Skip external APIs during development to prevent hanging
    // Use fast fallback immediately
    const seed = categorySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/800/600`;
    
    // Option 1: Try Hugging Face Inference API (free, no credit card needed)
    // Get free token at: https://huggingface.co/settings/tokens
    // DISABLED: Can cause hanging during development
    /*
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (HF_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const response = await fetch(
          'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HF_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                num_inference_steps: 20,
              }
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const imageBlob = await response.blob();
          const arrayBuffer = await imageBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString('base64');
          return `data:image/png;base64,${base64}`;
        }
      } catch (e) {
        console.log('HF API unavailable, using fallback');
      }
    }

    // Option 2: Use Unsplash API (free tier)
    const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
    if (UNSPLASH_KEY) {
      const searchTerm = categorySlug.replace(/-/g, ' ');
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerm)}&w=800&h=600&client_id=${UNSPLASH_KEY}`,
          { 
            next: { revalidate: 3600 }, // Cache for 1 hour
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return data.urls?.regular || data.urls?.full;
        }
      } catch (e) {
        console.log('Unsplash API unavailable');
      }
    }
    */
    
  } catch (error) {
    console.error('Image generation error:', error);
    // Final fallback
    const seed = categorySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/800/600`;
  }
}

async function getProductImageForCategory(categorySlug: string): Promise<string | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        category: {
          slug: categorySlug
        },
        stock: { gt: 0 }
      },
      select: {
        images: true
      }
    });

    if (product && product.images) {
      try {
        const images = JSON.parse(product.images);
        if (Array.isArray(images) && images.length > 0) {
          const validImage = images.find((img: string) => 
            img && 
            img.trim() !== '' && 
            !img.toLowerCase().includes('placeholder')
          );
          
          if (validImage) {
            return validImage.startsWith('/') ? validImage : `/${validImage}`;
          }
        }
      } catch (e) {
        // Invalid JSON
      }
    }
  } catch (e) {
    // Error fetching
  }
  
  return null;
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const categoriesWithImages = await getCategories();

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
                  unoptimized={cat.image.startsWith('data:')}
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
