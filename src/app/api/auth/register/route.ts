import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, storeName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const userRole = role === 'VENDOR' ? 'VENDOR' : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: userRole,
        ...(userRole === 'VENDOR' && storeName ? {
          vendorProfile: {
            create: {
              storeName
            }
          }
        } : {})
      },
      include: {
        vendorProfile: true
      }
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: userWithoutPassword 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
