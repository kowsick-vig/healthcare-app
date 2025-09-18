export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "probe@local";
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
