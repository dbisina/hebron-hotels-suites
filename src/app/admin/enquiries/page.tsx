import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EnquiryList } from "@/components/admin/EnquiryList";

export default async function AdminEnquiries() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <div className="px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl text-[#1A0E0A] mb-1"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
          >
            Enquiries
          </h1>
          <p className="text-sm text-[#1A0E0A]/40">{enquiries.length} total</p>
        </div>
        <EnquiryList enquiries={enquiries} />
      </div>
    </AdminShell>
  );
}
