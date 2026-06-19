"use client";

import { useState } from "react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  status: string;
  createdAt: Date;
}

export function EnquiryList({ enquiries: initial }: { enquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial);
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  async function markStatus(id: string, status: string) {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  async function deleteEnquiry(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  }

  const statusColor: Record<string, string> = {
    new: "#C9A84C",
    read: "rgba(26,14,10,0.35)",
    responded: "#4CAF50",
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-5">
        {["all", "new", "read", "responded"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{
              borderRadius: 99,
              background: filter === f ? "#1A0E0A" : "transparent",
              color: filter === f ? "#F9F1E3" : "rgba(26,14,10,0.4)",
              border: "1px solid rgba(26,14,10,0.12)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="bg-white overflow-hidden"
        style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
      >
        {visible.length === 0 ? (
          <p className="px-6 py-10 text-sm text-center text-[#1A0E0A]/30">No enquiries.</p>
        ) : (
          visible.map((enq) => (
            <div
              key={enq.id}
              className="px-6 py-5 border-b border-[#1A0E0A]/04 last:border-0 grid grid-cols-[auto_1fr_auto] gap-4 items-start"
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: statusColor[enq.status] ?? "gray" }}
              />

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-[#1A0E0A]">
                    {enq.name || "Anonymous"}
                  </span>
                  {enq.email && (
                    <a
                      href={`mailto:${enq.email}`}
                      className="text-xs text-[#C9A84C]"
                    >
                      {enq.email}
                    </a>
                  )}
                  {enq.phone && (
                    <a href={`tel:${enq.phone}`} className="text-xs text-[#1A0E0A]/40">
                      {enq.phone}
                    </a>
                  )}
                </div>
                <div className="text-xs text-[#1A0E0A]/50 mb-1">
                  {enq.checkIn} → {enq.checkOut} · {enq.guests} {enq.guests === 1 ? "guest" : "guests"}
                </div>
                {enq.message && (
                  <p className="text-xs text-[#1A0E0A]/40 mt-1">{enq.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 items-end">
                <span
                  className="text-[9px] tracking-[0.15em] uppercase px-2.5 py-1"
                  style={{
                    background: `${statusColor[enq.status]}18`,
                    color: statusColor[enq.status],
                    borderRadius: 99,
                  }}
                >
                  {enq.status}
                </span>
                <div className="flex gap-2">
                  {enq.status !== "read" && (
                    <button
                      onClick={() => markStatus(enq.id, "read")}
                      className="text-[9px] text-[#1A0E0A]/30 hover:text-[#1A0E0A]/60 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {enq.status !== "responded" && (
                    <button
                      onClick={() => markStatus(enq.id, "responded")}
                      className="text-[9px] text-green-600/60 hover:text-green-600 transition-colors"
                    >
                      Responded
                    </button>
                  )}
                  <button
                    onClick={() => deleteEnquiry(enq.id)}
                    className="text-[9px] text-red-400/40 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
