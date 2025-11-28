"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Heart, Eye, ShoppingCart } from "lucide-react";
import { getThumbnailClass } from "@/lib/thumbnail-utils";
import { useCart } from "@/lib/cart";
import { getPlaceholderStockWarning, getStockBadgeClass } from "@/lib/stock-placeholder";

interface ProductListItemProps {
  product: any;
  isLoggedIn: boolean;
  onQuickView?: (product: any) => void;
  onToggleFavorite?: (productId: string, productName?: string) => void;
  isFavorited?: boolean;
}

export function ProductListItem({ product, isLoggedIn, onQuickView, onToggleFavorite, isFavorited = false }: ProductListItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  let images = ["/placeholder.jpg"];
  try {
    const parsedImages = JSON.parse(product.images);
    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
      images = parsedImages.filter(img => img && img !== '');
    }
    if (images.length === 0) {
      images = ["/placeholder.jpg"];
    }
  } catch (e) {
    images = ["/placeholder.jpg"];
  }

  const thumbClasses = getThumbnailClass(
    product.category?.name || '',
    product.name,
    product.thumbnailAspectRatio,
    product.thumbnailFit
  );

  const stockWarning = getPlaceholderStockWarning(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) return;
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0],
      quantity: 1,
    });
    
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product.id, product.name);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div 
            onClick={handleQuickView}
            className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-white rounded-lg overflow-hidden cursor-pointer"
          >
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              sizes="160px"
              className="object-contain p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
            {stockWarning.show && (
              <Badge className={`absolute top-2 left-2 ${getStockBadgeClass(stockWarning.variant)} z-10`}>
                {stockWarning.message}
              </Badge>
            )}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-stone-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1">
              <Link 
                href={`/products?category=${product.category?.slug || ''}`}
                className="text-xs text-stone-500 hover:underline inline-block mb-1"
              >
                {product.category?.name || 'Uncategorized'}
              </Link>
              
              <Link href={`/products/${product.slug}`} className="block mb-2">
                <h3 className="font-semibold text-base text-stone-900 hover:text-stone-700 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>

              {product.description && (
                <p className="text-sm text-stone-600 line-clamp-2 mb-3">
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-4 mb-3">
                {isLoggedIn ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-stone-900">€{Number(product.price).toFixed(2)}</span>
                    <span className="text-xs text-stone-500">/{product.unit}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span className="text-sm text-stone-500 italic">Login for price</span>
                  </div>
                )}
                
                <Badge variant={product.stock > 0 ? "secondary" : "outline"} className="text-xs">
                  Stock: {product.stock}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickView}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
              
              {isLoggedIn && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 active:translate-y-[1px] active:shadow-inner"
                >
                  {isAddingToCart ? (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2 animate-pulse" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

