import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { settingsSchema, validationError } from "@/lib/validate";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json(settings ?? {});
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError("Invalid JSON");
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const data = parsed.data;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      phone: data.phone ?? "+2347071259011",
      email: data.email ?? "hebron.hotels@yahoo.com",
      address: data.address ?? "",
      checkIn: data.checkIn ?? "12:00 PM",
      checkOut: data.checkOut ?? "10:00 AM",
      facebook: data.facebook ?? "",
      instagram: data.instagram ?? "",
    },
    update: data,
  });
  return NextResponse.json(settings);
}
