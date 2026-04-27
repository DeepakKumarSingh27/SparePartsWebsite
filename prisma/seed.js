const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const vendor1Id = '22548405-c7c7-4bef-80a5-adb2c7a333ec';
  const vendor2Id = '0000a4f2-b275-4209-8292-b6832f133267';

  // Create additional categories
  const categoryNames = ['Engine Parts', 'Suspension', 'Lighting', 'Filters'];
  const categories = [];

  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, description: `High-quality ${name} for all vehicles.` },
    });
    categories.push(cat);
  }

  // Add the existing 'Braking' category to our list
  const brakingCat = await prisma.category.findUnique({ where: { name: 'Braking' } });
  if (brakingCat) categories.push(brakingCat);

  const productsData = [
    {
      title: "Premium Ceramic Brake Pads",
      description: "Ultra-quiet ceramic brake pads with high heat resistance and superior stopping power.",
      price: 85.99,
      stock: 50,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Braking')?.id || categories[0].id,
      vendorId: vendor1Id,
      imageUrl: "https://images.unsplash.com/photo-1598209279122-8541213a0387?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Turbocharged Air Filter",
      description: "High-flow air filter designed to increase horsepower and acceleration.",
      price: 45.50,
      stock: 100,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Filters')?.id || categories[0].id,
      vendorId: vendor1Id,
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Heavy Duty Shock Absorber",
      description: "Nitrogen-charged shock absorbers for a smoother ride on rough terrains.",
      price: 120.00,
      stock: 24,
      vehicleType: "Truck",
      categoryId: categories.find(c => c.name === 'Suspension')?.id || categories[0].id,
      vendorId: vendor2Id,
      imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "LED Headlight Conversion Kit",
      description: "Super bright 6000K white LED headlights with easy plug-and-play installation.",
      price: 65.00,
      stock: 40,
      vehicleType: "Motorcycle",
      categoryId: categories.find(c => c.name === 'Lighting')?.id || categories[0].id,
      vendorId: vendor2Id,
      imageUrl: "https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Full Synthetic Motor Oil 5W-30",
      description: "Advanced full synthetic formula for maximum engine protection and performance.",
      price: 34.99,
      stock: 200,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Engine Parts')?.id || categories[0].id,
      vendorId: vendor1Id,
      imageUrl: "https://images.unsplash.com/photo-1635739655458-7f9a18012015?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Vented Brake Rotors (Pair)",
      description: "Precision-machined vented rotors for improved cooling and reduced brake fade.",
      price: 155.00,
      stock: 15,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Braking')?.id || categories[0].id,
      vendorId: vendor2Id,
      imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "High Performance Spark Plugs",
      description: "Iridium-tipped spark plugs for better fuel efficiency and quicker starts.",
      price: 12.99,
      stock: 300,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Engine Parts')?.id || categories[0].id,
      vendorId: vendor1Id,
      imageUrl: "https://images.unsplash.com/photo-1589131008225-b7463002898d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Off-Road Suspension Lift Kit",
      description: "3-inch lift kit for superior ground clearance and off-road capability.",
      price: 450.00,
      stock: 8,
      vehicleType: "Truck",
      categoryId: categories.find(c => c.name === 'Suspension')?.id || categories[0].id,
      vendorId: vendor2Id,
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Oil Filter - Long Life",
      description: "High-capacity oil filter designed to trap more dirt and contaminants.",
      price: 9.99,
      stock: 500,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Filters')?.id || categories[0].id,
      vendorId: vendor1Id,
      imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Fog Light Assembly",
      description: "Durable fog lights for improved visibility during poor weather conditions.",
      price: 78.25,
      stock: 30,
      vehicleType: "Car",
      categoryId: categories.find(c => c.name === 'Lighting')?.id || categories[0].id,
      vendorId: vendor2Id,
      imageUrl: "https://images.unsplash.com/photo-1549399500-c44d172e9971?q=80&w=800&auto=format&fit=crop"
    }
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product
    });
  }

  console.log(`Successfully added ${productsData.length} products and ${categoryNames.length} categories.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
