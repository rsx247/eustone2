"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Map, Box, FlaskConical, CheckCircle2, ChevronLeft, ChevronRight, BarChart3, Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Box },
    { href: "/admin/products/description-quality", label: "Description Quality", icon: FileText },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/verify", label: "Verification", icon: CheckCircle2 },
    { href: "/admin/roadmap", label: "Roadmap", icon: Map },
    { href: "/admin/components", label: "Component Log", icon: Box },
    { href: "/admin/playground", label: "Playground", icon: FlaskConical },
    { href: "/admin/colors", label: "Color System", icon: Palette },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-stone-900 text-stone-200 flex-shrink-0 transition-all duration-300 relative sticky top-16 h-[calc(100vh-4rem)] flex flex-col`}>
        <div className="border-b border-stone-800 flex items-center flex-shrink-0 h-20 relative">
          <div className={`absolute left-6 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-xl font-bold text-white whitespace-nowrap">EU Stone Admin</h2>
            <p className="text-xs text-stone-500 whitespace-nowrap">Dev & Planning Portal</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-stone-400 hover:text-white hover:bg-stone-800 absolute transition-all duration-300 ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-6'}`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="space-y-2 p-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg transition-colors relative py-3 ${
                  isCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  active ? 'text-white bg-stone-800' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`truncate whitespace-nowrap transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0 absolute left-4 pointer-events-none' : 'opacity-100 ml-3'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

