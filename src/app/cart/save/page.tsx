"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useSavedCarts } from "@/lib/saved-carts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, Copy, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SaveCartPage() {
  const router = useRouter();
  const { items } = useCart();
  const { saveCart, getShareableLink } = useSavedCarts();
  const [cartName, setCartName] = useState("");
  const [savedCartId, setSavedCartId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Your Cart is Empty</h1>
          <p className="text-stone-500 mb-8">
            Add some products to your cart before saving it.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!cartName.trim()) {
      toast.error("Please enter a name for your cart");
      return;
    }

    const cartId = saveCart(cartName, items);
    setSavedCartId(cartId);
    const link = getShareableLink(cartId);
    setShareLink(link);
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/cart">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Save Cart</CardTitle>
            <CardDescription>
              Save your current cart with a name so you can access it later or share it with others.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cart-name">Cart Name</Label>
              <Input
                id="cart-name"
                placeholder="e.g., Project A, Kitchen Renovation, etc."
                value={cartName}
                onChange={(e) => setCartName(e.target.value)}
                disabled={!!savedCartId}
              />
            </div>

            <div className="bg-stone-50 p-4 rounded-lg">
              <p className="text-sm text-stone-600 mb-2">
                <strong>{items.length}</strong> items in cart
              </p>
              <p className="text-xs text-stone-500">
                Total: €{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </p>
            </div>

            {!savedCartId ? (
              <Button onClick={handleSave} className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Cart
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">
                    ✓ Cart saved successfully!
                  </p>
                  <p className="text-xs text-green-700">
                    Your cart "{cartName}" has been saved.
                  </p>
                </div>

                {shareLink && (
                  <div className="space-y-2">
                    <Label>Shareable Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={shareLink}
                        readOnly
                        className="flex-1 font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        size="icon"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-stone-500">
                      Share this link with others to let them view and add this cart to their account.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/cart">Back to Cart</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/cart/saved">View Saved Carts</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

