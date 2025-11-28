import { notFound } from "next/navigation";
import { ProductPageClient } from "@/components/product-page-client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getProduct(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      stock: { gt: 0 }
    },
    take: 4,
    include: { category: true }
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  // Serialize product to convert Decimal to number for client components
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    tradePrice: product.tradePrice ? Number(product.tradePrice) : null,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: 'Products', href: '/products' },
        { label: product.category.name, href: `/products?category=${product.category.slug}` },
        { label: product.name }
      ]} />

      <ProductPageClient product={serializedProduct} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((related) => {
              let imageUrl = "/placeholder.jpg";
              try {
                const images = JSON.parse(related.images);
                if (Array.isArray(images) && images.length > 0) imageUrl = images[0];
              } catch (e) {}

              return (
                <Card key={related.id} className="group overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-[4/3] bg-white flex items-center justify-center">
                    <Image 
                      src={imageUrl}
                      alt={related.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="text-xs text-stone-500 mb-1">{related.category.name}</div>
                    <h3 className="font-semibold text-sm text-stone-900 line-clamp-2">
                      {related.name}
                    </h3>
                  </CardContent>
                  <CardFooter className="p-3 pt-0">
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href={`/products/${related.slug}`}>View</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
