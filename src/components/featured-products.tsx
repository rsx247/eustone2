"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getThumbnailClass } from "@/lib/thumbnail-utils";
import { ProductCard } from "@/components/product-card";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useFavorites } from "@/lib/favorites";

export default function FeaturedProductsSection({ products }: { products: any[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const { toggleFavorite, isFavorited } = useFavorites();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isLoggedIn={isLoggedIn}
            onQuickView={setQuickViewProduct}
            onToggleFavorite={toggleFavorite}
            isFavorited={isFavorited(product.id)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}

