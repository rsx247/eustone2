"use client";

import { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Lock, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { QuoteRequestButton } from "@/components/quote-request-button";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { getPlaceholderStockWarning, getStockBadgeClass } from "@/lib/stock-placeholder";

export function ProductPageClient({ product }: { product: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
    // Track product view
    if (product?.id) {
      addToRecentlyViewed(product.id);
    }
  }, [product?.id, addToRecentlyViewed]);

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

  // Get placeholder stock warning (10-15% of products will show warnings)
  const stockWarning = getPlaceholderStockWarning(product.id);

  let productImages: string[] = ["/placeholder.jpg"];
  try {
    const images = JSON.parse(product.images);
    if (Array.isArray(images) && images.length > 0) productImages = images;
  } catch (e) {}

  const isSlab = product.unit === 'm2' || product.name.toLowerCase().includes('slab');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-white rounded-lg overflow-hidden relative border flex items-center justify-center">
            <Image 
              src={productImages[selectedImage]} 
              alt={product.name}
              fill
              className="object-contain p-4"
            />
            {productImages.length > 1 && (
              <Badge className="absolute top-3 right-3 bg-stone-900/80">
                {selectedImage + 1} / {productImages.length}
              </Badge>
            )}
          </div>

          {/* Thumbnail Strip */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded relative transition-all ${
                    selectedImage === index 
                      ? 'border-2 border-blue-600 shadow-lg shadow-blue-200/50' 
                      : 'border-2 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded">
                    <Image 
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">{product.category.name}</Badge>
            <h1 className="text-3xl font-bold text-stone-900">{product.name}</h1>
            <p className="text-muted-foreground mt-1">SKU: {product.slug}</p>
          </div>

          <Separator />

          {/* Price & CTA */}
          <div className="p-6 bg-stone-50 rounded-lg space-y-4">
            {isLoggedIn ? (
              // LOGGED IN: Show prices and normal CTAs
              <>
                {isSlab ? (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">Price per m²</span>
                      <div className="text-3xl font-bold text-stone-900">
                        €{Number(product.price).toFixed(2)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Natural stone slab. Freight shipping required.
                    </p>
                    <div className="flex gap-3">
                      <QuoteRequestButton product={product} className="flex-1" />
                      <Button size="lg" variant="outline">Order Sample</Button>
                    </div>
                  </>
                ) : (
                  <>
                  <div>
                    <span className="text-sm text-muted-foreground">Price (excl. VAT)</span>
                    <div className="text-3xl font-bold text-stone-900">€{Number(product.price).toFixed(2)}</div>
                    <span className="text-xs text-stone-400">per {product.unit}</span>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-stone-700">Quantity:</label>
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        className="p-2 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      />
                      <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        className="p-2 hover:bg-stone-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                    disabled={addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="mr-2 w-5 h-5" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 w-5 h-5" /> Add to Cart
                      </>
                    )}
                  </Button>
                  </>
                )}
              </>
            ) : (
              // GUEST: Show login prompts
              <>
                {isSlab ? (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">Price per m²</span>
                      <div className="text-xl font-medium text-stone-500 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <span>Login to view pricing</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Natural stone slab. Freight shipping required.
                    </p>
                    <div className="flex gap-3">
                      <QuoteRequestButton product={product} className="flex-1" />
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/trade/register">Login</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">Price (excl. VAT)</span>
                      <div className="text-xl font-medium text-stone-500 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        <span>Login to view pricing</span>
                      </div>
                      <span className="text-xs text-stone-400">per {product.unit}</span>
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/trade/register">
                        <Lock className="mr-2 w-4 h-4" /> Login to Order
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2">
            {stockWarning.show ? (
              <Badge className={getStockBadgeClass(stockWarning.variant)}>
                {stockWarning.message}
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-600 text-white">
                In Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && product.description.length > 5 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Product Details</h3>
              <div 
                className="text-sm text-stone-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

