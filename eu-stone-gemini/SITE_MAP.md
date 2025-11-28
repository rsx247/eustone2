# EU Stone - Complete Site Map & Access Guide

## 🗺️ **ALL PAGES & HOW TO ACCESS THEM**

### 🏠 **PUBLIC PAGES**

#### Homepage
- **URL**: `/` or `http://localhost:3003`
- **Access**: Click logo in header
- **Features**:
  - Hero carousel with 4 banners from original eustone.nl
  - Visual category grid (8 categories)
  - Featured Products (12 recent items)
  - Trust signals footer

#### Product Catalog
- **URL**: `/products`
- **Access**: Click "Products" in header
- **Features**:
  - 537 products, paginated (20 per page)
  - Advanced filters (Category, Source, Sort, In Stock)
  - Search bar
  - Smart thumbnails (consistent 4:3 aspect ratio)
  - Prices visible when logged in

#### Product Detail Page (PDP)
- **URL**: `/products/[slug]`
- **Access**: Click "View" on any product card
- **Features**:
  - Breadcrumbs (Home > Products > Category > Product)
  - Image gallery with thumbnail strip (up to 3 images)
  - Price & Add to Cart (for tools) OR Request Quote (for slabs)
  - Stock indicator
  - Related Products (4 items from same category)

#### Trade Account Registration
- **URL**: `/trade/register`
- **Access**: Click "Trade Account" in header
- **Features**:
  - Company details form
  - VAT & KVK number fields
  - Trade benefits explanation

---

### 🔐 **ADMIN PAGES** (Visible when logged in via Admin Bar)

#### Admin Products Manager
- **URL**: `/admin/products`
- **Access**: 
  1. Click "Login" in Admin Bar (bottom of page)
  2. Click "Admin" in header (appears after login)
- **Features**:
  - Table view of all 537 products
  - Filters: Category, Missing Data, Source
  - Edit button → goes to `/admin/products/[id]/edit`
  - "Check Source" button (opens Arsenius/Marmermarkt)
  - Verification status badges

#### Product Edit Page
- **URL**: `/admin/products/[id]/edit`
- **Access**: Click "Edit" icon in Admin Products table
- **Features**:
  - Full product form (name, slug, description, price, stock, category, unit)
  - Image manager (add/remove multiple images)
  - Verification toggle
  - "Check Source" button
  - Quick Actions sidebar

#### Admin Roadmap
- **URL**: `/admin/roadmap`
- **Access**: From Admin sidebar → "Roadmap"
- **Features**:
  - Future features list
  - Grouped by: Critical, UI/UX, Operations
  - Difficulty indicators (Easy, Medium, Hard)
  - Interactive checkboxes

#### Admin Components
- **URL**: `/admin/components`
- **Access**: From Admin sidebar → "Components"
- **Features**:
  - Component library documentation
  - Layout examples
  - UI patterns used in the project

#### Admin Playground
- **URL**: `/admin/playground`
- **Access**: From Admin sidebar → "Playground"
- **Features**:
  - Freight Shipping Estimator prototype
  - Quick Order Catalog prototype (dense table view)
  - Experimental features testing area

---

## 🎨 **COMPONENTS CREATED**

### Layout Components
- `Header` - Main navigation with logo, links, cart, user icons
- `AdminBar` - Simulated login toggle (bottom of page)
- `Breadcrumbs` - Navigation trail

### Product Components
- `FeaturedProducts` - Homepage product grid
- `ProductPageClient` - PDP main content
- `ProductCardSkeleton` - Loading placeholder
- `ProductGridSkeleton` - Grid of loading cards
- `CategoryCard` - Visual category cards

### Interactive Components
- `HeroCarousel` - Auto-playing banner carousel
- `QuoteRequestButton` - Modal form for quote requests

### Utility
- `thumbnail-utils.ts` - Consistent aspect ratio logic
- `auth.ts` - Simulated authentication context
- `categories.ts` - Category helper functions

---

## 🔌 **API ENDPOINTS**

### `/api/products`
- **Method**: GET
- **Query Params**: `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `inStock`, `source`, `sortBy`, `sortOrder`
- **Returns**: Paginated products + pagination metadata

### `/api/products/[id]`
- **Methods**: GET, PATCH, DELETE
- **Usage**: Fetch/update/delete individual product

### `/api/categories`
- **Method**: GET
- **Returns**: All categories (for dropdowns)

### `/api/quote-request`
- **Method**: POST
- **Body**: Customer details, product info, quantity, message
- **Returns**: Success confirmation (logs to console for now)

---

## 📊 **DATABASE**

### Tables
- `Product` (537 rows)
  - Fields: id, name, slug, description, price, stock, categoryId, unit, images, source, legacyCategoryId, verified, createdAt, updatedAt
- `Category` (8 rows)
  - Fields: id, name, slug, createdAt, updatedAt

### Seeding
- **Command**: `npm run seed` (from `/prisma/seed.ts`)
- **Source**: `Full Live Database Export SQL 20102025-1113.sql`
- **Images**: 877 images in `/public/images/legacy/`

---

## 🚀 **HOW TO TEST EVERYTHING**

### Step 1: Start the Dev Server
```bash
cd /Users/admin/.cursor/worktrees/niks/jzw/eu-stone-gemini
npm run dev
```

### Step 2: Test Public Pages
1. Visit `http://localhost:3003` → Homepage
2. Click "Products" → Catalog
3. Click "Show Filters" → Try filters
4. Click any product "View" button → PDP
5. On PDP, click thumbnail images → Image gallery
6. Scroll down → Related Products

### Step 3: Test Catalog Mode
1. Logout via Admin Bar
2. Visit `/products` → Prices should be hidden ("Login for price")
3. Visit any PDP → "Login to Order" / "Login to Request Quote"

### Step 4: Test Admin Features
1. Click "Login" in Admin Bar
2. Header should now show "Admin" link
3. Click "Admin" → Admin Products Manager
4. Click edit icon on any product → Product Edit Page
5. Change something → Click "Save Changes"
6. Use Admin sidebar to visit Roadmap, Components, Playground

### Step 5: Test Quote Request
1. Visit a sink product (e.g., "Afyon Bewolkt Witte Hammam Gootsteen")
2. Click "Add to Cart" OR "Request Quote" (depending on product type)
3. If it's a quote request, fill out the form
4. Submit → Check browser console for logged quote data

---

## 🎯 **BIGGER PICTURE OBJECTIVE**

### Original Goal
Build a **production-ready multi-vendor stone & tile marketplace** with:
- ✅ All ~750 products from SQL database
- ✅ Catalog mode (prices hidden until login)
- ✅ Quote request system for slabs
- ✅ Add to cart for tools
- ✅ Admin tools for data verification and bulk editing
- ✅ Professional, wholesale-focused design
- ⚠️ **INCOMPLETE**: Many products still using placeholder images

### Current Status (Nov 27, 2025)
- **537 products** imported and live
- **877 product images** extracted and stored
- ⚠️ **Image Mapping Issue**: Many products not correctly linked to their images
  - Placeholder images still showing for many products
  - Need to improve image matching logic in seed script

### Phase 1 Complete ✅
- [x] Product catalog with pagination
- [x] Advanced filters & search
- [x] Catalog mode (login-gated pricing)
- [x] Product edit interface
- [x] Quote request system
- [x] Image galleries
- [x] Breadcrumbs & related products
- [x] Admin access via header

### Phase 2 In Progress ⚠️
- [ ] **FIX PLACEHOLDER IMAGES** (TOP PRIORITY)
- [ ] Shopping cart for tools
- [ ] Real authentication (replace localStorage simulation)
- [ ] Email integration for quote requests

### Phase 3 Planned
- [ ] Inventory sync with Arsenius/Marmermarkt
- [ ] Product variants
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 🐛 **KNOWN ISSUES**

1. **Placeholder Images**: Many products show `/placeholder.jpg` instead of actual images
   - **Cause**: Image paths in database don't match filenames in `/public/images/legacy/`
   - **Fix**: Improve seed script image matching logic

2. **Simulated Auth**: Using localStorage for login state (not production-ready)
   - **Fix**: Implement NextAuth.js or Clerk

3. **Quote Requests**: Only console.log, no email sent
   - **Fix**: Integrate SendGrid or Resend

4. **Missing Features**: Cart, checkout, payments not implemented
   - **Fix**: Phase 2 development

---

## 📁 **FILE STRUCTURE**

```
eu-stone-gemini/
├── src/
│   ├── app/
│   │   ├── page.tsx (Homepage)
│   │   ├── products/
│   │   │   ├── page.tsx (Catalog)
│   │   │   └── [slug]/page.tsx (PDP)
│   │   ├── admin/
│   │   │   ├── layout.tsx (Admin sidebar)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx (Product Manager)
│   │   │   │   └── [id]/edit/page.tsx (Edit Page)
│   │   │   ├── roadmap/page.tsx
│   │   │   ├── components/page.tsx
│   │   │   └── playground/page.tsx
│   │   ├── trade/register/page.tsx
│   │   └── api/
│   │       ├── products/route.ts
│   │       ├── products/[id]/route.ts
│   │       ├── categories/route.ts
│   │       └── quote-request/route.ts
│   ├── components/
│   │   ├── header.tsx
│   │   ├── admin-bar.tsx
│   │   ├── hero-carousel.tsx
│   │   ├── category-card.tsx
│   │   ├── featured-products.tsx
│   │   ├── product-page-client.tsx
│   │   ├── quote-request-button.tsx
│   │   ├── breadcrumbs.tsx
│   │   ├── product-skeleton.tsx
│   │   └── ui/ (Shadcn components)
│   └── lib/
│       ├── auth.ts (Auth context)
│       ├── thumbnail-utils.ts (Image logic)
│       └── prisma.ts (DB client)
├── prisma/
│   ├── schema.prisma (Database schema)
│   └── seed.ts (Import script)
├── public/
│   └── images/
│       └── legacy/ (877 product images)
└── RECOMMENDATIONS.md (Future roadmap)
```

---

## ✅ **QUICK ACCESS CHECKLIST**

- [ ] Can access homepage: `http://localhost:3003` ✓
- [ ] Can access catalog: `/products` ✓
- [ ] Can access PDPs: Click any product ✓
- [ ] Can access Admin: Login via Admin Bar → Click "Admin" in header ✓
- [ ] Can edit products: Admin → Products → Click Edit icon ✓
- [ ] Can request quotes: Visit any PDP → Click "Request Quote" ✓
- [ ] All components documented: See "Components Created" section ✓
- [ ] All API endpoints listed: See "API Endpoints" section ✓

---

*Last Updated: Nov 27, 2025 - 22:00*





