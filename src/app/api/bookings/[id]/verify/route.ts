import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPaystack, upsertCustomer } from "@/lib/booking";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { paystackRef } = await req.json() as { paystackRef: string };

  if (!paystackRef) {
    return NextResponse.json({ error: "Missing paystackRef" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "confirmed") {
    return NextResponse.json({ ok: true, already: true });
  }

  let verified: { status: string; amount: number; email: string };
  try {
    verified = await verifyPaystack(paystackRef);
  } catch (e) {
    console.error("Paystack verify error:", e);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 502 });
  }

  if (verified.status !== "success") {
    await prisma.booking.update({
      where: { id },
      data: { paystackRef, paystackStatus: verified.status, status: "failed" },
    });
    return NextResponse.json({ error: "Payment not successful", status: verified.status }, { status: 402 });
  }

  // Guard: amount paid must cover the booking amount (1 naira float tolerance)
  if (verified.amount < booking.amount - 1) {
    await prisma.booking.update({
      where: { id },
      data: { paystackRef, paystackStatus: "amount_mismatch", status: "failed" },
    });
    return NextResponse.json(
      { error: "Payment amount insufficient", expected: booking.amount, received: verified.amount },
      { status: 402 }
    );
  }

  // Increment discount code usage if used
  if (booking.discountCode) {
    await prisma.discountCode.updateMany({
      where: { code: booking.discountCode },
      data: { usedCount: { increment: 1 } },
    });
  }

  // Upsert customer record
  const customerId = await upsertCustomer(
    booking.guestName,
    booking.guestEmail,
    booking.guestPhone,
    booking.amount
  );

  // Confirm booking
  const updated = await prisma.booking.update({
    where: { id },
    data: {
      paystackRef,
      paystackStatus: "success",
      status: "confirmed",
      customerId,
    },
  });

  return NextResponse.json({ ok: true, booking: updated });
}
