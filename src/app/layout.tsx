import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminBar } from "@/components/admin-bar";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { RecentlyViewedProvider } from "@/lib/recently-viewed";
import { SavedCartsProvider } from "@/lib/saved-carts";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EU Stone - Wholesale Stone & Tile Marketplace",
  description: "Premium natural stone, tiles, and tools for trade professionals",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <RecentlyViewedProvider>
                <SavedCartsProvider>
                  <Header />
                  <div className="flex-grow">
                    {children}
                  </div>
                  <SiteFooter />
                  <AdminBar />
                  <Toaster 
                    position="top-right" 
                    richColors 
                    closeButton
                    offset={80}
                  />
                </SavedCartsProvider>
              </RecentlyViewedProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
