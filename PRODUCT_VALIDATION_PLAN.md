# 🔍 Product Validation & Backend Improvement Plan

## Current Issues

### 1. **Empty Stone Categories**
- Marble, Granite, Onyx, Quartzite, Travertin have **no products**
- All natural stone products are being categorized as Tools/Sinks/Tiles

### 2. **Categorization Logic Problems**
The seed script **only** checks for:
- Tools keywords (bouwemmer, tegelkruis, lijm, etc.)
- Sinks keywords (wasbak, wastafel, hammam)
- Tiles keywords (tegel, tile)

**Missing**: Natural stone keyword detection (marmer, graniet, travertijn, onyx, etc.)

### 3. **Source Metadata** (Already Implemented ✅)
- `source` field exists: "Arsenius", "Marmermarkt", "Unknown"
- Can use this to re-scrape from original sources

---

## 🎯 **Action Plan**

### **Phase 1: Fix Categorization Logic** (Immediate)

#### Problem in seed.ts (lines 154-207):
```typescript
// Current logic ONLY checks:
if (lowerName.includes('tool keywords')) → Tools
if (lowerName.includes('sink keywords')) → Sinks  
if (lowerName.includes('tile keywords')) → Tiles
// MISSING: Stone type detection!
```

#### Solution: Add stone type detection BEFORE tool/sink/tile check

```typescript
// PRIORITY 1: Natural Stone Detection (should come FIRST)
if (!prismaCatId) {
  // Marble
  if (lowerName.includes('marmer') || lowerName.includes('marble')) {
    prismaCatId = await getCategoryId('marble');
    marbleCount++;
  }
  // Travertine
  else if (lowerName.includes('travertin') || lowerName.includes('travertine')) {
    prismaCatId = await getCategoryId('travertin');
    travertinCount++;
  }
  // Granite
  else if (lowerName.includes('graniet') || lowerName.includes('granite')) {
    prismaCatId = await getCategoryId('granite');
    graniteCount++;
  }
  // Onyx
  else if (lowerName.includes('onyx')) {
    prismaCatId = await getCategoryId('onyx');
    onyxCount++;
  }
  // Quartzite
  else if (lowerName.includes('quartzite') || lowerName.includes('kwartsiet')) {
    prismaCatId = await getCategoryId('quartzite');
    quartziteCount++;
  }
}

// PRIORITY 2: Then check for Tools/Sinks/Tiles (existing logic)
```

---

### **Phase 2: Enhanced Admin Backend** 

#### A. **Product Verification Dashboard**
Location: `/admin/products/verify`

**Features**:
1. **Anomaly Detection**
   - Missing images
   - Products in wrong category (e.g., "marble" in name but category = "tools")
   - Missing source metadata
   - Price = 0
   - Stock = 0

2. **Bulk Actions**
   - Re-categorize by pattern
   - Assign source in bulk
   - Flag for manual review

3. **Source Mirror Check**
   - Button: "Check on Arsenius.nl"
   - Button: "Check on Marmermarkt.com"
   - Auto-open product URL based on slug

#### B. **Category Health Report**
Location: `/admin/categories`

**Shows**:
```
Category       | Products | With Images | Avg Price | Issues
----------------------------------------------------------
Marble         | 0        | -           | -         | ⚠️ EMPTY
Granite        | 0        | -           | -         | ⚠️ EMPTY
Tools          | 245      | 240 (98%)   | €12.50    | ✅ Good
Sinks          | 156      | 150 (96%)   | €89.00    | ✅ Good
Tiles          | 136      | 130 (96%)   | €45.00    | ✅ Good
```

#### C. **Product Family Grouping**
Detect variants of same product:
```
"Titan Prof Tile Level 1mm (100x)"
"Titan Prof Tile Level 1.5mm (100x)"  
"Titan Prof Tile Level 2mm (100x)"
→ Group as "Titan Prof Tile Level System"
```

**Bulk edit**: Update all variants at once

---

### **Phase 3: Re-scraping System** (Future)

#### Using `source` metadata:

```typescript
// For products with source = "Arsenius"
const scrapedData = await scrapeArsenius(product.slug);
if (scrapedData) {
  // Update images, price, description
  await prisma.product.update({
    where: { id: product.id },
    data: {
      images: JSON.stringify(scrapedData.images),
      price: scrapedData.price,
      description: scrapedData.description,
      verified: true
    }
  });
}
```

---

## 📊 **Current Database State**

Need to check:
```sql
SELECT 
  c.name, 
  c.slug, 
  COUNT(p.id) as product_count 
FROM Category c 
LEFT JOIN Product p ON p.categoryId = c.id 
GROUP BY c.id 
ORDER BY product_count DESC;
```

Expected issue:
```
Tools      | 245
Sinks      | 156  
Tiles      | 136
Marble     | 0    ← PROBLEM
Granite    | 0    ← PROBLEM
Onyx       | 0    ← PROBLEM
Quartzite  | 0    ← PROBLEM
Travertin  | 0    ← PROBLEM
```

---

## 🔧 **Immediate Fix Steps**

### Step 1: Update seed.ts categorization logic
- Add stone type keyword detection (marble, travertin, etc.)
- Make it check stone types BEFORE tools/sinks/tiles
- Add counters for each stone type

### Step 2: Re-run seed
```bash
npm run prisma:reset  # Clears DB
npm run prisma:seed   # Re-imports with new logic
```

### Step 3: Verify results
- Check category distribution
- Verify marble/granite products are in correct categories

### Step 4: Build admin verification UI
- Dashboard to review categorization
- Flag suspicious products (marble in tools category, etc.)

---

## 🎯 **Success Criteria**

✅ All 8 categories have products  
✅ Stone products correctly categorized (marble → Marble, not Tools)  
✅ `source` field populated for all products  
✅ Admin can bulk re-categorize  
✅ Admin can flag products for review  
✅ Missing images identified automatically  

---

## 🚀 **Next Steps**

1. **[NOW]** Show current category distribution
2. **[NOW]** Fix seed.ts categorization logic
3. **[NOW]** Re-seed database
4. **[NEXT]** Build admin verification dashboard
5. **[LATER]** Implement re-scraping from sources

---

**Priority**: Fix categorization logic first, then build admin tools to maintain quality.



