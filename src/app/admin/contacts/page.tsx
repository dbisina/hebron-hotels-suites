import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactTable } from "./ContactTable";

export default async function AdminContacts() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <div className="px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-[#1A0E0A] mb-1" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              Contact Messages
            </h1>
            <p className="text-sm text-[#1A0E0A]/40">{submissions.length} total submissions</p>
          </div>
          <div className="flex gap-2">
            {(["new", "read", "replied"] as const).map((s) => (
              <span
                key={s}
                className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                style={{
                  background: "rgba(26,14,10,0.05)",
                  color: "rgba(26,14,10,0.35)",
                  borderRadius: 4,
                }}
              >
                {s}: {submissions.filter((e) => e.status === s).length}
              </span>
            ))}
          </div>
        </div>

        {submissions.length === 0 ? (
          <div
            className="bg-white p-12 text-center"
            style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
          >
            <p className="text-sm text-[#1A0E0A]/30">No contact messages yet. They will appear here when guests use the contact form at <code className="bg-gray-100 px-1 rounded text-xs">/contact</code>.</p>
          </div>
        ) : (
          <ContactTable initial={submissions} />
        )}
      </div>
    </AdminShell>
  );
}
