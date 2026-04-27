import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

async function getVendorProducts() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return [];

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: payload.userId as string }
    });

    if (!vendorProfile) return [];

    return await prisma.product.findMany({
      where: { vendorId: vendorProfile.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch {
    return [];
  }
}

export default async function VendorProductsPage() {
  const products = await getVendorProducts();

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>My Products</h1>
        <Link href="/dashboard/vendor/products/new" className="btn btn-primary">Add New Product</Link>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {products.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ marginBottom: "1rem" }}>You haven't added any products yet.</p>
            <Link href="/dashboard/vendor/products/new" className="btn btn-primary">Add Your First Product</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-light)", borderBottom: "1px solid var(--border-light)" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Product</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Category</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Price</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Stock</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>{product.title}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{product.category.name}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "var(--radius-sm)", 
                      fontSize: "0.875rem",
                      backgroundColor: product.stock > 0 ? "#ECFDF5" : "#FEF2F2",
                      color: product.stock > 0 ? "#059669" : "#DC2626"
                    }}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {/* Placeholder for edit/delete actions */}
                    <button style={{ color: "var(--primary)", fontWeight: "500", marginRight: "1rem" }}>Edit</button>
                    <button style={{ color: "#DC2626", fontWeight: "500" }}>Delete</button>
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
