import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({
    orderBy: { totalSpent: "desc" },
    include: { bookings: { select: { id: true, status: true, amount: true, createdAt: true } } },
  });
  return NextResponse.json(customers);
}
