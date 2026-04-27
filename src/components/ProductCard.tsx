"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    category: { name: string };
    vendor: { storeName: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">⚙️</div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Link href={`/products/${product.id}`} className="p-3 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-colors">
            <Eye className="w-5 h-5" />
          </Link>
          <button className="p-3 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
          {product.category.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
            <h3 className="text-xl font-bold line-clamp-1">{product.title}</h3>
          </Link>
        </div>
        
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-muted-foreground ml-2">(4.9)</span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="text-2xl font-black text-primary">${product.price.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Vendor</span>
            <p className="text-sm font-semibold truncate max-w-[120px]">{product.vendor.storeName}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
