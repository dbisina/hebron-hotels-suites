"use client";

import { useState } from "react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
};

const STATUS_OPTIONS = ["new", "read", "replied", "closed"];

const STATUS_COLORS: Record<string, string> = {
  new: "#C9A84C",
  read: "#3B82F6",
  replied: "#22C55E",
  closed: "#6B7280",
};

export function ContactTable({ initial }: { initial: Submission[] }) {
  const [items, setItems] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    await fetch("/api/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white overflow-hidden"
          style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
        >
          <button
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-black/[0.02] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#1A0E0A]">{item.name}</span>
                <span
                  className="text-[9px] tracking-[0.15em] uppercase px-2 py-0.5"
                  style={{
                    background: `${STATUS_COLORS[item.status] ?? "#6B7280"}18`,
                    color: STATUS_COLORS[item.status] ?? "#6B7280",
                    borderRadius: 3,
                  }}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#1A0E0A]/40 mt-0.5 truncate">
                {item.subject ? `${item.subject} · ` : ""}{item.email}
              </p>
            </div>
            <div className="text-xs text-[#1A0E0A]/25 flex-shrink-0">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <span
              className="text-[#1A0E0A]/25 text-xs flex-shrink-0 transition-transform duration-200"
              style={{ transform: expanded === item.id ? "rotate(180deg)" : "none" }}
            >
              ▾
            </span>
          </button>

          {expanded === item.id && (
            <div
              className="px-5 pb-5 pt-1 flex flex-col gap-4"
              style={{ borderTop: "1px solid rgba(26,14,10,0.05)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ["Email", item.email],
                  ["Phone", item.phone || "—"],
                  ["Subject", item.subject || "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[8px] tracking-[0.2em] uppercase text-[#1A0E0A]/30 mb-0.5">{label}</p>
                    <p className="text-sm text-[#1A0E0A]/70">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[8px] tracking-[0.2em] uppercase text-[#1A0E0A]/30 mb-1">Message</p>
                <p className="text-sm text-[#1A0E0A]/70 leading-relaxed">{item.message}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/30">Status:</span>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(item.id, s)}
                    className="text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 transition-all"
                    style={{
                      borderRadius: 4,
                      background: item.status === s ? `${STATUS_COLORS[s]}20` : "rgba(26,14,10,0.04)",
                      color: item.status === s ? STATUS_COLORS[s] : "rgba(26,14,10,0.35)",
                    }}
                  >
                    {s}
                  </button>
                ))}

                <a
                  href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || "Your message")}`}
                  className="ml-auto text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    color: "#C9A84C",
                    borderRadius: 4,
                  }}
                >
                  Reply by Email
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
