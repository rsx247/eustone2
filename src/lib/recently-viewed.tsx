"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RecentlyViewedContextType {
  recentlyViewed: string[]; // Array of product IDs
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 10; // Maximum number of products to track

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recently_viewed');
      if (saved) {
        try {
          setRecentlyViewed(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load recently viewed:', e);
        }
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(current => {
      // Remove if already exists (to move to front)
      const filtered = current.filter(id => id !== productId);
      // Add to beginning and limit to MAX_RECENTLY_VIEWED
      return [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

