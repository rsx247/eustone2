"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, ExternalLink, Lock, Maximize2, Info } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  const { addItem } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();

  if (!product) return null;

  let images = ["/placeholder.jpg"];
  try {
    const parsedImages = JSON.parse(product.images);
    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
      images = parsedImages;
    }
  } catch (e) {}

  const favorited = isFavorited(product.id);

  const handleAddToCart = () => {
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-stone-50 border-none h-[85vh] flex flex-col md:flex-row gap-0">
        <VisuallyHidden>
            <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>

        {/* LEFT: Image Focus Area */}
        <div className={`relative h-[50vh] md:h-full transition-all duration-500 ease-in-out flex items-center justify-center bg-white ${viewMode === 'details' ? 'md:w-1/3' : 'md:w-2/3'}`}>
          
          {/* Main Image */}
          <div className="relative w-full h-full p-8 md:p-12">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-stone-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-stone-800" />
              </button>
              
              {/* Pagination dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-stone-900 w-4' : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* View Mode Toggle (Desktop) */}
          <div className="absolute top-6 left-6 z-20 hidden md:flex bg-white/90 backdrop-blur rounded-full p-1 shadow-sm border border-stone-100">
             <button
               onClick={() => setViewMode('image')}
               className={`p-2 rounded-full transition-all ${viewMode === 'image' ? 'bg-stone-900 text-white shadow' : 'text-stone-500 hover:bg-stone-100'}`}
               title="Focus Image"
             >
               <Maximize2 className="w-4 h-4" />
             </button>
             <button
               onClick={() => setViewMode('details')}
               className={`p-2 rounded-full transition-all ${viewMode === 'details' ? 'bg-stone-900 text-white shadow' : 'text-stone-500 hover:bg-stone-100'}`}
               title="Show Details"
             >
               <Info className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* RIGHT: Details Panel */}
        <div className={`flex flex-col h-[50vh] md:h-full overflow-y-auto bg-stone-50 border-l border-stone-200 transition-all duration-500 ease-in-out ${viewMode === 'details' ? 'md:w-2/3' : 'md:w-1/3'}`}>
          <div className="p-8 flex flex-col h-full">
            
            {/* Header Info */}
            <div className="mb-6">
              <Badge variant="secondary" className="mb-3 bg-stone-200 text-stone-700 hover:bg-stone-300">
                {product.category?.name || "Stone"}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-stone-500 font-mono text-xs tracking-wide">SKU: {product.slug}</p>
            </div>

            {/* Pricing Section */}
            <div className="mb-8 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              {isLoggedIn ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-stone-900">€{Number(product.price).toFixed(2)}</span>
                    <span className="text-sm text-stone-500">/ {product.unit}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">Excl. VAT • Trade Pricing Applied</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-stone-600">
                  <div className="bg-stone-100 p-2 rounded-full">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Trade Pricing Hidden</div>
                    <Link href="/trade/register" className="text-xs text-blue-600 hover:underline font-medium">
                      Register for wholesale access
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Description (Expandable in details mode) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">Description</h3>
              <div className={`text-stone-600 text-sm leading-relaxed ${viewMode === 'image' ? 'line-clamp-4' : ''}`}>
                {product.description || "Premium natural stone sourced directly from the finest quarries. Suitable for both residential and commercial applications."}
              </div>
              
              {viewMode === 'details' && (
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded border border-stone-100">
                       <span className="block text-xs text-stone-400 uppercase">Material</span>
                       <span className="font-medium text-stone-900">{product.material || 'Natural Stone'}</span>
                    </div>
                    <div className="p-3 bg-white rounded border border-stone-100">
                       <span className="block text-xs text-stone-400 uppercase">Finish</span>
                       <span className="font-medium text-stone-900">{product.finish || 'Standard'}</span>
                    </div>
                    <div className="p-3 bg-white rounded border border-stone-100">
                       <span className="block text-xs text-stone-400 uppercase">Origin</span>
                       <span className="font-medium text-stone-900">{product.origin || 'Europe'}</span>
                    </div>
                    <div className="p-3 bg-white rounded border border-stone-100">
                       <span className="block text-xs text-stone-400 uppercase">Availability</span>
                       <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                          {product.stock > 0 ? "In Stock" : "Pre-order"}
                       </span>
                    </div>
                 </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="mt-8 space-y-3 pt-6 border-t border-stone-200">
               {isLoggedIn ? (
                 <Button 
                  size="lg" 
                  className="w-full bg-stone-900 hover:bg-stone-800 h-12 text-lg"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                 >
                   <ShoppingCart className="mr-2 w-5 h-5" />
                   {addedToCart ? 'Added to Cart' : 'Add to Order'}
                 </Button>
               ) : (
                 <Button size="lg" className="w-full bg-stone-900 hover:bg-stone-800 h-12" asChild>
                   <Link href="/trade/register">Apply for Account</Link>
                 </Button>
               )}

               <div className="flex gap-3">
                 <Button
                   variant="outline"
                   className="flex-1 border-stone-300 text-stone-600 hover:text-stone-900"
                   onClick={() => toggleFavorite(product.id)}
                 >
                   <Heart className={`mr-2 w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                   {favorited ? 'Saved' : 'Save'}
                 </Button>
                 <Button variant="ghost" className="flex-1 text-stone-500 hover:text-stone-900" asChild>
                   <Link href={`/products/${product.slug}`}>
                     Full Details <ExternalLink className="ml-2 w-4 h-4" />
                   </Link>
                 </Button>
               </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
