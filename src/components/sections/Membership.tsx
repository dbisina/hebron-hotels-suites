"use client";

import { motion } from "framer-motion";
import { membershipContent, packagesContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/hooks/useInView";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BENEFITS = [
  {
    title: "Priority Access",
    description: "First in line for seasonal suites, event bookings, and limited offers.",
    icon: "◈",
  },
  {
    title: "Complimentary Upgrades",
    description: "Room upgrades whenever availability permits, automatically applied.",
    icon: "⬡",
  },
  {
    title: "Private Lounge",
    description: "Exclusive access to our members-only lounge with curated refreshments.",
    icon: "◎",
  },
  {
    title: "Late Check-Out",
    description: "Depart on your own schedule. No rush, no compromise.",
    icon: "◫",
  },
];

// ─── Package card ─────────────────────────────────────────────────────────────

interface PkgData {
  name: string;
  description: string;
  highlight: string;
  includes: string[] | string;
  image?: string;
}

function PackageCard({ pkg, index, imageSrc }: { pkg: PkgData; index: number; imageSrc?: string }) {
  const [hovered, setHovered] = useState(false);
  const includes = Array.isArray(pkg.includes) ? pkg.includes : JSON.parse(pkg.includes as string) as string[];
  const src = imageSrc || pkg.image || `/images/packages/${pkg.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col overflow-hidden"
      style={{
        background: hovered ? "#1A0E0A" : "#140B07",
        border: "1px solid rgba(201,168,76,0.12)",
        transition: "background 0.4s ease",
      }}
    >
      {/* Image slot */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: 220, background: "#0D0704" }}
      >
        <img
          src={src}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0704]/80 to-transparent" />
        <div
          className="absolute top-4 left-5 text-[9px] tracking-[0.3em] uppercase"
          style={{ color: "#C9A84C" }}
        >
          {pkg.highlight}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-7">
        {/* Gold rule */}
        <div
          className="w-8 h-px mb-5"
          style={{ background: "#C9A84C", opacity: 0.5 }}
        />

        <h3
          className="font-display text-cream-100 text-xl leading-snug mb-3"
          style={{ fontWeight: 300 }}
        >
          {pkg.name}
        </h3>

        <p className="text-cream-100/40 text-xs leading-relaxed mb-6 font-sans">
          {pkg.description}
        </p>

        {/* Includes */}
        <ul className="flex flex-col gap-1.5 flex-1 mb-7">
          {includes.map((item) => (
            <li
              key={item}
              className="text-[11px] font-sans text-cream-100/30 flex items-center gap-2"
            >
              <span style={{ color: "rgba(201,168,76,0.5)" }}>·</span>
              {item}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="text-[10px] tracking-[0.25em] uppercase font-sans text-gold-500 border-b border-gold-600/30 pb-0.5 w-fit transition-colors hover:text-gold-400 hover:border-gold-500/60"
        >
          Reserve Package
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface MembershipCms {
  eyebrow?: string;
  headline?: string;
  body?: string;
  cta?: string;
}

export function Membership({ cms, dbPackages, packageImages }: { cms?: MembershipCms | null; dbPackages?: PkgData[] | null; packageImages?: Record<string, string> }) {
  const { ref: headerRef, inView: headerInView } = useInView(0.15);
  const { ref: benefitsRef, inView: benefitsInView } = useInView(0.15);

  const packages: PkgData[] = dbPackages && dbPackages.length > 0
    ? dbPackages
    : (packagesContent.packages as unknown as PkgData[]);

  const PKG_ASSET_KEYS = ["pkg-weekend", "pkg-voucher", "pkg-romantic"];

  const membershipData = {
    eyebrow: cms?.eyebrow || membershipContent.eyebrow,
    headline: cms?.headline || membershipContent.headline,
    body: cms?.body || membershipContent.body,
    cta: cms?.cta || membershipContent.cta,
  };

  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <section id="membership" style={{ background: "#0D0704" }}>
      {/* ── Top split: headline + benefits ── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 pt-28 pb-20 grid lg:grid-cols-[55%_45%] gap-16 items-start">
        {/* Left */}
        <div ref={headerRef as React.RefObject<HTMLDivElement>}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8"
          >
            <SectionLabel className="text-gold-600">{membershipData.eyebrow}</SectionLabel>
          </motion.div>

          <h2
            className="font-display text-cream-100 leading-[0.9] tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300 }}
          >
            {membershipData.headline.split("\n").map((line: string, i: number) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  animate={headerInView ? { y: "0%" } : {}}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: EASE }}
                >
                  {i === 1 ? <em>{line}</em> : line}
                </motion.span>
              </div>
            ))}
          </h2>

          <motion.div
            className="h-px mb-8"
            style={{ background: "rgba(201,168,76,0.2)", transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          />

          <motion.p
            className="font-sans text-cream-100/40 text-sm leading-relaxed mb-10 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            {membershipData.body}
          </motion.p>

          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); setEnquiryOpen(true); }}
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
            className="inline-block text-[11px] tracking-[0.3em] uppercase font-sans px-8 py-3.5 transition-colors"
            style={{
              border: "1px solid rgba(201,168,76,0.35)",
              color: "#C9A84C",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,168,76,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {membershipData.cta}
          </motion.a>
        </div>

        {/* Right — benefit cards */}
        <div
          ref={benefitsRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: EASE }}
              className="p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="text-2xl mb-4"
                style={{ color: "rgba(201,168,76,0.6)" }}
              >
                {b.icon}
              </div>
              <h4
                className="font-display text-cream-100 text-base mb-2"
                style={{ fontWeight: 400 }}
              >
                {b.title}
              </h4>
              <p className="text-cream-100/30 text-xs leading-relaxed font-sans">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Thin gold rule */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16">
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)" }} />
      </div>

      {/* ── Package cards ── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 pt-20 pb-28">
        {/* Packages eyebrow */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <SectionLabel className="text-gold-600">{packagesContent.eyebrow}</SectionLabel>
          <h3
            className="font-display text-cream-100 mt-4"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 300 }}
          >
            {packagesContent.headline.split("\n").map((line: string, i: number) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} index={i} imageSrc={packageImages?.[PKG_ASSET_KEYS[i]]} />
          ))}
        </div>
      </div>

      {/* Membership enquiry modal */}
      {enquiryOpen && (
        <MembershipModal onClose={() => setEnquiryOpen(false)} />
      )}
    </section>
  );
}

// ─── Membership enquiry modal ─────────────────────────────────────────────────

function MembershipModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        checkIn: "TBD",
        checkOut: "TBD",
        guests: 1,
        message: "Membership enquiry",
      }),
    });
    setSent(true);
    setSending(false);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,7,4,0.85)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-sm p-8"
        style={{ background: "#1A0E0A", border: "1px solid rgba(201,168,76,0.15)" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {sent ? (
          <div className="text-center py-4">
            <div className="text-gold-500 text-3xl mb-4">✓</div>
            <h3 className="font-display text-cream-100 text-xl mb-2" style={{ fontWeight: 300 }}>
              Enquiry Received
            </h3>
            <p className="text-cream-100/40 text-xs">We will be in touch shortly.</p>
            <button onClick={onClose} className="mt-6 text-[10px] tracking-[0.25em] uppercase text-gold-500">Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-cream-100 text-xl mb-6" style={{ fontWeight: 300 }}>
              Membership Enquiry
            </h3>
            <form onSubmit={submit} className="flex flex-col gap-4">
              {([["name", "Name"], ["email", "Email"], ["phone", "Phone"]] as const).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 mb-2">{label}</label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    required={key !== "phone"}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white/90 text-sm px-3 py-2.5 outline-none focus:border-gold-600/50 transition-colors"
                    style={{ borderRadius: 4 }}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={sending}
                className="mt-2 py-3 text-[10px] tracking-[0.25em] uppercase transition-colors"
                style={{ background: "#C9A84C", color: "#0D0704", borderRadius: 4, opacity: sending ? 0.6 : 1 }}
              >
                {sending ? "Sending…" : "Submit Enquiry"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
