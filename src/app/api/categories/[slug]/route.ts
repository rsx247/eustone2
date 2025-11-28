import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Category fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

