"use client";

import { useState } from "react";

interface Package {
  id: string;
  name: string;
  description: string;
  highlight: string;
  image: string;
  includes: string;
  order: number;
}

const EMPTY: Omit<Package, "id" | "order"> = {
  name: "",
  description: "",
  highlight: "",
  image: "",
  includes: "",
};

export function PackagesAdmin({ packages: initial }: { packages: Package[] }) {
  const [packages, setPackages] = useState(initial);
  const [editing, setEditing] = useState<(Partial<Package> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const includesArr = typeof editing.includes === "string"
      ? editing.includes.split("\n").map((s) => s.trim()).filter(Boolean)
      : editing.includes;
    const payload = { ...editing, includes: includesArr };

    if (editing.id) {
      const res = await fetch(`/api/packages/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, order: packages.length }),
      });
      const created = await res.json();
      setPackages((prev) => [...prev, created]);
    }
    setEditing(null);
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("Archive package?")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE" });
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) { setUploading(false); return; }
    const { url } = await res.json() as { url: string };
    setEditing((prev) => prev ? { ...prev, image: url } : prev);
    setUploading(false);
  }

  const inputStyle = {
    width: "100%",
    background: "#F5F0E8",
    border: "1px solid rgba(26,14,10,0.12)",
    color: "#1A0E0A",
    fontSize: 13,
    padding: "8px 12px",
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

  return (
    <div>
      <button
        onClick={() => setEditing(EMPTY)}
        className="mb-5 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase"
        style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
      >
        + Add Package
      </button>

      <div className="grid gap-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white p-5 flex gap-4 items-center"
            style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
          >
            {pkg.image && (
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ borderRadius: 4 }}>
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-[#1A0E0A]">{pkg.name}</span>
                <span className="text-[9px] px-2 py-0.5 tracking-[0.15em] uppercase" style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", borderRadius: 99 }}>{pkg.highlight}</span>
              </div>
              <p className="text-xs text-[#1A0E0A]/40 line-clamp-1">{pkg.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing({ ...pkg, includes: JSON.parse(pkg.includes || "[]").join("\n") })}
                className="text-xs px-3 py-1.5"
                style={{ border: "1px solid rgba(26,14,10,0.15)", borderRadius: 4, color: "#1A0E0A" }}
              >
                Edit
              </button>
              <button
                onClick={() => del(pkg.id)}
                className="text-xs px-3 py-1.5 text-red-400"
                style={{ border: "1px solid rgba(239,68,68,0.2)", borderRadius: 4 }}
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,7,4,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div className="w-full max-w-lg bg-white p-6 overflow-y-auto" style={{ borderRadius: 12, maxHeight: "90vh" }}>
            <h2 className="text-xl mb-5 text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              {editing.id ? "Edit Package" : "Add Package"}
            </h2>
            <div className="flex flex-col gap-4">
              {(["name", "highlight"] as const).map((f) => (
                <div key={f}>
                  <label style={labelStyle}>{f}</label>
                  <input style={inputStyle} value={(editing as Record<string, string>)[f] ?? ""} onChange={(e) => setEditing((p) => p ? { ...p, [f]: e.target.value } : p)} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={editing.description ?? ""} onChange={(e) => setEditing((p) => p ? { ...p, description: e.target.value } : p)} />
              </div>
              <div>
                <label style={labelStyle}>Includes (one per line)</label>
                <textarea rows={5} style={{ ...inputStyle, resize: "vertical" }} value={typeof editing.includes === "string" ? editing.includes : ""} onChange={(e) => setEditing((p) => p ? { ...p, includes: e.target.value } : p)} />
              </div>
              <div>
                <label style={labelStyle}>Image</label>
                <div className="flex gap-2">
                  <input style={{ ...inputStyle, flex: 1 }} value={editing.image ?? ""} onChange={(e) => setEditing((p) => p ? { ...p, image: e.target.value } : p)} placeholder="/images/packages/..." />
                  <label className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase cursor-pointer flex-shrink-0" style={{ background: "#F5F0E8", border: "1px solid rgba(26,14,10,0.12)", borderRadius: 4, color: "#1A0E0A" }}>
                    {uploading ? "…" : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                </div>
                {editing.image && <img src={editing.image} className="mt-2 h-24 w-full object-cover rounded" alt="" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase" style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}>
                {saving ? "Saving…" : "Save Package"}
              </button>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase" style={{ border: "1px solid rgba(26,14,10,0.15)", borderRadius: 6, color: "#1A0E0A" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
