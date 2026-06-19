import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUnavailableInventoryIds } from "@/lib/booking";
import { z } from "zod";

const schema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().int().min(1),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = schema.safeParse({
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
    guests: searchParams.get("guests") ?? 1,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const { checkIn, checkOut, guests } = parsed.data;

  const unavailable = await getUnavailableInventoryIds(checkIn, checkOut);

  // Find room types that have at least one available physical room
  const availableInventory = await prisma.roomInventory.findMany({
    where: {
      active: true,
      id: { notIn: unavailable },
    },
    include: { room: true },
  });

  // Group by room type, include count
  const roomMap = new Map<
    string,
    { room: typeof availableInventory[0]["room"]; available: number; inventoryIds: string[] }
  >();

  for (const inv of availableInventory) {
    const r = inv.room;
    if (!r.active) continue;
    // Basic occupancy filter — show room types that can fit the guests
    const maxGuests = parseInt(r.occupancy.replace(/\D+.*$/, "")) || 2;
    if (guests > maxGuests * 2) continue; // rough filter
    const existing = roomMap.get(r.id);
    if (existing) {
      existing.available++;
      existing.inventoryIds.push(inv.id);
    } else {
      roomMap.set(r.id, { room: r, available: 1, inventoryIds: [inv.id] });
    }
  }

  const rooms = [...roomMap.values()].sort((a, b) => a.room.order - b.room.order);

  // Calculate nights
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));

  return NextResponse.json({ rooms, nights, checkIn, checkOut, guests });
}
