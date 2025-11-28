"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

type Priority = "Critical" | "High" | "Medium" | "Low";
type Difficulty = "Easy" | "Medium" | "Hard" | "Complex";
type Status = "Pending" | "In Progress" | "Done";

interface Feature {
  id: string;
  title: string;
  description: string;
  category: "Catalog Depth" | "Wholesale UX" | "Vendor Ops" | "Trust & Support";
  priority: Priority;
  difficulty: Difficulty;
  status: Status;
}

const PRODUCTION_FEATURES: Feature[] = [
  // CATALOG DEPTH (Real Product Handling)
  { id: "1", title: "Bulk Quantity Variants", description: "Support for 'Box of 100' vs 'Box of 500' with unit price calculations (e.g., €0.04/clip).", category: "Catalog Depth", priority: "Critical", difficulty: "Medium", status: "Pending" },
  { id: "2", title: "Stone Attributes Schema", description: "Add specific fields: BookMatch (Yes/No), Application (Indoor/Outdoor), Slip Rating (R9-R13).", category: "Catalog Depth", priority: "High", difficulty: "Easy", status: "Pending" },
  { id: "3", title: "Cross-Sell Consumables", description: "On Slab PDP, suggest: Glue, Sealant, and Blades. (e.g., 'Kalekim Dolgulu Astar').", category: "Catalog Depth", priority: "Medium", difficulty: "Medium", status: "Pending" },

  // WHOLESALE UX (Density & Speed)
  { id: "4", title: "Compact Catalog View", description: "Data-dense table view for fabricators to order tools quickly (Excel-like interface).", category: "Wholesale UX", priority: "High", difficulty: "Hard", status: "Pending" },
  { id: "5", title: "Quick Re-Order", description: "One-click 'Buy Again' for consumables like Leveling Clips and Wedges.", category: "Wholesale UX", priority: "Medium", difficulty: "Medium", status: "Pending" },
  
  // VENDOR OPS (Multi-Vendor Reality)
  { id: "6", title: "Vendor Storefronts", description: "Dedicated pages for 'FC Mining Stone' showing their specific stock and shipping terms.", category: "Vendor Ops", priority: "Critical", difficulty: "Complex", status: "Pending" },
  { id: "7", title: "Split Cart Logic", description: "Handle orders containing items from multiple vendors (Split shipping costs).", category: "Vendor Ops", priority: "High", difficulty: "Complex", status: "Pending" },

  // TRUST & SUPPORT
  { id: "8", title: "Ticket Support System", description: "Internal helpdesk for 'Where is my order?' queries (Intercom or custom).", category: "Trust & Support", priority: "Medium", difficulty: "Medium", status: "Pending" },
  { id: "9", title: "Mobile PWA", description: "Installable web app for warehouse staff to scan QR codes on slabs.", category: "Trust & Support", priority: "Low", difficulty: "Hard", status: "Pending" },
];

export default function RoadmapPage() {
  const [features, setFeatures] = useState(PRODUCTION_FEATURES);

  const toggleStatus = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, status: f.status === "Done" ? "Pending" : "Done" } : f));
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-stone-100 text-stone-800 border-stone-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Production Roadmap</h1>
        <p className="text-stone-500">From 'Nice Demo' to 'High-Volume Wholesaler'.</p>
      </div>

      <div className="grid gap-6">
        {["Catalog Depth", "Wholesale UX", "Vendor Ops", "Trust & Support"].map((cat) => (
          <Card key={cat}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                {cat} <Badge variant="outline">{features.filter(f => f.category === cat).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.filter(f => f.category === cat).map((feature) => (
                  <div key={feature.id} className="flex items-start justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                    <div className="flex gap-4">
                      <button onClick={() => toggleStatus(feature.id)} className="mt-1">
                        {feature.status === "Done" ? 
                          <CheckCircle2 className="w-5 h-5 text-green-600" /> : 
                          <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                        }
                      </button>
                      <div>
                        <h3 className={`font-medium ${feature.status === "Done" ? "line-through text-stone-400" : "text-stone-900"}`}>
                          {feature.title}
                        </h3>
                        <p className="text-sm text-stone-500 mt-1 max-w-2xl">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getPriorityColor(feature.priority)} variant="outline">
                        {feature.priority}
                      </Badge>
                      <span className="text-xs text-stone-400 font-mono">Diff: {feature.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
