"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
  
  export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { itemCount, items } = useCart();
    const { favorites } = useFavorites();
    const prevItemCountRef = useRef(0);
    const prevFavoritesCountRef = useRef(0);
    const cartIconRef = useRef<HTMLDivElement>(null);
    const heartIconRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
    }, []);

    // Ripple wave animation with high pitch sound
    const playRippleAnimation = (iconRef: React.RefObject<HTMLDivElement | null>, color: string) => {
      if (!iconRef.current) return;
      
      // Play high pitch sound (1200Hz)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
      } catch (e) {
        // Fallback if audio context fails
      }

      // Create ripple effect
      const icon = iconRef.current;
      const ripple = document.createElement('span');
      const rect = icon.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (rect.width / 2 - size / 2) + 'px';
      ripple.style.top = (rect.height / 2 - size / 2) + 'px';
      ripple.className = `absolute rounded-full ${color} animate-ping pointer-events-none`;
      ripple.style.animationDuration = '600ms';
      
      icon.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    // Trigger animation when cart count increases
    useEffect(() => {
      if (itemCount > prevItemCountRef.current && prevItemCountRef.current > 0) {
        playRippleAnimation(cartIconRef, 'bg-blue-400/30');
      }
      prevItemCountRef.current = itemCount;
    }, [itemCount]);

    // Trigger animation when favorites count increases
    useEffect(() => {
      if (favorites.length > prevFavoritesCountRef.current && prevFavoritesCountRef.current > 0) {
        playRippleAnimation(heartIconRef, 'bg-red-400/30');
      }
      prevFavoritesCountRef.current = favorites.length;
    }, [favorites.length]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-32">
          <Image 
            src="/logo.webp" 
            alt="EU Stone Logo" 
            fill
            className="object-contain"
            priority
          />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <Link 
            href="/products" 
            className="transition-colors hover:text-stone-900 text-stone-500"
          >
            Products
          </Link>
          <Link 
            href="/products?category=tools" 
            className="transition-colors hover:text-stone-900 text-stone-500"
          >
            Tools
          </Link>
          <Link 
            href="/products?category=tiles" 
            className="transition-colors hover:text-stone-900 text-stone-500"
          >
            Tiles
          </Link>
          <Link 
            href="/trade/register" 
            className="transition-colors hover:text-stone-900 text-stone-500"
          >
            Trade Account
          </Link>
          {isLoggedIn && (
            <Link 
              href="/admin" 
              className="transition-colors hover:text-stone-900 text-stone-500"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex relative group">
            <Link href="/favorites">
              <div ref={heartIconRef} className="relative w-5 h-5">
                <Heart className={`h-5 w-5 transition-all duration-300 ${
                  favorites.length > 0 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-stone-600 group-hover:text-red-500 group-hover:scale-110 group-active:scale-95'
                }`} />
              </div>
              {favorites.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 animate-in zoom-in-50 duration-300">
                  {favorites.length}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex relative group">
            <Link href="/cart">
              <div ref={cartIconRef} className="relative w-5 h-5">
                <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${
                  itemCount > 0 
                    ? 'text-blue-600' 
                    : 'text-stone-600 group-hover:text-blue-600 group-hover:scale-110 group-active:scale-95'
                }`} />
              </div>
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 animate-in zoom-in-50 duration-300">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={isLoggedIn ? "/account" : "/login"}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto flex flex-col space-y-3 px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              href="/products" 
              className="text-sm font-medium transition-colors hover:text-blue-600 text-stone-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/products?category=tools" 
              className="text-sm font-medium transition-colors hover:text-blue-600 text-stone-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link 
              href="/products?category=tiles" 
              className="text-sm font-medium transition-colors hover:text-blue-600 text-stone-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tiles
            </Link>
            <Link 
              href="/trade/register" 
              className="text-sm font-medium transition-colors hover:text-blue-600 text-stone-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trade Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

