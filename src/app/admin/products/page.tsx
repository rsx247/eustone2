import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, AlertCircle, ExternalLink, XCircle, AlertTriangle, Image as ImageIcon, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { hasRealImages, getFirstRealImage } from "@/lib/product-utils";
import { ProductsTable } from "./products-table";
import { AdminProductsPageClient } from "./admin-products-client";

export const dynamic = 'force-dynamic';

async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
}

function getSourceUrl(name: string) {
  if (name.toLowerCase().includes('titan') || name.toLowerCase().includes('kalekim')) {
    return `https://arsenius.nl/search?q=${encodeURIComponent(name)}`;
  }
  return `https://marmermarkt.com/search?q=${encodeURIComponent(name)}`;
}

export default async function AdminProductsPage() {
  const products = await getProducts();
  
  // Use consistent image detection
  const missingImages = products.filter(p => !hasRealImages(p.images));
  const noStock = products.filter(p => p.stock === 0);
  const noPrice = products.filter(p => Number(p.price) === 0);

  return (
    <AdminProductsPageClient>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-900">Product Database</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Live Database
              </Badge>
            </div>
            <p className="text-stone-500 mt-1">
              {products.length} products • Direct database query • Updated in real-time
            </p>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Missing Images
              {missingImages.length > 0 && <AlertTriangle className="h-4 w-4 text-amber-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${missingImages.length === 0 ? 'text-green-600' : 'text-amber-600'}`}>
              {missingImages.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              No Stock
              {noStock.length > 0 && <XCircle className="h-4 w-4 text-red-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${noStock.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {noStock.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              No Price
              {noPrice.length > 0 && <XCircle className="h-4 w-4 text-red-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${noPrice.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {noPrice.length}
            </div>
          </CardContent>
        </Card>
      </div>

        <ProductsTable products={products} />
      </div>
    </AdminProductsPageClient>
  );
}
