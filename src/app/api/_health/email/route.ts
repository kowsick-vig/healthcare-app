export const runtime = 'nodejs';
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const to = new URL(req.url).searchParams.get("to");
  return NextResponse.json({ ok: true, gotTo: to ?? null, where: "email route alive" });
}
