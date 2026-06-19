"use client";

import { useState } from "react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  order: number;
}

const CATEGORIES = ["general", "rooms", "facilities", "dining", "events", "exterior", "interior"];

export function GalleryAdmin({ images: initial }: { images: GalleryImage[] }) {
  const [images, setImages] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [newAlt, setNewAlt] = useState("");
  const [newCat, setNewCat] = useState("general");

  async function uploadAndAdd(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();

    const addRes = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src: url, alt: newAlt || file.name, category: newCat, order: images.length }),
    });
    const added = await addRes.json();
    setImages((prev) => [...prev, added]);
    setNewAlt("");
    setUploading(false);
  }

  async function remove(id: string) {
    if (!confirm("Remove this image?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function updateAlt(id: string, alt: string) {
    await fetch(`/api/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    });
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, alt } : img)));
  }

  const inputStyle = {
    background: "#F5F0E8",
    border: "1px solid rgba(26,14,10,0.12)",
    color: "#1A0E0A",
    fontSize: 12,
    padding: "7px 10px",
    outline: "none",
    borderRadius: 4,
    width: "100%",
  };

  return (
    <div>
      {/* Upload panel */}
      <div
        className="bg-white p-5 mb-5"
        style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/40 mb-4">Upload New Image</p>
        <div className="flex gap-3 flex-wrap">
          <input
            style={{ ...inputStyle, flex: 1, minWidth: 160 }}
            placeholder="Alt text (description)"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
          />
          <select
            style={{ ...inputStyle, width: "auto" }}
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label
            className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-colors flex items-center gap-2"
            style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6, opacity: uploading ? 0.5 : 1 }}
          >
            {uploading ? "Uploading…" : "Choose File"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && uploadAndAdd(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white overflow-hidden group"
            style={{ borderRadius: 8, border: "1px solid rgba(26,14,10,0.06)" }}
          >
            <div className="aspect-video bg-[#2D1A0E] overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <input
                style={{ ...inputStyle, fontSize: 11 }}
                defaultValue={img.alt}
                onBlur={(e) => {
                  if (e.target.value !== img.alt) updateAlt(img.id, e.target.value);
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className="text-[9px] px-2 py-0.5 tracking-[0.15em] uppercase"
                  style={{ background: "rgba(201,168,76,0.08)", color: "#C9A84C", borderRadius: 99 }}
                >
                  {img.category}
                </span>
                <button
                  onClick={() => remove(img.id)}
                  className="text-[9px] text-red-400/40 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
