"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch some featured products for suggestions
    fetch('/api/products?limit=6')
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Heading */}
        <div>
          <h1 className="text-9xl font-bold text-stone-200 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-stone-900 mb-2">Page Not Found</h2>
          <p className="text-stone-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <Button type="submit" className="px-6">
            Search
          </Button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">
              <Package className="w-4 h-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Product Suggestions */}
        {products.length > 0 && (
          <div className="mt-12 text-left">
            <h3 className="text-xl font-semibold text-stone-900 mb-4">You might be interested in:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm text-stone-900 line-clamp-2 mb-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {product.category?.name || 'Product'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

