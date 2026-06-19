"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Bookings", href: "/admin/bookings", icon: "◷" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "✉" },
  { label: "Event Enquiries", href: "/admin/event-enquiries", icon: "◎" },
  { label: "Contact", href: "/admin/contacts", icon: "◌" },
  { label: "Customers", href: "/admin/customers", icon: "◉" },
  { label: "Rooms", href: "/admin/rooms", icon: "⬡" },
  { label: "Inventory", href: "/admin/inventory", icon: "⊟" },
  { label: "Gallery", href: "/admin/gallery", icon: "◫" },
  { label: "Packages", href: "/admin/packages", icon: "◈" },
  { label: "Events", href: "/admin/events", icon: "◈" },
  { label: "Discounts", href: "/admin/discounts", icon: "⊘" },
  { label: "CMS", href: "/admin/cms", icon: "✦" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export function AdminShell({
  children,
  sidebarSlot,
}: {
  children: React.ReactNode;
  sidebarSlot?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const currentLabel = NAV.find((n) => n.href === pathname)?.label ?? "Admin";

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-6 py-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            <span style={{ color: "#C9A84C", fontSize: 13, fontFamily: "var(--font-cormorant)", fontWeight: 500 }}>H</span>
          </div>
          <span
            className="text-base tracking-[0.2em] uppercase"
            style={{ color: "#C9A84C", fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
          >
            Hebron
          </span>
        </div>
        <span className="text-[9px] text-white/20 tracking-[0.25em] uppercase pl-10">Admin Console</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon }) => {
          const isCms = href === "/admin/cms";
          const active = isCms
            ? pathname.startsWith("/admin/cms")
            : pathname === href;
          return (
            <div key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150"
                style={{
                  borderRadius: 6,
                  color: active ? "#C9A84C" : "rgba(255,255,255,0.4)",
                  background: active ? "rgba(201,168,76,0.1)" : "transparent",
                }}
              >
                <span
                  style={{ opacity: active ? 0.9 : 0.5, fontSize: 13, width: 16, textAlign: "center" }}
                >
                  {icon}
                </span>
                <span style={{ color: active ? "#C9A84C" : "rgba(255,255,255,0.45)" }}>
                  {label}
                </span>
              </Link>

              {/* CMS sub-sections — inline sub-nav, visible when on CMS */}
              {isCms && sidebarSlot && active && (
                <div className="ml-7 mt-0.5 mb-1 flex flex-col gap-0">
                  {sidebarSlot}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 12 }}>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-white/5 rounded"
          style={{ color: "rgba(255,255,255,0.25)", borderRadius: 6 }}
        >
          <span style={{ fontSize: 13, width: 16, textAlign: "center" }}>↪</span>
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
        <p className="text-[8px] text-white/10 tracking-[0.15em] uppercase px-3 mt-1">Hebron Hotels © 2026</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F0E8", fontFamily: "var(--font-inter)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-56 flex-shrink-0 flex-col"
        style={{ background: "#0D0704", minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col w-56 lg:hidden transition-transform duration-300"
        style={{
          background: "#0D0704",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center gap-4 px-5 py-4 flex-shrink-0"
          style={{ background: "#0D0704", borderBottom: "1px solid rgba(201,168,76,0.1)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Open menu"
          >
            <span className="block w-5 h-px bg-white/50" />
            <span className="block w-5 h-px bg-white/50" />
            <span className="block w-3.5 h-px bg-white/50" />
          </button>
          <span
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: "#C9A84C", fontFamily: "var(--font-cormorant)" }}
          >
            {currentLabel}
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
