import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Warehouses
  const chennai = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
      location: "Chennai",
    },
  });

  const bangalore = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  // Products
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15",
      description: "Apple flagship smartphone",
      price: 79999,
    },
  });

  const samsung = await prisma.product.create({
    data: {
      name: "Samsung S24",
      description: "Samsung premium smartphone",
      price: 69999,
    },
  });

  // Inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: chennai.id,
        stock: 20,
      },
      {
        productId: iphone.id,
        warehouseId: bangalore.id,
        stock: 10,
      },
      {
        productId: samsung.id,
        warehouseId: chennai.id,
        stock: 15,
      },
      {
        productId: samsung.id,
        warehouseId: bangalore.id,
        stock: 8,
      },
    ],
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });