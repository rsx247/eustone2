# EU Stone - Master Development Plan

## 1. Vision & Strategy
A specialized B2B/B2C marketplace for natural stone and tools. Unlike standard e-commerce, this platform must handle the complexities of heavy freight, trade verification, and variable stock attributes (lots, block origins).

**Core Focus**: 
- **For Fabricators/Architects**: Efficiency, technical data, trade pricing.
- **For Retail**: Inspiration, trust, visual quality.

## 2. Revised Roadmap (Integrated Analysis)

### Phase 1: Technical Core & Architecture
- [x] **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- [ ] **Database Schema**: Specialized for Stone.
    - *Products*: Add fields for `Block Origin`, `Lot Number`, `Thickness Tolerance`, `Finishes`.
    - *Users*: Distinct tables for `Trade_Profile` (VAT/KVK, Credit Limits) vs `Public_User`.
- [ ] **Auth System**: Role-based access control (Admin, Vendor, Verified Trade, Guest).

### Phase 2: The "True Customer" Experience (UX Redesign)
- [ ] **Homepage Redesign**:
    - Remove generic carousels.
    - Implement "Persona Entry Points": *For Fabricators*, *For Designers*, *For Homeowners*.
- [ ] **Product Detail Page (PDP) Overhaul**:
    - Dynamic "Request Quote" vs "Add to Cart" buttons based on user type/product weight.
    - Downloadable Specs (PDF generation).
    - High-res Gallery (Slab full view + Close-up + Edge detail).
- [ ] **Search & Discovery**:
    - Filters for: `Availability (Live Stock)`, `Dimensions`, `Finish`, `Application`.

### Phase 3: Business Logic & Operations
- [ ] **Trade Gating System**:
    - Registration form with VAT/KVK validation.
    - "Price Tiering": Public MSRP vs. Trade Pricing (hidden until login).
- [ ] **Complex Checkout/RFQ**:
    - Logic to split orders: "Tools" (Parcel shipping) vs "Slabs" (Freight Request).
    - Shipping Estimator: Inputs for "Liftgate required", "Forklift available".
- [ ] **Inventory Management**:
    - "Reserve Lot" functionality for architects holding stone for projects.

### Phase 4: Vendor & Trust Ecosystem
- [ ] **Vendor Profiles**: 
    - Showroom locations, Real verified reviews, Completed project portfolios.
- [ ] **Multi-Vendor Marketplace**:
    - Vendor Zone with vendor login, "Become a vendor" registration, "All Vendors" browse page.
    - Vendor profiles with store name, logo, product count, review count, "Chat with vendor" button.
    - "More from this store" sections on product pages.
    - Vendor analytics dashboard (sales, product performance, customer insights).
- [ ] **Vendor Chat/Messaging System**:
    - Real-time chat between buyers and sellers, "Chat with vendor" button on product pages.
    - Message notifications, chat history in user dashboard, vendor response time tracking.
- [ ] **Product Reviews & Ratings**:
    - Star ratings (0-5), written reviews, review count display, verified purchase badges.
    - Review moderation, vendor responses, review aggregation.
- [ ] **Order Tracking System**:
    - Order status page, status updates (Processing → Shipped → Delivered).
    - Shipping carrier integration, email notifications on status changes.
- [ ] **Logistics Integration**:
    - Order tracking with milestones (e.g., "Slab Cut", "Crated", "Shipped").

### Phase 5: Growth & Optimization
- [ ] **Multi-Language Support (i18n)**:
    - 13 languages (EN, NL, IT, ES, DE, FR, RU, PT, PL, GR, HU, SE, DK).
    - Language switcher in header, full site translation, SEO-friendly language routing.
- [ ] **Email Notifications**:
    - Order confirmations, shipping notifications, price drop alerts, new product notifications.
- [ ] **Social Sharing**:
    - Share buttons on product pages, social media integration for marketing.
- [ ] **Brand Pages**:
    - Brand navigation, brand filtering, brand-specific product pages, brand logos on products.
- [ ] **Promotions & Discounts**:
    - Discount codes, percentage off, bulk pricing, automatic trade discounts for verified trade accounts.
- [ ] **Advanced Product Filters**:
    - Price range slider, brand filter, vendor filter, multiple filter combinations, sort by popularity.
- [ ] **Advanced Search**:
    - Search suggestions/autocomplete, search by SKU, search by brand, recent searches, popular searches.
- [ ] **Product Comparison**:
    - Compare products side-by-side, feature comparison table, "Add to compare" button.
- [ ] **SEO**: Localized landing pages ("Marble Slabs Rotterdam").
- [ ] **Performance**: Edge caching for images to ensure instant loading of heavy textures.

## 3. Technical Dependencies
- **Frontend**: React / Next.js / Shadcn UI
- **Backend**: Node.js / Server Actions
- **Database**: PostgreSQL (Supabase/Neon) + Prisma ORM
- **Storage**: AWS S3 or R2 (for high-res slab images)
- **Payments**: Stripe (for tools/samples) + Invoicing System (for slabs)

