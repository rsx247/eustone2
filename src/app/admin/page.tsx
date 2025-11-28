import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, LayoutDashboard, Map, FlaskConical, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getQuickStats() {
  const [totalProducts, productsWithImages, productsInStock, productsNoStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: {
        images: {
          not: {
            equals: '["/placeholder.jpg"]'
          }
        }
      }
    }),
    prisma.product.count({
      where: {
        stock: {
          gt: 0
        }
      }
    }),
    prisma.product.count({
      where: {
        stock: 0
      }
    })
  ]);

  return {
    totalProducts,
    productsWithImages,
    productsInStock,
    productsNoStock
  };
}

export default async function AdminDashboard() {
  const stats = await getQuickStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="text-stone-500">Quick overview and navigation</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Box className="h-4 w-4 text-stone-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-stone-500">in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Images</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsWithImages}</div>
            <p className="text-xs text-stone-500">
              {stats.totalProducts > 0 
                ? `${Math.round((stats.productsWithImages / stats.totalProducts) * 100)}% coverage`
                : '0% coverage'
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
            <div className="text-2xl font-bold">{stats.productsInStock}</div>
            <p className="text-xs text-stone-500">available products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsNoStock}</div>
            <p className="text-xs text-stone-500">need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Product Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                View and manage all {stats.totalProducts} products. Edit details, update images, and manage inventory.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/playground">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                UI Playground
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                Test and preview UI components, animations, and design variants in an interactive environment.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/roadmap">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                View project roadmap, planned features, and development progress.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/components">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Component Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                Browse component documentation and usage examples.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/verify">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                Verify and validate product data, images, and metadata.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
