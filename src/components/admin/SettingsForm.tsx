"use client";

import { useState } from "react";

interface Settings {
  phone: string;
  email: string;
  address: string;
  checkIn: string;
  checkOut: string;
  facebook: string;
  instagram: string;
}

export function SettingsForm({ settings: initial }: { settings: Settings | null }) {
  const [form, setForm] = useState<Settings>(initial ?? {
    phone: "",
    email: "",
    address: "",
    checkIn: "12:00 PM",
    checkOut: "10:00 AM",
    facebook: "",
    instagram: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputStyle = {
    width: "100%",
    background: "#F5F0E8",
    border: "1px solid rgba(26,14,10,0.12)",
    color: "#1A0E0A",
    fontSize: 13,
    padding: "9px 12px",
    outline: "none",
    borderRadius: 4,
  };

  const labelStyle = {
    display: "block",
    fontSize: 9,
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: "rgba(26,14,10,0.4)",
    marginBottom: 6,
  };

  const fields: { key: keyof Settings; label: string }[] = [
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "checkIn", label: "Check-In Time" },
    { key: "checkOut", label: "Check-Out Time" },
    { key: "facebook", label: "Facebook URL" },
    { key: "instagram", label: "Instagram URL" },
  ];

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <div className="bg-white p-6 flex flex-col gap-5" style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}>
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input
              style={inputStyle}
              value={form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase"
          style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {saved && <span className="text-xs text-green-600">Saved ✓</span>}
      </div>
    </form>
  );
}
