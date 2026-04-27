"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress,
          totalAmount
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      clearCart();
      // In a real app, redirect to success page or Stripe payment intent
      alert("Order placed successfully!");
      router.push("/dashboard"); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-light)" }}>
      <header style={{ 
        backgroundColor: "var(--bg-white)", 
        borderBottom: "1px solid var(--border-light)", 
        padding: "1rem 2rem",
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-main)" }}>
          AutoParts<span style={{ color: "var(--primary)" }}>Global</span>
        </Link>
      </header>

      <main className="container animate-fade-in" style={{ padding: "4rem 1.5rem", flex: 1 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>Secure Checkout</h1>

        {items.length === 0 ? (
          <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.25rem", marginBottom: "1rem" }}>Your cart is empty.</p>
            <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem", alignItems: "start" }}>
            
            {/* Form Section */}
            <div className="card" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>Shipping Details</h2>
              {error && <div style={{ color: "#DC2626", marginBottom: "1rem" }}>{error}</div>}
              
              <form onSubmit={handleCheckout}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }} htmlFor="address">Full Shipping Address</label>
                  <textarea
                    id="address"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    rows={4}
                    placeholder="123 Main St, City, Country, Zip Code"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: "100%", padding: "1rem" }}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="card" style={{ padding: "2rem", backgroundColor: "var(--bg-white)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Order Summary</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.title}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(item.id)} style={{ color: "#DC2626", fontSize: "0.875rem", padding: "0.25rem" }}>Remove</button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 700 }}>
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
