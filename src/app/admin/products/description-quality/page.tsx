"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, FileText, Edit, Save, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: { name: string };
  quality: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
}

export default function DescriptionQualityPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'poor' | 'good' | 'empty'>('poor');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products?limit=1000');
      const data = await response.json();
      
      const productsWithQuality = data.products.map((product: any) => ({
        ...product,
        quality: analyzeDescription(product.description || ''),
      }));
      
      setProducts(productsWithQuality);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const analyzeDescription = (description: string) => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Empty or very short
    if (!description || description.trim().length === 0) {
      issues.push('Empty description');
      score = 0;
      suggestions.push('Add a detailed product description');
    } else if (description.length < 50) {
      issues.push('Too short (less than 50 characters)');
      score = Math.max(0, score - 40);
      suggestions.push('Expand description to at least 100-200 characters');
    } else if (description.length < 100) {
      issues.push('Short description (less than 100 characters)');
      score = Math.max(0, score - 20);
      suggestions.push('Add more details about the product');
    }

    // Generic/placeholder text
    const genericPatterns = [
      /premium natural stone/i,
      /suitable for.*applications/i,
      /high quality/i,
      /beautiful/i,
      /elegant/i,
    ];
    
    const genericMatches = genericPatterns.filter(pattern => pattern.test(description));
    if (genericMatches.length > 2) {
      issues.push('Too generic (contains placeholder language)');
      score = Math.max(0, score - 30);
      suggestions.push('Replace generic terms with specific product details');
    }

    // Missing key information
    if (!description.match(/\d+[x×]\d+/i) && !description.match(/\d+\s*(cm|mm|m)/i)) {
      issues.push('Missing dimensions');
      score = Math.max(0, score - 15);
      suggestions.push('Include product dimensions (e.g., 60x120cm)');
    }

    if (!description.match(/(polished|honed|leathered|brushed|antique)/i)) {
      issues.push('Missing finish information');
      score = Math.max(0, score - 10);
      suggestions.push('Specify the surface finish');
    }

    if (!description.match(/(marble|granite|quartzite|travertine|onyx|limestone)/i)) {
      issues.push('Missing material type');
      score = Math.max(0, score - 10);
      suggestions.push('Mention the stone type');
    }

    // HTML tags (might indicate poor formatting)
    if (description.includes('<') && description.includes('>')) {
      const htmlTagCount = (description.match(/<[^>]+>/g) || []).length;
      if (htmlTagCount > 10) {
        issues.push('Excessive HTML formatting');
        score = Math.max(0, score - 10);
        suggestions.push('Simplify HTML structure');
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      suggestions,
    };
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'empty') return !product.description || product.description.trim().length === 0;
    if (filter === 'poor') return product.quality.score < 60;
    if (filter === 'good') return product.quality.score >= 60;
    return true;
  }).sort((a, b) => a.quality.score - b.quality.score); // Sort by quality (worst first)

  const stats = {
    total: products.length,
    empty: products.filter(p => !p.description || p.description.trim().length === 0).length,
    poor: products.filter(p => p.quality.score < 60).length,
    good: products.filter(p => p.quality.score >= 60).length,
    averageScore: products.length > 0 
      ? Math.round(products.reduce((sum, p) => sum + p.quality.score, 0) / products.length)
      : 0,
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditDescription(product.description || '');
  };

  const handleSave = async (productId: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to update description');
      }

      toast.success('Description updated');
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update description');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditDescription("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Product Description Quality</h1>
        <p className="text-stone-500 mt-1">
          Review and improve product descriptions for better SEO and customer experience
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-stone-900">{stats.total}</div>
            <div className="text-sm text-stone-500">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.empty}</div>
            <div className="text-sm text-stone-500">Empty</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.poor}</div>
            <div className="text-sm text-stone-500">Poor Quality</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.good}</div>
            <div className="text-sm text-stone-500">Good Quality</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-stone-900">{stats.averageScore}</div>
            <div className="text-sm text-stone-500">Avg. Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </Button>
        <Button
          variant={filter === 'empty' ? 'default' : 'outline'}
          onClick={() => setFilter('empty')}
        >
          Empty ({stats.empty})
        </Button>
        <Button
          variant={filter === 'poor' ? 'default' : 'outline'}
          onClick={() => setFilter('poor')}
        >
          Poor ({stats.poor})
        </Button>
        <Button
          variant={filter === 'good' ? 'default' : 'outline'}
          onClick={() => setFilter('good')}
        >
          Good ({stats.good})
        </Button>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="text-center py-12 text-stone-500">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-semibold text-stone-900 hover:underline"
                      >
                        {product.name}
                      </Link>
                      <Badge variant="outline">{product.category.name}</Badge>
                      <Badge
                        variant={product.quality.score >= 60 ? 'default' : 'destructive'}
                        className={
                          product.quality.score >= 60
                            ? 'bg-green-600 text-white'
                            : product.quality.score >= 30
                            ? 'bg-amber-600 text-white'
                            : 'bg-red-600 text-white'
                        }
                      >
                        Score: {product.quality.score}
                      </Badge>
                    </div>

                    {editingId === product.id ? (
                      <div className="space-y-2 mt-4">
                        <Label>Description</Label>
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={6}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(product.id)}
                            disabled={saving}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="text-sm text-stone-700 whitespace-pre-wrap">
                          {product.description || (
                            <span className="text-stone-400 italic">No description</span>
                          )}
                        </div>

                        {product.quality.issues.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              Issues:
                            </div>
                            <ul className="list-disc list-inside text-sm text-stone-600 ml-6">
                              {product.quality.issues.map((issue, idx) => (
                                <li key={idx}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {product.quality.suggestions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <div className="text-xs font-medium text-stone-500">Suggestions:</div>
                            <ul className="list-disc list-inside text-xs text-stone-500 ml-6">
                              {product.quality.suggestions.map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingId !== product.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-stone-500">
              No products found matching the selected filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

