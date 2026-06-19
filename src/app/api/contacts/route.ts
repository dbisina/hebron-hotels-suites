import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { contactSchema, validationError } from "@/lib/validate";
import { isRateLimited } from "@/lib/ratelimit";
import { sendContactConfirmation, sendContactAdminAlert } from "@/lib/email";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json() as { id: string; status: string };
  const updated = await prisma.contactSubmission.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(`contact:${ip}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return validationError("Invalid JSON");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const submission = await prisma.contactSubmission.create({ data: parsed.data });

  void Promise.all([
    sendContactConfirmation(parsed.data),
    sendContactAdminAlert(parsed.data),
  ]);

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}
