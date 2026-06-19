import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { enquirySchema, validationError } from "@/lib/validate";
import { isRateLimited } from "@/lib/ratelimit";
import { sendEnquiryConfirmation, sendEnquiryAdminAlert } from "@/lib/email";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(enquiries);
}

export async function POST(req: NextRequest) {
  // 5 enquiries per hour per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(`enquiry:${ip}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError("Invalid JSON");
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const enquiry = await prisma.enquiry.create({ data: parsed.data });

  void Promise.all([
    sendEnquiryConfirmation(parsed.data),
    sendEnquiryAdminAlert(parsed.data),
  ]);

  return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
}
