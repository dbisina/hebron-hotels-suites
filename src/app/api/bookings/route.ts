import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateRef, getUnavailableInventoryIds, upsertCustomer } from "@/lib/booking";
import { isRateLimited } from "@/lib/ratelimit";
import { sendBookingConfirmation, sendBookingAdminAlert } from "@/lib/email";
import { z } from "zod";

const createSchema = z.object({
  inventoryId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  nights: z.number().int().min(1),
  guests: z.number().int().min(1),
  guestName: z.string().min(1).max(120),
  guestEmail: z.string().email().max(255),
  guestPhone: z.string().max(20).optional().default(""),
  amount: z.number().min(0),
  discountCode: z.string().max(30).optional().default(""),
  discountAmount: z.number().optional().default(0),
});

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: {
      inventory: { include: { room: true } },
      customer: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(`booking:${ip}`, 10, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const d = parsed.data;

  // Confirm inventory still available
  const unavailable = await getUnavailableInventoryIds(d.checkIn, d.checkOut);
  if (unavailable.includes(d.inventoryId)) {
    return NextResponse.json({ error: "Room no longer available for these dates" }, { status: 409 });
  }

  // Validate discount code if provided
  if (d.discountCode) {
    const code = await prisma.discountCode.findFirst({
      where: { code: d.discountCode.toUpperCase(), active: true },
    });
    if (!code) return NextResponse.json({ error: "Invalid discount code" }, { status: 400 });
    if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Discount code expired" }, { status: 400 });
    }
    if (code.maxUses > 0 && code.usedCount >= code.maxUses) {
      return NextResponse.json({ error: "Discount code fully redeemed" }, { status: 400 });
    }
  }

  const ref = generateRef();

  const booking = await prisma.booking.create({
    data: {
      bookingRef: ref,
      inventoryId: d.inventoryId,
      checkIn: d.checkIn,
      checkOut: d.checkOut,
      nights: d.nights,
      guests: d.guests,
      guestName: d.guestName,
      guestEmail: d.guestEmail,
      guestPhone: d.guestPhone,
      amount: d.amount,
      discountCode: d.discountCode,
      discountAmount: d.discountAmount,
      status: "pending",
      paystackStatus: "pending",
    },
  });

  // Fetch room name for email
  const inventory = await prisma.roomInventory.findUnique({
    where: { id: d.inventoryId },
    include: { room: true },
  });

  void Promise.all([
    sendBookingConfirmation({
      bookingRef: ref,
      guestName: d.guestName,
      guestEmail: d.guestEmail,
      roomName: inventory?.room.name ?? "Room",
      checkIn: d.checkIn,
      checkOut: d.checkOut,
      nights: d.nights,
      guests: d.guests,
      amount: d.amount,
    }),
    sendBookingAdminAlert({
      bookingRef: ref,
      guestName: d.guestName,
      guestEmail: d.guestEmail,
      roomName: inventory?.room.name ?? "Room",
      checkIn: d.checkIn,
      checkOut: d.checkOut,
      nights: d.nights,
      guests: d.guests,
      amount: d.amount,
    }),
  ]);

  return NextResponse.json({ ok: true, bookingRef: ref, bookingId: booking.id }, { status: 201 });
}
