"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Copy, Check, RotateCcw } from "lucide-react";

// Predefined color presets
const COLOR_PRESETS = [
  {
    name: "EU Flag Blue",
    value: "#003399",
    description: "Current brand color from logo",
    oklch: "oklch(0.25 0.15 260)"
  },
  {
    name: "Deep Navy",
    value: "#001F3F",
    description: "Professional navy blue",
    oklch: "oklch(0.20 0.10 260)"
  },
  {
    name: "Royal Blue",
    value: "#4169E1",
    description: "Classic royal blue",
    oklch: "oklch(0.50 0.20 260)"
  },
  {
    name: "Stone Gray",
    value: "#1C1917",
    description: "Current neutral (stone-900)",
    oklch: "oklch(0.205 0 0)"
  },
  {
    name: "Forest Green",
    value: "#1B4332",
    description: "Natural stone green",
    oklch: "oklch(0.30 0.10 150)"
  },
  {
    name: "Burgundy",
    value: "#800020",
    description: "Rich burgundy",
    oklch: "oklch(0.30 0.15 20)"
  }
];

// Convert hex to oklch (approximate)
function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Convert to linear RGB
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);
  
  // Convert to XYZ
  const x = (rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375) * 100;
  const y = (rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750) * 100;
  const z = (rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041) * 100;
  
  // Convert to Lab
  const xn = x / 95.047;
  const yn = y / 100.0;
  const zn = z / 108.883;
  
  const fx = xn > 0.008856 ? Math.pow(xn, 1/3) : (7.787 * xn + 16/116);
  const fy = yn > 0.008856 ? Math.pow(yn, 1/3) : (7.787 * yn + 16/116);
  const fz = zn > 0.008856 ? Math.pow(zn, 1/3) : (7.787 * zn + 16/116);
  
  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);
  
  // Convert to oklch (approximate)
  const C = Math.sqrt(a * a + bLab * bLab);
  const h = Math.atan2(bLab, a) * (180 / Math.PI);
  const hNormalized = h < 0 ? h + 360 : h;
  
  // Approximate oklch values
  const l = L / 100;
  const c = C / 100;
  
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${hNormalized.toFixed(0)})`;
}

export default function ColorsPage() {
  const [primaryColor, setPrimaryColor] = useState("#003399");
  const [accentColor, setAccentColor] = useState("#003399");
  const [copied, setCopied] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Apply colors to document root
  useEffect(() => {
    if (previewMode) {
      const primaryOklch = hexToOklch(primaryColor);
      const accentOklch = hexToOklch(accentColor);
      
      document.documentElement.style.setProperty('--primary', primaryOklch);
      document.documentElement.style.setProperty('--accent', accentOklch);
    } else {
      // Reset to defaults
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--accent');
    }
  }, [primaryColor, accentColor, previewMode]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetColors = () => {
    setPrimaryColor("#003399");
    setAccentColor("#003399");
    setPreviewMode(false);
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0], type: 'primary' | 'accent') => {
    if (type === 'primary') {
      setPrimaryColor(preset.value);
    } else {
      setAccentColor(preset.value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Color System</h1>
        <p className="text-stone-500">Manage primary and accent colors for the application</p>
      </div>

      {/* Current Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Primary Color
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-lg border-2 border-stone-200 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(primaryColor, 'primary-hex')}
                  >
                    {copied === 'primary-hex' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-stone-100 px-2 py-1 rounded">
                    {hexToOklch(primaryColor)}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(hexToOklch(primaryColor), 'primary-oklch')}
                  >
                    {copied === 'primary-oklch' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Accent Color
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-lg border-2 border-stone-200 shadow-sm"
                style={{ backgroundColor: accentColor }}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(accentColor, 'accent-hex')}
                  >
                    {copied === 'accent-hex' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-stone-100 px-2 py-1 rounded">
                    {hexToOklch(accentColor)}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(hexToOklch(accentColor), 'accent-oklch')}
                  >
                    {copied === 'accent-oklch' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Color Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLOR_PRESETS.map((preset) => (
              <div
                key={preset.name}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded border-2 border-stone-200"
                    style={{ backgroundColor: preset.value }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900">{preset.name}</h3>
                    <p className="text-xs text-stone-500">{preset.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset, 'primary')}
                    className="flex-1"
                  >
                    Use as Primary
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset, 'accent')}
                    className="flex-1"
                  >
                    Use as Accent
                  </Button>
                </div>
                <div className="mt-2 text-xs font-mono text-stone-500">
                  {preset.value} • {preset.oklch}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Preview & Apply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Live Preview</Label>
              <p className="text-sm text-stone-500">
                Toggle preview mode to see colors applied across the site
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={previewMode ? "default" : "outline"}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "Preview Active" : "Enable Preview"}
              </Button>
              <Button
                variant="outline"
                onClick={resetColors}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {previewMode && (
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
              <p className="text-sm text-stone-600 mb-4">
                <strong>Note:</strong> Preview mode applies colors temporarily. To make changes permanent, update <code className="bg-stone-200 px-1 rounded">src/app/globals.css</code>
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="default" style={{ backgroundColor: primaryColor }}>
                    Primary Button
                  </Button>
                  <Button variant="outline" style={{ borderColor: accentColor, color: accentColor }}>
                    Accent Button
                  </Button>
                  <Badge style={{ backgroundColor: accentColor, color: 'white' }}>
                    Accent Badge
                  </Badge>
                </div>
                <div className="h-20 rounded border-2" style={{ borderColor: accentColor }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CSS Variable Usage</Label>
            <div className="bg-stone-900 text-stone-100 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">/* In globals.css */</div>
              <div>--primary: {hexToOklch(primaryColor)};</div>
              <div>--accent: {hexToOklch(accentColor)};</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tailwind Classes</Label>
            <div className="bg-stone-100 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">className="bg-primary text-primary-foreground"</div>
              <div>className="bg-accent text-accent-foreground"</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

