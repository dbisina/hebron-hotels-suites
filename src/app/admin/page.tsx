import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const [
    roomCount,
    enquiryCount,
    galleryCount,
    packageCount,
    newEnquiries,
    confirmedBookings,
    pendingBookings,
    recentEnquiries,
    bookingRevenue,
    newEventEnquiries,
    newContacts,
  ] = await Promise.all([
    prisma.room.count({ where: { active: true } }),
    prisma.enquiry.count(),
    prisma.galleryImage.count({ where: { active: true } }),
    prisma.package.count({ where: { active: true } }),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.booking.aggregate({
      where: { status: "confirmed" },
      _sum: { amount: true },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ("eventEnquiry" in prisma ? (prisma as any).eventEnquiry.count({ where: { status: "new" } }) : Promise.resolve(0)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ("contactSubmission" in prisma ? (prisma as any).contactSubmission.count({ where: { status: "new" } }) : Promise.resolve(0)),
  ]);

  const totalRevenue = bookingRevenue._sum.amount ?? 0;

  const stats = [
    {
      label: "Confirmed Bookings",
      value: confirmedBookings,
      sub: `₦${totalRevenue.toLocaleString()} revenue`,
      href: "/admin/bookings",
      highlight: false,
      accent: false,
    },
    {
      label: "New Enquiries",
      value: newEnquiries,
      sub: `${enquiryCount} total`,
      href: "/admin/enquiries",
      highlight: newEnquiries > 0,
      accent: newEnquiries > 0,
    },
    {
      label: "Pending Payments",
      value: pendingBookings,
      sub: "awaiting payment",
      href: "/admin/bookings",
      highlight: false,
      accent: false,
    },
    {
      label: "Active Rooms",
      value: roomCount,
      sub: `${galleryCount} gallery images`,
      href: "/admin/rooms",
      highlight: false,
      accent: false,
    },
    {
      label: "New Event Enquiries",
      value: newEventEnquiries,
      sub: "from /events page",
      href: "/admin/event-enquiries",
      highlight: newEventEnquiries > 0,
      accent: newEventEnquiries > 0,
    },
    {
      label: "New Contact Messages",
      value: newContacts,
      sub: "from /contact page",
      href: "/admin/contacts",
      highlight: newContacts > 0,
      accent: newContacts > 0,
    },
  ];

  return (
    <AdminShell>
      <div className="px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1
              className="text-2xl text-[#1A0E0A] mb-1"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
            >
              Dashboard
            </h1>
            <p className="text-xs text-[#1A0E0A]/40">
              Welcome back, <span className="text-[#1A0E0A]/60">{session.email}</span>
            </p>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 99 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" style={{ boxShadow: "0 0 6px rgba(201,168,76,0.6)" }} />
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A84C]/80">Live</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="bg-white p-6 block transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
              style={{
                borderRadius: 10,
                border: s.accent ? "1px solid rgba(201,168,76,0.25)" : "1px solid rgba(26,14,10,0.06)",
                background: s.accent ? "rgba(201,168,76,0.03)" : "white",
              }}
            >
              <div
                className="text-3xl mb-1.5 transition-colors"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: s.accent ? "#C9A84C" : "#1A0E0A",
                  fontWeight: 300,
                }}
              >
                {s.value}
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#1A0E0A]/40 mb-1">{s.label}</div>
              {s.sub && (
                <div className="text-[10px] text-[#1A0E0A]/30">{s.sub}</div>
              )}
            </a>
          ))}
        </div>

        {/* Revenue summary bar */}
        <div
          className="mb-8 px-6 py-5 flex items-center justify-between gap-6"
          style={{ background: "#0D0704", borderRadius: 10 }}
        >
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-white/30 mb-1">Total Revenue</p>
            <p
              className="text-2xl"
              style={{ fontFamily: "var(--font-cormorant)", color: "#C9A84C", fontWeight: 300 }}
            >
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="text-right">
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Confirmed</p>
            <p className="text-lg text-white/70" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}>
              {confirmedBookings} booking{confirmedBookings !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <a
              href="/admin/bookings"
              className="text-[9px] tracking-[0.2em] uppercase transition-colors"
              style={{ color: "#C9A84C" }}
            >
              View All →
            </a>
          </div>
        </div>

        {/* Recent enquiries */}
        <div
          className="bg-white mb-6"
          style={{ borderRadius: 10, border: "1px solid rgba(26,14,10,0.06)" }}
        >
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(26,14,10,0.05)" }}>
            <h2
              className="text-base text-[#1A0E0A]"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
            >
              Recent Enquiries
            </h2>
            <a
              href="/admin/enquiries"
              className="text-[9px] tracking-[0.2em] uppercase transition-colors hover:opacity-70"
              style={{ color: "#C9A84C" }}
            >
              View All
            </a>
          </div>

          <div>
            {recentEnquiries.length === 0 ? (
              <p className="px-6 py-10 text-sm text-[#1A0E0A]/25 text-center">No enquiries yet.</p>
            ) : (
              recentEnquiries.map((enq, i) => (
                <div
                  key={enq.id}
                  className="px-6 py-3.5 flex items-center gap-4"
                  style={{ borderBottom: i < recentEnquiries.length - 1 ? "1px solid rgba(26,14,10,0.04)" : "none" }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: enq.status === "new" ? "#C9A84C" : "rgba(26,14,10,0.12)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-[#1A0E0A]/75">
                      {enq.name || "Guest"} · {enq.guests} {enq.guests === 1 ? "guest" : "guests"}
                    </span>
                    <span className="text-xs text-[#1A0E0A]/30 ml-3">
                      {enq.checkIn} → {enq.checkOut}
                    </span>
                  </div>
                  <span
                    className="text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 flex-shrink-0"
                    style={{
                      background: enq.status === "new" ? "rgba(201,168,76,0.1)" : "rgba(26,14,10,0.04)",
                      color: enq.status === "new" ? "#C9A84C" : "rgba(26,14,10,0.3)",
                      borderRadius: 99,
                    }}
                  >
                    {enq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Add Room", href: "/admin/rooms" },
            { label: "Upload to Gallery", href: "/admin/gallery" },
            { label: "Edit Packages", href: "/admin/packages" },
            { label: "Site Settings", href: "/admin/settings" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="py-3 text-center text-[9px] tracking-[0.2em] uppercase transition-all duration-150 hover:bg-[rgba(26,14,10,0.04)] hover:border-[rgba(26,14,10,0.2)]"
              style={{
                border: "1px solid rgba(26,14,10,0.1)",
                color: "rgba(26,14,10,0.5)",
                borderRadius: 8,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
