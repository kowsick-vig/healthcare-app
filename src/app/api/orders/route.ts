export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return NextResponse.json({ error: "No items" }, { status: 400 });

    const ids = items.map((i: any) => String(i.productId));
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const byId = new Map(products.map(p => [p.id, p]));

    let total = 0;
    const orderItems = items.map((i: any) => {
      const p = byId.get(String(i.productId));
      if (!p) throw new Error("Invalid product");
      const qty = Math.max(1, Number(i.qty || 1));
      total += p.priceCents * qty;
      return {
        productId: p.id,
        productName: p.name,
        priceCents: p.priceCents,
        qty,
      };
    });

    const order = await prisma.order.create({
      data: {
        userEmail: email,
        totalCents: total,
        status: "PENDING",
        items: { create: orderItems }
      },
      select: { id: true }
    });

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
