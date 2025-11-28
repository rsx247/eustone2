"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Mail, Phone, MapPin, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Load order from localStorage
    const stored = localStorage.getItem(`order_${orderId}`);
    if (stored) {
      setOrderData(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [orderId, router]);

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  const { items, total, customerInfo, date } = orderData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-stone-600">
          Thank you for your order. We've received it and will process it shortly.
        </p>
        <p className="text-sm text-stone-500 mt-2">
          Order #{orderId}
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Truck className="mr-2 h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">
              {customerInfo.firstName} {customerInfo.lastName}
            </p>
            {customerInfo.company && (
              <p className="text-stone-600">{customerInfo.company}</p>
            )}
            <div className="flex items-start text-stone-600">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p>{customerInfo.address}</p>
                <p>
                  {customerInfo.postalCode} {customerInfo.city}
                </p>
                <p>{customerInfo.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center text-stone-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{customerInfo.email}</span>
            </div>
            <div className="flex items-center text-stone-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{customerInfo.phone}</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-stone-500">
                A confirmation email has been sent to <strong>{customerInfo.email}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-20 h-20 bg-white border rounded flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-stone-500">{item.categoryName}</p>
                  <p className="text-sm text-stone-600">
                    Quantity: {item.quantity} × €{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span>€{(total / 1.21).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">VAT (21%)</span>
                <span>€{(total - total / 1.21).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-stone-600">
                  You'll receive a confirmation email with your order details.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-medium">Invoice & Payment</p>
                <p className="text-stone-600">
                  We'll send you an invoice with bank transfer details within 24 hours.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-medium">Processing & Shipping</p>
                <p className="text-stone-600">
                  Once payment is received, we'll prepare your order for shipment (2-5 business days).
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                4
              </span>
              <div>
                <p className="font-medium">Delivery Notification</p>
                <p className="text-stone-600">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => {
            // In production, this would download a PDF invoice
            alert("Invoice download feature coming soon!");
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      {/* Support Info */}
      <div className="mt-8 text-center text-sm text-stone-500">
        <p>Need help with your order?</p>
        <p>
          Contact us at{" "}
          <a href="mailto:orders@eustone.nl" className="text-blue-600 hover:underline">
            orders@eustone.nl
          </a>{" "}
          or call{" "}
          <a href="tel:+31201234567" className="text-blue-600 hover:underline">
            +31 (0) 20 123 4567
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading order details...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}



