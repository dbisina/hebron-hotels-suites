import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(`discount:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { code, amount } = body as { code: string; amount: number };

  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  const dc = await prisma.discountCode.findFirst({
    where: { code: code.trim().toUpperCase(), active: true },
  });

  if (!dc) return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  if (dc.expiresAt && new Date(dc.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }
  if (dc.maxUses > 0 && dc.usedCount >= dc.maxUses) {
    return NextResponse.json({ error: "Code fully redeemed" }, { status: 400 });
  }
  if (amount < dc.minAmount) {
    return NextResponse.json({
      error: `Minimum booking amount ₦${dc.minAmount.toLocaleString()} required`,
    }, { status: 400 });
  }

  const discountAmount =
    dc.type === "percentage"
      ? Math.round((amount * dc.value) / 100)
      : Math.min(dc.value, amount);

  return NextResponse.json({ valid: true, discountAmount, type: dc.type, value: dc.value });
}
