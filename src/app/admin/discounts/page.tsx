"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number;
  usedCount: number;
  minAmount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

const TH = "text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/35 font-normal text-left py-3 px-4";
const TD = "py-3 px-4 text-sm text-[#1A0E0A]/70 border-b border-[rgba(26,14,10,0.04)]";
const INPUT = "w-full text-sm px-3 py-2.5 border border-[rgba(26,14,10,0.12)] outline-none rounded text-[#1A0E0A]";
const LABEL = "block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-1.5";

type FormType = { code: string; type: "percentage" | "fixed"; value: number; maxUses: number; minAmount: number; expiresAt: string };
const EMPTY: FormType = { code: "", type: "percentage", value: 10, maxUses: 0, minAmount: 0, expiresAt: "" };

export default function DiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState<FormType>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/discounts").then((r) => r.ok ? r.json() : []).catch(() => []) as DiscountCode[];
    setCodes(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditItem(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(item: DiscountCode) {
    setEditItem(item);
    setForm({
      code: item.code,
      type: item.type,
      value: item.value,
      maxUses: item.maxUses,
      minAmount: item.minAmount,
      expiresAt: item.expiresAt ? item.expiresAt.split("T")[0] : "",
    });
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/discounts/${editItem.id}` : "/api/discounts";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        expiresAt: form.expiresAt || null,
      }),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function toggleActive(item: DiscountCode) {
    await fetch(`/api/discounts/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  async function deleteCode(item: DiscountCode) {
    if (!confirm(`Delete code ${item.code}?`)) return;
    await fetch(`/api/discounts/${item.id}`, { method: "DELETE" });
    load();
  }

  const activeCodes = codes.filter((c) => c.active);

  return (
    <AdminShell>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl text-[#1A0E0A]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}>
              Discount Codes
            </h1>
            <p className="text-xs text-[#1A0E0A]/40 mt-0.5">
              {activeCodes.length} active codes
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase"
            style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
          >
            + New Code
          </button>
        </div>

        <div className="bg-white" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10, overflow: "hidden" }}>
          {loading ? (
            <div className="py-16 text-center text-[#1A0E0A]/30 text-sm">Loading…</div>
          ) : (
            <table className="w-full">
              <thead style={{ borderBottom: "1px solid rgba(26,14,10,0.06)", background: "rgba(26,14,10,0.02)" }}>
                <tr>
                  <th className={TH}>Code</th>
                  <th className={TH}>Discount</th>
                  <th className={TH}>Uses</th>
                  <th className={TH}>Min. Amount</th>
                  <th className={TH}>Expires</th>
                  <th className={TH}>Status</th>
                  <th className={TH}></th>
                </tr>
              </thead>
              <tbody>
                {codes.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-[#1A0E0A]/30 text-sm">No discount codes yet</td></tr>
                ) : codes.map((c) => {
                  const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                  const exhausted = c.maxUses > 0 && c.usedCount >= c.maxUses;
                  return (
                    <tr key={c.id} className="hover:bg-[rgba(26,14,10,0.01)] transition-colors">
                      <td className={TD}>
                        <span className="font-mono font-medium text-[#1A0E0A] text-xs bg-[rgba(26,14,10,0.04)] px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                      </td>
                      <td className={TD}>
                        <span className="font-display text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {c.type === "percentage" ? `${c.value}%` : `₦${c.value.toLocaleString()}`}
                        </span>
                        <span className="text-[10px] text-[#1A0E0A]/30 ml-1">{c.type}</span>
                      </td>
                      <td className={TD}>
                        <span className={exhausted ? "text-red-500" : ""}>{c.usedCount}</span>
                        {c.maxUses > 0 && <span className="text-[#1A0E0A]/30"> / {c.maxUses}</span>}
                      </td>
                      <td className={TD}>
                        {c.minAmount > 0 ? `₦${c.minAmount.toLocaleString()}` : <span className="text-[#1A0E0A]/20">None</span>}
                      </td>
                      <td className={TD}>
                        {c.expiresAt ? (
                          <span className={expired ? "text-red-500 text-xs" : "text-xs"}>
                            {new Date(c.expiresAt).toLocaleDateString()}
                          </span>
                        ) : <span className="text-[#1A0E0A]/20">Never</span>}
                      </td>
                      <td className={TD}>
                        <button
                          onClick={() => toggleActive(c)}
                          className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase rounded-full"
                          style={{
                            background: c.active && !expired && !exhausted ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)",
                            color: c.active && !expired && !exhausted ? "#166534" : "#991b1b",
                          }}
                        >
                          {expired ? "Expired" : exhausted ? "Exhausted" : c.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className={TD}>
                        <div className="flex gap-3">
                          <button onClick={() => openEdit(c)}
                            className="text-[10px] tracking-[0.15em] uppercase text-[#1A0E0A]/30 hover:text-[#C9A84C] transition-colors">Edit</button>
                          <button onClick={() => deleteCode(c)}
                            className="text-[10px] tracking-[0.15em] uppercase text-[#1A0E0A]/20 hover:text-red-400 transition-colors">Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              {editItem ? "Edit Discount Code" : "New Discount Code"}
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className={LABEL}>Code *</label>
                <input
                  className={INPUT}
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. HEBRON20"
                  disabled={!!editItem}
                />
              </div>
              <div>
                <label className={LABEL}>Type *</label>
                <select
                  className={INPUT}
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as "percentage" | "fixed" }))}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Value * {form.type === "percentage" ? "(percent)" : "(naira)"}</label>
                <input
                  type="number" min={0}
                  className={INPUT}
                  value={form.value}
                  onChange={(e) => setForm((p) => ({ ...p, value: +e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Max Uses (0 = unlimited)</label>
                  <input type="number" min={0} className={INPUT} value={form.maxUses}
                    onChange={(e) => setForm((p) => ({ ...p, maxUses: +e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL}>Min. Booking Amount (₦)</label>
                  <input type="number" min={0} className={INPUT} value={form.minAmount}
                    onChange={(e) => setForm((p) => ({ ...p, minAmount: +e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Expiry Date (optional)</label>
                <input type="date" className={INPUT} value={form.expiresAt}
                  onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-[rgba(26,14,10,0.15)] text-[#1A0E0A]/50 rounded">
                Cancel
              </button>
              <button onClick={save} disabled={saving || !form.code || !form.value}
                className="flex-1 py-2.5 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40 rounded"
                style={{ background: "#1A0E0A", color: "#F9F1E3" }}>
                {saving ? "Saving…" : editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
