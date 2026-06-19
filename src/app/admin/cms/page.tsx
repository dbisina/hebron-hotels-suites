"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

type CmsKey =
  | "hero" | "about" | "facilities" | "rooms" | "gallery"
  | "events" | "packages" | "membership" | "footer"
  | "fonts" | "sections" | "seo";

interface CmsContent { [key: string]: unknown }
interface AssetMap { [id: string]: string }

const SECTION_CONFIG: {
  key: CmsKey;
  label: string;
  icon: string;
  fields?: { id: string; label: string; type: string }[];
}[] = [
  {
    key: "hero",
    label: "Hero",
    icon: "◈",
    fields: [
      { id: "eyebrow", label: "Eyebrow Text", type: "text" },
      { id: "headline", label: "Headline", type: "textarea" },
      { id: "subheadline", label: "Sub-headline", type: "text" },
    ],
  },
  {
    key: "about",
    label: "About",
    icon: "◉",
    fields: [
      { id: "eyebrow", label: "Eyebrow", type: "text" },
      { id: "headline", label: "Headline", type: "textarea" },
      { id: "body", label: "Body Text", type: "textarea" },
    ],
  },
  {
    key: "facilities",
    label: "Facilities",
    icon: "⊞",
    fields: [
      { id: "eyebrow", label: "Eyebrow", type: "text" },
      { id: "headline", label: "Headline", type: "textarea" },
    ],
  },
  {
    key: "gallery",
    label: "Gallery",
    icon: "◫",
    fields: [
      { id: "eyebrow", label: "Eyebrow", type: "text" },
      { id: "headline", label: "Headline", type: "textarea" },
    ],
  },
  {
    key: "events",
    label: "Events",
    icon: "◎",
    fields: [
      { id: "eyebrow", label: "Eyebrow", type: "text" },
      { id: "headline", label: "Headline", type: "textarea" },
    ],
  },
  {
    key: "membership",
    label: "Membership",
    icon: "✦",
    fields: [
      { id: "eyebrow", label: "Eyebrow", type: "text" },
      { id: "headline", label: "Headline", type: "textarea" },
      { id: "body", label: "Body Text", type: "textarea" },
      { id: "cta", label: "CTA Button Text", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    icon: "⬡",
    fields: [
      { id: "tagline", label: "Tagline", type: "text" },
      { id: "address", label: "Address", type: "textarea" },
      { id: "phone", label: "Phone", type: "text" },
      { id: "email", label: "Email", type: "text" },
      { id: "copyright", label: "Copyright text", type: "text" },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    icon: "◷",
    fields: [
      { id: "title", label: "Page Title", type: "text" },
      { id: "description", label: "Meta Description", type: "textarea" },
      { id: "keywords", label: "Keywords (comma separated)", type: "text" },
    ],
  },
];

const FONT_OPTIONS = [
  { id: "default", label: "Default (Cormorant + Inter)" },
  { id: "playfair", label: "Playfair Display + Inter" },
  { id: "garamond", label: "EB Garamond + Inter" },
  { id: "cinzel", label: "Cinzel + Lato" },
  { id: "bodoni", label: "Libre Bodoni + Source Sans" },
];

const ASSET_SLOTS = [
  { id: "logo", label: "Logo (PNG/SVG)", hint: "Displayed in nav bar — transparent background recommended" },
  { id: "og-image", label: "Social Share Image", hint: "1200×630px recommended" },
  { id: "about-image", label: "About — Section Photo", hint: "Left-side editorial photo in About section" },
  { id: "facility-1", label: "Facilities — Photo 1 (Pool)", hint: "First image in facilities strip" },
  { id: "facility-2", label: "Facilities — Photo 2 (Gym)", hint: "Second image in facilities strip" },
  { id: "facility-3", label: "Facilities — Photo 3 (Spa)", hint: "Third image in facilities strip" },
  { id: "facility-4", label: "Facilities — Photo 4 (Dining)", hint: "Fourth image in facilities strip" },
  { id: "event-weddings", label: "Events — Weddings Photo", hint: "Background for the Weddings panel" },
  { id: "event-conferences", label: "Events — Conferences Photo", hint: "Background for the Conferences panel" },
  { id: "event-parties", label: "Events — Parties Photo", hint: "Background for the Parties panel" },
  { id: "pkg-weekend", label: "Package — Weekend Escape", hint: "Premium Weekend Escape package image" },
  { id: "pkg-voucher", label: "Package — Lifestyle Voucher", hint: "Exclusive Lifestyle Voucher package image" },
  { id: "pkg-romantic", label: "Package — Romantic Getaway", hint: "Romantic Getaway package image" },
];

const LABEL = "block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-1.5";
const INPUT =
  "w-full text-sm px-3 py-2.5 border border-[rgba(26,14,10,0.12)] outline-none rounded text-[#1A0E0A] bg-white focus:border-[#C9A84C]/40 transition-colors";

// ── Device preview (laptop + phone overlay, Airfree pattern) ──────────────

function DevicePreview({
  laptopRef,
  phoneRef,
}: {
  laptopRef: React.RefObject<HTMLIFrameElement | null>;
  phoneRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const L_SW = 430, L_SH = 269;  // 16:10, fits 480px column
  const L_IW = 1280, L_IH = 800;
  const L_SCALE = L_SW / L_IW;

  const P_SW = 112, P_SH = 242;
  const P_IW = 390, P_IH = 844;
  const P_SCALE = P_SW / P_IW;

  function injectScrollbarCSS(ref: React.RefObject<HTMLIFrameElement | null>) {
    try {
      const d = ref.current?.contentDocument;
      if (d) {
        const s = d.createElement("style");
        s.textContent =
          "::-webkit-scrollbar{display:none}*{scrollbar-width:none;-ms-overflow-style:none}";
        d.head.appendChild(s);
      }
    } catch {}
  }

  return (
    <div className="select-none" style={{ position: "relative" }}>
      {/* Laptop */}
      <div>
        <div
          style={{
            width: L_SW + 20,
            background: "linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)",
            borderRadius: "10px 10px 0 0",
            padding: "10px 10px 8px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#333",
              margin: "0 auto 6px",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.6)",
            }}
          />
          <div
            style={{
              width: L_SW,
              height: L_SH,
              background: "#000",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <iframe
              ref={laptopRef}
              src="/"
              title="Desktop preview"
              onLoad={() => injectScrollbarCSS(laptopRef)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: L_IW,
                height: L_IH,
                border: "none",
                transform: `scale(${L_SCALE})`,
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>
        {/* Hinge */}
        <div style={{ width: L_SW + 20, height: 3, background: "#111" }} />
        {/* Base */}
        <div
          style={{
            width: L_SW + 40,
            marginLeft: -10,
            height: 12,
            background: "linear-gradient(to bottom, #cccccc, #b8b8b8)",
            borderRadius: "0 0 6px 6px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
        />
        <div
          style={{
            width: L_SW + 60,
            marginLeft: -20,
            height: 5,
            background: "#aaaaaa",
            borderRadius: "0 0 4px 4px",
          }}
        />
      </div>

      {/* Phone — overlapping bottom-right corner */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: -44,
          width: P_SW + 14,
          background: "#1a1a1a",
          borderRadius: 20,
          padding: "7px 5px",
          boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.06)",
          zIndex: 10,
        }}
      >
        {/* Notch */}
        <div
          style={{
            width: 32,
            height: 7,
            background: "#000",
            borderRadius: "0 0 7px 7px",
            margin: "0 auto 4px",
          }}
        />
        {/* Screen */}
        <div
          style={{
            width: P_SW,
            height: P_SH,
            background: "#000",
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
          }}
          onWheel={(e) => {
            e.preventDefault();
            phoneRef.current?.contentWindow?.scrollBy({
              top: e.deltaY * (P_IW / P_SW),
              behavior: "auto",
            });
          }}
        >
          <iframe
            ref={phoneRef}
            src="/"
            title="Mobile preview"
            onLoad={() => injectScrollbarCSS(phoneRef)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: P_IW,
              height: P_IH,
              border: "none",
              transform: `scale(${P_SCALE})`,
              transformOrigin: "top left",
            }}
          />
        </div>
        {/* Home indicator */}
        <div
          style={{
            width: 32,
            height: 3,
            background: "#333",
            borderRadius: 2,
            margin: "5px auto 0",
          }}
        />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<"content" | "assets" | "fonts" | "sections">("content");
  const [activeSection, setActiveSection] = useState<CmsKey>("hero");
  const [content, setContent] = useState<Record<CmsKey, CmsContent>>({} as Record<CmsKey, CmsContent>);
  const [assets, setAssets] = useState<AssetMap>({});
  const [fonts, setFonts] = useState({ heading: "default", body: "default" });
  const [sections, setSections] = useState<{ key: string; visible: boolean; order: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const laptopRef = useRef<HTMLIFrameElement>(null);
  const phoneRef = useRef<HTMLIFrameElement>(null);

  const reloadPreviews = useCallback(() => {
    try { laptopRef.current?.contentWindow?.location.reload(); } catch {
      if (laptopRef.current) laptopRef.current.src = "/";
    }
    try { phoneRef.current?.contentWindow?.location.reload(); } catch {
      if (phoneRef.current) phoneRef.current.src = "/";
    }
  }, []);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((data: { content: Record<CmsKey, unknown>; assets: AssetMap }) => {
        const parsed: Record<CmsKey, CmsContent> = {} as Record<CmsKey, CmsContent>;
        for (const [k, v] of Object.entries(data.content ?? {})) {
          parsed[k as CmsKey] = (v ?? {}) as CmsContent;
        }
        setContent(parsed);
        setAssets(data.assets ?? {});
        if (parsed.fonts) {
          setFonts((parsed.fonts as { heading?: string; body?: string }) as { heading: string; body: string });
        }
        if (Array.isArray(parsed.sections)) {
          setSections(parsed.sections as { key: string; visible: boolean; order: number }[]);
        } else {
          setSections([
            { key: "about", visible: true, order: 1 },
            { key: "facilities", visible: true, order: 2 },
            { key: "rooms", visible: true, order: 3 },
            { key: "gallery", visible: true, order: 4 },
            { key: "events", visible: true, order: 5 },
            { key: "membership", visible: true, order: 6 },
          ]);
        }
        setLoading(false);
      });
  }, []);

  // Preview reloads only after explicit save (reloadPreviews called in saveSection/saveFonts)

  async function saveSection(key: CmsKey, data: CmsContent) {
    setSaving(key);
    await fetch("/api/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data }),
    });
    setSaving(null);
    reloadPreviews();
  }

  async function saveFonts() {
    setSaving("fonts");
    await fetch("/api/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "fonts", data: fonts }),
    });
    setSaving(null);
    reloadPreviews();
  }

  async function saveSections() {
    setSaving("sections");
    await fetch("/api/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "sections", data: sections }),
    });
    setSaving(null);
  }

  async function uploadAsset(assetId: string, file: File) {
    setUploadingAsset(assetId);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("id", assetId);
    const res = await fetch("/api/cms/assets", { method: "POST", body: fd });
    const data = await res.json() as { url?: string };
    if (data.url) setAssets((prev) => ({ ...prev, [assetId]: data.url! }));
    setUploadingAsset(null);
  }

  async function uploadHeroPhoto(side: "desktop" | "mobile", file: File) {
    const assetId = `hero-${side}`;
    setUploadingAsset(assetId);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("id", assetId);
    const res = await fetch("/api/cms/assets", { method: "POST", body: fd });
    const data = await res.json() as { url?: string };
    if (data.url) {
      const field = side === "desktop" ? "desktopPhoto" : "mobilePhoto";
      setContent((prev) => ({
        ...prev,
        hero: { ...(prev.hero ?? {}), [field]: data.url! },
      }));
    }
    setUploadingAsset(null);
  }

  function updateField(key: CmsKey, field: string, value: string) {
    setContent((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? {}), [field]: value },
    }));
  }

  const cfg = SECTION_CONFIG.find((s) => s.key === activeSection);
  const heroContent = content.hero ?? {};
  const desktopMode = (heroContent.desktopMode as string | undefined) ?? "frames";
  const mobileMode = (heroContent.mobileMode as string | undefined) ?? "frames";
  const desktopPhoto = heroContent.desktopPhoto as string | undefined;
  const mobilePhoto = heroContent.mobilePhoto as string | undefined;

  // Sidebar slot — CMS sub-sections rendered inline under CMS nav item
  const cmsSidebarSlot = (
    <>
      {SECTION_CONFIG.map((s) => {
        const active = activeSection === s.key && activeTab === "content";
        return (
          <button
            key={s.key}
            onClick={() => { setActiveSection(s.key); setActiveTab("content"); }}
            className="flex items-center gap-2 px-2 py-1.5 w-full text-left transition-all duration-150"
            style={{
              borderRadius: 4,
              background: active ? "rgba(201,168,76,0.1)" : "transparent",
              color: active ? "#C9A84C" : "rgba(255,255,255,0.3)",
              fontSize: 11,
            }}
          >
            <span style={{ opacity: active ? 0.9 : 0.4, fontSize: 10 }}>{s.icon}</span>
            {s.label}
          </button>
        );
      })}
    </>
  );

  if (loading) {
    return (
      <AdminShell sidebarSlot={cmsSidebarSlot}>
        <div className="flex items-center justify-center h-full text-[#1A0E0A]/30 text-sm">
          Loading CMS…
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell sidebarSlot={cmsSidebarSlot}>
      <div className="p-5 xl:p-7">
        {/* Header */}
        <div className="mb-7">
          <h1
            className="text-2xl text-[#1A0E0A]"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
          >
            Content Management
          </h1>
          <p className="text-xs text-[#1A0E0A]/40 mt-0.5">
            Edit text, upload images, configure fonts and sections
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 mb-7 p-1 w-fit"
          style={{ background: "rgba(26,14,10,0.04)", borderRadius: 8 }}
        >
          {(["content", "assets", "fonts", "sections"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase capitalize transition-colors"
              style={{
                borderRadius: 6,
                background: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? "#1A0E0A" : "rgba(26,14,10,0.4)",
                boxShadow: activeTab === tab ? "0 1px 4px rgba(26,14,10,0.08)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── CONTENT TAB ── */}
        {activeTab === "content" && (
          <div className="flex gap-5 items-start">
            {/* Editor */}
            {cfg && (
              <div
                className="flex-1 min-w-0 bg-white p-6"
                style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-lg text-[#1A0E0A]"
                    style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
                  >
                    {cfg.label} Section
                  </h2>
                  <button
                    onClick={() => saveSection(cfg.key, content[cfg.key] ?? {})}
                    disabled={saving === cfg.key}
                    className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40 transition-opacity"
                    style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
                  >
                    {saving === cfg.key ? "Saving…" : "Save Changes"}
                  </button>
                </div>

                {/* Text fields */}
                <div className="flex flex-col gap-5">
                  {(cfg.fields ?? []).map((field) => (
                    <div key={field.id}>
                      <label className={LABEL}>{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={4}
                          className={`${INPUT} resize-none`}
                          value={String((content[cfg.key] ?? {})[field.id] ?? "")}
                          onChange={(e) => updateField(cfg.key, field.id, e.target.value)}
                        />
                      ) : (
                        <input
                          type="text"
                          className={INPUT}
                          value={String((content[cfg.key] ?? {})[field.id] ?? "")}
                          onChange={(e) => updateField(cfg.key, field.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Section image uploads — About */}
                {activeSection === "about" && (
                  <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(26,14,10,0.07)" }}>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/35 mb-4">Section Photo</p>
                    {assets["about-image"] && (
                      <div className="mb-2 overflow-hidden rounded" style={{ height: 80, background: "rgba(26,14,10,0.04)" }}>
                        <img src={assets["about-image"]} alt="About" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input type="file" accept="image/*" ref={(el) => { fileRefs.current["about-image"] = el; }} className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset("about-image", f); }} />
                    <button onClick={() => fileRefs.current["about-image"]?.click()} disabled={uploadingAsset === "about-image"}
                      className="w-full py-2 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40"
                      style={{ border: "1px dashed rgba(26,14,10,0.2)", color: "rgba(26,14,10,0.4)", borderRadius: 6 }}>
                      {uploadingAsset === "about-image" ? "Uploading…" : assets["about-image"] ? "Replace Photo" : "Upload About Photo"}
                    </button>
                  </div>
                )}

                {/* Section image uploads — Facilities */}
                {activeSection === "facilities" && (
                  <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(26,14,10,0.07)" }}>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/35 mb-4">Strip Photos (4)</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[["facility-1","Pool"],["facility-2","Gym"],["facility-3","Spa"],["facility-4","Dining"]].map(([id, label]) => (
                        <div key={id}>
                          <p className="text-[9px] text-[#1A0E0A]/30 mb-1">{label}</p>
                          {assets[id] && <div className="mb-1 overflow-hidden rounded" style={{ height: 50, background: "rgba(26,14,10,0.04)" }}><img src={assets[id]} alt={label} className="w-full h-full object-cover" /></div>}
                          <input type="file" accept="image/*" ref={(el) => { fileRefs.current[id] = el; }} className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(id, f); }} />
                          <button onClick={() => fileRefs.current[id]?.click()} disabled={uploadingAsset === id}
                            className="w-full py-1.5 text-[9px] tracking-[0.1em] uppercase disabled:opacity-40"
                            style={{ border: "1px dashed rgba(26,14,10,0.2)", color: "rgba(26,14,10,0.4)", borderRadius: 4 }}>
                            {uploadingAsset === id ? "Uploading…" : assets[id] ? "Replace" : "Upload"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section image uploads — Events */}
                {activeSection === "events" && (
                  <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(26,14,10,0.07)" }}>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/35 mb-4">Event Photos</p>
                    <div className="flex flex-col gap-3">
                      {[["event-weddings","Weddings"],["event-conferences","Conferences"],["event-parties","Parties"]].map(([id, label]) => (
                        <div key={id}>
                          <p className="text-[9px] text-[#1A0E0A]/30 mb-1">{label}</p>
                          {assets[id] && <div className="mb-1 overflow-hidden rounded" style={{ height: 50, background: "rgba(26,14,10,0.04)" }}><img src={assets[id]} alt={label} className="w-full h-full object-cover" /></div>}
                          <input type="file" accept="image/*" ref={(el) => { fileRefs.current[id] = el; }} className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(id, f); }} />
                          <button onClick={() => fileRefs.current[id]?.click()} disabled={uploadingAsset === id}
                            className="w-full py-1.5 text-[9px] tracking-[0.1em] uppercase disabled:opacity-40"
                            style={{ border: "1px dashed rgba(26,14,10,0.2)", color: "rgba(26,14,10,0.4)", borderRadius: 4 }}>
                            {uploadingAsset === id ? "Uploading…" : assets[id] ? "Replace" : "Upload"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section image uploads — Membership/Packages */}
                {activeSection === "membership" && (
                  <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(26,14,10,0.07)" }}>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/35 mb-4">Package Photos</p>
                    <div className="flex flex-col gap-3">
                      {[["pkg-weekend","Weekend Escape"],["pkg-voucher","Lifestyle Voucher"],["pkg-romantic","Romantic Getaway"]].map(([id, label]) => (
                        <div key={id}>
                          <p className="text-[9px] text-[#1A0E0A]/30 mb-1">{label}</p>
                          {assets[id] && <div className="mb-1 overflow-hidden rounded" style={{ height: 50, background: "rgba(26,14,10,0.04)" }}><img src={assets[id]} alt={label} className="w-full h-full object-cover" /></div>}
                          <input type="file" accept="image/*" ref={(el) => { fileRefs.current[id] = el; }} className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(id, f); }} />
                          <button onClick={() => fileRefs.current[id]?.click()} disabled={uploadingAsset === id}
                            className="w-full py-1.5 text-[9px] tracking-[0.1em] uppercase disabled:opacity-40"
                            style={{ border: "1px dashed rgba(26,14,10,0.2)", color: "rgba(26,14,10,0.4)", borderRadius: 4 }}>
                            {uploadingAsset === id ? "Uploading…" : assets[id] ? "Replace" : "Upload"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hero background controls */}
                {activeSection === "hero" && (
                  <div
                    className="mt-8 pt-6"
                    style={{ borderTop: "1px solid rgba(26,14,10,0.07)" }}
                  >
                    <p className="text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/35 mb-5">
                      Background Mode
                    </p>

                    {/* Desktop */}
                    <div className="mb-6">
                      <label className={LABEL}>Desktop</label>
                      <div className="flex gap-2 mb-3">
                        {(["frames", "photo"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => updateField("hero", "desktopMode", mode)}
                            className="flex-1 py-2 text-[10px] tracking-[0.15em] uppercase transition-all"
                            style={{
                              borderRadius: 6,
                              background: desktopMode === mode ? "#1A0E0A" : "white",
                              color: desktopMode === mode ? "#F9F1E3" : "rgba(26,14,10,0.4)",
                              border: `1px solid ${desktopMode === mode ? "#1A0E0A" : "rgba(26,14,10,0.12)"}`,
                            }}
                          >
                            {mode === "frames" ? "Scroll Frames" : "Static Photo"}
                          </button>
                        ))}
                      </div>

                      {desktopMode === "photo" && (
                        <>
                          {desktopPhoto && (
                            <div
                              className="mb-2 overflow-hidden"
                              style={{ height: 72, background: "rgba(26,14,10,0.04)", borderRadius: 6 }}
                            >
                              <img
                                src={desktopPhoto}
                                alt="Desktop hero"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            ref={(el) => { fileRefs.current["hero-desktop"] = el; }}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadHeroPhoto("desktop", f);
                            }}
                          />
                          <button
                            onClick={() => fileRefs.current["hero-desktop"]?.click()}
                            disabled={uploadingAsset === "hero-desktop"}
                            className="w-full py-2 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40 transition-opacity"
                            style={{
                              border: "1px dashed rgba(26,14,10,0.2)",
                              color: "rgba(26,14,10,0.4)",
                              borderRadius: 6,
                            }}
                          >
                            {uploadingAsset === "hero-desktop"
                              ? "Uploading…"
                              : desktopPhoto
                              ? "Replace Photo"
                              : "Upload Desktop Photo"}
                          </button>
                          {!desktopPhoto && (
                            <p className="text-[9px] text-[#1A0E0A]/25 mt-1.5">
                              No photo set — scroll frames used as fallback
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className={LABEL}>Mobile</label>
                      <div className="flex gap-2 mb-3">
                        {(["frames", "photo"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => updateField("hero", "mobileMode", mode)}
                            className="flex-1 py-2 text-[10px] tracking-[0.15em] uppercase transition-all"
                            style={{
                              borderRadius: 6,
                              background: mobileMode === mode ? "#1A0E0A" : "white",
                              color: mobileMode === mode ? "#F9F1E3" : "rgba(26,14,10,0.4)",
                              border: `1px solid ${mobileMode === mode ? "#1A0E0A" : "rgba(26,14,10,0.12)"}`,
                            }}
                          >
                            {mode === "frames" ? "Scroll Frames" : "Static Photo"}
                          </button>
                        ))}
                      </div>

                      {mobileMode === "photo" && (
                        <>
                          {mobilePhoto && (
                            <div
                              className="mb-2 overflow-hidden"
                              style={{ height: 72, background: "rgba(26,14,10,0.04)", borderRadius: 6 }}
                            >
                              <img
                                src={mobilePhoto}
                                alt="Mobile hero"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            ref={(el) => { fileRefs.current["hero-mobile"] = el; }}
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadHeroPhoto("mobile", f);
                            }}
                          />
                          <button
                            onClick={() => fileRefs.current["hero-mobile"]?.click()}
                            disabled={uploadingAsset === "hero-mobile"}
                            className="w-full py-2 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40 transition-opacity"
                            style={{
                              border: "1px dashed rgba(26,14,10,0.2)",
                              color: "rgba(26,14,10,0.4)",
                              borderRadius: 6,
                            }}
                          >
                            {uploadingAsset === "hero-mobile"
                              ? "Uploading…"
                              : mobilePhoto
                              ? "Replace Photo"
                              : "Upload Mobile Photo"}
                          </button>
                          {!mobilePhoto && (
                            <p className="text-[9px] text-[#1A0E0A]/25 mt-1.5">
                              No photo set — scroll frames used as fallback
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-[#1A0E0A]/25 mt-6">
                  Changes are saved per section. Click &ldquo;Save Changes&rdquo; to apply — preview
                  refreshes automatically.
                </p>
              </div>
            )}

            {/* Live Preview Panel */}
            <div className="w-[480px] flex-shrink-0 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/30">
                  Live Preview
                </span>
                <button
                  onClick={reloadPreviews}
                  className="text-[9px] tracking-[0.1em] text-[#1A0E0A]/30 hover:text-[#C9A84C] transition-colors"
                  title="Reload preview"
                >
                  ↻ Refresh
                </button>
              </div>
              <DevicePreview laptopRef={laptopRef} phoneRef={phoneRef} />
            </div>
          </div>
        )}

        {/* ── ASSETS TAB ── */}
        {activeTab === "assets" && (
          <div className="grid grid-cols-2 gap-4">
            {ASSET_SLOTS.map((slot) => {
              const currentUrl = assets[slot.id];
              return (
                <div
                  key={slot.id}
                  className="bg-white p-5"
                  style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-medium text-[#1A0E0A]">{slot.label}</div>
                      <div className="text-[10px] text-[#1A0E0A]/30 mt-0.5">{slot.hint}</div>
                    </div>
                    {currentUrl && (
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase"
                        style={{ background: "rgba(34,197,94,0.1)", color: "#166534" }}
                      >
                        Uploaded
                      </span>
                    )}
                  </div>

                  {currentUrl && (
                    <div
                      className="mb-3 overflow-hidden"
                      style={{ height: 80, background: "rgba(26,14,10,0.04)", borderRadius: 6 }}
                    >
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileRefs.current[slot.id] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadAsset(slot.id, file);
                    }}
                  />
                  <button
                    onClick={() => fileRefs.current[slot.id]?.click()}
                    disabled={uploadingAsset === slot.id}
                    className="w-full py-2 text-[10px] tracking-[0.2em] uppercase transition-colors disabled:opacity-40"
                    style={{
                      border: "1px dashed rgba(26,14,10,0.2)",
                      color: "rgba(26,14,10,0.4)",
                      borderRadius: 6,
                    }}
                  >
                    {uploadingAsset === slot.id
                      ? "Uploading…"
                      : currentUrl
                      ? "Replace Image"
                      : "Upload Image"}
                  </button>

                  {currentUrl && (
                    <p className="text-[9px] text-[#1A0E0A]/20 mt-2 truncate">{currentUrl}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── FONTS TAB ── */}
        {activeTab === "fonts" && (
          <div className="max-w-lg">
            <div
              className="bg-white p-6"
              style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg text-[#1A0E0A]"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
                >
                  Typography
                </h2>
                <button
                  onClick={saveFonts}
                  disabled={saving === "fonts"}
                  className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40"
                  style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
                >
                  {saving === "fonts" ? "Saving…" : "Save"}
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className={LABEL}>Display / Heading Font</label>
                  <select
                    className={INPUT}
                    value={fonts.heading}
                    onChange={(e) => setFonts((p) => ({ ...p, heading: e.target.value }))}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div
                  className="p-5 rounded"
                  style={{
                    background: "rgba(26,14,10,0.02)",
                    border: "1px solid rgba(26,14,10,0.06)",
                  }}
                >
                  <div className="text-[9px] tracking-[0.2em] uppercase text-[#1A0E0A]/30 mb-3">Preview</div>
                  <div
                    className="text-3xl text-[#1A0E0A] mb-1"
                    style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, lineHeight: 1.1 }}
                  >
                    Luxury Redefined
                  </div>
                  <div className="text-sm text-[#1A0E0A]/50" style={{ fontFamily: "var(--font-inter)" }}>
                    Experience the pinnacle of Nigerian hospitality
                  </div>
                </div>

                <p className="text-[10px] text-[#1A0E0A]/30">
                  Font changes apply globally across the website on next save.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTIONS TAB ── */}
        {activeTab === "sections" && (
          <div className="max-w-lg">
            <div
              className="bg-white p-6"
              style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-lg text-[#1A0E0A]"
                    style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
                  >
                    Page Sections
                  </h2>
                  <p className="text-[10px] text-[#1A0E0A]/30 mt-0.5">Toggle visibility of each section</p>
                </div>
                <button
                  onClick={saveSections}
                  disabled={saving === "sections"}
                  className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase disabled:opacity-40"
                  style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
                >
                  {saving === "sections" ? "Saving…" : "Save Order"}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { key: "hero", label: "Hero (Canvas Animation)" },
                  { key: "footer", label: "Footer" },
                ].map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      background: "rgba(26,14,10,0.02)",
                      borderRadius: 8,
                      border: "1px solid rgba(26,14,10,0.04)",
                    }}
                  >
                    <span className="text-sm text-[#1A0E0A]/60">{s.label}</span>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase"
                      style={{ background: "rgba(26,14,10,0.06)", color: "rgba(26,14,10,0.3)" }}
                    >
                      Always On
                    </span>
                  </div>
                ))}

                <div className="my-2 border-t border-[rgba(26,14,10,0.06)]" />
                <p className="text-[9px] tracking-[0.15em] uppercase text-[#1A0E0A]/25 mb-1">
                  Toggleable Sections
                </p>

                {sections.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      background: s.visible ? "rgba(201,168,76,0.04)" : "white",
                      borderRadius: 8,
                      border: `1px solid ${s.visible ? "rgba(201,168,76,0.15)" : "rgba(26,14,10,0.06)"}`,
                    }}
                    onClick={() =>
                      setSections((prev) =>
                        prev.map((p) => (p.key === s.key ? { ...p, visible: !p.visible } : p))
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-4 rounded-full transition-colors flex items-center"
                        style={{
                          background: s.visible ? "#C9A84C" : "rgba(26,14,10,0.1)",
                          padding: "2px",
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full bg-white transition-transform"
                          style={{ transform: s.visible ? "translateX(16px)" : "translateX(0)" }}
                        />
                      </div>
                      <span className="text-sm text-[#1A0E0A]/70 capitalize">{s.key}</span>
                    </div>
                    <span className="text-[10px] text-[#1A0E0A]/30 capitalize">
                      {s.visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
