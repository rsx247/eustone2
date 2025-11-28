"use client";

import { useState, useEffect } from "react";
import { Lock, LockOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Start with false to avoid hydration mismatch
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const checkLoginState = () => {
      const stored = localStorage.getItem('admin_logged_in');
      if (stored !== null) {
        setIsLoggedIn(stored === 'true');
      } else {
        // Default to logged in if no stored value
        setIsLoggedIn(true);
        localStorage.setItem('admin_logged_in', 'true');
      }
    };
    
    // Check immediately
    checkLoginState();
    
    // Listen for storage changes (e.g., from other tabs/components)
    window.addEventListener('storage', checkLoginState);
    
    return () => {
      window.removeEventListener('storage', checkLoginState);
    };
  }, []);

  // Save state to localStorage
  const toggleLogin = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    localStorage.setItem('admin_logged_in', String(newState));
    window.location.reload(); // Refresh to apply changes
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-stone-900 text-white p-2 rounded-full shadow-lg hover:bg-stone-800"
        title="Show Admin Bar"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-lg border-t-2 border-amber-500" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-sm font-medium">ADMIN MODE</span>
          </div>
          <div className="h-4 w-px bg-stone-600"></div>
          <div className="text-xs text-stone-400">
            Simulated User State
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-3 py-2">
            {isLoggedIn ? <LockOpen className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-red-400" />}
            <span className="text-sm font-medium">
              {isLoggedIn ? 'Logged In (Prices Visible)' : 'Guest (Catalog Mode)'}
            </span>
          </div>
          
          <Button
            size="sm"
            variant={isLoggedIn ? "destructive" : "default"}
            onClick={toggleLogin}
            className="font-medium"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-stone-400 hover:text-white transition-colors p-1"
            title="Hide Admin Bar"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}



