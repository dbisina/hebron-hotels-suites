import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCmsData, setCmsData, getAllAssets, setAsset, type CmsKey } from "@/lib/cms";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") as CmsKey | null;

  if (key) {
    const data = await getCmsData(key);
    return NextResponse.json({ key, data });
  }

  // Return all CMS keys + all assets
  const keys: CmsKey[] = [
    "hero", "about", "facilities", "rooms", "gallery",
    "events", "packages", "membership", "footer", "fonts", "sections", "seo",
  ];
  const [entries, assets] = await Promise.all([
    Promise.all(keys.map(async (k) => [k, await getCmsData(k)] as const)),
    getAllAssets(),
  ]);

  return NextResponse.json({
    content: Object.fromEntries(entries),
    assets,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, data } = await req.json() as { key: CmsKey; data: unknown };
  await setCmsData(key, data);
  return NextResponse.json({ ok: true });
}
