import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = 'force-dynamic';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function VerifyPage() {
  // Fetch anomalies
  const missingImages = await prisma.product.findMany({
    where: { images: { contains: 'placeholder' } },
    include: { category: true },
    take: 50
  });

  const missingSource = await prisma.product.findMany({
    where: { OR: [{ source: null }, { source: 'Unknown' }] },
    include: { category: true },
    take: 50
  });

  const zeroPrice = await prisma.product.findMany({
    where: { price: 0 },
    include: { category: true },
    take: 50
  });

  const zeroStock = await prisma.product.findMany({
    where: { stock: 0 },
    include: { category: true },
    take: 50
  });

  // Category mismatch detection
  const wrongCategory = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'marble' }, category: { slug: { not: 'marble' } } },
        { name: { contains: 'marmer' }, category: { slug: { not: 'marble' } } },
        { name: { contains: 'granite' }, category: { slug: { not: 'granite' } } },
        { name: { contains: 'graniet' }, category: { slug: { not: 'granite' } } },
        { name: { contains: 'travertin' }, category: { slug: { not: 'travertin' } } },
        { name: { contains: 'onyx' }, category: { slug: { not: 'onyx' } } },
      ]
    },
    include: { category: true },
    take: 50
  });

  // Category distribution
  const categoryStats = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      products: {
        _count: 'desc'
      }
    },
    take: 20
  });

  // Source distribution
  const sourceStats = await prisma.product.groupBy({
    by: ['source'],
    _count: true,
    orderBy: {
      _count: {
        source: 'desc'
      }
    }
  });

  const totalProducts = await prisma.product.count();
  const verifiedProducts = await prisma.product.count({ where: { verified: true } });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Product Verification</h1>
        <p className="text-stone-600">
          Quality assurance dashboard for product data integrity
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-500">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{verifiedProducts}</div>
            <p className="text-xs text-stone-500 mt-1">
              {((verifiedProducts / totalProducts) * 100).toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-500">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {missingImages.length + wrongCategory.length + missingSource.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-500">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stone-400">{zeroStock.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Product count per category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="p-3 bg-stone-50 rounded-lg border">
                <div className="font-semibold text-sm mb-1">{cat.name}</div>
                <div className="text-2xl font-bold text-stone-900">{cat._count.products}</div>
                <Link 
                  href={`/products?category=${cat.slug}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Source Distribution</CardTitle>
          <CardDescription>Products by origin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {sourceStats.map((stat) => (
              <div key={stat.source || 'unknown'} className="p-4 bg-stone-50 rounded-lg border">
                <div className="font-semibold mb-1">{stat.source || 'Unknown'}</div>
                <div className="text-2xl font-bold">{stat._count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anomalies */}
      {wrongCategory.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-900">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Wrong Category ({wrongCategory.length})
            </CardTitle>
            <CardDescription>Products with stone type in name but wrong category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {wrongCategory.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-xs text-stone-500">
                      Current: <Badge variant="outline">{product.category.name}</Badge>
                      {product.source && <span className="ml-2">Source: {product.source}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {product.source && (
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={`https://${product.source.toLowerCase()}.nl/search?q=${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Check Source
                        </a>
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>Fix</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {missingImages.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-900">
              <ImageIcon className="mr-2 h-5 w-5" />
              Missing Images ({missingImages.length})
            </CardTitle>
            <CardDescription>Products using placeholder images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {missingImages.slice(0, 20).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-xs text-stone-500">
                      <Badge variant="outline">{product.category.name}</Badge>
                      {product.source && <span className="ml-2">Source: {product.source}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {product.source && (
                      <Button size="sm" variant="outline" asChild>
                        <a 
                          href={`https://${product.source.toLowerCase()}.nl/search?q=${encodeURIComponent(product.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Find Image
                        </a>
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>Fix</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {missingSource.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Missing Source ({missingSource.length})
            </CardTitle>
            <CardDescription>Products without source metadata (can't re-scrape)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {missingSource.slice(0, 20).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-stone-50 rounded border">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-xs text-stone-500">
                      <Badge variant="outline">{product.category.name}</Badge>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Set Source</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {zeroPrice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Zero Price ({zeroPrice.length})
            </CardTitle>
            <CardDescription>Products with no price set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {zeroPrice.slice(0, 20).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-stone-50 rounded border">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-xs text-stone-500">
                      <Badge variant="outline">{product.category.name}</Badge>
                      {product.source && <span className="ml-2">Source: {product.source}</span>}
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Fix</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

