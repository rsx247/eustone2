/**
 * Placeholder stock data utility
 * Since stock is not being tracked yet, this generates dummy stock warnings
 * for 10-15% of products to demonstrate the feature.
 */

type StockWarning = {
  show: boolean;
  stock: number;
  message: string;
  variant: 'low' | 'critical' | 'limited';
};

const STOCK_MESSAGE_VARIATIONS = {
  low: [
    "Only {count} left!",
    "Just {count} remaining",
    "{count} units in stock",
    "Limited: {count} left",
    "Only {count} available",
  ],
  critical: [
    "Hurry! Only {count} left!",
    "Last {count} in stock!",
    "⚠️ Only {count} remaining!",
    "Final {count} units!",
    "Almost gone! {count} left",
  ],
  limited: [
    "Limited stock: {count}",
    "{count} units available",
    "Stock: {count}",
    "{count} in warehouse",
  ],
};

/**
 * Generates a deterministic placeholder stock warning for a product
 * Uses product ID to ensure consistent results (same product always gets same warning)
 */
export function getPlaceholderStockWarning(productId: string): StockWarning {
  // Use product ID to create a deterministic hash
  // This ensures the same product always gets the same stock status
  const hash = simpleHash(productId);
  
  // Only show stock warnings for 10-15% of products (12.5% average)
  const shouldShow = (hash % 8) === 0; // ~12.5% chance
  
  if (!shouldShow) {
    return { show: false, stock: 0, message: '', variant: 'low' };
  }

  // Determine stock level and variant
  const stockLevel = hash % 3;
  let stock: number;
  let variant: 'low' | 'critical' | 'limited';

  if (stockLevel === 0) {
    // Critical: 1-3 units
    stock = (hash % 3) + 1;
    variant = 'critical';
  } else if (stockLevel === 1) {
    // Low: 4-5 units
    stock = (hash % 2) + 4;
    variant = 'low';
  } else {
    // Limited: 6-10 units
    stock = (hash % 5) + 6;
    variant = 'limited';
  }

  // Select message variation based on hash
  const messages = STOCK_MESSAGE_VARIATIONS[variant];
  const messageIndex = hash % messages.length;
  const messageTemplate = messages[messageIndex];
  const message = messageTemplate.replace('{count}', stock.toString());

  return {
    show: true,
    stock,
    message,
    variant,
  };
}

/**
 * Simple hash function for deterministic results
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get badge color class based on stock variant
 */
export function getStockBadgeClass(variant: 'low' | 'critical' | 'limited'): string {
  switch (variant) {
    case 'critical':
      return 'bg-red-600 text-white';
    case 'low':
      return 'bg-amber-600 text-white';
    case 'limited':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-stone-600 text-white';
  }
}

