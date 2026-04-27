import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import styles from "../dashboard.module.css";

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

async function getVendorStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return { sales: 0, products: 0, orders: 0 };

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: payload.userId as string },
      include: {
        _count: {
          select: { products: true, orderItems: true }
        },
        orderItems: {
          select: { priceAtPurchase: true, quantity: true }
        }
      }
    });

    if (!vendorProfile) return { sales: 0, products: 0, orders: 0 };

    const totalSales = vendorProfile.orderItems.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);

    return {
      sales: totalSales,
      products: vendorProfile._count.products,
      orders: vendorProfile._count.orderItems
    };
  } catch {
    return { sales: 0, products: 0, orders: 0 };
  }
}

export default async function VendorDashboard() {
  const stats = await getVendorStats();

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "600" }}>Vendor Overview</h1>
      
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <h3>Total Sales</h3>
          <p>${stats.sales.toFixed(2)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Active Products</h3>
          <p>{stats.products}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Orders</h3>
          <p>{stats.orders}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Store Rating</h3>
          <p>N/A</p>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>Recent Orders</h3>
        {stats.orders === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>You have no recent orders.</p>
        ) : (
          <p style={{ color: "var(--text-main)" }}>You have {stats.orders} orders to manage.</p>
        )}
      </div>
    </div>
  );
}
