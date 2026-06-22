"use client";

import { useState } from "react";

interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  size: string;
  occupancy: string;
  image: string;
  amenities: string;
  featured: boolean;
  order: number;
}

const EMPTY: Omit<Room, "id" | "order"> = {
  slug: "",
  name: "",
  description: "",
  size: "",
  occupancy: "",
  image: "",
  amenities: "",
  featured: false,
};

export function RoomsAdmin({ rooms: initial }: { rooms: Room[] }) {
  const [rooms, setRooms] = useState(initial);
  const [editing, setEditing] = useState<(Partial<Room> & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const amenitiesArr = typeof editing.amenities === "string"
      ? editing.amenities.split("\n").map((s) => s.trim()).filter(Boolean)
      : editing.amenities;

    const payload = { ...editing, amenities: amenitiesArr };

    if (editing.id) {
      const res = await fetch(`/api/rooms/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, order: rooms.length }),
      });
      const created = await res.json();
      setRooms((prev) => [...prev, created]);
    }
    setEditing(null);
    setSaving(false);
  }

  async function deleteRoom(id: string) {
    if (!confirm("Archive this room?")) return;
    await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();
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
      {/* Add button */}
      <button
        onClick={() => setEditing(EMPTY)}
        className="mb-5 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors"
        style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
      >
        + Add Room
      </button>

      {/* Room list */}
      <div className="grid gap-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white p-5 flex gap-4 items-center"
            style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
          >
            {room.image && (
              <div
                className="w-16 h-16 flex-shrink-0 bg-[#2D1A0E] overflow-hidden"
                style={{ borderRadius: 4 }}
              >
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-[#1A0E0A]">{room.name}</span>
                {room.featured && (
                  <span
                    className="text-[9px] px-2 py-0.5 tracking-[0.15em] uppercase"
                    style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", borderRadius: 99 }}
                  >
                    Featured
                  </span>
                )}
              </div>
              <div className="text-xs text-[#1A0E0A]/40">
                {room.size} · {room.occupancy}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setEditing(() => {
                    let parsed: unknown;
                    try { parsed = JSON.parse(room.amenities || "[]"); } catch { parsed = []; }
                    const arr = Array.isArray(parsed) ? parsed : [];
                    return { ...room, amenities: arr.join("\n") };
                  })
                }
                className="text-xs px-3 py-1.5 transition-colors"
                style={{ border: "1px solid rgba(26,14,10,0.15)", borderRadius: 4, color: "#1A0E0A" }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteRoom(room.id)}
                className="text-xs px-3 py-1.5 transition-colors text-red-400"
                style={{ border: "1px solid rgba(239,68,68,0.2)", borderRadius: 4 }}
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,7,4,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div
            className="w-full max-w-lg bg-white p-6 overflow-y-auto"
            style={{ borderRadius: 12, maxHeight: "90vh" }}
          >
            <h2
              className="text-xl mb-5 text-[#1A0E0A]"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
            >
              {editing.id ? "Edit Room" : "Add Room"}
            </h2>

            <div className="flex flex-col gap-4">
              {(["name", "slug", "size", "occupancy"] as const).map((field) => (
                <div key={field}>
                  <label style={labelStyle}>{field}</label>
                  <input
                    style={inputStyle}
                    value={(editing as Record<string, string>)[field] ?? ""}
                    onChange={(e) => setEditing((p) => p ? { ...p, [field]: e.target.value } : p)}
                  />
                </div>
              ))}

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing((p) => p ? { ...p, description: e.target.value } : p)}
                />
              </div>

              <div>
                <label style={labelStyle}>Amenities (one per line)</label>
                <textarea
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical" }}
                  value={typeof editing.amenities === "string" ? editing.amenities : ""}
                  onChange={(e) => setEditing((p) => p ? { ...p, amenities: e.target.value } : p)}
                />
              </div>

              <div>
                <label style={labelStyle}>Image</label>
                <div className="flex gap-2">
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={editing.image ?? ""}
                    onChange={(e) => setEditing((p) => p ? { ...p, image: e.target.value } : p)}
                    placeholder="/images/rooms/..."
                  />
                  <label
                    className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors flex-shrink-0"
                    style={{ background: "#F5F0E8", border: "1px solid rgba(26,14,10,0.12)", borderRadius: 4, color: "#1A0E0A" }}
                  >
                    {uploading ? "…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                    />
                  </label>
                </div>
                {editing.image && (
                  <img src={editing.image} className="mt-2 h-24 w-full object-cover rounded" alt="" />
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.featured ?? false}
                  onChange={(e) => setEditing((p) => p ? { ...p, featured: e.target.checked } : p)}
                />
                <span className="text-xs text-[#1A0E0A]/60">Featured room</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors"
                style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
              >
                {saving ? "Saving…" : "Save Room"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase"
                style={{ border: "1px solid rgba(26,14,10,0.15)", borderRadius: 6, color: "#1A0E0A" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
