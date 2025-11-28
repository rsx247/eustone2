"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuickAddProductModal } from "@/components/quick-add-product-modal";

export function AdminProductsPageClient({ children }: { children: React.ReactNode }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {/* Quick Add Button - Floating */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            onClick={() => setQuickAddOpen(true)}
            className="rounded-full shadow-lg h-14 w-14 p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
        
        {children}
      </div>
      
      <QuickAddProductModal open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </>
  );
}

