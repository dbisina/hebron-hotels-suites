import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { roomSchema, validationError } from "@/lib/validate";

export async function GET() {
  const rooms = await prisma.room.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError("Invalid JSON");
  }

  const parsed = roomSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const room = await prisma.room.create({
    data: {
      ...parsed.data,
      amenities: JSON.stringify(parsed.data.amenities),
      order: parsed.data.order ?? (await prisma.room.count()),
    },
  });
  return NextResponse.json(room, { status: 201 });
}
