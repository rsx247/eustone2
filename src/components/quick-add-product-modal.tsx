"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Sparkles, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  images: string | string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

interface QuickAddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateProductId?: string; // Optional: pre-fill from a template
}

export function QuickAddProductModal({ open, onOpenChange, templateProductId }: QuickAddProductModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [autofillSuggestions, setAutofillSuggestions] = useState<{
    unit?: string;
    price?: string;
  }>({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    categoryId: '',
    unit: 'piece',
    imageUrl: '',
  });

  useEffect(() => {
    if (open) {
      // Fetch categories when modal opens
      fetch('/api/categories')
        .then(res => res.json())
        .then(setCategories);
      
      // Fetch products for template selection
      fetch('/api/products?limit=100')
        .then(res => res.json())
        .then(data => setProducts(data.products || []));
      
      // If templateProductId is provided, load that product
      if (templateProductId) {
        fetch(`/api/products/${templateProductId}`)
          .then(res => res.json())
          .then(data => {
            loadTemplate(data);
          });
      }
    } else {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '0',
        categoryId: '',
        unit: 'piece',
        imageUrl: '',
      });
      setSelectedTemplate('');
      setAutofillSuggestions({});
    }
  }, [open, templateProductId]);

  // Autofill suggestions when category changes
  useEffect(() => {
    if (formData.categoryId && products.length > 0) {
      const categoryProducts = products.filter(p => 
        p.categoryId === formData.categoryId || p.category?.id === formData.categoryId
      );
      if (categoryProducts.length > 0) {
        // Get most common unit for this category
        const unitCounts: Record<string, number> = {};
        categoryProducts.forEach(p => {
          if (p.unit) {
            unitCounts[p.unit] = (unitCounts[p.unit] || 0) + 1;
          }
        });
        const mostCommonUnit = Object.entries(unitCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
        
        // Get average price (rounded)
        const prices = categoryProducts.map(p => Number(p.price)).filter(p => p > 0);
        const avgPrice = prices.length > 0 
          ? prices.reduce((sum, p) => sum + p, 0) / prices.length 
          : 0;
        
        setAutofillSuggestions({
          unit: mostCommonUnit || 'piece',
          price: avgPrice > 0 ? avgPrice.toFixed(2) : undefined,
        });
        
        // Auto-fill unit if not set or still default
        if (!formData.unit || formData.unit === 'piece') {
          setFormData(prev => ({ ...prev, unit: mostCommonUnit || 'piece' }));
        }
      }
    }
  }, [formData.categoryId, products]);

  const loadTemplate = (template: Product) => {
    const images = typeof template.images === 'string' 
      ? JSON.parse(template.images || '[]')
      : (template.images || []);
    
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description || '',
      price: template.price.toString(),
      stock: '0', // Always start with 0 stock for new products
      categoryId: template.categoryId,
      unit: template.unit || 'piece',
      imageUrl: images[0] || '',
    });
    setSelectedTemplate(template.id);
  };

  const handleTemplateSelect = (productId: string) => {
    const template = products.find(p => p.id === productId);
    if (template) {
      loadTemplate(template);
      setShowTemplateSelector(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert('Please fill in required fields: Name, Category, and Price');
      return;
    }

    setLoading(true);
    
    try {
      const images = formData.imageUrl ? [formData.imageUrl] : [];
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          categoryId: formData.categoryId,
          unit: formData.unit,
          images,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '0',
        categoryId: '',
        unit: 'piece',
        imageUrl: '',
      });
      setSelectedTemplate('');
      setAutofillSuggestions({});
      
      onOpenChange(false);
      
      // Refresh the page to show new product
      router.refresh();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Add Product</DialogTitle>
          <DialogDescription>
            Add a new product quickly. Use a template or autofill suggestions. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        {/* Template Selector */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Use Template</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            >
              <Copy className="w-3 h-3 mr-1" />
              {selectedTemplate ? 'Change Template' : 'Select Template'}
            </Button>
          </div>
          
          {selectedTemplate && (
            <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
              Using template: {products.find(p => p.id === selectedTemplate)?.name}
            </div>
          )}

          {showTemplateSelector && (
            <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-1">
              <Input
                placeholder="Search products..."
                className="mb-2"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
              />
              <div className="space-y-1">
                {products
                  .filter((product) => 
                    !templateSearch || 
                    product.name.toLowerCase().includes(templateSearch.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleTemplateSelect(product.id)}
                      className="w-full text-left p-2 hover:bg-stone-100 rounded text-sm flex items-center justify-between"
                    >
                      <span className="truncate">{product.name}</span>
                      <Badge variant="outline" className="text-xs ml-2">
                        €{Number(product.price).toFixed(2)}
                      </Badge>
                    </button>
                  ))}
                {products.filter((product) => 
                  !templateSearch || 
                  product.name.toLowerCase().includes(templateSearch.toLowerCase())
                ).length === 0 && (
                  <p className="text-xs text-stone-500 p-2 text-center">No products found</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Titan Level 1.5mm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="price">
                  Price (€) <span className="text-red-500">*</span>
                </Label>
                {autofillSuggestions.price && autofillSuggestions.price !== formData.price && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      setFormData({ ...formData, price: autofillSuggestions.price! });
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Use €{autofillSuggestions.price}
                  </Button>
                )}
              </div>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder={autofillSuggestions.price || "0.00"}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="unit">Unit</Label>
                {autofillSuggestions.unit && autofillSuggestions.unit !== formData.unit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      setFormData({ ...formData, unit: autofillSuggestions.unit! });
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Use {autofillSuggestions.unit}
                  </Button>
                )}
              </div>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="m2">m²</SelectItem>
                  <SelectItem value="slab">Slab</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-stone-500">
              You can add more images later by editing the product
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

