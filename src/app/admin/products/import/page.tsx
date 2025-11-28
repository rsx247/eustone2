"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Download, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const downloadTemplate = () => {
    const csv = `name,description,price,stock,category,unit,imageUrl
Titan Level 1.5mm,Professional leveling clips,0.04,1000,tools,piece,https://example.com/image.jpg
Marble Slab White,Beautiful white marble slab,150.00,5,slabs,m2,https://example.com/slab.jpg`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Find column indices
      const nameIdx = headers.indexOf('name');
      const descIdx = headers.indexOf('description');
      const priceIdx = headers.indexOf('price');
      const stockIdx = headers.indexOf('stock');
      const categoryIdx = headers.indexOf('category');
      const unitIdx = headers.indexOf('unit');
      const imageIdx = headers.indexOf('imageurl');

      if (nameIdx === -1 || priceIdx === -1) {
        throw new Error('CSV must have "name" and "price" columns');
      }

      // Fetch categories to map names to IDs
      const categoriesRes = await fetch('/api/categories');
      const categories = await categoriesRes.json();
      const categoryMap = new Map(categories.map((c: any) => [c.name.toLowerCase(), c.id]));

      const results: ImportResult = {
        success: 0,
        failed: 0,
        errors: []
      };

      // Process each row (skip header)
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        try {
          const name = values[nameIdx];
          const price = parseFloat(values[priceIdx] || '0');
          const stock = parseInt(values[stockIdx] || '0');
          const categoryName = values[categoryIdx] || '';
          const categoryId = categoryMap.get(categoryName.toLowerCase());

          if (!name || !price) {
            results.failed++;
            results.errors.push(`Row ${i + 1}: Missing name or price`);
            continue;
          }

          if (!categoryId) {
            results.failed++;
            results.errors.push(`Row ${i + 1}: Category "${categoryName}" not found`);
            continue;
          }

          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              description: values[descIdx] || '',
              price,
              stock,
              categoryId,
              unit: values[unitIdx] || 'piece',
              images: values[imageIdx] ? [values[imageIdx]] : [],
            }),
          });

          if (response.ok) {
            results.success++;
          } else {
            results.failed++;
            const error = await response.json();
            results.errors.push(`Row ${i + 1}: ${error.error || 'Failed'}`);
          }
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: ${error.message || 'Error'}`);
        }
      }

      setResult(results);
      if (results.success > 0) {
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Bulk Import Products</h1>
          <p className="text-stone-500">Import multiple products from a CSV file</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CSV Template</CardTitle>
            <CardDescription>
              Download a template CSV file with the correct format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <div className="mt-4 text-sm text-stone-600 space-y-1">
              <p><strong>Required columns:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>name - Product name</li>
                <li>price - Price in euros</li>
                <li>category - Category name (must match existing category)</li>
              </ul>
              <p className="mt-2"><strong>Optional columns:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>description - Product description</li>
                <li>stock - Stock quantity (default: 0)</li>
                <li>unit - Unit type: piece, m2, slab, box (default: piece)</li>
                <li>imageUrl - Single image URL</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import CSV File</CardTitle>
            <CardDescription>
              Upload your CSV file to import products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            {file && (
              <div className="p-3 bg-stone-50 rounded-lg">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-stone-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Products
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Successful</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{result.success}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">Failed</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">{result.failed}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-sm">Errors:</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {result.errors.map((error, idx) => (
                      <p key={idx} className="text-xs text-stone-600 bg-stone-50 p-2 rounded">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

