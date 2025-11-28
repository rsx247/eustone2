import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-stone-500 mb-6">
      <Link href="/" className="hover:text-stone-900 transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1 text-stone-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-stone-900 transition-colors text-stone-500">
              {item.label}
            </Link>
          ) : (
            <span className="text-stone-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}



