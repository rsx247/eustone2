"use client";

import { useEffect, useState } from "react";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function RecentlyViewedSection() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
  }, []);

  useEffect(() => {
    if (recentlyViewed.length === 0) {
      setProducts([]);
      return;
    }

    setLoading(true);
    // Fetch products by IDs
    Promise.all(
      recentlyViewed.slice(0, 8).map(id =>
        fetch(`/api/products/${id}`)
          .then(res => res.json())
          .catch(() => null)
      )
    )
      .then(results => {
        setProducts(results.filter(Boolean));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [recentlyViewed]);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-700">Recently Viewed</h3>
        <button
          onClick={clearRecentlyViewed}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      {loading ? (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: Math.min(8, recentlyViewed.length) }).map((_, i) => (
            <div key={i} className="w-20 h-20 flex-shrink-0 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {products.map((product) => {
            let imageUrl = "/placeholder.jpg";
            try {
              const images = JSON.parse(product.images);
              if (Array.isArray(images) && images.length > 0) imageUrl = images[0];
            } catch (e) {}
            
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex-shrink-0 w-20 h-20 rounded border border-stone-200 overflow-hidden hover:border-stone-400 transition-colors relative group"
              >
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </Link>
            );
          })}
        </div>
      ) : null}
      
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

