import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.product.createMany({
    data: [
      { name: "Pulse Oximeter", description: "SpO2 fingertip monitor.", priceCents: 2999, sku: "PULS-OXI-01" },
      { name: "BP Monitor", description: "Upper arm blood pressure monitor.", priceCents: 4999, sku: "BP-MON-02" },
    ],
    skipDuplicates: true,
  });
  console.log("Seeded products.");
}
main().finally(() => prisma.$disconnect());
