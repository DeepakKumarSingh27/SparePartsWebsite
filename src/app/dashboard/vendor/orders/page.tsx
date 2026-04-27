import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import styles from "../../dashboard.module.css";

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

async function getVendorOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return [];

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: payload.userId as string }
    });

    if (!vendorProfile) return [];

    // Fetch all order items for this vendor
    return await prisma.orderItem.findMany({
      where: { vendorId: vendorProfile.id },
      include: {
        product: true,
        order: {
          include: {
            customer: {
              select: { email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch {
    return [];
  }
}

export default async function VendorOrdersPage() {
  const orderItems = await getVendorOrders();

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>Manage Orders</h1>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {orderItems.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <p>You haven't received any orders yet.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-light)", borderBottom: "1px solid var(--border-light)" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Order ID</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Product</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Qty</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Customer</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem" }}>
                    #{item.orderId.substring(0, 8)}...
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontWeight: "500" }}>{item.product.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>${item.priceAtPurchase.toFixed(2)} / unit</div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>{item.quantity}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem" }}>
                    {item.order.customer.email}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "var(--radius-sm)", 
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      backgroundColor: item.status === 'PENDING' ? '#FEF3C7' : '#D1FAE5',
                      color: item.status === 'PENDING' ? '#92400E' : '#065F46'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
