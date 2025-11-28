import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSlug } from "@/lib/slug-utils";

// Cache API responses for 30 seconds
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const source = searchParams.get('source');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = { slug: category };
    }
    
    if (search) {
      // SQLite doesn't support case-insensitive mode, so we use contains without mode
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    if (inStock) {
      where.stock = { gt: 0 };
    }
    
    if (source && source !== 'all') {
      where.source = source;
    }

    // Validate sortBy field to prevent errors
    const validSortFields = ['name', 'price', 'stock', 'createdAt', 'updatedAt'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [safeSortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.categoryId || body.price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, categoryId, and price are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const baseSlug = generateSlug(body.name);
    const slug = await generateUniqueSlug(baseSlug, async (s) => {
      const existing = await prisma.product.findUnique({ where: { slug: s } });
      return !!existing;
    });

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || '',
        price: parseFloat(body.price),
        stock: parseInt(body.stock) || 0,
        categoryId: body.categoryId,
        unit: body.unit || 'piece',
        images: body.images ? JSON.stringify(body.images) : JSON.stringify([]),
        verified: body.verified || false,
        thumbnailAspectRatio: body.thumbnailAspectRatio || 'auto',
        thumbnailFit: body.thumbnailFit || 'cover',
        source: body.source || null,
      },
      include: { category: true }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}
