"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  categoryName: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity: number = 1) => {
    if (isAdding) return; // Prevent double calls
    
    setIsAdding(true);
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already in cart
        const updatedItems = currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated quantity: ${product.name}`, {
          description: `Now ${existingItem.quantity + quantity} in cart`
        });
        setTimeout(() => setIsAdding(false), 100);
        return updatedItems;
      } else {
        // Add new item
        let imageUrl = '/placeholder.jpg';
        try {
          const images = JSON.parse(product.images);
          if (Array.isArray(images) && images.length > 0) imageUrl = images[0];
        } catch (e) {}

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          quantity,
          unit: product.unit,
          image: imageUrl,
          categoryName: product.category?.name || 'Uncategorized'
        };
        
        toast.success('Added to cart', {
          description: product.name
        });
        setTimeout(() => setIsAdding(false), 100);
        return [...currentItems, newItem];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        toast.info('Removed from cart', {
          description: item.name
        });
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}



