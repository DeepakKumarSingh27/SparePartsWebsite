import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

async function getVendorProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    if (payload.role !== 'VENDOR') return null;

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: payload.userId as string }
    });

    return vendorProfile;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const vendorProfile = await getVendorProfile();
    if (!vendorProfile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { vendorId: vendorProfile.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const vendorProfile = await getVendorProfile();
    if (!vendorProfile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, stock, categoryName, vehicleType } = body;

    if (!title || !description || price === undefined || stock === undefined || !categoryName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create category
    let category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName }
      });
    }

    const product = await prisma.product.create({
      data: {
        vendorId: vendorProfile.id,
        categoryId: category.id,
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        vehicleType
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
