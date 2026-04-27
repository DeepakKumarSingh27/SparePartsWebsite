"use client";

import { useCartStore } from "@/lib/cartStore";

interface Props {
  product: {
    id: string;
    title: string;
    price: number;
    vendorId: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      vendorId: product.vendorId
    });
    alert("Added to cart!"); // Simple feedback for now
  };

  return (
    <button 
      className="btn btn-primary" 
      style={{ width: "100%", padding: "1rem", fontSize: "1.125rem" }}
      disabled={product.stock <= 0}
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
}
