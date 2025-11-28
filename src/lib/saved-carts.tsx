"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface SavedCart {
  id: string;
  name: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
  shareToken?: string;
}

interface SavedCartsContextType {
  savedCarts: SavedCart[];
  saveCart: (name: string, items: any[]) => string; // Returns cart ID
  loadCart: (cartId: string) => SavedCart | null;
  deleteCart: (cartId: string) => void;
  getShareableLink: (cartId: string) => string;
  loadCartFromToken: (token: string) => SavedCart | null;
}

const SavedCartsContext = createContext<SavedCartsContextType | undefined>(undefined);

export function SavedCartsProvider({ children }: { children: ReactNode }) {
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);

  // Load saved carts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_carts');
      if (saved) {
        try {
          setSavedCarts(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load saved carts:', e);
        }
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('saved_carts', JSON.stringify(savedCarts));
    }
  }, [savedCarts]);

  const saveCart = (name: string, items: any[]): string => {
    const cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // Use encodeURIComponent to handle Unicode characters, then base64
    const jsonString = JSON.stringify({ cartId, items });
    const encoded = encodeURIComponent(jsonString);
    const shareToken = btoa(encoded).replace(/[+/=]/g, (m) => {
      return { '+': '-', '/': '_', '=': '' }[m] || m;
    });
    
    const newCart: SavedCart = {
      id: cartId,
      name,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shareToken,
    };

    setSavedCarts(prev => [...prev, newCart]);
    toast.success('Cart saved', {
      description: `"${name}" has been saved`
    });
    
    return cartId;
  };

  const loadCart = (cartId: string): SavedCart | null => {
    const cart = savedCarts.find(c => c.id === cartId);
    if (cart) {
      toast.success('Cart loaded', {
        description: `"${cart.name}" has been loaded`
      });
    }
    return cart || null;
  };

  const deleteCart = (cartId: string) => {
    const cart = savedCarts.find(c => c.id === cartId);
    setSavedCarts(prev => prev.filter(c => c.id !== cartId));
    if (cart) {
      toast.info('Cart deleted', {
        description: `"${cart.name}" has been deleted`
      });
    }
  };

  const getShareableLink = (cartId: string): string => {
    const cart = savedCarts.find(c => c.id === cartId);
    if (cart && cart.shareToken) {
      return `${typeof window !== 'undefined' ? window.location.origin : ''}/cart/shared/${cart.shareToken}`;
    }
    return '';
  };

  const loadCartFromToken = (token: string): SavedCart | null => {
    try {
      const base64 = token.replace(/[-_]/g, (m) => {
        return { '-': '+', '_': '/' }[m] || m;
      });
      const decoded = atob(base64);
      const jsonString = decodeURIComponent(decoded);
      const data = JSON.parse(jsonString);
      return {
        id: data.cartId,
        name: 'Shared Cart',
        items: data.items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shareToken: token,
      };
    } catch (e) {
      console.error('Failed to load cart from token:', e);
      return null;
    }
  };

  return (
    <SavedCartsContext.Provider value={{ savedCarts, saveCart, loadCart, deleteCart, getShareableLink, loadCartFromToken }}>
      {children}
    </SavedCartsContext.Provider>
  );
}

export function useSavedCarts() {
  const context = useContext(SavedCartsContext);
  if (context === undefined) {
    throw new Error('useSavedCarts must be used within a SavedCartsProvider');
  }
  return context;
}

