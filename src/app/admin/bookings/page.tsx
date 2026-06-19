"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface Booking {
  id: string;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  amount: number;
  discountCode: string;
  discountAmount: number;
  status: string;
  paystackStatus: string;
  paystackRef: string;
  createdAt: string;
  inventory: { roomNumber: string; floor: number; room: { name: string } };
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: "rgba(34,197,94,0.1)", color: "#166534" },
  pending: { bg: "rgba(234,179,8,0.1)", color: "#713f12" },
  cancelled: { bg: "rgba(239,68,68,0.08)", color: "#991b1b" },
  failed: { bg: "rgba(239,68,68,0.08)", color: "#991b1b" },
};

const TH = "text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/35 font-normal text-left py-3 px-4";
const TD = "py-3 px-4 text-sm text-[#1A0E0A]/70 border-b border-[rgba(26,14,10,0.04)]";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Booking | null>(null);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/bookings").then((r) => r.json()) as Booking[] | { error: string };
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
    setDetail(null);
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const total = bookings.reduce((s, b) => s + (b.status === "confirmed" ? b.amount : 0), 0);

  const statuses = ["all", "confirmed", "pending", "cancelled", "failed"];

  return (
    <AdminShell>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              Bookings
            </h1>
            <p className="text-xs text-[#1A0E0A]/40 mt-0.5">
              {bookings.filter((b) => b.status === "confirmed").length} confirmed · ₦{total.toLocaleString()} revenue
            </p>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 mb-6">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors capitalize"
              style={{
                borderRadius: 99,
                background: filter === s ? "#1A0E0A" : "white",
                color: filter === s ? "#F9F1E3" : "rgba(26,14,10,0.4)",
                border: "1px solid rgba(26,14,10,0.1)",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10, overflow: "hidden" }}>
          {loading ? (
            <div className="py-16 text-center text-[#1A0E0A]/30 text-sm">Loading…</div>
          ) : (
            <table className="w-full">
              <thead style={{ borderBottom: "1px solid rgba(26,14,10,0.06)", background: "rgba(26,14,10,0.02)" }}>
                <tr>
                  <th className={TH}>Ref</th>
                  <th className={TH}>Guest</th>
                  <th className={TH}>Room</th>
                  <th className={TH}>Dates</th>
                  <th className={TH}>Amount</th>
                  <th className={TH}>Status</th>
                  <th className={TH}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-[#1A0E0A]/30 text-sm">No bookings found</td></tr>
                ) : filtered.map((b) => {
                  const sc = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
                  return (
                    <tr key={b.id} className="hover:bg-[rgba(26,14,10,0.01)] transition-colors">
                      <td className={TD}>
                        <span className="font-mono text-xs text-[#1A0E0A]">{b.bookingRef}</span>
                      </td>
                      <td className={TD}>
                        <div className="font-medium text-[#1A0E0A]">{b.guestName}</div>
                        <div className="text-xs text-[#1A0E0A]/40">{b.guestEmail}</div>
                      </td>
                      <td className={TD}>
                        <div>{b.inventory?.room?.name ?? "-"}</div>
                        <div className="text-xs text-[#1A0E0A]/40">#{b.inventory?.roomNumber}</div>
                      </td>
                      <td className={TD}>
                        <div className="text-xs">{b.checkIn}</div>
                        <div className="text-xs text-[#1A0E0A]/40">{b.checkOut} · {b.nights}n</div>
                      </td>
                      <td className={TD}>
                        <span className="font-display text-sm text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)" }}>
                          ₦{b.amount.toLocaleString()}
                        </span>
                        {b.discountAmount > 0 && (
                          <div className="text-[10px] text-green-600">−₦{b.discountAmount.toLocaleString()}</div>
                        )}
                      </td>
                      <td className={TD}>
                        <span className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase rounded-full"
                          style={{ background: sc.bg, color: sc.color }}>
                          {b.status}
                        </span>
                      </td>
                      <td className={TD}>
                        <button
                          onClick={() => setDetail(b)}
                          className="text-[10px] tracking-[0.15em] uppercase text-[#1A0E0A]/30 hover:text-[#C9A84C] transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
                  Booking {detail.bookingRef}
                </h2>
                <p className="text-xs text-[#1A0E0A]/40 mt-0.5">{new Date(detail.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-[#1A0E0A]/30 hover:text-[#1A0E0A] text-lg leading-none">×</button>
            </div>

            {[
              ["Guest", detail.guestName],
              ["Email", detail.guestEmail],
              ["Phone", detail.guestPhone || "-"],
              ["Room", `${detail.inventory?.room?.name} #${detail.inventory?.roomNumber} (Floor ${detail.inventory?.floor})`],
              ["Check-in", detail.checkIn],
              ["Check-out", detail.checkOut],
              ["Nights", String(detail.nights)],
              ["Guests", String(detail.guests)],
              ["Subtotal", `₦${(detail.amount + detail.discountAmount).toLocaleString()}`],
              ["Discount", detail.discountCode ? `${detail.discountCode} (−₦${detail.discountAmount.toLocaleString()})` : "None"],
              ["Total Paid", `₦${detail.amount.toLocaleString()}`],
              ["Paystack Ref", detail.paystackRef || "-"],
              ["Payment Status", detail.paystackStatus],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-[rgba(26,14,10,0.04)] text-sm">
                <span className="text-[#1A0E0A]/40 text-xs tracking-[0.1em] uppercase">{label}</span>
                <span className="text-[#1A0E0A]/80 text-right max-w-[60%]">{value}</span>
              </div>
            ))}

            <div className="mt-6 flex gap-2">
              {detail.status !== "confirmed" && (
                <button
                  onClick={() => updateStatus(detail.id, "confirmed")}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase rounded"
                  style={{ background: "#166534", color: "white" }}
                >
                  Mark Confirmed
                </button>
              )}
              {detail.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(detail.id, "cancelled")}
                  className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase rounded"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#991b1b" }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
