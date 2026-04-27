import Link from "next/link";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, Package } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      vendor: {
        select: {
          storeName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function ProductsCatalog() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      {/* Search & Filter Header */}
      <section className="pt-12 pb-16 bg-secondary/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Global <span className="text-gradient">Parts Catalog</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover over {products.length} premium automotive components from verified global suppliers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative group flex-1 sm:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by part name or SKU..." 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-card border border-border hover:bg-secondary/10 transition-colors font-semibold shadow-sm">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-16">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Parts Found</h2>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find any products matching your search. Vendors are currently updating their inventory!
            </p>
            <Link href="/" className="mt-8 text-primary font-semibold hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} AutoPartsGlobal. The world's spare parts network.</p>
        </div>
      </footer>
    </div>
  );
}
