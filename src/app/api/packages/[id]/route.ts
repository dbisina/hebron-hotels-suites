import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const pkg = await prisma.package.update({
    where: { id },
    data: {
      ...body,
      includes: body.includes ? JSON.stringify(body.includes) : undefined,
      updatedAt: new Date(),
    },
  });
  return NextResponse.json(pkg);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.package.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
