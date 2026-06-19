import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GalleryAdmin } from "@/components/admin/GalleryAdmin";

export default async function AdminGallery() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const images = await prisma.galleryImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <AdminShell>
      <div className="px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl text-[#1A0E0A] mb-1"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
          >
            Gallery
          </h1>
          <p className="text-sm text-[#1A0E0A]/40">{images.length} images</p>
        </div>
        <GalleryAdmin images={images} />
      </div>
    </AdminShell>
  );
}
