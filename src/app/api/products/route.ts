import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.product.findMany({ where: { active: true } });
  return NextResponse.json(items);
}
