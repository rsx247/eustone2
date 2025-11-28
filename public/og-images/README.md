# OG Images Directory

This directory contains Open Graph images for social media sharing.

## Structure

- `og-default.jpg` - Default OG image for homepage
- `og-category-{slug}.jpg` - Category-specific OG images
- `og-product-{id}.jpg` - Product-specific OG images (generated dynamically)

## Usage

OG images are referenced in:
- `src/app/layout.tsx` - Default metadata
- `src/app/products/[slug]/page.tsx` - Product pages
- `src/app/products/page.tsx` - Category pages

## Generation

See `OG_IMAGE_PROMPT.md` for detailed prompts and specifications for generating these images.

## Optimization

All images should be:
- 1200x630 pixels
- WebP format (with JPG fallback)
- Under 300KB
- Optimized with sharp or similar tools

