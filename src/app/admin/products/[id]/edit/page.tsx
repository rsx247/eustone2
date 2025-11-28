"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, ExternalLink, Copy, Loader2, Wand2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ASPECT_RATIO_OPTIONS, FIT_OPTIONS, getThumbnailClass } from "@/lib/thumbnail-utils";

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the params Promise
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    unit: 'piece',
    images: [] as string[],
    verified: false,
    thumbnailAspectRatio: 'auto',
    thumbnailFit: 'cover'
  });

  useEffect(() => {
    // Fetch product
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          price: Number(data.price),
          stock: data.stock,
          categoryId: data.categoryId,
          unit: data.unit,
          images: JSON.parse(data.images || '[]'),
          verified: data.verified || false,
          thumbnailAspectRatio: data.thumbnailAspectRatio || 'auto',
          thumbnailFit: data.thumbnailFit || 'cover'
        });
        setLoading(false);
      });

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(formData.images)
        })
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Save failed:', error);
      setSaving(false);
    }
  };

  const handleImageAdd = () => {
    const newUrl = prompt('Enter image URL:');
    if (newUrl) {
      setFormData({
        ...formData,
        images: [...formData.images, newUrl]
      });
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const getSourceUrl = (name: string) => {
    if (name.toLowerCase().includes('titan') || name.toLowerCase().includes('kalekim')) {
      return `https://arsenius.nl/search?q=${encodeURIComponent(name)}`;
    }
    return `https://marmermarkt.com/search?q=${encodeURIComponent(name)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Edit Product</h1>
            <p className="text-stone-500">{product?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={getSourceUrl(formData.name)} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Check Source
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Slug (URL)</Label>
                <Input 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (€)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit</Label>
                  <Select value={formData.unit} onValueChange={(val) => setFormData({...formData, unit: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="m2">m²</SelectItem>
                      <SelectItem value="slab">Slab</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="bucket">Bucket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.categoryId} onValueChange={(val) => setFormData({...formData, categoryId: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Images ({formData.images.length})
                <Button size="sm" onClick={handleImageAdd}>Add Image</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-white rounded border overflow-hidden relative">
                      <Image src={url} alt={`Image ${index + 1}`} fill className="object-contain p-2" />
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageRemove(index)}
                    >
                      Remove
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2">Primary</Badge>
                    )}
                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="col-span-full text-center py-8 text-stone-400">
                    No images. Click "Add Image" to add one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Thumbnail Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <strong>Smart Defaults:</strong> Square (1:1) with crop for most products. 
                Products with text labels automatically use 4:3 with contain.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Aspect Ratio</Label>
                  <Select 
                    value={formData.thumbnailAspectRatio} 
                    onValueChange={(val) => setFormData({...formData, thumbnailAspectRatio: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIO_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Image Fit</Label>
                  <Select 
                    value={formData.thumbnailFit} 
                    onValueChange={(val) => setFormData({...formData, thumbnailFit: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Live Preview */}
              {formData.images.length > 0 && (
                <div>
                  <Label className="mb-2 block">Preview on Catalog</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Current Settings */}
                    <div>
                      <div className="text-xs text-stone-500 mb-1 font-medium">Current Settings</div>
                      <div className={`relative ${getThumbnailClass(product?.category?.name || '', formData.name, formData.thumbnailAspectRatio, formData.thumbnailFit).container} bg-white rounded border`}>
                        <Image 
                          src={formData.images[0]} 
                          alt="Preview"
                          fill
                          className={`${getThumbnailClass(product?.category?.name || '', formData.name, formData.thumbnailAspectRatio, formData.thumbnailFit).image} ${getThumbnailClass(product?.category?.name || '', formData.name, formData.thumbnailAspectRatio, formData.thumbnailFit).padding}`}
                        />
                      </div>
                    </div>
                    {/* Default (for comparison) */}
                    <div>
                      <div className="text-xs text-stone-500 mb-1 font-medium">Default (Auto)</div>
                      <div className={`relative ${getThumbnailClass(product?.category?.name || '', formData.name, 'auto', 'cover').container} bg-white rounded border`}>
                        <Image 
                          src={formData.images[0]} 
                          alt="Default"
                          fill
                          className={`${getThumbnailClass(product?.category?.name || '', formData.name, 'auto', 'cover').image} ${getThumbnailClass(product?.category?.name || '', formData.name, 'auto', 'cover').padding}`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {formData.thumbnailAspectRatio !== 'auto' && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <Wand2 className="w-3 h-3" />
                      Manual override active. Set to "Auto-Detect" to use smart defaults.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Verified</Label>
                <Button 
                  size="sm"
                  variant={formData.verified ? "default" : "outline"}
                  onClick={() => setFormData({...formData, verified: !formData.verified})}
                >
                  {formData.verified ? "Verified ✓" : "Mark as Verified"}
                </Button>
              </div>
              
              {product?.source && (
                <div>
                  <Label>Source</Label>
                  <Badge variant="secondary">{product.source}</Badge>
                </div>
              )}

              {product?.legacyCategoryId && (
                <div>
                  <Label>Legacy Category ID</Label>
                  <div className="font-mono text-sm text-stone-500">{product.legacyCategoryId}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/products/${formData.slug}`} target="_blank">
                  View on Frontend
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={getSourceUrl(formData.name)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open on {product?.source || 'Source'}
                </a>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

