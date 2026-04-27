"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../../../auth.module.css"; // Reuse form styles

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "1",
    categoryName: "",
    vehicleType: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      router.push("/dashboard/vendor/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>Add New Product</h1>
        <Link href="/dashboard/vendor/products" className="btn">Back to Products</Link>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        {error && <div className={styles.errorText}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">Product Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.input}
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Brembo Front Brake Pads"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="categoryName">Category</label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              className={styles.input}
              value={formData.categoryName}
              onChange={handleChange}
              required
              placeholder="e.g., Brakes"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="vehicleType">Vehicle Type / Fitment</label>
            <input
              type="text"
              id="vehicleType"
              name="vehicleType"
              className={styles.input}
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="e.g., Universal, Honda Civic 2016-2021"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                className={styles.input}
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="stock">Initial Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                className={styles.input}
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className={styles.input}
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the condition, compatibility, and features..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Saving Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
