import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { setAsset, getAllAssets } from "@/lib/cms";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const assets = await getAllAssets();
  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const assetId = formData.get("id") as string | null;

  if (!file || !assetId) {
    return NextResponse.json({ error: "file and id required" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${assetId.replace(/[^a-z0-9-]/gi, "-")}-${Date.now()}.${ext}`;

  const uploadDir = join(process.cwd(), "public", "assets");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const url = `/assets/${filename}`;
  await setAsset(assetId, url);

  return NextResponse.json({ ok: true, url });
}
