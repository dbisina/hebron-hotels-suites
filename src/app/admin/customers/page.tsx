"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface CustomerBooking {
  id: string; status: string; amount: number; createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  bookings: CustomerBooking[];
}

const TH = "text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/35 font-normal text-left py-3 px-4";
const TD = "py-3 px-4 text-sm text-[#1A0E0A]/70 border-b border-[rgba(26,14,10,0.04)]";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <AdminShell>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              Customers
            </h1>
            <p className="text-xs text-[#1A0E0A]/40 mt-0.5">
              {customers.length} guests · ₦{totalRevenue.toLocaleString()} total revenue
            </p>
          </div>
          <input
            type="search"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm px-4 py-2 border border-[rgba(26,14,10,0.1)] outline-none rounded-full text-[#1A0E0A]"
            style={{ background: "white", width: 240 }}
          />
        </div>

        {/* Top spenders */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {customers.slice(0, 3).map((c, i) => (
            <div key={c.id} className="p-4 bg-white" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{ background: i === 0 ? "rgba(201,168,76,0.15)" : "rgba(26,14,10,0.06)", color: i === 0 ? "#C9A84C" : "#1A0E0A" }}
                >
                  {c.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#1A0E0A] truncate">{c.name}</div>
                  <div className="text-[10px] text-[#1A0E0A]/40 truncate">{c.email}</div>
                </div>
              </div>
              <div className="text-xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)" }}>
                ₦{c.totalSpent.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#1A0E0A]/40">{c.totalBookings} booking{c.totalBookings !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>

        <div className="bg-white" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10, overflow: "hidden" }}>
          {loading ? (
            <div className="py-16 text-center text-[#1A0E0A]/30 text-sm">Loading…</div>
          ) : (
            <table className="w-full">
              <thead style={{ borderBottom: "1px solid rgba(26,14,10,0.06)", background: "rgba(26,14,10,0.02)" }}>
                <tr>
                  <th className={TH}>Guest</th>
                  <th className={TH}>Phone</th>
                  <th className={TH}>Bookings</th>
                  <th className={TH}>Total Spent</th>
                  <th className={TH}>Since</th>
                  <th className={TH}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#1A0E0A]/30 text-sm">No customers found</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[rgba(26,14,10,0.01)] transition-colors">
                    <td className={TD}>
                      <div className="font-medium text-[#1A0E0A]">{c.name}</div>
                      <div className="text-xs text-[#1A0E0A]/40">{c.email}</div>
                    </td>
                    <td className={TD}>{c.phone || <span className="text-[#1A0E0A]/20">-</span>}</td>
                    <td className={TD}>
                      <span className="font-medium text-[#1A0E0A]">{c.totalBookings}</span>
                    </td>
                    <td className={TD}>
                      <span className="font-display text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)" }}>
                        ₦{c.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className={TD}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className={TD}>
                      <button
                        onClick={() => setDetail(c)}
                        className="text-[10px] tracking-[0.15em] uppercase text-[#1A0E0A]/30 hover:text-[#C9A84C] transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,7,4,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetail(null); }}
        >
          <div className="w-full max-w-md p-7" style={{ background: "white", borderRadius: 12, border: "1px solid rgba(26,14,10,0.06)", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
                  {detail.name}
                </h2>
                <p className="text-xs text-[#1A0E0A]/40 mt-0.5">{detail.email}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-[#1A0E0A]/30 hover:text-[#1A0E0A] text-lg leading-none">×</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                ["Total Bookings", String(detail.totalBookings)],
                ["Total Spent", `₦${detail.totalSpent.toLocaleString()}`],
                ["Phone", detail.phone || "-"],
                ["Customer Since", new Date(detail.createdAt).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label} className="p-3 bg-[rgba(26,14,10,0.02)] rounded">
                  <div className="text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/30 mb-1">{label}</div>
                  <div className="text-sm font-medium text-[#1A0E0A]">{value}</div>
                </div>
              ))}
            </div>

            <h3 className="text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/30 mb-3">Booking History</h3>
            <div className="flex flex-col gap-2">
              {detail.bookings.length === 0 ? (
                <p className="text-xs text-[#1A0E0A]/30">No bookings yet</p>
              ) : detail.bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-[rgba(26,14,10,0.04)] text-sm">
                  <span className="text-[#1A0E0A]/60 text-xs">{new Date(b.createdAt).toLocaleDateString()}</span>
                  <span className="text-[9px] px-2 py-0.5 uppercase tracking-[0.1em] rounded-full"
                    style={{
                      background: b.status === "confirmed" ? "rgba(34,197,94,0.1)" : "rgba(26,14,10,0.06)",
                      color: b.status === "confirmed" ? "#166534" : "#1A0E0A",
                    }}>
                    {b.status}
                  </span>
                  <span className="text-[#1A0E0A]">₦{b.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
