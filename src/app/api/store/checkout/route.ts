import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to checkout.' }, { status: 401 });
    }

    let userId: string;
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
      userId = payload.userId as string;
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, totalAmount } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    // Use a transaction to ensure all database operations succeed or fail together
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          customerId: userId,
          totalAmount: parseFloat(totalAmount),
          shippingAddress,
          status: 'PAID', // In a real app, this would be 'PENDING' until payment gateway confirms
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              vendorId: item.vendorId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
              status: 'PENDING'
            }))
          }
        },
        include: {
          items: true
        }
      });

      // 2. Decrement stock for each product
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.title}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ 
      message: 'Order placed successfully', 
      orderId: order.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
