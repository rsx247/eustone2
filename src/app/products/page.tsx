"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Filter, Lock, ChevronLeft, ChevronRight, X, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { ProductGridSkeleton, ProductListSkeleton } from "@/components/product-skeleton";
import { ProductCard } from "@/components/product-card";
import { ProductListItem } from "@/components/product-list-item";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useFavorites } from "@/lib/favorites";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [source, setSource] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('products_per_page') || '20', 10);
    }
    return 20;
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('products_view_mode') || 'grid') as "grid" | "list";
    }
    return "grid";
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, page: 1, limit: 20 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const { toggleFavorite, isFavorited } = useFavorites();

  // Read category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
    
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }
    
    setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
  }, [searchParams]);

  // Fetch category info when category changes
  useEffect(() => {
    if (category && category !== 'all') {
      fetch(`/api/categories/${category}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setCategoryInfo(data);
          } else {
            setCategoryInfo(null);
          }
        })
        .catch(() => setCategoryInfo(null));
    } else {
      setCategoryInfo(null);
    }
  }, [category]);

  // Update URL when filters change (but not on initial mount)
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    if (inStock) params.set('inStock', 'true');
    if (source !== 'all') params.set('source', source);
    if (page > 1) params.set('page', page.toString());
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [category, search, inStock, source, page, pathname, router]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [category, search, inStock, source, sortBy, itemsPerPage]);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products_per_page', itemsPerPage.toString());
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products_view_mode', viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      ...(category !== 'all' && { category }),
      ...(search && { search }),
      ...(inStock && { inStock: 'true' }),
      ...(source !== 'all' && { source }),
      sortBy,
      sortOrder: 'asc'
    });

    fetch(`/api/products?${params}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setPagination(data.pagination || { total: 0, totalPages: 0, page: 1, limit: itemsPerPage });
        setLoading(false);
      });
  }, [page, category, search, inStock, source, sortBy, itemsPerPage]);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "tools", label: "Tools" },
    { id: "tiles", label: "Tiles" },
    { id: "marble", label: "Marble" },
    { id: "sinks", label: "Sinks" },
    { id: "travertin", label: "Travertine" },
  ];

  const sources = [
    { id: "all", label: "All Sources" },
    { id: "Arsenius", label: "Arsenius" },
    { id: "Marmermarkt", label: "Marmermarkt" },
    { id: "Unknown", label: "Unknown" },
  ];

  const clearFilters = () => {
    setCategory("all");
    setSource("all");
    setInStock(false);
    setSearch("");
  };

  const activeFiltersCount = [
    category !== "all",
    source !== "all",
    inStock,
    search !== ""
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          ...(category !== 'all' && categoryInfo ? [{ label: categoryInfo.name }] : [])
        ]} />

        {/* Category Header */}
        {category !== 'all' && categoryInfo && (
          <div className="mb-8">
            {categoryInfo.image && (
              <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={categoryInfo.image || `/images/categories/${categoryInfo.slug}.webp`}
                  alt={categoryInfo.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    {categoryInfo.name}
                  </h1>
                </div>
              </div>
            )}
            {categoryInfo.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
                <p className="text-stone-700 leading-relaxed">{categoryInfo.description}</p>
                {categoryInfo._count && (
                  <p className="text-sm text-stone-500 mt-4">
                    {categoryInfo._count.products} products available
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="mb-8 space-y-4">
          {/* Top Row: Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Product Catalog</h1>
              <p className="text-stone-500 mt-1">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>
          </div>

          {/* Filter Toolbar Container */}
          <div className="space-y-4">
            
            {/* Primary Row: Search + Quick Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-12 h-12 bg-white text-lg shadow-sm border-stone-200 focus-visible:ring-stone-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Controls Group */}
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-12 bg-white border-stone-200 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price">Price (Low-High)</SelectItem>
                    <SelectItem value="stock">Stock Level</SelectItem>
                    <SelectItem value="createdAt">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 border border-stone-200 rounded-md bg-white p-1 h-12 items-center">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`h-full flex-1 ${viewMode === "grid" ? "bg-stone-900 text-white" : ""}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-full flex-1 ${viewMode === "list" ? "bg-stone-900 text-white" : ""}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value, 10))}>
                  <SelectTrigger className="w-[120px] h-12 bg-white border-stone-200 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="40">40 per page</SelectItem>
                    <SelectItem value="60">60 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant={showAdvanced ? "default" : "outline"}
                  className={`h-12 px-6 ${showAdvanced ? "bg-stone-900 text-white" : "bg-white text-stone-700 border-stone-200"}`}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-stone-100 text-stone-900 h-5 px-1.5">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Secondary Row: Category Pills (Always visible nudge) */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex-none px-4 h-10 rounded-full text-sm font-medium transition-all border flex items-center ${
                    category === cat.id
                      ? "bg-stone-900 text-white border-stone-900 shadow-md"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tertiary Row: Advanced Filters (Collapsible) */}
            {showAdvanced && (
              <div className="p-6 bg-white rounded-xl border border-stone-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-stone-900">Source</Label>
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger className="w-full h-12 border-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-stone-900">Availability</Label>
                    <div className="flex items-center justify-between h-12 px-3 border border-stone-200 rounded-md bg-white">
                      <span className="text-sm text-stone-600">In Stock Only</span>
                      <Switch
                        checked={inStock}
                        onCheckedChange={setInStock}
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                     <Button 
                      variant="outline" 
                      className="w-full border-stone-200 text-stone-500 hover:text-stone-900"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display - Simplified */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
             {/* Only showing active badges for non-default states to keep UI clean */}
             {search && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-white border border-stone-200">
                Search: {search}
                <button onClick={() => setSearch("")} className="ml-1 hover:text-stone-900">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Product Grid/List */}
        {loading ? (
          viewMode === "grid" ? (
            <ProductGridSkeleton count={itemsPerPage} />
          ) : (
            <ProductListSkeleton count={itemsPerPage} />
          )
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product: any, index: number) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
                  >
                    <ProductCard
                      product={product}
                      isLoggedIn={isLoggedIn}
                      onQuickView={setQuickViewProduct}
                      onToggleFavorite={toggleFavorite}
                      isFavorited={isFavorited(product.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product: any, index: number) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
                  >
                    <ProductListItem
                      product={product}
                      isLoggedIn={isLoggedIn}
                      onQuickView={setQuickViewProduct}
                      onToggleFavorite={toggleFavorite}
                      isFavorited={isFavorited(product.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (() => {
              // Calculate which page numbers to show
              const getPageNumbers = () => {
                const totalPages = pagination.totalPages;
                const currentPage = page;
                const delta = 2; // Number of pages to show on each side of current page
                const range = [];
                const rangeWithDots = [];

                // Always show first page
                range.push(1);

                // Calculate start and end of the range around current page
                let start = Math.max(2, currentPage - delta);
                let end = Math.min(totalPages - 1, currentPage + delta);

                // Adjust if we're near the start
                if (currentPage <= delta + 1) {
                  end = Math.min(2 * delta + 2, totalPages - 1);
                }

                // Adjust if we're near the end
                if (currentPage >= totalPages - delta) {
                  start = Math.max(2, totalPages - 2 * delta - 1);
                }

                // Add pages in the middle range
                for (let i = start; i <= end; i++) {
                  range.push(i);
                }

                // Always show last page if there's more than one page
                if (totalPages > 1) {
                  range.push(totalPages);
                }

                // Remove duplicates and sort
                const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

                // Add dots where there are gaps
                for (let i = 0; i < uniqueRange.length; i++) {
                  rangeWithDots.push(uniqueRange[i]);
                  if (i < uniqueRange.length - 1 && uniqueRange[i + 1] - uniqueRange[i] > 1) {
                    rangeWithDots.push('...');
                  }
                }

                return rangeWithDots;
              };

              const pageNumbers = getPageNumbers();

              return (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {pageNumbers.map((pageNum, index) => {
                      if (pageNum === '...') {
                        return (
                          <span key={`dots-${index}`} className="px-2 py-2 text-stone-400">
                            ...
                          </span>
                        );
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          onClick={() => setPage(pageNum as number)}
                          className={page === pageNum ? "bg-stone-900" : "bg-white"}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={20} />}>
      <ProductsPageContent />
    </Suspense>
  );
}
