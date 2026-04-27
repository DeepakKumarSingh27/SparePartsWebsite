const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  // 1. Fix Broken Images
  const fixes = [
    {
      title: "Fog Light Assembly",
      newUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "High Performance Spark Plugs",
      newUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Full Synthetic Motor Oil 5W-30",
      newUrl: "https://images.unsplash.com/photo-1631505312386-8968032d1694?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Premium Ceramic Brake Pads", // The one mentioned as eleventh card
      newUrl: "https://images.unsplash.com/photo-1598209279122-8541213a0387?q=80&w=800&auto=format&fit=crop"
    }
  ];

  for (const fix of fixes) {
    await prisma.product.updateMany({
      where: { title: fix.title },
      data: { imageUrl: fix.newUrl }
    });
  }
  console.log('Fixed broken image URLs.');

  // 2. Add 5 Dummy Vendors
  const dummyVendors = [
    {
      email: 'apex@autosolutions.com',
      storeName: 'Apex Auto Solutions',
      description: 'Your reliable partner for premium European car parts and accessories.'
    },
    {
      email: 'titan@heavyduty.com',
      storeName: 'Titan Heavy Duty',
      description: 'Specialized in robust truck components and off-road performance gear.'
    },
    {
      email: 'lumina@lighting.com',
      storeName: 'Lumina Lighting Co.',
      description: 'Brightening the road ahead with state-of-the-art automotive lighting solutions.'
    },
    {
      email: 'nitro@performance.com',
      storeName: 'Nitro Performance',
      description: 'High-performance engine components for racing and enthusiasts.'
    },
    {
      email: 'velocity@moto.com',
      storeName: 'Velocity Moto',
      description: 'A dedicated shop for high-quality motorcycle spare parts and rider gear.'
    }
  ];

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('vendor123', salt);

  for (const v of dummyVendors) {
    const user = await prisma.user.create({
      data: {
        email: v.email,
        passwordHash: passwordHash,
        role: 'VENDOR',
        vendorProfile: {
          create: {
            storeName: v.storeName,
            description: v.description,
            status: 'APPROVED'
          }
        }
      }
    });
    console.log(`Created Vendor: ${v.storeName} (${v.email})`);
  }

  console.log('Successfully added 5 dummy vendors and fixed image issues.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
