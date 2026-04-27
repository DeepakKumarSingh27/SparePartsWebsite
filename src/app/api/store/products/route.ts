import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const vehicleType = searchParams.get('vehicleType');

    const filters: any = {};

    if (query) {
      filters.title = { contains: query };
    }
    if (category) {
      filters.categoryId = category;
    }
    if (vehicleType) {
      filters.vehicleType = { contains: vehicleType };
    }

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: true,
        vendor: {
          select: {
            storeName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
