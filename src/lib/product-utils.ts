/**
 * Product utility functions for consistent data checking
 */

/**
 * Check if a product has real images (not placeholder)
 * This is the SINGLE SOURCE OF TRUTH for image detection
 */
export function hasRealImages(imagesString: string): boolean {
  if (!imagesString) return false;
  
  try {
    const images = JSON.parse(imagesString);
    if (!Array.isArray(images) || images.length === 0) return false;
    
    // Check if any image is a real image (not placeholder)
    return images.some((img: string) => {
      if (!img || typeof img !== 'string') return false;
      const imgLower = img.toLowerCase();
      return !imgLower.includes('placeholder') && 
             !imgLower.includes('unsplash') &&
             !imgLower.includes('picsum');
    });
  } catch (e) {
    return false;
  }
}

/**
 * Get the first real image from a product's images string
 */
export function getFirstRealImage(imagesString: string): string | null {
  if (!imagesString) return null;
  
  try {
    const images = JSON.parse(imagesString);
    if (!Array.isArray(images)) return null;
    
    const realImage = images.find((img: string) => {
      if (!img || typeof img !== 'string') return false;
      const imgLower = img.toLowerCase();
      return !imgLower.includes('placeholder') && 
             !imgLower.includes('unsplash') &&
             !imgLower.includes('picsum');
    });
    
    return realImage || '/placeholder.jpg';
  } catch (e) {
    return '/placeholder.jpg';
  }
}

