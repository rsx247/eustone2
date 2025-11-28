import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Package, DollarSign, CheckCircle2, AlertCircle, Image as ImageIcon, Database, XCircle, AlertTriangle } from "lucide-react";
import { hasRealImages } from "@/lib/product-utils";

export const dynamic = 'force-dynamic';

async function getAnalytics() {
  // Overview stats - fetch all products first for image checking
  const [
    productsForImageCheck,
    verifiedProducts,
    productsInStock,
    productsNoStock,
    productsWithPrice,
    productsNoPrice,
    totalCategories
  ] = await Promise.all([
    prisma.product.findMany({ select: { images: true } }),
    prisma.product.count({ where: { verified: true } }),
    prisma.product.count({ where: { stock: { gt: 0 } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.count({ where: { price: { gt: 0 } } }),
    prisma.product.count({ where: { price: 0 } }),
    prisma.category.count()
  ]);

  // Count products with real images using consistent logic
  const totalProducts = productsForImageCheck.length;
  const productsWithImages = productsForImageCheck.filter(p => hasRealImages(p.images)).length;

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
    }
  });

  // Source distribution - group by source
  const productsForSource = await prisma.product.findMany({
    select: { source: true }
  });
  
  const sourceMap = new Map<string, number>();
  productsForSource.forEach(product => {
    const source = product.source || 'Unknown';
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  });
  
  const sourceStats = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, _count: count }))
    .sort((a, b) => b._count - a._count);

  // Price analytics
  const priceStats = await prisma.product.aggregate({
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
    _sum: { price: true }
  });

  // Stock analytics
  const stockStats = await prisma.product.aggregate({
    _avg: { stock: true },
    _min: { stock: true },
    _max: { stock: true },
    _sum: { stock: true }
  });

  // Recent products (last 10)
  const recentProducts = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      category: {
        select: { name: true }
      },
      createdAt: true
    }
  });

  // Products by verification status
  const verificationStats = {
    verified: verifiedProducts,
    unverified: totalProducts - verifiedProducts
  };

  return {
    overview: {
      totalProducts,
      verifiedProducts,
      productsWithImages,
      productsInStock,
      productsNoStock,
      productsWithPrice,
      productsNoPrice,
      totalCategories
    },
    categoryStats,
    sourceStats,
    priceStats,
    stockStats,
    recentProducts,
    verificationStats
  };
}

function BarChart({ data, maxValue, labelKey, valueKey }: { data: any[], maxValue: number, labelKey: string, valueKey: string }) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const value = typeof valueKey === 'function' ? valueKey(item) : item[valueKey];
        const label = typeof labelKey === 'function' ? labelKey(item) : item[labelKey];
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-stone-700 font-medium truncate">{label || 'Unknown'}</span>
              <span className="text-stone-600 font-semibold">{value}</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  const maxCategoryCount = Math.max(...analytics.categoryStats.map(c => c._count.products), 1);
  const maxSourceCount = Math.max(...analytics.sourceStats.map(s => s._count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Analytics Dashboard</h1>
        <p className="text-stone-500">Comprehensive insights into your product database</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-stone-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalProducts}</div>
            <p className="text-xs text-stone-500 mt-1">
              {analytics.overview.totalCategories} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.overview.verifiedProducts}</div>
            <p className="text-xs text-stone-500 mt-1">
              {analytics.overview.totalProducts > 0 
                ? `${Math.round((analytics.overview.verifiedProducts / analytics.overview.totalProducts) * 100)}% verified`
                : '0% verified'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.overview.productsInStock}</div>
            <p className="text-xs text-stone-500 mt-1">
              {analytics.overview.productsNoStock} out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics.overview.productsWithImages}</div>
            <p className="text-xs text-stone-500 mt-1">
              {analytics.overview.totalProducts > 0 
                ? `${Math.round((analytics.overview.productsWithImages / analytics.overview.totalProducts) * 100)}% coverage`
                : '0% coverage'
              }
            </p>
            {analytics.overview.totalProducts - analytics.overview.productsWithImages > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                <span>{analytics.overview.totalProducts - analytics.overview.productsWithImages} missing images</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Products by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={analytics.categoryStats}
              maxValue={maxCategoryCount}
              labelKey="name"
              valueKey={(item) => item._count.products}
            />
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Products by Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.sourceStats.length > 0 ? (
              <BarChart
                data={analytics.sourceStats}
                maxValue={maxSourceCount}
                labelKey={(item) => item.source || 'Unknown'}
                valueKey="_count"
              />
            ) : (
              <p className="text-sm text-stone-500">No source data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price & Stock Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-stone-500">Average Price</p>
                <p className="text-2xl font-bold">
                  €{analytics.priceStats._avg.price ? Number(analytics.priceStats._avg.price).toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Total Value</p>
                <p className="text-2xl font-bold">
                  €{analytics.priceStats._sum.price ? Number(analytics.priceStats._sum.price).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Min Price</p>
                <p className="text-xl font-semibold">
                  €{analytics.priceStats._min.price ? Number(analytics.priceStats._min.price).toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Max Price</p>
                <p className="text-xl font-semibold">
                  €{analytics.priceStats._max.price ? Number(analytics.priceStats._max.price).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  With Price
                </span>
                <span className="font-semibold text-green-600">{analytics.overview.productsWithPrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-stone-600 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5 text-red-600" />
                  No Price
                </span>
                <span className="font-semibold text-red-600">{analytics.overview.productsNoPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-stone-500">Average Stock</p>
                <p className="text-2xl font-bold">
                  {analytics.stockStats._avg.stock ? Math.round(Number(analytics.stockStats._avg.stock)) : 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Total Stock</p>
                <p className="text-2xl font-bold">
                  {analytics.stockStats._sum.stock ? analytics.stockStats._sum.stock.toLocaleString() : 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Min Stock</p>
                <p className="text-xl font-semibold">{analytics.stockStats._min.stock || 0}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Max Stock</p>
                <p className="text-xl font-semibold">
                  {analytics.stockStats._max.stock ? analytics.stockStats._max.stock.toLocaleString() : 0}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  In Stock
                </span>
                <span className="font-semibold text-green-600">{analytics.overview.productsInStock}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-stone-600 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Out of Stock
                </span>
                <span className="font-semibold text-amber-600">{analytics.overview.productsNoStock}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Status & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-stone-700">Verified</span>
                  <span className="text-sm font-semibold text-green-600">
                    {analytics.verificationStats.verified}
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(analytics.verificationStats.verified / analytics.overview.totalProducts) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-stone-700">Unverified</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {analytics.verificationStats.unverified}
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-3">
                  <div
                    className="bg-amber-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(analytics.verificationStats.unverified / analytics.overview.totalProducts) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                      <span className="text-xs text-stone-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

