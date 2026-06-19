"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

const EVENT_TYPES = [
  { key: "Wedding", label: "Wedding & Reception", description: "Intimate ceremonies to grand celebrations, tailored to your vision." },
  { key: "Conference", label: "Conference & Corporate", description: "State-of-the-art facilities for meetings, summits, and business events." },
  { key: "Birthday", label: "Birthday & Milestone", description: "Make every milestone unforgettable with curated dining and celebration packages." },
  { key: "Social", label: "Social Gathering", description: "Cocktail evenings, dinner parties, and exclusive social occasions." },
  { key: "Other", label: "Other Event", description: "Tell us what you have in mind and we'll craft the perfect experience." },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  message: string;
};

export default function EventsPage() {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", eventType: "", eventDate: "", guestCount: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(k: keyof FormState, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/event-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputCls = "w-full bg-white border border-[rgba(26,14,10,0.12)] text-[#1A0E0A] text-sm px-4 py-3 outline-none focus:border-[#C9A84C]/60 transition-colors placeholder:text-[#1A0E0A]/25";

  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 md:px-16">
        <div className="max-w-screen-lg mx-auto">
          <motion.p
            className="text-[10px] tracking-[0.4em] uppercase mb-5"
            style={{ color: "#C9A84C" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Events & Celebrations
          </motion.p>

          <div className="overflow-hidden mb-4">
            <motion.h1
              className="font-display text-[#1A0E0A] leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: "clamp(3rem,7vw,6rem)", fontWeight: 300 }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: EASE }}
            >
              Make It
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="font-display leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: "clamp(3rem,7vw,6rem)", fontWeight: 300, color: "#C9A84C" }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
            >
              <em>Extraordinary</em>
            </motion.h1>
          </div>

          <motion.p
            className="font-sans text-[#1A0E0A]/45 text-sm leading-relaxed max-w-lg mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            From intimate weddings to landmark corporate summits, Hebron Hotels & Suites delivers
            flawless events against a backdrop of genuine luxury. Tell us your vision.
          </motion.p>
        </div>
      </section>

      {/* Event type cards */}
      <section className="px-6 md:px-16 pb-24">
        <div className="max-w-screen-lg mx-auto">
          <div
            className="h-px mb-16"
            style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-20">
            {EVENT_TYPES.slice(0, -1).map((evt, i) => (
              <motion.button
                key={evt.key}
                onClick={() => set("eventType", evt.key)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="text-left p-6 transition-all duration-300"
                style={{
                  background: form.eventType === evt.key ? "rgba(201,168,76,0.07)" : "white",
                  border: form.eventType === evt.key ? "1px solid rgba(201,168,76,0.45)" : "1px solid rgba(26,14,10,0.08)",
                }}
              >
                <p
                  className="font-display text-base mb-2"
                  style={{ color: form.eventType === evt.key ? "#C9A84C" : "#1A0E0A", fontWeight: 300 }}
                >
                  {evt.label}
                </p>
                <p className="text-xs text-[#1A0E0A]/40 font-sans leading-relaxed">{evt.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Enquiry form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: "#C9A84C" }}>
              Event Enquiry
            </p>

            {status === "sent" ? (
              <div className="py-20 text-center">
                <div className="text-5xl mb-6" style={{ color: "#C9A84C" }}>✓</div>
                <h3 className="font-display text-[#1A0E0A] text-2xl mb-3" style={{ fontWeight: 300 }}>
                  Enquiry Received
                </h3>
                <p className="text-[#1A0E0A]/45 text-sm max-w-sm mx-auto">
                  Our events team will be in touch within 24 hours to discuss your plans.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div suppressHydrationWarning>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Full Name *</label>
                  <input
                    suppressHydrationWarning
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div suppressHydrationWarning>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Email Address *</label>
                  <input
                    suppressHydrationWarning
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="your@email.com"
                    className={inputCls}
                  />
                </div>
                <div suppressHydrationWarning>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Phone Number</label>
                  <input
                    suppressHydrationWarning
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+234 800 000 0000"
                    className={inputCls}
                  />
                </div>
                <div suppressHydrationWarning>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Event Type *</label>
                  <select
                    suppressHydrationWarning
                    required
                    value={form.eventType}
                    onChange={(e) => set("eventType", e.target.value)}
                    className={inputCls}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="" disabled style={{ background: "white" }}>Select event type</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t.key} value={t.key} style={{ background: "white" }}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div suppressHydrationWarning>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Preferred Date</label>
                  <input
                    suppressHydrationWarning
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => set("eventDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div suppressHydrationWarning>
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Expected Guests</label>
                  <input
                    suppressHydrationWarning
                    value={form.guestCount}
                    onChange={(e) => set("guestCount", e.target.value)}
                    placeholder="e.g. 50-100"
                    className={inputCls}
                  />
                </div>
                <div suppressHydrationWarning className="md:col-span-2">
                  <label className="block text-[9px] tracking-[0.3em] uppercase text-[#1A0E0A]/40 mb-2">Additional Details</label>
                  <textarea
                    suppressHydrationWarning
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Describe your event, any special requirements, theme, catering preferences..."
                    className={inputCls}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {status === "error" && (
                  <div className="md:col-span-2">
                    <p className="text-red-600/70 text-xs">Something went wrong. Please try again or call us directly.</p>
                  </div>
                )}

                <div className="md:col-span-2 flex items-center gap-6 mt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="text-[10px] tracking-[0.3em] uppercase font-sans px-10 py-4 transition-opacity"
                    style={{
                      background: "#C9A84C",
                      color: "#0D0704",
                      opacity: status === "sending" ? 0.7 : 1,
                    }}
                  >
                    {status === "sending" ? "Submitting…" : "Submit Enquiry"}
                  </button>
                  <p className="text-xs text-[#1A0E0A]/30 font-sans">
                    Or call us: <a href="tel:+2347071259011" style={{ color: "#C9A84C" }}>+234 707 125 9011</a>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
