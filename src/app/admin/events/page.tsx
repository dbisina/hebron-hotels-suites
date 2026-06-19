import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function AdminEvents() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const events = await prisma.event.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <AdminShell>
      <div className="px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl text-[#1A0E0A] mb-1" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
            Events
          </h1>
          <p className="text-sm text-[#1A0E0A]/40">{events.length} event types configured</p>
        </div>

        {events.length === 0 ? (
          <div
            className="bg-white p-10 text-center"
            style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
          >
            <p className="text-sm text-[#1A0E0A]/30">
              Events are defined in <code className="bg-gray-100 px-1 rounded text-xs">src/lib/content.ts</code>.
              Add event images via the Gallery.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white p-5 flex items-center gap-4"
                style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#1A0E0A]">{ev.type}</span>
                  <p className="text-xs text-[#1A0E0A]/40 mt-0.5">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-[#1A0E0A]/30">
          Event details are managed through <code className="bg-gray-100 px-1 rounded">src/lib/content.ts</code>.
          Photography for events can be uploaded via <a href="/admin/gallery" className="text-[#C9A84C]">Gallery</a>.
        </p>
      </div>
    </AdminShell>
  );
}
