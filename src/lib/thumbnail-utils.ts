/**
 * Smart Thumbnail Display System
 * 
 * Default Behavior: 1:1 (square) with cover (crop to fill)
 * Exception: Only "Titan Prof Tile Level Voetstuk" products use 4:3 with contain
 * Override: Product-level settings can bypass defaults
 */

interface ThumbnailStyle {
  container: string;  // Tailwind aspect ratio class
  image: string;      // object-fit class
  padding: string;    // padding class
}

/**
 * Checks if product is the specific Titan Voetstuk product that needs 4:3 aspect ratio
 */
function isTitanVoetstukProduct(productName: string): boolean {
  const name = productName.toLowerCase();
  // Only match the exact Titan Prof Tile Level Voetstuk products
  return name.includes('titan prof tile level voetstuk');
}

/**
 * Auto-detects optimal aspect ratio from actual image
 * Returns: 'square' | 'portrait' | 'landscape' | 'wide'
 */
async function detectImageAspectRatio(imageUrl: string): Promise<string> {
  // This would need to run server-side or use Image.onLoad client-side
  // For now, return based on file analysis patterns
  if (typeof window === 'undefined') return 'square';
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      
      if (ratio >= 1.7) resolve('wide');        // 16:9 or wider
      else if (ratio >= 1.2) resolve('landscape'); // 4:3 ish
      else if (ratio >= 0.9 && ratio <= 1.1) resolve('square'); // 1:1 ish
      else resolve('portrait');                 // 3:4 or taller
    };
    img.onerror = () => resolve('square'); // Fallback
    img.src = imageUrl;
  });
}

/**
 * Get thumbnail styling based on product settings or smart defaults
 */
export function getThumbnailClass(
  categoryName: string, 
  productName: string,
  overrideAspectRatio?: string | null,
  overrideFit?: string | null
): ThumbnailStyle {
  // OVERRIDE: If product has manual settings, use those
  if (overrideAspectRatio && overrideAspectRatio !== 'auto') {
    const fitMode = overrideFit || 'cover';
    
    const aspectClasses: Record<string, string> = {
      'square': 'aspect-square',
      'portrait': 'aspect-[3/4]',
      'landscape': 'aspect-[4/3]',
      'wide': 'aspect-video',
    };
    
    return {
      container: aspectClasses[overrideAspectRatio] || 'aspect-square',
      image: fitMode === 'contain' ? 'object-contain' : 'object-cover',
      padding: fitMode === 'contain' ? 'p-2' : 'p-0'
    };
  }
  
  // EXCEPTION: Only Titan Prof Tile Level Voetstuk products use 4:3
  if (isTitanVoetstukProduct(productName)) {
    return {
      container: 'aspect-[4/3]',
      image: 'object-contain',
      padding: 'p-2'
    };
  }
  
  // DEFAULT: Square 1:1 with cover (crop to fill) for all other products
  return {
    container: 'aspect-square',
    image: 'object-cover',
    padding: 'p-0'
  };
}

/**
 * Get aspect ratio options for dropdown
 */
export const ASPECT_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto-Detect' },
  { value: 'square', label: 'Square (1:1)' },
  { value: 'portrait', label: 'Portrait (3:4)' },
  { value: 'landscape', label: 'Landscape (4:3)' },
  { value: 'wide', label: 'Wide (16:9)' },
];

export const FIT_OPTIONS = [
  { value: 'cover', label: 'Cover (Fill & Crop)' },
  { value: 'contain', label: 'Contain (Show Full)' },
];

/**
 * Analyze image and suggest optimal settings
 */
export async function suggestThumbnailSettings(
  imageUrl: string,
  productName: string,
  categoryName: string
): Promise<{ aspectRatio: string; fit: string; reason: string }> {
  // Check for Titan Voetstuk exception
  if (isTitanVoetstukProduct(productName)) {
    return {
      aspectRatio: 'landscape',
      fit: 'contain',
      reason: 'Titan Prof Tile Level Voetstuk product - using landscape + contain to show full label'
    };
  }
  
  // For client-side detection
  if (typeof window !== 'undefined') {
    const detected = await detectImageAspectRatio(imageUrl);
    return {
      aspectRatio: detected === 'square' ? 'square' : 'square', // Force square for consistency
      fit: 'cover',
      reason: 'Default: square with cover for consistent card heights'
    };
  }
  
  return {
    aspectRatio: 'square',
    fit: 'cover',
    reason: 'Default: square with cover for consistent card heights'
  };
}
