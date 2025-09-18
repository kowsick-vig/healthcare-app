export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET() {
  const items = await prisma.product.findMany({ where: { active: true }, select: { id: true, name: true, sku: true, priceCents: true }});
  return NextResponse.json(items);
}
