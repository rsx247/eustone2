# EU Stone - Proper Categorization Structure

Based on the live database export SQL file analysis.

## Category Hierarchy

### Main Categories (parent_id = 0)

1. **Quartzite** (id: 1, slug: `quartzite`, priority: 1)
2. **Marble** (id: 2, slug: `marble`, priority: 2)
3. **Granite** (id: 3, slug: `granite`, priority: 3)
4. **Onyx** (id: 4, slug: `onyx`, priority: 4)
5. **Travertin** (id: 5, slug: `travertin`, priority: 5)
6. **Tools** (id: 6, slug: `tools`, priority: 0)
7. **Tiles** (id: 7, slug: `tiles`, priority: 0, home_status: 1)
8. **Sinks** (id: 8, slug: `sinks`, priority: 0, home_status: 1)

### Sub-Categories

#### Under Sinks (parent_id: 8)
- **Marmeren Badkuipen** (id: 12, slug: `marmeren-badkuipen`, position: 3)
- **Marmeren Douchebakken** (id: 13, slug: `marmeren-douchebakken`, position: 4)
- **Verticaal Gootstenen** (id: 14, slug: `verticaal-gootstenen`, position: 5)

#### Under Tiles (parent_id: 7)
- **Natuursteen Tegels** (id: 17, slug: `natuursteen-tegels`, position: 3)
- **Metro Tegels** (id: 18, slug: `metro-tegels`, position: 4)
- **Mosaïek Tegels** (id: 19, slug: `mosaiek-tegels`, position: 5)
- **Houtlook Tegels** (id: 20, slug: `houtlook-tegels`, position: 6)
- **Marbel Tegels** (id: 21, slug: `marbel-tegels`, position: 7)

## Product Category Fields

Products table includes:
- `category_ids` (varchar 80) - Multiple category IDs (comma-separated?)
- `category_id` (varchar 191) - Main category ID
- `sub_category_id` (varchar 191) - Sub-category ID
- `sub_sub_category_id` (varchar 191) - Sub-sub-category ID

## Category Structure in Database

```sql
CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `icon` varchar(250) DEFAULT NULL,
  `icon_storage_type` varchar(10) DEFAULT 'public',
  `parent_id` int(11) NOT NULL,  -- 0 for main categories
  `position` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `home_status` tinyint(1) NOT NULL DEFAULT 0,  -- Show on homepage
  `priority` int(11) DEFAULT NULL  -- Display order
)
```

## Notes for Implementation

1. **Natural Stone Categories** (Quartzite, Marble, Granite, Onyx, Travertin) are the main stone types
2. **Tools** is a separate category for equipment/tools
3. **Tiles** and **Sinks** have sub-categories for better organization
4. Categories with `home_status = 1` should be featured on homepage
5. `priority` field determines display order (lower numbers first for natural stone)
6. Products can belong to multiple categories via `category_ids` field

## Recommended Category Mapping

When importing/migrating products:
- Map main stone types to their respective categories (1-5)
- Map tools to category 6
- Map tiles to category 7 (with appropriate sub-category if applicable)
- Map sinks to category 8 (with appropriate sub-category if applicable)
