"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { AboutUs } from "@/components/AboutUs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-mesh">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Now Shipping Globally to 120+ Countries</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              The World's Most Trusted <br />
              <span className="text-gradient">Spare Parts Marketplace</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl"
            >
              Direct access to premium vehicle parts from verified global suppliers. 
              Quality guaranteed, delivered with speed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link href="/products" className="group relative flex items-center space-x-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                <span>Start Browsing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register?role=vendor" className="flex items-center space-x-2 px-8 py-4 rounded-full bg-secondary/10 hover:bg-secondary/20 font-bold text-lg transition-all">
                <Rocket className="w-5 h-5" />
                <span>Become a Vendor</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Verified Sellers</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">OEM Quality Parts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
      </section>

      {/* About Section */}
      <AboutUs />

      {/* Categories / Quick Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Professionals Choose Us</h2>
            <p className="text-muted-foreground">The ultimate platform for sourcing genuine automotive components.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Inventory Accuracy</h3>
              <p className="text-muted-foreground text-sm">Real-time stock synchronization with over 5,000+ warehouses worldwide.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">Our streamlined ordering process gets parts into your hands within 48-72 hours.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Warranty Support</h3>
              <p className="text-muted-foreground text-sm">Every part is covered by our comprehensive Global Warranty program.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} AutoPartsGlobal. Built for the modern automotive industry.</p>
        </div>
      </footer>
    </div>
  );
}
