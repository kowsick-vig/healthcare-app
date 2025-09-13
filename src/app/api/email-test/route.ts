export const runtime = 'nodejs';
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const to = new URL(req.url).searchParams.get("to") ?? null;
  return NextResponse.json({ ok: true, route: "/api/email-test", gotTo: to });
}
