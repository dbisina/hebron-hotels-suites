"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface Room { id: string; name: string; }
interface InventoryItem {
  id: string; roomNumber: string; floor: number; notes: string; active: boolean;
  room: Room; createdAt: string;
}

const TH = "text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/35 font-normal text-left py-3 px-4";
const TD = "py-3 px-4 text-sm text-[#1A0E0A]/70 border-b border-[rgba(26,14,10,0.04)]";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ roomId: "", roomNumber: "", floor: 1, notes: "", active: true });
  const [saving, setSaving] = useState(false);
  const [filterRoom, setFilterRoom] = useState("all");

  async function load() {
    setLoading(true);
    const [inv, rm] = await Promise.all([
      fetch("/api/inventory").then((r) => r.json()) as Promise<InventoryItem[]>,
      fetch("/api/rooms").then((r) => r.json()) as Promise<Room[]>,
    ]);
    setItems(Array.isArray(inv) ? inv : []);
    setRooms(Array.isArray(rm) ? rm : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditItem(null);
    setForm({ roomId: rooms[0]?.id ?? "", roomNumber: "", floor: 1, notes: "", active: true });
    setModalOpen(true);
  }

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    setForm({ roomId: item.room.id, roomNumber: item.roomNumber, floor: item.floor, notes: item.notes, active: item.active });
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/inventory/${editItem.id}` : "/api/inventory";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function toggle(item: InventoryItem) {
    await fetch(`/api/inventory/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  const filtered = filterRoom === "all" ? items : items.filter((i) => i.room.id === filterRoom);
  const activeCount = items.filter((i) => i.active).length;

  return (
    <AdminShell>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              Room Inventory
            </h1>
            <p className="text-xs text-[#1A0E0A]/40 mt-0.5">
              {activeCount} active units across {rooms.length} room types
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
          >
            + Add Unit
          </button>
        </div>

        {/* Stats by room type */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {rooms.map((room) => {
            const roomItems = items.filter((i) => i.room.id === room.id);
            const active = roomItems.filter((i) => i.active).length;
            return (
              <button
                key={room.id}
                onClick={() => setFilterRoom(filterRoom === room.id ? "all" : room.id)}
                className="text-left p-4 transition-colors"
                style={{
                  background: filterRoom === room.id ? "rgba(201,168,76,0.08)" : "white",
                  border: `1px solid ${filterRoom === room.id ? "rgba(201,168,76,0.3)" : "rgba(26,14,10,0.06)"}`,
                  borderRadius: 10,
                }}
              >
                <div className="text-xs text-[#1A0E0A]/40 mb-1 truncate">{room.name}</div>
                <div className="text-2xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {active}
                </div>
                <div className="text-[10px] text-[#1A0E0A]/30">{roomItems.length} total</div>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10, overflow: "hidden" }}>
          {loading ? (
            <div className="py-16 text-center text-[#1A0E0A]/30 text-sm">Loading…</div>
          ) : (
            <table className="w-full">
              <thead style={{ borderBottom: "1px solid rgba(26,14,10,0.06)", background: "rgba(26,14,10,0.02)" }}>
                <tr>
                  <th className={TH}>Room #</th>
                  <th className={TH}>Type</th>
                  <th className={TH}>Floor</th>
                  <th className={TH}>Notes</th>
                  <th className={TH}>Status</th>
                  <th className={TH}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-[#1A0E0A]/30 text-sm">No inventory found</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[rgba(26,14,10,0.01)] transition-colors">
                    <td className={TD}>
                      <span className="font-medium text-[#1A0E0A]">{item.roomNumber}</span>
                    </td>
                    <td className={TD}>{item.room.name}</td>
                    <td className={TD}>Floor {item.floor}</td>
                    <td className={TD}>{item.notes || <span className="text-[#1A0E0A]/20">-</span>}</td>
                    <td className={TD}>
                      <button
                        onClick={() => toggle(item)}
                        className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase rounded-full"
                        style={{
                          background: item.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)",
                          color: item.active ? "#166534" : "#991b1b",
                        }}
                      >
                        {item.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className={TD}>
                      <button
                        onClick={() => openEdit(item)}
                        className="text-[10px] tracking-[0.15em] uppercase text-[#1A0E0A]/30 hover:text-[#C9A84C] transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,7,4,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="w-full max-w-md p-7" style={{ background: "white", borderRadius: 12, border: "1px solid rgba(26,14,10,0.06)" }}>
            <h2 className="text-xl mb-6 text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              {editItem ? "Edit Unit" : "Add Room Unit"}
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-1.5">Room Type *</label>
                <select
                  value={form.roomId}
                  onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 border border-[rgba(26,14,10,0.12)] outline-none rounded"
                  style={{ color: "#1A0E0A" }}
                >
                  {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-1.5">Room Number *</label>
                <input
                  className="w-full text-sm px-3 py-2.5 border border-[rgba(26,14,10,0.12)] outline-none rounded"
                  value={form.roomNumber}
                  onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))}
                  placeholder="e.g. 101"
                  style={{ color: "#1A0E0A" }}
                />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-1.5">Floor</label>
                <input
                  type="number" min={1} max={50}
                  className="w-full text-sm px-3 py-2.5 border border-[rgba(26,14,10,0.12)] outline-none rounded"
                  value={form.floor}
                  onChange={(e) => setForm((p) => ({ ...p, floor: +e.target.value }))}
                  style={{ color: "#1A0E0A" }}
                />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-1.5">Notes</label>
                <input
                  className="w-full text-sm px-3 py-2.5 border border-[rgba(26,14,10,0.12)] outline-none rounded"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="e.g. Corner room, sea view"
                  style={{ color: "#1A0E0A" }}
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-[#1A0E0A]/70">Active (available for booking)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-[rgba(26,14,10,0.15)] text-[#1A0E0A]/50 rounded"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.roomId || !form.roomNumber}
                className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40 rounded"
                style={{ background: "#1A0E0A", color: "#F9F1E3" }}
              >
                {saving ? "Saving…" : editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
