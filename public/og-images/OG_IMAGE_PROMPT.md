# Open Graph Image Generation Prompt

## Overview
Generate professional, branded Open Graph (OG) images for EUSTONE product pages and category pages. These images will be displayed when links are shared on social media platforms (Facebook, Twitter, LinkedIn, etc.).

## Image Specifications
- **Dimensions**: 1200 x 630 pixels (1.91:1 aspect ratio)
- **Format**: PNG or JPG (WebP for optimization)
- **File Size**: Under 300KB (optimized)
- **Text**: Must be readable at small sizes (minimum 24px font)

## Design Guidelines

### Brand Colors
- **Primary Blue**: EU Flag Blue `#003399` or `oklch(0.25 0.15 260)`
- **Accent Yellow**: EU Flag Yellow `#FFCC00` or `oklch(0.85 0.15 90)`
- **Background**: White or light stone gray
- **Text**: Dark stone gray or black for readability

### Typography
- **Logo**: EUSTONE with EU stars (use provided logo)
- **Product Name**: Bold, large (48-60px), dark text
- **Category/Price**: Medium (24-32px), secondary text
- **Font**: Sans-serif, modern (similar to Inter or system fonts)

## Image Types Needed

### 1. Default OG Image (Homepage)
**File**: `og-default.jpg`
**Content**:
- EUSTONE logo (top left or center)
- Tagline: "Premium Natural Stone & Tools"
- Background: Elegant marble or stone texture (subtle)
- Optional: Product silhouette or icon

### 2. Category OG Images
**Files**: `og-category-{slug}.jpg` (e.g., `og-category-marble.jpg`)
**Content**:
- Category name prominently displayed
- Representative product image or category icon
- EUSTONE logo (small, bottom corner)
- Color scheme matching category theme

**Categories to create**:
- Marble (`og-category-marble.jpg`)
- Granite (`og-category-granite.jpg`)
- Travertine (`og-category-travertin.jpg`)
- Quartzite (`og-category-quartzite.jpg`)
- Tools (`og-category-tools.jpg`)
- Sinks (`og-category-sinks.jpg`)
- Tiles (`og-category-tiles.jpg`)

### 3. Product OG Images (Dynamic)
**Generation**: These should be generated dynamically per product
**Template**:
- Product image (left side, 60% width)
- Product name (right side, large text)
- Price (if logged in) or "Login for Pricing"
- Category badge
- EUSTONE logo (small, bottom right)

## AI Generation Prompt

Use this prompt with DALL-E, Midjourney, or similar:

```
Create a professional Open Graph social media image for EUSTONE, a premium natural stone and tools e-commerce website.

Specifications:
- Dimensions: 1200x630 pixels, landscape orientation
- Style: Modern, clean, minimalist, luxury
- Color palette: EU Flag Blue (#003399), EU Flag Yellow (#FFCC00), white, light stone gray
- Layout: [Specify based on image type above]
- Typography: Bold, modern sans-serif, highly readable
- Branding: Include EUSTONE logo with EU stars
- Mood: Premium, professional, trustworthy, European quality

[Add specific details based on image type]
```

## Example Prompts by Type

### Default Homepage OG Image
```
Create a 1200x630px Open Graph image for EUSTONE homepage. 
Background: Subtle marble texture in light gray/white tones.
Center: EUSTONE logo with EU stars, large and prominent.
Below logo: Tagline "Premium Natural Stone & Tools" in dark gray.
Bottom right: Small decorative element (stone slab silhouette or tool icon).
Color scheme: EU Flag Blue accents, white background, elegant and minimal.
Style: Luxury e-commerce, professional, trustworthy.
```

### Category OG Image (Marble Example)
```
Create a 1200x630px Open Graph image for EUSTONE Marble category page.
Left side (60%): High-quality marble slab texture or pattern (Carrara, Calacatta, or elegant white/gray marble).
Right side (40%): 
  - Large text "MARBLE" in bold, dark gray
  - Subtitle "Premium Natural Stone" in smaller text
  - EUSTONE logo with EU stars (small, bottom)
Background: White or very light gray.
Accent: EU Flag Blue (#003399) for text or decorative elements.
Style: Luxury, elegant, showcasing the beauty of marble.
```

### Product OG Image Template
```
Create a 1200x630px Open Graph image template for EUSTONE product pages.
Layout: Split design
Left (60%): Product showcase area - placeholder for product image
Right (40%): 
  - Product name area (large, bold text)
  - Price area (medium text)
  - Category badge (small, rounded)
Bottom right: EUSTONE logo with EU stars (small, subtle)
Background: White or light stone gray
Accent colors: EU Flag Blue for highlights
Style: Clean, product-focused, professional e-commerce
Note: This is a template - product-specific images will overlay the left side, and text will be dynamically added to the right side.
```

## Assets Needed

1. **Logo Files** (already available):
   - `logo.svg` - Full color logo
   - `logo-white.svg` - White version for dark backgrounds
   - `logo.webp` - Optimized WebP version

2. **Category Icons** (optional):
   - Marble icon/silhouette
   - Granite icon/silhouette
   - Tool icon
   - Sink icon
   - Tile pattern

3. **Background Textures**:
   - Subtle marble texture (for default)
   - Stone texture variations (for categories)

## Implementation Notes

- Generate static images for homepage and categories
- Use dynamic generation for product OG images (combine template + product image)
- Optimize all images with WebP conversion
- Ensure text is readable at small sizes (test at 200px width)
- Maintain brand consistency across all OG images
- Consider dark mode variants if needed

## Tools Recommended

- **Design**: Figma, Canva, or Adobe Express
- **AI Generation**: DALL-E 3, Midjourney, Stable Diffusion
- **Optimization**: Sharp, ImageMagick, or online tools
- **Format Conversion**: Convert to WebP for best performance

