import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      vendor: {
        select: {
          storeName: true,
          description: true,
        }
      }
    }
  });

  if (!product) notFound();
  return product;
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ 
        backgroundColor: "var(--bg-white)", 
        borderBottom: "1px solid var(--border-light)", 
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-main)" }}>
          AutoParts<span style={{ color: "var(--primary)" }}>Global</span>
        </Link>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link href="/products" style={{ fontWeight: 500 }}>Catalog</Link>
          <Link href="/checkout" style={{ fontWeight: 500 }}>Cart</Link>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: "0.25rem 1rem" }}>Dashboard</Link>
        </nav>
      </header>

      <main className="container animate-fade-in" style={{ padding: "4rem 1.5rem", flex: 1 }}>
        <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem", fontWeight: 500 }}>
          ← Back to Catalog
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          {/* Product Image Placeholder */}
          <div className="card" style={{ 
            aspectRatio: "1/1", 
            backgroundColor: "var(--bg-light)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontSize: "8rem"
          }}>
            ⚙️
          </div>

          {/* Product Info */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ backgroundColor: "var(--primary)", color: "white", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-xl)", fontSize: "0.875rem", fontWeight: 600 }}>
                {product.category.name}
              </span>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.2 }}>{product.title}</h1>
            
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "2rem" }}>
              ${product.price.toFixed(2)}
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "1.125rem" }}>
                {product.description}
              </p>
            </div>

            {product.vehicleType && (
              <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontWeight: 600 }}>Compatibility:</span> {product.vehicleType}
              </div>
            )}

            <div style={{ marginBottom: "2rem" }}>
              {product.stock > 0 ? (
                <div style={{ color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: "#059669", borderRadius: "50%" }}></span>
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div style={{ color: "#DC2626", fontWeight: 600 }}>Out of Stock</div>
              )}
            </div>

            <AddToCartButton product={product} />

            {/* Vendor Info */}
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border-light)" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>Sold by {product.vendor.storeName}</h3>
              {product.vendor.description && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{product.vendor.description}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
