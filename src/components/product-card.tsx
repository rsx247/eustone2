"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Heart, ChevronLeft, ChevronRight, Eye, ShoppingCart, FileText, Check } from "lucide-react";
import { getThumbnailClass } from "@/lib/thumbnail-utils";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: any;
  isLoggedIn: boolean;
  onQuickView?: (product: any) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorited?: boolean;
}

export function ProductCard({ product, isLoggedIn, onQuickView, onToggleFavorite, isFavorited = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { addItem } = useCart();

  let images = ["/placeholder.jpg"];
  try {
    const parsedImages = JSON.parse(product.images);
    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
      images = parsedImages.filter(img => img && img !== '');
    }
    // Fallback if no valid images
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

  // Determine product type for CTA
  const categorySlug = product.category?.slug?.toLowerCase() || '';
  const isStandardProduct = ['tools', 'tiles', 'accessories', 'sinks'].includes(categorySlug);
  const isNaturalStone = ['marble', 'granite', 'travertin', 'onyx', 'quartzite', 'slabs'].includes(categorySlug);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    addItem(product, 1);
    setTimeout(() => setIsAddingToCart(false), 2000);
  };

  return (
    <Card 
      className="group overflow-visible hover:shadow-xl transition-all h-full flex flex-col"
    >
      {/* Image Container - Click opens Quick View */}
      <div 
        onClick={() => onQuickView?.(product)}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsImageHovered(true);
        }}
        onMouseLeave={() => {
          // Only hide if not hovering over navigation
          if (!isNavHovered) {
            setIsHovered(false);
            setIsImageHovered(false);
          }
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="cursor-pointer -m-px relative focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
      >
        <div className={`relative ${thumbClasses.container} bg-white flex items-center justify-center overflow-hidden`}>
          <Image
            src={images[currentImageIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className={`${thumbClasses.image} ${thumbClasses.padding}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.jpg';
            }}
          />

          {/* Stock Badge */}
          {product.stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white z-10">
              In Stock
            </Badge>
          )}

          {/* Favorite Button - Top Right with Dark Background, Hover Effect */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-stone-900/80 backdrop-blur-sm rounded-full z-10 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 transition-all ${
              isFavorited 
                ? 'fill-red-500 text-red-500' 
                : 'text-white hover:text-red-500'
            }`} />
          </button>

          {/* Quick View Hint - Above Navigation with Matching Background */}
          {isImageHovered && !isNavHovered && (
            <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
              <div className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white rounded-full">
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Image Navigation - Chevrons and Dots on Same Line, Outside Image */}
        {images.length > 1 && (isImageHovered || isNavHovered) && (
          <div 
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10"
            onMouseEnter={() => setIsNavHovered(true)}
            onMouseLeave={() => {
              setIsNavHovered(false);
              if (!isImageHovered) {
                setIsHovered(false);
              }
            }}
          >
            <button
              onClick={handlePrevImage}
              className="p-0.5 transition-opacity hover:opacity-70"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-stone-900" />
            </button>
            
            {/* Image Indicator Dots */}
            <div className="flex gap-1.5 items-center">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 relative ${
                    idx === currentImageIndex 
                      ? 'w-4 bg-stone-300' 
                      : 'w-1.5 bg-stone-400/60 hover:bg-stone-600/80'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                >
                  {idx === currentImageIndex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-stone-900" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleNextImage}
              className="p-0.5 transition-opacity hover:opacity-70"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5 text-stone-900" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-3 flex-1 flex flex-col">
        {/* Category - Clickable */}
        <Link 
          href={`/products?category=${product.category?.slug || ''}`}
          className="text-xs text-stone-500 mb-1 hover:text-blue-600 transition-colors inline-block w-fit"
        >
          {product.category?.name || 'Uncategorized'}
        </Link>

        {/* Product Name - Clickable - Goes to Full Product Page */}
        <Link 
          href={`/products/${product.slug}`}
          className="hover:text-blue-600 transition-colors mb-auto"
        >
          <h3 className="font-semibold text-sm text-stone-900 line-clamp-2 h-10 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Price Display */}
        <div className="flex items-baseline gap-1 mb-3">
          {isLoggedIn ? (
            <>
              <span className="text-lg font-bold text-stone-900">€{Number(product.price).toFixed(2)}</span>
              <span className="text-xs text-stone-500">/{product.unit}</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 text-stone-400" />
              <span className="text-sm text-stone-500 italic">Login for price</span>
            </>
          )}
        </div>

        {/* CTA Button - Context Dependent */}
        {isLoggedIn ? (
          isStandardProduct ? (
            <Button 
              size="sm" 
              className={`w-full transition-all duration-200 overflow-hidden relative ${
                isAddingToCart 
                  ? 'bg-green-600 hover:bg-green-600 animate-[fadeOutGreen_2s_ease-out_forwards]' 
                  : 'bg-stone-900 hover:bg-stone-900/80'
              }`}
              onMouseDown={(e) => {
                if (!isAddingToCart) {
                  e.currentTarget.style.transform = 'translateY(1px)';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center animate-in slide-in-from-right-4 duration-300">
                  <Check className="w-4 h-4 mr-1.5 animate-in fade-in duration-300 text-green-50" />
                  <span>Added!</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  <span>Add to Cart</span>
                </span>
              )}
            </Button>
          ) : isNaturalStone ? (
            <Button 
              size="sm" 
              variant="outline"
              className="w-full"
              onClick={() => onQuickView?.(product)}
            >
              <FileText className="w-4 h-4 mr-1.5" />
              Request Quote
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link href={`/products/${product.slug}`}>View Details</Link>
            </Button>
          )
        ) : (
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/trade/register">Login to Order</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
