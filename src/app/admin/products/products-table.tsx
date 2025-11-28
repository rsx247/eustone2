"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { hasRealImages, getFirstRealImage } from "@/lib/product-utils";
import { QuickAddProductModal } from "@/components/quick-add-product-modal";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: string;
  category: {
    name: string;
  } | null;
}

interface ProductsTableProps {
  products: Product[];
}

function getSourceUrl(name: string) {
  if (name.toLowerCase().includes('titan') || name.toLowerCase().includes('kalekim')) {
    return `https://arsenius.nl/search?q=${encodeURIComponent(name)}`;
  }
  return `https://marmermarkt.com/search?q=${encodeURIComponent(name)}`;
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [limit, setLimit] = useState<number | "all">(25);

  const displayedProducts = limit === "all" 
    ? products 
    : products.slice(0, limit);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [templateProductId, setTemplateProductId] = useState<string | undefined>();

  const handleDuplicate = (product: Product) => {
    // Open Quick Add modal with this product as template
    setTemplateProductId(product.id);
    setQuickAddOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Full Inventory
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">Show:</span>
              <Select
                value={limit === "all" ? "all" : limit.toString()}
                onValueChange={(value) => {
                  setLimit(value === "all" ? "all" : parseInt(value, 10));
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-xs">
              {displayedProducts.length} of {products.length} products
            </Badge>
          </div>
        </div>
        <p className="text-sm text-stone-500 mt-2">
          Complete database view • All fields shown are from live database records
        </p>
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
              {displayedProducts.map((product) => {
                const hasImageIssue = !hasRealImages(product.images);
                const imageUrl = getFirstRealImage(product.images) || "/placeholder.jpg";

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
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          title="Duplicate"
                          onClick={() => handleDuplicate(product)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
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
      
      <QuickAddProductModal 
        open={quickAddOpen} 
        onOpenChange={(open) => {
          setQuickAddOpen(open);
          if (!open) setTemplateProductId(undefined);
        }}
        templateProductId={templateProductId}
      />
    </Card>
  );
}

