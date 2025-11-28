/**
 * Smart Thumbnail Display System with Auto-Detection
 * 
 * Default Behavior: 1:1 (square) with cover (crop to fill)
 * Exception: Products with text/labels use 4:3 with contain (show full image)
 * Override: Product-level settings can bypass defaults
 */

interface ThumbnailStyle {
  container: string;  // Tailwind aspect ratio class
  image: string;      // object-fit class
  padding: string;    // padding class
}

/**
 * Detects if a product likely has text/labels based on name patterns
 */
function hasTextLabel(productName: string, categoryName: string): boolean {
  const name = productName.toLowerCase();
  const cat = categoryName.toLowerCase();
  
  // Common text-heavy product patterns
  const textPatterns = [
    'titan prof',     // Titan Professional tools
    'ox trade',       // OX Trade branded items
    'kalekim',        // Kalekim products
    'schonox',        // Schonox products
    'eltex',          // Eltex profiles
    'tegelkruis',     // Tile spacers
    'tegelprofiel',   // Tile profiles
    'lijm',           // Adhesives
    'kit',            // Sealants
    'profiel',        // Profiles
    'spaan',          // Trowels
  ];
  
  return textPatterns.some(pattern => name.includes(pattern));
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
  
  // SMART DEFAULT: Check if product has text labels
  if (hasTextLabel(productName, categoryName)) {
    // Text-heavy products: use 4:3 with contain to show full label
    return {
      container: 'aspect-[4/3]',
      image: 'object-contain',
      padding: 'p-2'
    };
  }
  
  // DEFAULT: Square 1:1 with cover (crop to fill)
  return {
    container: 'aspect-square',
    image: 'object-cover',
    padding: 'p-1'
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
  const hasText = hasTextLabel(productName, categoryName);
  
  if (hasText) {
    return {
      aspectRatio: 'landscape',
      fit: 'contain',
      reason: 'Product has text/labels - using landscape + contain to prevent cropping'
    };
  }
  
  // For client-side detection
  if (typeof window !== 'undefined') {
    const detected = await detectImageAspectRatio(imageUrl);
    return {
      aspectRatio: detected,
      fit: detected === 'square' ? 'cover' : 'contain',
      reason: `Detected ${detected} aspect ratio from image analysis`
    };
  }
  
  return {
    aspectRatio: 'square',
    fit: 'cover',
    reason: 'Default: square with cover'
  };
}
