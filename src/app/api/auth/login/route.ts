import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, SESSION_COOKIE } from "@/lib/auth";
import { loginSchema, validationError } from "@/lib/validate";
import { isRateLimited } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // 10 attempts per 15 minutes per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(`login:${ip}`, 10, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationError("Invalid JSON");
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const { email, password } = parsed.data;

  // Constant-time: always compare even if user not found (prevents user enumeration)
  const user = await prisma.user.findUnique({ where: { email } });
  const DUMMY_HASH = "$2b$12$Ik.L7ywHovs7MKXFWFkGFuzG7A0bLCE9L2/AZSVjABU8pR9J0SRaO";
  const valid = await compare(password, user?.password ?? DUMMY_HASH);

  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ id: user.id, email: user.email, role: user.role });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
