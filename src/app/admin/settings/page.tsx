import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettings() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <AdminShell>
      <div className="px-8 py-8 max-w-xl">
        <div className="mb-8">
          <h1 className="text-2xl text-[#1A0E0A] mb-1" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
            Site Settings
          </h1>
          <p className="text-sm text-[#1A0E0A]/40">Contact info & social links</p>
        </div>
        <SettingsForm settings={settings} />
      </div>
    </AdminShell>
  );
}
