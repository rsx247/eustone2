"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useSavedCarts } from "@/lib/saved-carts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SharedCartPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { loadCartFromToken } = useSavedCarts();
  const { addItem, clearCart } = useCart();
  const [sharedCart, setSharedCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const cart = loadCartFromToken(token);
      setSharedCart(cart);
      setLoading(false);
    }
  }, [token, loadCartFromToken]);

  const handleAddToMyCart = () => {
    if (!sharedCart) return;
    
    clearCart();
    sharedCart.items.forEach((item: any) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem(item, 1);
      }
    });
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-stone-500">Loading shared cart...</p>
        </div>
      </div>
    );
  }

  if (!sharedCart) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Cart Not Found</h1>
          <p className="text-stone-500 mb-8">
            This shared cart link is invalid or has expired.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = sharedCart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Shared Cart</CardTitle>
            <p className="text-sm text-stone-500 mt-1">
              {sharedCart.items.length} items
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {sharedCart.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-3 border border-stone-200 rounded-lg">
                  <div className="relative w-20 h-20 bg-white rounded border flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-stone-900">{item.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Quantity: {item.quantity} × €{item.price.toFixed(2)} = €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToMyCart}>
                <Download className="w-4 h-4 mr-2" />
                Add to My Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

