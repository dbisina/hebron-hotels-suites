import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { packageSchema, validationError } from "@/lib/validate";

export async function GET() {
  const packages = await prisma.package.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(packages);
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

  const parsed = packageSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const pkg = await prisma.package.create({
    data: {
      ...parsed.data,
      includes: JSON.stringify(parsed.data.includes),
      order: parsed.data.order ?? (await prisma.package.count()),
    },
  });
  return NextResponse.json(pkg, { status: 201 });
}
