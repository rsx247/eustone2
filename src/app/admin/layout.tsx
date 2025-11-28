import Link from "next/link";
import { LayoutDashboard, Map, Box, FlaskConical, CheckCircle2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-200 flex-shrink-0">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-xl font-bold text-white">EU Stone Admin</h2>
          <p className="text-xs text-stone-500">Dev & Planning Portal</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors text-white bg-stone-800"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Box className="w-5 h-5" /> Products
          </Link>
          <Link 
            href="/admin/verify" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" /> Verification
          </Link>
          <Link 
            href="/admin/roadmap" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Map className="w-5 h-5" /> Roadmap
          </Link>
          <Link 
            href="/admin/components" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Box className="w-5 h-5" /> Component Log
          </Link>
          <Link 
            href="/admin/playground" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <FlaskConical className="w-5 h-5" /> Playground
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

