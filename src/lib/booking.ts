import { prisma } from "./db";

/** Returns all inventory IDs that are NOT available for the given date range. */
export async function getUnavailableInventoryIds(
  checkIn: string,
  checkOut: string
): Promise<string[]> {
  const conflicts = await prisma.booking.findMany({
    where: {
      status: { notIn: ["cancelled", "failed"] },
      AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
    },
    select: { inventoryId: true },
  });
  return [...new Set(conflicts.map((b) => b.inventoryId))];
}

/** Generate unique booking reference */
export function generateRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HH-${ts}-${rnd}`;
}

/** Verify Paystack payment server-side */
export async function verifyPaystack(reference: string): Promise<{
  status: string;
  amount: number;
  email: string;
}> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY not set");

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" }
  );
  const data = await res.json() as { status: boolean; data?: { status: string; amount: number; customer?: { email: string } } | null };
  if (!data?.status || !data?.data) throw new Error("Paystack verification failed");
  return {
    status: data.data.status,
    amount: data.data.amount / 100, // kobo → naira
    email: data.data.customer?.email ?? "",
  };
}

/** Upsert customer and update loyalty stats */
export async function upsertCustomer(
  name: string,
  email: string,
  phone: string,
  amount: number
): Promise<string> {
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    const updated = await prisma.customer.update({
      where: { email },
      data: {
        totalBookings: existing.totalBookings + 1,
        totalSpent: existing.totalSpent + amount,
        phone: phone || existing.phone,
        name: name || existing.name,
      },
    });
    return updated.id;
  }
  const created = await prisma.customer.create({
    data: { name, email, phone, totalBookings: 1, totalSpent: amount },
  });
  return created.id;
}
