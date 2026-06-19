import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const image = await prisma.galleryImage.create({ data: body });
  return NextResponse.json(image, { status: 201 });
}
