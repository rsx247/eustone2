import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, AlertCircle, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

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
  
  const missingImages = products.filter(p => {
    try {
      const images = JSON.parse(p.images);
      return !images || images.length === 0 || images[0].includes("unsplash");
    } catch {
      return true;
    }
  });

  const noStock = products.filter(p => p.stock === 0);
  const noPrice = products.filter(p => Number(p.price) === 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Product Database</h1>
          <p className="text-stone-500">{products.length} products imported</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Missing Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{missingImages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">No Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{noStock.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">No Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{noPrice.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Full Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[700px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  let imageUrl = "/placeholder.jpg";
                  let hasImageIssue = false;
                  
                  try {
                    const images = JSON.parse(product.images);
                    if (Array.isArray(images) && images.length > 0) {
                      imageUrl = images[0];
                      hasImageIssue = imageUrl.includes("unsplash");
                    }
                  } catch (e) {
                    hasImageIssue = true;
                  }

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded overflow-hidden bg-stone-100 relative flex items-center justify-center">
                          <Image src={imageUrl} alt={product.name} fill className="object-contain p-1" />
                          {hasImageIssue && (
                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="font-medium truncate" title={product.name}>{product.name}</div>
                        <div className="text-xs text-stone-500 font-mono">{product.slug}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category?.name || 'None'}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={Number(product.price) === 0 ? "text-red-600 font-semibold" : ""}>
                          €{Number(product.price).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={product.stock === 0 ? "text-amber-600 font-semibold" : "text-green-600"}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {hasImageIssue && <Badge variant="destructive" className="text-xs">IMG</Badge>}
                          {Number(product.price) === 0 && <Badge variant="destructive" className="text-xs">PRICE</Badge>}
                          {product.stock === 0 && <Badge variant="secondary" className="text-xs">STOCK</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" title="Edit" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="ghost" title="Check Source" asChild>
                            <a href={getSourceUrl(product.name)} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
