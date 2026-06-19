import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    code: string; type: string; value: number;
    maxUses?: number; minAmount?: number; expiresAt?: string;
  };

  const code = await prisma.discountCode.create({
    data: {
      code: body.code.trim().toUpperCase(),
      type: body.type ?? "percentage",
      value: body.value,
      maxUses: body.maxUses ?? 0,
      minAmount: body.minAmount ?? 0,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  return NextResponse.json(code, { status: 201 });
}
