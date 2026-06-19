import { prisma } from "./db";

export type CmsKey =
  | "hero" | "about" | "facilities" | "rooms" | "gallery"
  | "events" | "packages" | "membership" | "footer"
  | "fonts" | "sections" | "seo";

export async function getCmsData<T = Record<string, unknown>>(
  key: CmsKey
): Promise<T | null> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: key } });
    if (!row) return null;
    return JSON.parse(row.data) as T;
  } catch {
    return null;
  }
}

export async function setCmsData(key: CmsKey, data: unknown): Promise<void> {
  await prisma.siteContent.upsert({
    where: { id: key },
    create: { id: key, data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
}

export async function getAsset(id: string): Promise<string | null> {
  const row = await prisma.siteAsset.findUnique({ where: { id } });
  return row?.url ?? null;
}

export async function setAsset(id: string, url: string): Promise<void> {
  await prisma.siteAsset.upsert({
    where: { id },
    create: { id, url },
    update: { url },
  });
}

export async function getAllAssets(): Promise<Record<string, string>> {
  const rows = await prisma.siteAsset.findMany();
  return Object.fromEntries(rows.map((r) => [r.id, r.url]));
}
