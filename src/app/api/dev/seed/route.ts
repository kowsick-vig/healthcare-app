export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = [
    { name: "Digital Thermometer", sku: "THERMO-001", priceCents: 1299, description: "Fast-read, contact digital thermometer.", imageUrl: "" },
    { name: "Blood Pressure Monitor", sku: "BP-002", priceCents: 4999, description: "Upper arm, automatic with memory.", imageUrl: "" },
    { name: "Pulse Oximeter", sku: "OXI-003", priceCents: 2999, description: "SpO2 and pulse rate with OLED.", imageUrl: "" },
  ];

  for (const p of items) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: p,
      create: p,
    });
  }
  return NextResponse.json({ ok: true, count: items.length });
}
