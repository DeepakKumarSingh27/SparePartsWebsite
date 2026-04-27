import prisma from "@/lib/prisma";
import Link from "next/link";
import { Store, ShieldCheck, MapPin, Package, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getVendors() {
  return await prisma.vendorProfile.findMany({
    where: { status: 'APPROVED' },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-mesh border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Our Trusted <span className="text-gradient">Partners</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with certified global suppliers who maintain the highest standards of quality and reliability in the automotive industry.
          </p>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
      </section>

      {/* Vendors Grid */}
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="bg-card rounded-3xl border border-border p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Store className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {vendor.storeName}
              </h2>
              
              <p className="text-muted-foreground mb-6 line-clamp-3 min-h-[4.5rem]">
                {vendor.description || "No description provided. This vendor is a verified supplier of high-quality automotive parts."}
              </p>

              <div className="flex items-center space-x-6 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>{vendor._count.products} Products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Global Shipping</span>
                </div>
              </div>

              <Link 
                href={`/vendors/${vendor.id}`} 
                className="flex items-center justify-center space-x-2 w-full py-4 rounded-2xl bg-secondary/5 hover:bg-primary hover:text-white transition-all font-bold group/btn"
              >
                <span>Visit Store</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {vendors.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-muted-foreground">No vendors found.</h3>
          </div>
        )}
      </main>

      {/* Become a Vendor CTA */}
      <section className="container mx-auto px-4 mt-32">
        <div className="rounded-[3rem] bg-foreground text-background p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Ready to grow your automotive business?
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              Join the world's most innovative spare parts network and reach millions of customers worldwide.
            </p>
            <Link href="/register?role=vendor" className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:scale-105 transition-transform">
              <span>Apply Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <div className="text-3xl font-black mb-1">0%</div>
                <div className="text-zinc-500 text-xs uppercase font-bold">Listing Fees</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mt-6">
                <div className="text-3xl font-black mb-1">120+</div>
                <div className="text-zinc-500 text-xs uppercase font-bold">Countries</div>
              </div>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
        </div>
      </section>
    </div>
  );
}
