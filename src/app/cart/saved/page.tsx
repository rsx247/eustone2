"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useSavedCarts } from "@/lib/saved-carts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Download, Copy, Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function SavedCartsPage() {
  const router = useRouter();
  const { items, clearCart, addItem } = useCart();
  const { savedCarts, loadCart, deleteCart, getShareableLink } = useSavedCarts();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLoadCart = (cartId: string) => {
    const cart = loadCart(cartId);
    if (cart) {
      // Clear current cart and load saved cart items
      clearCart();
      cart.items.forEach(item => {
        // Add each item to cart
        for (let i = 0; i < item.quantity; i++) {
          addItem(item, 1);
        }
      });
      router.push('/cart');
    }
  };

  const handleDeleteCart = (cartId: string) => {
    if (confirm('Are you sure you want to delete this saved cart?')) {
      deleteCart(cartId);
    }
  };

  const handleCopyLink = async (cartId: string) => {
    const link = getShareableLink(cartId);
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopiedId(cartId);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Saved Carts</h1>
            <p className="text-stone-500 mt-1">
              Manage your saved shopping carts
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
        </div>

        {savedCarts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-stone-300 mb-4" />
              <h2 className="text-xl font-semibold text-stone-900 mb-2">No Saved Carts</h2>
              <p className="text-stone-500 mb-6">
                Save your current cart to access it later or share it with others.
              </p>
              <Button asChild>
                <Link href="/cart/save">Save Current Cart</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {savedCarts.map((cart) => (
              <Card key={cart.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{cart.name}</CardTitle>
                      <p className="text-sm text-stone-500 mt-1">
                        Saved {formatDistanceToNow(new Date(cart.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {cart.items.length} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-stone-600">
                        Total: €{cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(cart.id)}
                      >
                        {copiedId === cart.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadCart(cart.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Load Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCart(cart.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

