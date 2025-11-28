"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, Clock, Play, Calendar, User, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Priority = "Critical" | "High" | "Medium" | "Low";
type Difficulty = "Easy" | "Medium" | "Hard" | "Complex";
type Status = "Pending" | "In Progress" | "Done";

interface FeatureInputConfig {
  label: string;
  placeholder: string;
  required?: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  category: "Catalog Depth" | "Wholesale UX" | "Vendor Ops" | "Trust & Support" | "E-Commerce" | "Technical" | "UX & Design" | "Growth & Marketing";
  priority: Priority;
  difficulty: Difficulty;
  status: Status;
  inputFields?: FeatureInputConfig[]; // Optional: only features that need inputs will have this
}

interface CompletionLog {
  featureId: string;
  completedAt: string;
  completedBy?: string;
  notes?: string;
}

interface FeatureInputConfig {
  key: string;
  label: string;
  placeholder: string;
}

interface FeatureInputs {
  [key: string]: string; // Dynamic keys based on feature's inputFields config
}

const PRODUCTION_FEATURES: Feature[] = [
  // CATALOG DEPTH (Real Product Handling)
  { id: "1", title: "Bulk Quantity Variants", description: "Support for 'Box of 100' vs 'Box of 500' with unit price calculations (e.g., €0.04/clip).", category: "Catalog Depth", priority: "Critical", difficulty: "Medium", status: "Pending" },
  { id: "2", title: "Stone Attributes Schema", description: "Add specific fields: BookMatch (Yes/No), Application (Indoor/Outdoor), Slip Rating (R9-R13).", category: "Catalog Depth", priority: "High", difficulty: "Easy", status: "Pending" },
  { id: "3", title: "Cross-Sell Consumables", description: "On Slab PDP, suggest: Glue, Sealant, and Blades. (e.g., 'Kalekim Dolgulu Astar').", category: "Catalog Depth", priority: "Medium", difficulty: "Medium", status: "Done" },
  { id: "10", title: "Product Variant System", description: "Group products like 'Titan Level 1.5mm 250x/500x/1000x' with variant selector dropdown.", category: "Catalog Depth", priority: "High", difficulty: "Hard", status: "Pending" },
  { id: "11", title: "Database Schema Enhancements", description: "Add fields: Block Origin, Lot Number, Thickness Tolerance, Finishes to Product model.", category: "Catalog Depth", priority: "High", difficulty: "Easy", status: "In Progress" },
  { id: "12", title: "Product Description Quality", description: "Standardize formatting, remove HTML artifacts, ensure consistent structure. Auto-formatting tool for bulk updates.", category: "Catalog Depth", priority: "Medium", difficulty: "Medium", status: "In Progress" },

  // WHOLESALE UX (Density & Speed)
  { id: "4", title: "Compact Catalog View", description: "Data-dense table view for fabricators to order tools quickly (Excel-like interface).", category: "Wholesale UX", priority: "High", difficulty: "Hard", status: "Pending" },
  { id: "5", title: "Quick Re-Order", description: "One-click 'Buy Again' for consumables like Leveling Clips and Wedges.", category: "Wholesale UX", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "13", title: "Advanced Filters", description: "Price range slider, stock status, source filter (Arsenius/Marmermarkt), multi-category selection, sort options.", category: "Wholesale UX", priority: "High", difficulty: "Easy", status: "In Progress" },
  { id: "14", title: "Product Comparison Tool", description: "Compare products side-by-side with feature comparison table. Max 4 products at once.", category: "Wholesale UX", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "15", title: "Save Cart Functionality", description: "Allow users to save cart state (localStorage or user account). Share cart links/QR codes for collaboration.", category: "Wholesale UX", priority: "Medium", difficulty: "Medium", status: "In Progress" },
  { id: "16", title: "Reserve Lot Functionality", description: "Allow architects to hold stone for projects with reservation system.", category: "Wholesale UX", priority: "Medium", difficulty: "Hard", status: "Pending" },

  // E-COMMERCE
  { id: "17", title: "Real Authentication System", description: "NextAuth.js or Clerk with email/password, trade account verification, role-based pricing (MSRP vs Trade).", category: "E-Commerce", priority: "Critical", difficulty: "Hard", status: "In Progress" },
  { id: "18", title: "Stripe Payment Integration", description: "Process payments for tools/samples. Invoicing system for slabs. Test mode ready.", category: "E-Commerce", priority: "Critical", difficulty: "Medium", status: "Pending" },
  { id: "19", title: "Order Management System", description: "Admin view of orders, order status tracking (Processing → Shipped → Delivered), order history.", category: "E-Commerce", priority: "High", difficulty: "Medium", status: "In Progress" },
  { id: "20", title: "Email Notifications", description: "Order confirmations, shipping notifications, price drop alerts, new product notifications via SendGrid/Resend.", category: "E-Commerce", priority: "High", difficulty: "Medium", status: "Pending" },
  { id: "21", title: "Trade Gating System", description: "Registration form with VAT/KVK validation. Price tiering: Public MSRP vs Trade Pricing (hidden until login).", category: "E-Commerce", priority: "High", difficulty: "Medium", status: "Pending" },
  { id: "22", title: "Complex Checkout/RFQ", description: "Split orders: Tools (Parcel shipping) vs Slabs (Freight Request). Shipping estimator with liftgate/forklift options.", category: "E-Commerce", priority: "High", difficulty: "Hard", status: "Pending" },
  { id: "23", title: "Freight Calculator", description: "Postcode → Shipping zone, weight/dimensions input, liftgate checkbox, instant estimate. Integration with DHL/UPS.", category: "E-Commerce", priority: "Medium", difficulty: "Hard", status: "Pending", inputFields: [
    { key: "shippingProvider", label: "Shipping Provider", placeholder: "DHL, UPS, or other?" },
    { key: "apiEndpoint", label: "API Endpoint", placeholder: "Shipping API endpoint URL" },
    { key: "rateTable", label: "Rate Table Reference", placeholder: "Link to shipping rate table or documentation" }
  ]},
  { id: "24", title: "Invoice Generation", description: "Downloadable PDF invoices for orders. Button exists, needs implementation.", category: "E-Commerce", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "25", title: "Promotions & Discounts", description: "Discount codes, percentage off, bulk pricing, automatic trade discounts for verified trade accounts.", category: "E-Commerce", priority: "Medium", difficulty: "Medium", status: "Pending" },

  // VENDOR OPS (Multi-Vendor Reality)
  { id: "6", title: "Vendor Storefronts", description: "Dedicated pages for 'FC Mining Stone' showing their specific stock and shipping terms.", category: "Vendor Ops", priority: "Critical", difficulty: "Complex", status: "Pending", inputFields: [
    { key: "vendorList", label: "Vendor List", placeholder: "List of vendors that need storefronts" },
    { key: "storefrontDesign", label: "Design Reference", placeholder: "Link to design mockup or reference" }
  ]},
  { id: "7", title: "Split Cart Logic", description: "Handle orders containing items from multiple vendors (Split shipping costs).", category: "Vendor Ops", priority: "High", difficulty: "Complex", status: "Pending" },
  { id: "26", title: "Vendor Portal", description: "Vendor dashboard: Add products, manage inventory, see sales, update prices. Admin approval workflow.", category: "Vendor Ops", priority: "High", difficulty: "Complex", status: "In Progress" },
  { id: "27", title: "Vendor Chat/Messaging", description: "Real-time chat between buyers and sellers. Message notifications, chat history, vendor response time tracking.", category: "Vendor Ops", priority: "Medium", difficulty: "Hard", status: "Pending" },
  { id: "28", title: "Vendor Analytics Dashboard", description: "Sales tracking, product performance, customer insights for vendors.", category: "Vendor Ops", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "29", title: "Inventory Sync Tool", description: "Scraper/API integration to check prices, stock, images from Arsenius/Marmermarkt. Auto-flag discrepancies.", category: "Vendor Ops", priority: "Medium", difficulty: "Complex", status: "Pending", inputFields: [
    { key: "apiEndpoints", label: "API Endpoints", placeholder: "Arsenius/Marmermarkt API endpoints" },
    { key: "syncFrequency", label: "Sync Frequency", placeholder: "How often to sync (e.g., hourly, daily)" },
    { key: "discrepancyRules", label: "Discrepancy Rules", placeholder: "What counts as a discrepancy?" }
  ]},

  // TRUST & SUPPORT
  { id: "8", title: "Ticket Support System", description: "Internal helpdesk for 'Where is my order?' queries (Intercom or custom).", category: "Trust & Support", priority: "Medium", difficulty: "Medium", status: "Pending", inputFields: [
    { key: "supportProvider", label: "Support Provider", placeholder: "Intercom, Zendesk, or custom?" },
    { key: "integrationType", label: "Integration Type", placeholder: "Widget, API, or full integration?" }
  ]},
  { id: "9", title: "Mobile PWA", description: "Installable web app for warehouse staff to scan QR codes on slabs.", category: "Trust & Support", priority: "Low", difficulty: "Hard", status: "Pending" },
  { id: "30", title: "Product Reviews & Ratings", description: "Star ratings (0-5), written reviews, review count display, verified purchase badges. Admin moderation.", category: "Trust & Support", priority: "High", difficulty: "Medium", status: "Pending" },
  { id: "31", title: "Order Tracking System", description: "Order status page, status updates (Processing → Shipped → Delivered). Shipping carrier integration, email notifications.", category: "Trust & Support", priority: "High", difficulty: "Medium", status: "Pending" },
  { id: "32", title: "Logistics Integration", description: "Order tracking with milestones (e.g., 'Slab Cut', 'Crated', 'Shipped').", category: "Trust & Support", priority: "Medium", difficulty: "Hard", status: "Pending" },

  // UX & DESIGN
  { id: "33", title: "Homepage Redesign", description: "Remove generic carousels. Implement 'Persona Entry Points': For Fabricators, For Designers, For Homeowners.", category: "UX & Design", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "34", title: "PDP Overhaul", description: "Dynamic 'Request Quote' vs 'Add to Cart' buttons. Downloadable Specs (PDF generation). High-res Gallery (Slab full view + Close-up + Edge detail).", category: "UX & Design", priority: "High", difficulty: "Medium", status: "Pending" },
  { id: "35", title: "Advanced Search", description: "Search suggestions/autocomplete, search by SKU, search by brand, recent searches, popular searches. Algolia integration.", category: "UX & Design", priority: "High", difficulty: "Medium", status: "Pending" },
  { id: "36", title: "Category Pages with Descriptions", description: "Category header with description, category-specific hero image, featured products, breadcrumbs.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "In Progress" },
  { id: "37", title: "Hero Carousel Text Overlays", description: "Text overlay on each slide, CTA button on banner ('Shop Marble', 'View Tools'), slide-specific messaging.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "Pending" },
  { id: "38", title: "Recently Viewed Products", description: "Track and display recently viewed products using localStorage.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "In Progress" },
  { id: "39", title: "Stock Level Warnings", description: "Display 'Only 3 left!' warnings for low stock items.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "Done" },
  { id: "40", title: "Toast Notifications", description: "Toast notifications for cart actions, favorites, and other user interactions.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "Done" },
  { id: "41", title: "Sticky Add to Cart", description: "Sticky 'Add to Cart' button on PDP scroll for better UX.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "Pending" },
  { id: "42", title: "404 Page with Suggestions", description: "Custom 404 page with product suggestions and search functionality.", category: "UX & Design", priority: "Low", difficulty: "Easy", status: "Done" },

  // GROWTH & MARKETING
  { id: "43", title: "Multi-Language Support (i18n)", description: "13 languages (EN, NL, IT, ES, DE, FR, RU, PT, PL, GR, HU, SE, DK). Language switcher, SEO-friendly routing.", category: "Growth & Marketing", priority: "Medium", difficulty: "Medium", status: "In Progress" },
  { id: "44", title: "SEO Optimization", description: "Dynamic metadata per product, structured data (Schema.org Product), sitemap generation, robots.txt, Open Graph images.", category: "Growth & Marketing", priority: "High", difficulty: "Easy", status: "In Progress", inputFields: [
    { key: "sitemapUrl", label: "Sitemap URL", placeholder: "Where should sitemap be hosted?" },
    { key: "ogImageSource", label: "OG Image Source", placeholder: "How to generate OG images?" }
  ]},
  { id: "45", title: "Localized Landing Pages", description: "SEO landing pages like 'Marble Slabs Rotterdam' for local search optimization.", category: "Growth & Marketing", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "46", title: "Social Sharing", description: "Share buttons on product pages, social media integration for marketing.", category: "Growth & Marketing", priority: "Low", difficulty: "Easy", status: "Pending" },
  { id: "47", title: "Brand Pages", description: "Brand navigation, brand filtering, brand-specific product pages, brand logos on products.", category: "Growth & Marketing", priority: "Low", difficulty: "Medium", status: "Pending" },
  { id: "48", title: "Analytics Dashboard", description: "Track top products (views, quotes, sales), category performance, user acquisition, revenue tracking. Charts with Recharts or Tremor.", category: "Growth & Marketing", priority: "High", difficulty: "Medium", status: "In Progress" },

  // TECHNICAL
  { id: "49", title: "Database Migration to PostgreSQL", description: "Migrate from SQLite to PostgreSQL for better performance, full-text search, JSON operators, concurrent writes.", category: "Technical", priority: "High", difficulty: "Easy", status: "Pending", inputFields: [
    { key: "postgresUrl", label: "PostgreSQL Connection", placeholder: "Database connection string or host" },
    { key: "migrationPlan", label: "Migration Plan", placeholder: "Link to migration plan or notes" }
  ]},
  { id: "50", title: "Image Optimization Pipeline", description: "Sharp/ImageMagick batch conversion, WebP format, multiple sizes (thumbnail, medium, large), lazy loading, Blurhash placeholders.", category: "Technical", priority: "High", difficulty: "Medium", status: "In Progress" },
  { id: "51", title: "API Rate Limiting & Pagination", description: "Pagination (20 per page), cursor-based pagination, Redis cache for popular queries, Edge caching with Vercel.", category: "Technical", priority: "High", difficulty: "Medium", status: "In Progress" },
  { id: "52", title: "Error Tracking", description: "Sentry or LogRocket integration for production error monitoring.", category: "Technical", priority: "Medium", difficulty: "Easy", status: "Pending" },
  { id: "53", title: "Edge Caching for Images", description: "Ensure instant loading of heavy textures with edge caching.", category: "Technical", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "54", title: "Rich Text Editor for Admin", description: "Rich text editor for admin product management with preview for descriptions.", category: "Technical", priority: "Low", difficulty: "Medium", status: "Pending" },
];

const priorityOrder: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const statusOrder: Record<Status, number> = {
  "In Progress": 0,
  "Pending": 1,
  "Done": 2,
};

const difficultyOrder: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
  Complex: 3,
};

export default function RoadmapPage() {
  const [features, setFeatures] = useState(PRODUCTION_FEATURES);
  const [sortBy, setSortBy] = useState<"priority" | "status" | "difficulty" | "category">("priority");
  const [completionLogs, setCompletionLogs] = useState<Record<string, CompletionLog>>({});
  const [featureInputs, setFeatureInputs] = useState<Record<string, FeatureInputs>>({});

  // Load completion logs and feature inputs from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('roadmap-completion-logs');
    if (savedLogs) {
      try {
        setCompletionLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to load completion logs:', e);
      }
    }
    
    const savedInputs = localStorage.getItem('roadmap-feature-inputs');
    if (savedInputs) {
      try {
        setFeatureInputs(JSON.parse(savedInputs));
      } catch (e) {
        console.error('Failed to load feature inputs:', e);
      }
    }
  }, []);

  // Save completion logs to localStorage
  useEffect(() => {
    localStorage.setItem('roadmap-completion-logs', JSON.stringify(completionLogs));
  }, [completionLogs]);

  // Save feature inputs to localStorage
  useEffect(() => {
    localStorage.setItem('roadmap-feature-inputs', JSON.stringify(featureInputs));
  }, [featureInputs]);

  const toggleStatus = (id: string) => {
    setFeatures(features.map(f => {
      if (f.id !== id) return f;
      const statusOrder: Status[] = ["Pending", "In Progress", "Done"];
      const currentIndex = statusOrder.indexOf(f.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      const newStatus = statusOrder[nextIndex];
      
      // Log completion when marked as Done
      if (newStatus === "Done" && f.status !== "Done") {
        const log: CompletionLog = {
          featureId: id,
          completedAt: new Date().toISOString(),
          completedBy: typeof window !== 'undefined' ? localStorage.getItem('user_email') || 'Unknown' : 'Unknown',
        };
        setCompletionLogs(prev => ({ ...prev, [id]: log }));
      }
      
      return { ...f, status: newStatus };
    }));
  };

  const updateFeatureInput = (featureId: string, fieldKey: string, value: string) => {
    setFeatureInputs(prev => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [fieldKey]: value
      }
    }));
  };

  const startFeature = (feature: Feature) => {
    if (feature.status === "Pending") {
      toggleStatus(feature.id);
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  // Sort features
  const sortedFeatures = [...features].sort((a, b) => {
    if (sortBy === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority] || statusOrder[a.status] - statusOrder[b.status];
    } else if (sortBy === "status") {
      return statusOrder[a.status] - statusOrder[b.status] || priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "difficulty") {
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return a.category.localeCompare(b.category) || priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  });

  // Group by category
  const groupedFeatures = sortedFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Production Roadmap</h1>
          <p className="text-stone-500">From 'Nice Demo' to 'High-Volume Wholesaler'.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600">Sort by:</label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => {
          const doneCount = categoryFeatures.filter(f => f.status === "Done").length;
          const inProgressCount = categoryFeatures.filter(f => f.status === "In Progress").length;
          const pendingCount = categoryFeatures.filter(f => f.status === "Pending").length;
          
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category}
                    <Badge variant="outline">{categoryFeatures.length}</Badge>
                  </div>
                  <div className="flex gap-2 text-xs font-normal text-stone-500">
                    <span className="text-green-600">{doneCount} Done</span>
                    <span className="text-blue-600">{inProgressCount} In Progress</span>
                    <span className="text-stone-400">{pendingCount} Pending</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {categoryFeatures.map((feature) => {
                    const log = completionLogs[feature.id];
                    return (
                      <AccordionItem key={feature.id} value={feature.id} className="border-b border-stone-200 last:border-b-0">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-4 w-full pr-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStatus(feature.id);
                              }}
                              className="flex-shrink-0"
                            >
                              {feature.status === "Done" ? 
                                <CheckCircle2 className="w-5 h-5 text-green-600" /> : 
                                feature.status === "In Progress" ?
                                <Clock className="w-5 h-5 text-blue-600" /> :
                                <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                              }
                            </button>
                            <div className="flex-1 text-left min-w-0">
                              <h3 className={`font-medium text-base ${
                                feature.status === "Done" ? "line-through text-stone-400" : 
                                feature.status === "In Progress" ? "text-blue-700" :
                                "text-stone-900"
                              }`}>
                                {feature.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Fixed width container for status badge to ensure alignment */}
                              <div className="w-[100px] flex justify-end">
                                {feature.status === "In Progress" && (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                                    In Progress
                                  </Badge>
                                )}
                              </div>
                              <Badge className={getPriorityColor(feature.priority)} variant="outline">
                                {feature.priority}
                              </Badge>
                              <span className="text-xs text-stone-400 font-mono min-w-[3.5rem] text-right">{feature.difficulty}</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-9 pr-4 pb-4 pt-2 space-y-4">
                            <div className="border-t border-stone-100 pt-4">
                              <p className="text-sm text-stone-700 leading-relaxed">{feature.description}</p>
                            </div>
                            
                            {/* User Input Fields - Only show if feature has inputFields defined and is Pending */}
                            {feature.status === "Pending" && feature.inputFields && feature.inputFields.length > 0 && (
                              <div className="border-t border-stone-200 pt-4 space-y-4">
                                <div className="flex items-start gap-2 mb-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="text-sm font-semibold text-stone-900 mb-1">Essential Information</h4>
                                    <p className="text-xs text-stone-500">Fill in only if highly necessary before starting this feature.</p>
                                  </div>
                                </div>
                                
                                <div className="grid gap-3">
                                  {feature.inputFields.map((fieldConfig, index) => (
                                    <div key={fieldConfig.key}>
                                      <Label htmlFor={`input-${fieldConfig.key}-${feature.id}`} className="text-xs text-stone-600 mb-1.5 block">
                                        {fieldConfig.label}
                                      </Label>
                                      <Input
                                        id={`input-${fieldConfig.key}-${feature.id}`}
                                        placeholder={fieldConfig.placeholder}
                                        value={featureInputs[feature.id]?.[fieldConfig.key] || ''}
                                        onChange={(e) => updateFeatureInput(feature.id, fieldConfig.key, e.target.value)}
                                        className="text-sm"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Show saved inputs for In Progress or Done features */}
                            {(feature.status === "In Progress" || feature.status === "Done") && featureInputs[feature.id] && feature.inputFields && (
                              <div className="border-t border-stone-200 pt-4 space-y-2">
                                <h4 className="text-sm font-semibold text-stone-900 mb-2">Saved Information</h4>
                                <div className="space-y-2">
                                  {feature.inputFields.map((fieldConfig) => {
                                    const value = featureInputs[feature.id]?.[fieldConfig.key];
                                    return value ? (
                                      <div key={fieldConfig.key} className="text-xs">
                                        <span className="text-stone-500 font-medium">{fieldConfig.label}:</span>
                                        <span className="text-stone-700 ml-2">{value}</span>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 pt-2 border-t">
                              {feature.status === "Pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => startFeature(feature)}
                                  className="bg-stone-900 hover:bg-stone-800"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Feature
                                </Button>
                              )}
                              <div className="flex-1" />
                              <div className="flex gap-4 text-xs text-stone-500">
                                <span>Priority: <strong className="text-stone-700">{feature.priority}</strong></span>
                                <span>Difficulty: <strong className="text-stone-700">{feature.difficulty}</strong></span>
                              </div>
                            </div>

                            {log && feature.status === "Done" && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-green-900 mb-1">Completed</div>
                                    <div className="text-xs text-green-700 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(log.completedAt)}</span>
                                      </div>
                                      {log.completedBy && (
                                        <div className="flex items-center gap-2">
                                          <User className="w-3 h-3" />
                                          <span>{log.completedBy}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
