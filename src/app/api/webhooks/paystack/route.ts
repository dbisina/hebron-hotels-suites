import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/db";
import { upsertCustomer } from "@/lib/booking";

export const dynamic = "force-dynamic";

type ChargeEvent = {
  event: string;
  data: {
    reference: string;
    status: string;
    amount: number; // kobo
    customer: { email: string };
  };
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    console.error("Paystack webhook: PAYSTACK_SECRET_KEY not set");
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  // Verify HMAC-SHA512 — Paystack signs the raw body with your secret key
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: ChargeEvent;
  try {
    event = JSON.parse(rawBody) as ChargeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only handle successful charges — acknowledge everything else with 200
  if (event.event !== "charge.success" || event.data.status !== "success") {
    return NextResponse.json({ ok: true });
  }

  const { reference, amount } = event.data;

  const booking = await prisma.booking.findFirst({
    where: { bookingRef: reference },
  });

  if (!booking) {
    // Not a booking payment — acknowledge so Paystack stops retrying
    return NextResponse.json({ ok: true });
  }

  // Idempotent — already confirmed by frontend callback
  if (booking.status === "confirmed") {
    return NextResponse.json({ ok: true });
  }

  const amountNaira = amount / 100;
  if (amountNaira < booking.amount - 1) {
    console.error(
      `Paystack webhook amount mismatch: ref=${reference} expected=${booking.amount} got=${amountNaira}`
    );
    return NextResponse.json({ ok: true });
  }

  // Increment discount code usage if applicable
  if (booking.discountCode) {
    await prisma.discountCode
      .updateMany({
        where: { code: booking.discountCode },
        data: { usedCount: { increment: 1 } },
      })
      .catch(() => {});
  }

  const customerId = await upsertCustomer(
    booking.guestName,
    booking.guestEmail,
    booking.guestPhone,
    booking.amount
  ).catch(() => null);

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paystackRef: reference,
      paystackStatus: "success",
      status: "confirmed",
      ...(customerId ? { customerId } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
