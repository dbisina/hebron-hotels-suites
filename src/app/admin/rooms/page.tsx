import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RoomsAdmin } from "@/components/admin/RoomsAdmin";

export default async function AdminRooms() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const rooms = await prisma.room.findMany({
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
            Rooms
          </h1>
          <p className="text-sm text-[#1A0E0A]/40">{rooms.length} active rooms</p>
        </div>
        <RoomsAdmin rooms={rooms} />
      </div>
    </AdminShell>
  );
}
