"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap, Users } from "lucide-react";

const stats = [
  { label: "Verified Vendors", value: "500+", icon: ShieldCheck },
  { label: "Countries Served", value: "120+", icon: Globe },
  { label: "Daily Shipments", value: "15k+", icon: Zap },
  { label: "Happy Customers", value: "1M+", icon: Users },
];

export function AboutUs() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-secondary/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Driving the Future of <span className="text-gradient">Automotive Commerce</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              At AutoPartsGlobal, we've built more than just a marketplace. We've created a global ecosystem where quality meets reliability. Our platform connects millions of buyers with verified suppliers of genuine spare parts, ensuring that every vehicle stays on the road longer and safer.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Uncompromising Quality</h4>
                  <p className="text-muted-foreground text-sm">Every part sold on our platform undergoes a rigorous multi-step verification process.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-accent/10 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Global Logistics</h4>
                  <p className="text-muted-foreground text-sm">Our intelligent routing system finds the fastest path from vendor to your doorstep.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group"
              >
                <stat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
    </section>
  );
}
