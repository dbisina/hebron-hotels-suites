import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inventory = await prisma.roomInventory.findMany({
    include: { room: true },
    orderBy: [{ room: { order: "asc" } }, { roomNumber: "asc" }],
  });
  return NextResponse.json(inventory);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId, roomNumber, floor, notes } = await req.json() as {
    roomId: string;
    roomNumber: string;
    floor?: number;
    notes?: string;
  };

  if (!roomId || !roomNumber) {
    return NextResponse.json({ error: "roomId and roomNumber required" }, { status: 400 });
  }

  const inv = await prisma.roomInventory.create({
    data: { roomId, roomNumber, floor: floor ?? 1, notes: notes ?? "" },
    include: { room: true },
  });
  return NextResponse.json(inv, { status: 201 });
}
