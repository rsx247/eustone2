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
- [ ] **Cart Management**:
    - Save cart functionality: Allow users to save cart state (localStorage or user account).
    - Share cart functionality: Generate shareable cart links/QR codes for collaboration (e.g., architects sharing selections with clients).
- [ ] **Inventory Management**:
    - "Reserve Lot" functionality for architects holding stone for projects.

### Phase 4: Vendor & Trust Ecosystem
- [ ] **Vendor Profiles**: 
    - Showroom locations, Real verified reviews, Completed project portfolios.
- [ ] **Logistics Integration**:
    - Order tracking with milestones (e.g., "Slab Cut", "Crated", "Shipped").

### Phase 5: Growth & Optimization
- [ ] **SEO**: Localized landing pages ("Marble Slabs Rotterdam").
- [ ] **Performance**: Edge caching for images to ensure instant loading of heavy textures.
- [ ] **Product Description Quality**:
    - Cleaning/improving product descriptions: Standardize formatting, remove HTML artifacts, ensure consistent structure.
    - Auto-formatting tool for bulk description updates.
    - Description templates by product category.
    - Rich text editor for admin product management with preview.

## 3. Technical Dependencies
- **Frontend**: React / Next.js / Shadcn UI
- **Backend**: Node.js / Server Actions
- **Database**: PostgreSQL (Supabase/Neon) + Prisma ORM
- **Storage**: AWS S3 or R2 (for high-res slab images)
- **Payments**: Stripe (for tools/samples) + Invoicing System (for slabs)

