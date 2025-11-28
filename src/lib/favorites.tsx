"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string, productName?: string) => void;
  isFavorited: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId: string, productName?: string) => {
    setFavorites(current => {
      const isFavorited = current.includes(productId);
      if (isFavorited) {
        toast.info('Removed from favorites', {
          description: productName || 'Product'
        });
        return current.filter(id => id !== productId);
      } else {
        toast.success('Added to favorites', {
          description: productName || 'Product'
        });
        return [...current, productId];
      }
    });
  };

  const isFavorited = (productId: string) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}



