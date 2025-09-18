export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Accepts "YYYY-MM-DDTHH:mm" (from datetime-local) or "DD/MM/YYYY, HH:mm"
function parseLocalDateTime(s: string): Date | null {
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) {
    const d = new Date(s);
    return isNaN(+d) ? null : d;
  }
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})$/);
  if (m) {
    const [, dd, mm, yyyy, HH, MM] = m;
    const d = new Date(+yyyy, +mm - 1, +dd, +HH, +MM, 0, 0);
    return isNaN(+d) ? null : d;
  }
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const me = url.searchParams.get("me");
  if (me) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json([], { status: 200 });
    const items = await prisma.appointment.findMany({
      where: { patientEmail: email },
      orderBy: { startsAt: "asc" },
    });
    return NextResponse.json(items);
  }
  const items = await prisma.appointment.findMany({ orderBy: { startsAt: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({} as any));
    const { patientEmail, startsAt, endsAt, notes } = b || {};

    if (!patientEmail || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: "patientEmail, startsAt, endsAt are required" },
        { status: 400 }
      );
    }

    const start = parseLocalDateTime(String(startsAt));
    const end = parseLocalDateTime(String(endsAt));
    if (!start || !end) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DDTHH:mm or DD/MM/YYYY, HH:mm" },
        { status: 400 }
      );
    }
    if (+end <= +start) {
      return NextResponse.json(
        { error: "endsAt must be after startsAt" },
        { status: 400 }
      );
    }

    const appt = await prisma.appointment.create({
      data: { patientEmail, startsAt: start, endsAt: end, notes: notes ?? null },
    });
    return NextResponse.json(appt, { status: 201 });
  } catch (e: any) {
    console.error("[appointments POST]", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
