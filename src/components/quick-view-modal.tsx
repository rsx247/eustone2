"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, ExternalLink, Lock, Image as ImageIcon, Type, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getPlaceholderStockWarning, getStockBadgeClass } from "@/lib/stock-placeholder";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

export function QuickViewModal({ product, isOpen, onClose, isLoggedIn }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'image' | 'details'>('image'); // 'image' focus vs 'details' focus
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();

  // Reset view mode and quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewMode('image');
      setQuantity(1);
    }
  }, [isOpen]);

  if (!product) return null;

  let images = ["/placeholder.jpg"];
  try {
    const parsedImages = JSON.parse(product.images);
    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
      images = parsedImages;
    }
  } catch (e) {}

  const favorited = isFavorited(product.id);
  
  // Get placeholder stock warning (10-15% of products will show warnings)
  const stockWarning = getPlaceholderStockWarning(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleViewModeChange = (mode: 'image' | 'details') => {
    setViewMode(mode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* View Mode Toggle - Outside Modal, rendered via portal */}
      {isOpen && typeof window !== 'undefined' && createPortal((
        <div 
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] hidden md:flex bg-white/95 backdrop-blur rounded-full p-1 shadow-lg border border-stone-200"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleViewModeChange('image');
            }}
            className={`p-2.5 rounded-full transition-all ${viewMode === 'image' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
            title="Lightbox Gallery"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleViewModeChange('details');
            }}
            className={`p-2.5 rounded-full transition-all ${viewMode === 'details' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
            title="Show Details"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      ), document.body)}
        <DialogContent 
        className="max-w-[90vw] md:max-w-[80vw] p-0 overflow-hidden bg-transparent border-none h-[85vh] md:h-[80vh] max-h-[85vh] md:max-h-[80vh] flex flex-col gap-0 shadow-none"
        overlayClassName="bg-black/25"
      >
        <VisuallyHidden>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>Quick view of {product.name} - {product.category?.name || 'Product'}</DialogDescription>
        </VisuallyHidden>

        {/* Image Mode: Lightbox Gallery */}
        {viewMode === 'image' && (
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Main Image - Full Screen Lightbox */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
              <div className="relative w-full h-full drop-shadow-2xl">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Navigation Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/95 backdrop-blur rounded-full shadow-lg hover:bg-white border border-stone-200 transition-colors z-30"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-stone-900" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/95 backdrop-blur rounded-full shadow-lg hover:bg-white border border-stone-200 transition-colors z-30"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-stone-900" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip with Small Title */}
            <div className="w-full px-2 md:px-4 pb-2 md:pb-4 pt-2 border-t border-stone-200/50 flex-shrink-0">
              {/* Small Title Above Thumbnails */}
              <div className="text-center mb-2 relative">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg -z-10 left-1/2 -translate-x-1/2 w-[calc(100%+1rem)] h-full"></div>
                  <h2 className="relative text-stone-900 text-xs md:text-sm font-medium truncate px-3 md:px-4 py-1 md:py-1.5">{product.name}</h2>
                </div>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex 
                          ? 'border-stone-900' 
                          : 'border-stone-300 hover:border-stone-500 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details Mode: Text Only */}
        {viewMode === 'details' && (
          <div className="flex flex-col w-full h-full overflow-y-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl">
            <div className="p-4 md:p-12 max-w-4xl mx-auto w-full">
              
              {/* Header Info */}
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4 bg-stone-200 text-stone-700 hover:bg-stone-300">
                  {product.category?.name || "Stone"}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
                  {product.name}
                </h2>
                <p className="text-stone-500 font-mono text-sm tracking-wide">SKU: {product.slug}</p>
              </div>

              {/* Pricing Section */}
              <div className="mb-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
                {isLoggedIn ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-stone-900">€{Number(product.price).toFixed(2)}</span>
                      <span className="text-lg text-stone-500">/ {product.unit}</span>
                    </div>
                    <p className="text-sm text-stone-400 mt-2">Excl. VAT • Trade Pricing Applied</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-stone-600">
                    <div className="bg-stone-100 p-3 rounded-full">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base">Trade Pricing Hidden</div>
                      <Link href="/trade/register" className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium">
                        Register for wholesale access
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-stone-900 uppercase tracking-wider mb-4">Description</h3>
                <div className="text-stone-700 text-base leading-relaxed">
                  {product.description || "Premium natural stone sourced directly from the finest quarries. Suitable for both residential and commercial applications."}
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="block text-xs text-stone-400 uppercase mb-1">Material</span>
                  <span className="font-semibold text-stone-900">{product.material || 'Natural Stone'}</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="block text-xs text-stone-400 uppercase mb-1">Finish</span>
                  <span className="font-semibold text-stone-900">{product.finish || 'Standard'}</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="block text-xs text-stone-400 uppercase mb-1">Origin</span>
                  <span className="font-semibold text-stone-900">{product.origin || 'Europe'}</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="block text-xs text-stone-400 uppercase mb-1">Availability</span>
                  {stockWarning.show ? (
                    <Badge className={getStockBadgeClass(stockWarning.variant)}>
                      {stockWarning.message}
                    </Badge>
                  ) : (
                    <span className="text-green-600 font-semibold">In Stock</span>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="space-y-4 pt-8 border-t border-stone-200">
                {isLoggedIn ? (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-stone-700">Quantity:</span>
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDecreaseQuantity();
                          }}
                          className="px-3 py-2 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setQuantity(Math.max(1, val));
                          }}
                          className="w-16 text-center border-x border-stone-300 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-400"
                          aria-label="Quantity"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleIncreaseQuantity();
                          }}
                          className="px-3 py-2 hover:bg-stone-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full bg-stone-900 hover:bg-stone-800 h-14 text-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                      disabled={addedToCart}
                    >
                      <ShoppingCart className="mr-2 w-5 h-5" />
                      {addedToCart ? 'Added to Cart' : 'Add to Order'}
                    </Button>
                  </>
                ) : (
                  <Button size="lg" className="w-full bg-stone-900 hover:bg-stone-800 h-14 text-lg" asChild>
                    <Link href="/trade/register">Apply for Account</Link>
                  </Button>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-stone-300 text-stone-600 hover:text-stone-900 h-12"
                    onClick={() => toggleFavorite(product.id, product.name)}
                  >
                    <Heart className={`mr-2 w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                    {favorited ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="ghost" className="flex-1 text-stone-500 hover:text-stone-900 h-12" asChild>
                    <Link href={`/products/${product.slug}`}>
                      Full Details <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
