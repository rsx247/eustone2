import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-3 flex-1 flex flex-col">
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-5 w-20 mb-3" />
        <Skeleton className="h-9 w-full mt-auto" />
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



