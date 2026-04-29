import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const vendorId = resolvedParams.id;
    const body = await request.json();
    const { status, commissionRate } = body;

    if (!status && commissionRate === undefined) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedVendor = await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        ...(status && { status }),
        ...(commissionRate !== undefined && { commissionRate: parseFloat(commissionRate) }),
      },
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
