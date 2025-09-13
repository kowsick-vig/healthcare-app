export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.appointment.findMany({ orderBy: { startsAt: "asc" } });
  return NextResponse.json(items);
}
export async function POST(req: Request) {
  const b = await req.json().catch(()=>({}));
  const { patientEmail, startsAt, endsAt, notes } = b || {};
  if (!patientEmail || !startsAt || !endsAt)
    return NextResponse.json({ error: "patientEmail, startsAt, endsAt required" }, { status: 400 });
  const appt = await prisma.appointment.create({
    data: { patientEmail, startsAt: new Date(startsAt), endsAt: new Date(endsAt), notes: notes ?? null },
  });
  return NextResponse.json(appt, { status: 201 });
}
