"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import { ProductCard } from "@/components/product-card";
import { QuickViewModal } from "@/components/quick-view-modal";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
  }, []);

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // Fetch favorited products
    Promise.all(
      favorites.map(id => 
        fetch(`/api/products/${id}`).then(res => res.json())
      )
    ).then(data => {
      setProducts(data.filter(p => p && !p.error));
      setLoading(false);
    });
  }, [favorites]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Heart className="w-20 h-20 mx-auto text-stone-300 mb-4" />
          <h1 className="text-3xl font-bold text-stone-900 mb-2">No Saved Products</h1>
          <p className="text-stone-500 mb-8">
            Save products you're interested in for easy access later.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Saved Products</h1>
          <p className="text-stone-500 mt-1">{products.length} {products.length === 1 ? 'item' : 'items'}</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Browsing
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
    </div>
  );
}



