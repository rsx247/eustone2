"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, X, ChevronDown, SlidersHorizontal, Grid, List, Check, ShoppingCart, Heart, Eye, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function PlaygroundPage() {
  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Product Filtering Playground</h1>
        <p className="text-stone-500">Exploring 5 different UI paradigms for product discovery.</p>
      </div>

      <FilterApproach1 />
      <FilterApproach2 />
      <FilterApproach3 />
      <FilterApproach4 />
      <FilterApproach5 />
      
      <MicroanimationsSection />
      <QuickViewApproaches />
      <NavigationDotsVariants />
      <NavigationWithChevronsVariants />
      <ProductCardLayoutVariants />
      <PriceDisplayStyles />
      <LoadingStateVariants />
      <BadgeStatusVariants />
      <HeartPlacementVariants />
      <VisualCartMicroanimations />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Approach 1: Classic E-commerce Sidebar (The "Amazon" / "Zalando" style)
// ----------------------------------------------------------------------------
function FilterApproach1() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center rounded-full p-0">1</Badge>
        Classic Sidebar
        <span className="text-sm font-normal text-stone-400 ml-auto">Best for: Large catalogs, Desktop</span>
      </h2>
      <Card className="overflow-hidden bg-stone-50 border-stone-200">
        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-stone-200 p-6 overflow-y-auto hidden md:block">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {['Natural Stone', 'Ceramics', 'Tools', 'Maintenance', 'Adhesives'].map(c => (
                    <div key={c} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border border-stone-300" />
                      <span className="text-sm text-stone-600 hover:text-stone-900 cursor-pointer">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-bold mb-4">Price Range</h3>
                <Slider defaultValue={[50]} max={500} step={10} className="mb-2" />
                <div className="flex justify-between text-xs text-stone-500">
                  <span>€0</span>
                  <span>€500+</span>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-bold mb-4">Material</h3>
                <div className="space-y-2">
                  {['Marble', 'Granite', 'Travertine', 'Limestone', 'Onyx'].map(c => (
                    <div key={c} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border border-stone-300" />
                      <span className="text-sm text-stone-600 hover:text-stone-900 cursor-pointer">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Results (124)</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">Sort by:</span>
                <Select defaultValue="featured">
                   <SelectTrigger className="w-[140px] h-8 bg-white">
                    <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="featured">Featured</SelectItem>
                     <SelectItem value="price-asc">Price: Low-High</SelectItem>
                   </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white border rounded-lg p-4 h-40 flex items-center justify-center text-stone-300">
                  Product {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Approach 2: Top Bar Dropdowns (The "Airbnb" / "Notion" style)
// ----------------------------------------------------------------------------
function FilterApproach2() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center rounded-full p-0">2</Badge>
        Top Bar Dropdowns
        <span className="text-sm font-normal text-stone-400 ml-auto">Best for: Clean look, Medium complexity</span>
      </h2>
      <Card className="bg-white border-stone-200 min-h-[300px]">
        <div className="border-b p-4 flex items-center gap-2 overflow-x-auto">
          {/* Filter Trigger Buttons */}
          <Button variant="outline" className="rounded-full border-stone-300 hover:border-stone-900">
            Category <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </Button>
          <Button variant="outline" className="rounded-full border-stone-300 hover:border-stone-900 bg-stone-900 text-white hover:bg-stone-800 hover:text-white">
            Price: €10-€50 <X className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="rounded-full border-stone-300 hover:border-stone-900">
            Color <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </Button>
          <Button variant="outline" className="rounded-full border-stone-300 hover:border-stone-900">
            More Filters <SlidersHorizontal className="w-4 h-4 ml-2 opacity-50" />
          </Button>
          <div className="ml-auto flex items-center gap-2 border-l pl-4">
             <Switch id="stock" />
             <Label htmlFor="stock" className="text-sm">In Stock</Label>
          </div>
        </div>
        <div className="p-8 flex justify-center items-center text-stone-400 text-sm italic">
          Content Area
        </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Approach 3: Visual Chip Carousel (The "Spotify" / "Pinterest" style)
// ----------------------------------------------------------------------------
function FilterApproach3() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center rounded-full p-0">3</Badge>
        Visual Chip Carousel
        <span className="text-sm font-normal text-stone-400 ml-auto">Best for: Mobile, Quick Selection</span>
      </h2>
      <Card className="bg-stone-900 text-white border-stone-800 min-h-[300px]">
        <div className="p-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-stone-500" />
            <Input className="pl-10 bg-stone-800 border-stone-700 text-white h-12 text-lg placeholder:text-stone-500" placeholder="What are you looking for?" />
          </div>
          
          <div className="space-y-2">
             <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider">Browse by Category</h3>
             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {[
                  { label: 'All', active: true },
                  { label: 'Marble', color: 'bg-stone-200' },
                  { label: 'Granite', color: 'bg-stone-400' },
                  { label: 'Onyx', color: 'bg-orange-100' },
                  { label: 'Travertine', color: 'bg-amber-100' },
                  { label: 'Tools', color: 'bg-blue-100' }
                ].map((chip, i) => (
                  <button 
                    key={i} 
                    className={`
                      flex-none px-6 py-3 rounded-full font-medium text-sm transition-all
                      ${chip.active ? 'bg-white text-stone-900' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}
                    `}
                  >
                    {chip.label}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="space-y-2">
             <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider">Popular Tags</h3>
             <div className="flex flex-wrap gap-2">
                {['Indoor', 'Outdoor', 'Polished', 'Honed', 'Slabs', 'Tiles', 'Italian'].map((tag, i) => (
                   <Badge key={i} variant="secondary" className="bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer border-stone-700">
                      {tag}
                   </Badge>
                ))}
             </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Approach 4: The "Mad Libs" Sentence Builder (The "Natural Language" style)
// ----------------------------------------------------------------------------
function FilterApproach4() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center rounded-full p-0">4</Badge>
        Sentence Builder
        <span className="text-sm font-normal text-stone-400 ml-auto">Best for: Inspiration, Guided Discovery</span>
      </h2>
      <Card className="bg-stone-50 border-stone-200 p-12 flex flex-col items-center justify-center min-h-[300px]">
         <div className="text-2xl md:text-3xl font-serif text-center leading-relaxed text-stone-800 max-w-3xl">
            I am looking for 
            <span className="inline-block border-b-2 border-stone-900 mx-2 px-1 font-bold cursor-pointer hover:text-blue-600">Marble</span>
            tiles for my
            <span className="inline-block border-b-2 border-stone-300 mx-2 px-1 text-stone-400 cursor-pointer hover:text-stone-600 hover:border-stone-400">Kitchen</span>
            project, preferably in
            <span className="inline-block border-b-2 border-stone-300 mx-2 px-1 text-stone-400 cursor-pointer hover:text-stone-600 hover:border-stone-400">White</span>
            color tones.
         </div>
         
         <Button size="lg" className="mt-8 bg-stone-900 text-white">
            Show me 24 matches
         </Button>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Approach 5: Split View with Sticky Filter (The "Linear" / "Modern App" style)
// ----------------------------------------------------------------------------
function FilterApproach5() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center rounded-full p-0">5</Badge>
        Modern Toolbar (Current Implementation)
        <span className="text-sm font-normal text-stone-400 ml-auto">Best for: Efficiency, Cleanliness</span>
      </h2>
      <Card className="bg-white border-stone-200 min-h-[300px]">
         <div className="p-4 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                  <Input placeholder="Search..." className="pl-9" />
               </div>
               <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <Select defaultValue="sort">
                     <SelectTrigger className="w-[130px]"><SelectValue placeholder="Sort" /></SelectTrigger>
                     <SelectContent><SelectItem value="sort">Name (A-Z)</SelectItem></SelectContent>
                  </Select>
                  <div className="h-8 w-px bg-stone-200 mx-1" />
                  <div className="flex items-center gap-2 px-2 whitespace-nowrap">
                     <Switch id="st" />
                     <Label htmlFor="st">In Stock</Label>
                  </div>
               </div>
            </div>
            
            {/* Quick Pills Row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
               {['Tools', 'Tiles', 'Marble', 'Sinks', 'Granite', 'Limestone'].map(c => (
                  <Badge key={c} variant="outline" className="cursor-pointer hover:bg-stone-100 px-3 py-1 rounded-full font-normal text-sm">
                     {c}
                  </Badge>
               ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-4 mt-4">
               {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-stone-100 rounded-lg animate-pulse" />
               ))}
            </div>
         </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Microanimations Section - 5 Options for Add to Cart & Like Buttons
// ----------------------------------------------------------------------------
function MicroanimationsSection() {
  const [activeAnim, setActiveAnim] = useState<string | null>(null);
  
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Microanimations Playground</h2>
        <p className="text-stone-500">5 different animation styles for Add to Cart and Like buttons. Click to test each one.</p>
      </div>
      
      <Card className="bg-white border-stone-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Animation 1: Bounce & Scale */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">1. Bounce & Scale</h3>
            <p className="text-xs text-stone-500">Classic bounce with scale transform. Best for: Playful, energetic feel</p>
            <Button
              className={`w-full bg-stone-900 hover:bg-stone-800 transition-all ${
                activeAnim === 'bounce' ? 'animate-bounce scale-95' : 'hover:scale-105 active:scale-95'
              }`}
              onClick={() => {
                setActiveAnim('bounce');
                setTimeout(() => setActiveAnim(null), 600);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Add to Cart
            </Button>
          </div>

          {/* Animation 2: Pulse & Glow */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">2. Pulse & Glow</h3>
            <p className="text-xs text-stone-500">Gentle pulse with shadow glow. Best for: Subtle, premium feel</p>
            <Button
              className={`w-full bg-stone-900 hover:bg-stone-800 transition-all ${
                activeAnim === 'pulse' ? 'animate-pulse shadow-lg shadow-stone-900/50' : 'hover:shadow-md'
              }`}
              onClick={() => {
                setActiveAnim('pulse');
                setTimeout(() => setActiveAnim(null), 1000);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Add to Cart
            </Button>
          </div>

          {/* Animation 3: Slide & Checkmark */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">3. Slide & Checkmark</h3>
            <p className="text-xs text-stone-500">Icon slides out, checkmark slides in. Best for: Clear confirmation</p>
            <Button
              className={`w-full bg-stone-900 hover:bg-stone-800 transition-all overflow-hidden relative ${
                activeAnim === 'slide' ? 'bg-green-600' : ''
              }`}
              onClick={() => {
                setActiveAnim('slide');
                setTimeout(() => setActiveAnim(null), 2000);
              }}
            >
              <span className="flex items-center relative w-full">
                {activeAnim === 'slide' ? (
                  <span className="absolute inset-0 flex items-center animate-in slide-in-from-right-4 duration-300">
                    <Check className="w-4 h-4 mr-1.5" />
                    <span>Added!</span>
                  </span>
                ) : (
                  <span className="flex items-center w-full">
                    <ShoppingCart className="w-4 h-4 mr-1.5 transition-transform group-hover:translate-x-1" />
                    <span>Add to Cart</span>
                  </span>
                )}
                {activeAnim === 'slide' && (
                  <span className="opacity-0">
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    <span>Add to Cart</span>
                  </span>
                )}
              </span>
            </Button>
          </div>

          {/* Animation 4: Ripple Effect */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">4. Ripple Effect</h3>
            <p className="text-xs text-stone-500">Material Design ripple on click. Best for: Modern, tactile feel</p>
            <Button
              className="w-full bg-stone-900 hover:bg-stone-800 transition-all relative overflow-hidden"
              onClick={(e) => {
                const button = e.currentTarget;
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.className = 'absolute rounded-full bg-white/30 animate-ping';
                
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5 relative z-10" />
              <span className="relative z-10">Add to Cart</span>
            </Button>
          </div>

          {/* Animation 5: Shake & Sparkle */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">5. Shake & Sparkle</h3>
            <p className="text-xs text-stone-500">Quick shake with sparkle particles. Best for: Celebration, delight</p>
            <Button
              className={`w-full bg-stone-900 hover:bg-stone-800 transition-all ${
                activeAnim === 'shake' ? 'animate-[shake_0.5s_ease-in-out]' : ''
              }`}
              onClick={() => {
                setActiveAnim('shake');
                setTimeout(() => setActiveAnim(null), 500);
              }}
            >
              <ShoppingCart className={`w-4 h-4 mr-4 ${activeAnim === 'shake' ? 'animate-spin' : ''}`} />
              Add to Cart
            </Button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-stone-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Where to Use Microanimations:</h4>
          <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
            <li><strong>Add to Cart button:</strong> Scale on hover, color change + checkmark on click</li>
            <li><strong>Like/Favorite button:</strong> Heart fill animation, scale bounce on click</li>
            <li><strong>Header Cart/Heart icons:</strong> Scale on hover, color change when items present, badge zoom-in</li>
            <li><strong>Quick View trigger:</strong> Subtle fade-in on card hover</li>
            <li><strong>Image navigation:</strong> Chevron slide animation on hover</li>
            <li><strong>Navigation dots:</strong> Smooth width transition when active</li>
          </ul>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-sm mb-3 text-blue-900">Header Icon Microanimations (Currently Active):</h4>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="group relative">
                <Heart className="h-5 w-5 text-red-500 fill-red-500 transition-all group-hover:scale-110 group-active:scale-95" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 animate-in zoom-in-50">
                  3
                </Badge>
              </Button>
              <span className="text-xs text-blue-800">Heart: Scale + fill animation</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="group relative">
                <ShoppingCart className="h-5 w-5 text-blue-600 transition-all group-hover:scale-110 group-active:scale-95" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 animate-in zoom-in-50">
                  5
                </Badge>
              </Button>
              <span className="text-xs text-blue-800">Cart: Scale + color change</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Quick View Approaches - 3 Different Styles/Placements
// ----------------------------------------------------------------------------
function QuickViewApproaches() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Quick View Button Approaches</h2>
        <p className="text-stone-500">3 different styles and placements for the Quick View trigger button.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Approach 1: Bottom Center Badge */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center group">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white rounded-full">
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </div>
            </div>
            <span className="text-stone-400 text-sm">Product Image</span>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-1">Approach 1: Bottom Center Badge</h3>
            <p className="text-xs text-stone-500">Appears on hover, centered at bottom. Current implementation.</p>
          </CardContent>
        </Card>

        {/* Approach 2: Corner Icon Button */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center group">
            <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all z-10 opacity-0 group-hover:opacity-100">
              <Eye className="w-4 h-4 text-stone-900" />
            </button>
            <span className="text-stone-400 text-sm">Product Image</span>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-1">Approach 2: Corner Icon Button</h3>
            <p className="text-xs text-stone-500">Circular icon button in top-right corner. Minimal, clean.</p>
          </CardContent>
        </Card>

        {/* Approach 3: Overlay Text Link */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-300 flex items-center justify-center">
              <span className="text-white/0 group-hover:text-white font-medium text-sm transition-all duration-300">
                Click to Quick View
              </span>
            </div>
            <span className="text-stone-400 text-sm">Product Image</span>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-1">Approach 3: Overlay Text Link</h3>
            <p className="text-xs text-stone-500">Full overlay with text. Most discoverable, modern feel.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Navigation Dots Variants - 3 Different Styles
// ----------------------------------------------------------------------------
function NavigationDotsVariants() {
  const [activeIndex, setActiveIndex] = useState(0);
  const dots = [0, 1, 2, 3];
  
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Navigation Dots Variants</h2>
        <p className="text-stone-500">3 different styles with primary color contrast for visibility on light and dark backgrounds.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Variant 1: Border & Shadow */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-4">Variant 1: Border & Shadow</h3>
          <div className="relative h-32 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center mb-4">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {dots.map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'bg-stone-900 w-6 border-2 border-white shadow-lg'
                      : 'bg-white/80 w-1.5 border border-stone-900/30'
                  }`}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-500">Active dot has white border and shadow. Works on both light and dark.</p>
        </Card>

        {/* Variant 2: Dual Color Fill */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-4">Variant 2: Dual Color Fill</h3>
          <div className="relative h-32 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center mb-4">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {dots.map((idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-6 bg-gradient-to-r from-stone-900 to-stone-700 ring-2 ring-white'
                      : 'w-1.5 bg-white/60 ring-1 ring-stone-900/20'
                  }`}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-500">Gradient fill with ring border. High contrast, modern look.</p>
        </Card>

        {/* Variant 3: Outlined Style */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-4">Variant 3: Outlined Style</h3>
          <div className="relative h-32 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center mb-4">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {dots.map((idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-6 bg-stone-900 border-2 border-white'
                      : 'w-1.5 bg-transparent border-2 border-stone-900/40'
                  }`}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-500">Filled active, outlined inactive. Clean, minimal aesthetic.</p>
        </Card>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Navigation with Chevrons - 2 Additional Variants
// ----------------------------------------------------------------------------
function NavigationWithChevronsVariants() {
  const [activeIndex, setActiveIndex] = useState(0);
  const dots = [0, 1, 2, 3];
  
  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? dots.length - 1 : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev === dots.length - 1 ? 0 : prev + 1));
  
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Navigation with Chevrons Variants</h2>
        <p className="text-stone-500">2 additional navigation styles combining chevrons and dots on the same line.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variant 4: Compact Pill with Chevrons */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-4">Variant 4: Compact Pill with Chevrons</h3>
          <div className="relative h-32 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center mb-4">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-full shadow-lg border border-stone-200/50">
              <button
                onClick={handlePrev}
                className="p-1 transition-all hover:scale-110 active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-stone-900" />
              </button>
              <div className="flex gap-1.5 items-center">
                {dots.map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'bg-stone-900 w-4 border border-white shadow-md'
                        : 'bg-stone-400/60 w-1.5 border border-stone-900/20 hover:bg-stone-600/80'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="p-1 transition-all hover:scale-110 active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-stone-900" />
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-500">All controls in one pill container. Current implementation. Clean and compact.</p>
        </Card>

        {/* Variant 5: Separated Chevrons with Center Dots */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-4">Variant 5: Separated Chevrons with Center Dots</h3>
          <div className="relative h-32 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg flex items-center justify-center mb-4">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all hover:scale-110 active:scale-95 border border-stone-200/50"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-stone-900" />
              </button>
              <div className="flex gap-1.5 items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md border border-stone-200/50">
                {dots.map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'bg-stone-900 w-4 border border-white'
                        : 'bg-stone-400/60 w-1.5 border border-stone-900/20'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all hover:scale-110 active:scale-95 border border-stone-200/50"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-stone-900" />
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-500">Chevrons and dots in separate containers. More visual separation, clearer hierarchy.</p>
        </Card>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Product Card Layout Variants
// ----------------------------------------------------------------------------
function ProductCardLayoutVariants() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Product Card Layout Variants</h2>
        <p className="text-stone-500">Different ways to structure product information on cards.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Variant 1: Current - Image Top, Info Bottom */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-stone-100 to-stone-200" />
          <CardContent className="p-4">
            <div className="text-xs text-stone-500 mb-1">Category</div>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">Product Name</h3>
            <div className="text-lg font-bold mb-3">€45.00</div>
            <Button size="sm" className="w-full">Add to Cart</Button>
          </CardContent>
        </Card>

        {/* Variant 2: Horizontal Layout */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="flex">
            <div className="w-32 h-32 bg-gradient-to-br from-stone-100 to-stone-200 flex-shrink-0" />
            <CardContent className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs text-stone-500 mb-1">Category</div>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">Product Name</h3>
              </div>
              <div>
                <div className="text-lg font-bold mb-2">€45.00</div>
                <Button size="sm" className="w-full">Add to Cart</Button>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Variant 3: Minimal - Image Only with Overlay */}
        <Card className="bg-white border-stone-200 overflow-hidden relative group">
          <div className="h-48 bg-gradient-to-br from-stone-100 to-stone-200 relative">
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/60 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                <h3 className="font-semibold mb-1">Product Name</h3>
                <div className="text-lg font-bold mb-2">€45.00</div>
                <Button size="sm" variant="secondary">Add to Cart</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Price Display Styles
// ----------------------------------------------------------------------------
function PriceDisplayStyles() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Price Display Styles</h2>
        <p className="text-stone-500">Different ways to show pricing information.</p>
      </div>
      
      <Card className="bg-white border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Style 1: Large Bold */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Style 1: Large Bold</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-stone-900">€45.00</span>
              <span className="text-xs text-stone-500">/m²</span>
            </div>
          </div>

          {/* Style 2: With Trade Price */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Style 2: With Trade Price</h3>
            <div>
              <div className="text-sm text-stone-500 line-through">€45.00</div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-green-600">€38.00</span>
                <span className="text-xs text-stone-500">/m²</span>
              </div>
              <Badge className="mt-1 bg-green-100 text-green-800 text-xs">Trade Price</Badge>
            </div>
          </div>

          {/* Style 3: Compact Inline */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Style 3: Compact Inline</h3>
            <div className="text-base font-semibold text-stone-900">
              €45.00 <span className="text-xs font-normal text-stone-500">per m²</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Loading State Variants
// ----------------------------------------------------------------------------
function LoadingStateVariants() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Loading State Variants</h2>
        <p className="text-stone-500">Different skeleton and loading indicators for better perceived performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Variant 1: Shimmer Skeleton */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="h-40 bg-stone-200 animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-3 bg-stone-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-stone-200 rounded animate-pulse w-2/3" />
            <div className="h-6 bg-stone-200 rounded animate-pulse w-1/4" />
            <div className="h-8 bg-stone-200 rounded animate-pulse w-full" />
          </CardContent>
        </Card>

        {/* Variant 2: Gradient Pulse */}
        <Card className="bg-white border-stone-200 overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
          <CardContent className="p-4 space-y-2">
            <div className="h-3 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/3" />
            <div className="h-4 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-2/3" />
          </CardContent>
        </Card>

        {/* Variant 3: Spinner Overlay */}
        <Card className="bg-white border-stone-200 overflow-hidden relative">
          <div className="h-40 bg-stone-100" />
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-stone-500">Loading product...</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Badge & Status Variants
// ----------------------------------------------------------------------------
function BadgeStatusVariants() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Badge & Status Indicator Variants</h2>
        <p className="text-stone-500">Different styles for stock status, categories, and product badges.</p>
      </div>
      
      <Card className="bg-white border-stone-200 p-6">
        <div className="space-y-6">
          {/* Stock Status */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Stock Status</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-green-600 text-white">In Stock</Badge>
              <Badge className="bg-amber-500 text-white">Low Stock</Badge>
              <Badge className="bg-red-600 text-white">Out of Stock</Badge>
              <Badge variant="outline" className="border-green-600 text-green-600">Available</Badge>
            </div>
          </div>

          {/* Product Type Badges */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Product Type</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">Natural Stone</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Tools</Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Tiles</Badge>
              <Badge className="bg-stone-900 text-white">Premium</Badge>
            </div>
          </div>

          {/* Special Badges */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Special Indicators</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-red-500 text-white animate-pulse">New</Badge>
              <Badge className="bg-orange-500 text-white">Sale</Badge>
              <Badge className="bg-yellow-500 text-white">Featured</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-600">Verified</Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Heart Placement Variants - 5 Different Placements
// ----------------------------------------------------------------------------
function HeartPlacementVariants() {
  const [isFavorited, setIsFavorited] = useState(false);
  
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Heart Icon Placement Variants</h2>
        <p className="text-stone-500">5 different placements for the favorite/heart icon on product cards to improve visibility.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Variant 1: Top Right Corner (Current) */}
        <Card className="bg-white border-stone-200 overflow-hidden relative">
          <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-200">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-2 right-2 p-1.5 z-10 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 transition-all drop-shadow-lg ${
                isFavorited 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-white/90 hover:text-red-500 hover:fill-red-500/20'
              }`} />
            </button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">Variant 1: Top Right Corner</h3>
            <p className="text-xs text-stone-500">Current placement. May be hard to see on light images.</p>
          </CardContent>
        </Card>

        {/* Variant 2: Top Right with Dark Background + Hover Effect */}
        <Card className="bg-white border-stone-200 overflow-hidden relative group">
          <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-200">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-2 right-2 p-2 bg-black/75 backdrop-blur-sm rounded-full z-10 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-4 h-4 transition-all ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white hover:text-red-500'
              }`} />
            </button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">Variant 2: Top Right with Dark Background + Hover</h3>
            <p className="text-xs text-stone-500">Dark circular background (75% opacity) appears on hover. Matches Quick View opacity.</p>
          </CardContent>
        </Card>

        {/* Variant 3: Bottom Right Corner */}
        <Card className="bg-white border-stone-200 overflow-hidden relative">
          <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-200">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute bottom-2 right-2 p-1.5 z-10 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 transition-all drop-shadow-lg ${
                isFavorited 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-white/90 hover:text-red-500 hover:fill-red-500/20'
              }`} />
            </button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">Variant 3: Bottom Right Corner</h3>
            <p className="text-xs text-stone-500">Less likely to conflict with stock badges. Better for light images.</p>
          </CardContent>
        </Card>

        {/* Variant 4: Top Left Corner */}
        <Card className="bg-white border-stone-200 overflow-hidden relative">
          <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-200">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-2 left-2 p-1.5 z-10 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-5 h-5 transition-all drop-shadow-lg ${
                isFavorited 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-white/90 hover:text-red-500 hover:fill-red-500/20'
              }`} />
            </button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">Variant 4: Top Left Corner</h3>
            <p className="text-xs text-stone-500">Traditional placement. May conflict with stock badges.</p>
          </CardContent>
        </Card>

        {/* Variant 5: Floating on Hover (Bottom Center) */}
        <Card className="bg-white border-stone-200 overflow-hidden relative group">
          <div className="relative h-40 bg-gradient-to-br from-stone-100 to-stone-200">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 active:scale-95"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-4 h-4 transition-all ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-stone-900 hover:text-red-500'
              }`} />
            </button>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">Variant 5: Floating on Hover (Bottom Center)</h3>
            <p className="text-xs text-stone-500">Appears on hover with white background. Clean, modern approach.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Visual Cart Microanimations - Visual Feedback Options
// ----------------------------------------------------------------------------
function VisualCartMicroanimations() {
  const [activeAnim, setActiveAnim] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundVariant, setSoundVariant] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  
  const playSound = (variant: number = soundVariant) => {
    if (soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different sound variants
        switch(variant) {
          case 1: // Default beep
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            break;
          case 2: // Higher pitch
            oscillator.frequency.value = 1200;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
            break;
          case 3: // Lower pitch
            oscillator.frequency.value = 500;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            break;
          case 4: // Quick double beep
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
            setTimeout(() => {
              const osc2 = audioContext.createOscillator();
              const gain2 = audioContext.createGain();
              osc2.connect(gain2);
              gain2.connect(audioContext.destination);
              osc2.frequency.value = 1000;
              osc2.type = 'sine';
              gain2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.1);
              gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
              osc2.start(audioContext.currentTime + 0.1);
              osc2.stop(audioContext.currentTime + 0.15);
            }, 50);
            return;
          case 5: // Soft chime
            oscillator.frequency.value = 600;
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            break;
        }
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + (variant === 5 ? 0.2 : 0.1));
      } catch (e) {
        // Fallback if audio context fails
      }
    }
  };
  
  const triggerAnimation = (animType: string) => {
    setActiveAnim(animType);
    playSound();
    if (animType.includes('cart')) {
      setItemCount(prev => prev + 1);
    } else {
      setFavoriteCount(prev => prev + 1);
    }
    setTimeout(() => setActiveAnim(null), 1000);
  };
  
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Visual Cart Microanimations</h2>
        <p className="text-stone-500">Visual feedback options on header cart and favorite icons when items are added. Click "Add Item" to trigger animations.</p>
      </div>
      
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2">
          <Switch 
            checked={soundEnabled} 
            onCheckedChange={setSoundEnabled}
          />
          <Label className="text-sm">Enable sound feedback</Label>
        </div>
        {soundEnabled && (
          <div className="flex items-center gap-2">
            <Label className="text-sm">Sound Variant:</Label>
            <Select value={soundVariant.toString()} onValueChange={(v) => setSoundVariant(parseInt(v))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. Default Beep (800Hz)</SelectItem>
                <SelectItem value="2">2. High Pitch (1200Hz)</SelectItem>
                <SelectItem value="3">3. Low Pitch (500Hz)</SelectItem>
                <SelectItem value="4">4. Double Beep</SelectItem>
                <SelectItem value="5">5. Soft Chime (Triangle)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Animation 1: Particle Burst */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-3">1. Particle Burst</h3>
          <p className="text-xs text-stone-500 mb-4">Small particles explode from icon. Best for: Celebration, delight</p>
          <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                itemCount > 0 ? 'text-blue-600' : 'text-stone-600'
              }`} />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 animate-in zoom-in-50 duration-300">
                  {itemCount}
                </Badge>
              )}
              {activeAnim === 'particles-cart' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-green-400 rounded-full animate-ping"
                      style={{
                        left: '50%',
                        top: '50%',
                        animationDelay: `${i * 0.05}s`,
                        transform: `translate(${Math.cos(i * Math.PI / 4) * 20}px, ${Math.sin(i * Math.PI / 4) * 20}px)`,
                      }}
                    />
                  ))}
                </div>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative group">
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-600'
              }`} />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 animate-in zoom-in-50 duration-300">
                  {favoriteCount}
                </Badge>
              )}
              {activeAnim === 'particles-fav' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-red-400 rounded-full animate-ping"
                      style={{
                        left: '50%',
                        top: '50%',
                        animationDelay: `${i * 0.05}s`,
                        transform: `translate(${Math.cos(i * Math.PI / 4) * 20}px, ${Math.sin(i * Math.PI / 4) * 20}px)`,
                      }}
                    />
                  ))}
                </div>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => triggerAnimation('particles-cart')}>
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => triggerAnimation('particles-fav')}>
              Add Favorite
            </Button>
          </div>
        </Card>

        {/* Animation 2: Ripple Wave */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-3">2. Ripple Wave</h3>
          <p className="text-xs text-stone-500 mb-4">Concentric circles expand from icon. Best for: Material Design feel</p>
          <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
            <Button variant="ghost" size="icon" className="relative group" id="ripple-cart">
              <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                itemCount > 0 ? 'text-blue-600' : 'text-stone-600'
              }`} />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative group" id="ripple-fav">
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-600'
              }`} />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                  {favoriteCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={(e) => {
              triggerAnimation('ripple-cart');
              const icon = document.getElementById('ripple-cart');
              if (icon) {
                const ripple = document.createElement('span');
                const rect = icon.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                ripple.className = 'absolute rounded-full bg-blue-400/30 animate-ping pointer-events-none';
                icon.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }
            }}>
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
              triggerAnimation('ripple-fav');
              const icon = document.getElementById('ripple-fav');
              if (icon) {
                const ripple = document.createElement('span');
                const rect = icon.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                ripple.className = 'absolute rounded-full bg-red-400/30 animate-ping pointer-events-none';
                icon.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }
            }}>
              Add Favorite
            </Button>
          </div>
        </Card>

        {/* Animation 3: Checkmark Pop */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-3">3. Checkmark Pop</h3>
          <p className="text-xs text-stone-500 mb-4">Checkmark pops in over icon. Best for: Clear confirmation</p>
          <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
            <Button variant="ghost" size="icon" className="relative group">
              {activeAnim === 'checkmark-cart' ? (
                <Check className="h-5 w-5 animate-in zoom-in-50 duration-300 text-green-400" />
              ) : (
                <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                  itemCount > 0 ? 'text-blue-600' : 'text-stone-600'
                }`} />
              )}
              {itemCount > 0 && activeAnim !== 'checkmark-cart' && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative group">
              {activeAnim === 'checkmark-fav' ? (
                <Check className="h-5 w-5 animate-in zoom-in-50 duration-300 text-green-400" />
              ) : (
                <Heart className={`h-5 w-5 transition-all duration-300 ${
                  favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-600'
                }`} />
              )}
              {favoriteCount > 0 && activeAnim !== 'checkmark-fav' && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                  {favoriteCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => triggerAnimation('checkmark-cart')}>
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => triggerAnimation('checkmark-fav')}>
              Add Favorite
            </Button>
          </div>
        </Card>

        {/* Animation 4: Number Badge Pop */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-3">4. Number Badge Pop</h3>
          <p className="text-xs text-stone-500 mb-4">Badge appears with bounce animation. Best for: Cart count feedback</p>
          <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                itemCount > 0 ? 'text-blue-600' : 'text-stone-600'
              }`} />
              {itemCount > 0 && (
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 ${
                  activeAnim === 'badge-cart' ? 'animate-in zoom-in-50 bounce-in duration-300' : ''
                }`}>
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative group">
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-600'
              }`} />
              {favoriteCount > 0 && (
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 ${
                  activeAnim === 'badge-fav' ? 'animate-in zoom-in-50 bounce-in duration-300' : ''
                }`}>
                  {favoriteCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => triggerAnimation('badge-cart')}>
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => triggerAnimation('badge-fav')}>
              Add Favorite
            </Button>
          </div>
        </Card>

        {/* Animation 5: Glow Pulse */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-3">5. Glow Pulse</h3>
          <p className="text-xs text-stone-500 mb-4">Icon glows with pulsing effect. Best for: Subtle, elegant feedback</p>
          <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-stone-50 rounded-lg">
            <Button variant="ghost" size="icon" className={`relative group ${
              activeAnim === 'glow-cart' ? 'ring-4 ring-blue-400/50 ring-offset-2' : ''
            }`}>
              <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                itemCount > 0 ? 'text-blue-600' : 'text-stone-600'
              }`} />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className={`relative group ${
              activeAnim === 'glow-fav' ? 'ring-4 ring-red-400/50 ring-offset-2' : ''
            }`}>
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-600'
              }`} />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                  {favoriteCount}
                </Badge>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => triggerAnimation('glow-cart')}>
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => triggerAnimation('glow-fav')}>
              Add Favorite
            </Button>
          </div>
        </Card>

        {/* Animation 6: Slide Up Toast */}
        <Card className="bg-white border-stone-200 p-6">
          <h3 className="font-semibold text-sm mb-3">6. Slide Up Toast</h3>
          <p className="text-xs text-stone-500 mb-4">Toast notification slides up. Best for: Detailed feedback</p>
          <div className="flex items-center justify-between gap-4 mb-4 p-4 bg-stone-50 rounded-lg relative">
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                itemCount > 0 ? 'text-blue-600' : 'text-stone-600'
              }`} />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative group">
              <Heart className={`h-5 w-5 transition-all duration-300 ${
                favoriteCount > 0 ? 'fill-red-500 text-red-500' : 'text-stone-600'
              }`} />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                  {favoriteCount}
                </Badge>
              )}
            </Button>
            {activeAnim === 'toast-cart' && (
              <div className="absolute -top-12 left-0 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-300 text-xs">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3" />
                  <span>Added to cart!</span>
                </div>
              </div>
            )}
            {activeAnim === 'toast-fav' && (
              <div className="absolute -top-12 right-0 bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-300 text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 fill-white" />
                  <span>Added to favorites!</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => triggerAnimation('toast-cart')}>
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => triggerAnimation('toast-fav')}>
              Add Favorite
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-sm mb-2 text-blue-900">Usage Notes:</h4>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>These animations can be used for both "Add to Cart" buttons and header heart icon when favoriting</li>
          <li>Sound feedback is optional and can be toggled by users (accessibility consideration)</li>
          <li>Particle burst and ripple work well for celebratory actions</li>
          <li>Checkmark pop and badge pop provide clear confirmation</li>
          <li>Glow pulse is subtle and elegant for frequent actions</li>
          <li>Toast notification is best for detailed feedback with messages</li>
        </ul>
      </div>
    </section>
  );
}
