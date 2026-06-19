"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  "General Enquiry",
  "Room Reservation",
  "Event Planning",
  "Membership",
  "Feedback",
  "Other",
];

const INFO = [
  {
    label: "Address",
    lines: ["Plot 12 Umuoshigo Umuanunu,", "Obinze Owerri, Imo State, Nigeria"],
    href: "https://maps.app.goo.gl/78UGgffSnjdgy8vm6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Phone",
    lines: ["+234 707 125 9011"],
    href: "tel:+2347071259011",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    lines: ["hebron.hotels@yahoo.com"],
    href: "mailto:hebron.hotels@yahoo.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
  {
    label: "Reception",
    lines: ["Open 24 hours", "7 days a week"],
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(k: keyof FormState, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] text-cream-100 text-sm px-4 py-3 outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-cream-200/20";

  return (
    <div style={{ background: "#0D0704", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="pt-40 pb-20 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <motion.p
            className="text-[10px] tracking-[0.45em] uppercase mb-6"
            style={{ color: "#C9A84C" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Hebron Hotels & Suites · Owerri
          </motion.p>

          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-display text-cream-100 leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: "clamp(3.5rem,8vw,7rem)", fontWeight: 300 }}
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: EASE }}
            >
              Come Find
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="font-display leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: "clamp(3.5rem,8vw,7rem)", fontWeight: 300, color: "#C9A84C" }}
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.08, ease: EASE }}
            >
              <em>Us</em>
            </motion.h1>
          </div>

          <motion.p
            className="font-sans text-cream-200/45 text-sm leading-relaxed max-w-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            Our team is available around the clock. Reach us by phone, email,
            or send a message below.
          </motion.p>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="px-6 md:px-16 pb-20">
        <div className="max-w-screen-xl mx-auto">
          <div
            className="h-px mb-12"
            style={{ background: "linear-gradient(to right, rgba(201,168,76,0.35), transparent)" }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INFO.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex flex-col gap-4 p-6 h-full group transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.05)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    }}
                  >
                    <span style={{ color: "#C9A84C" }}>{item.icon}</span>
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-cream-200/35 mb-2">{item.label}</p>
                      {item.lines.map((l) => (
                        <p key={l} className="text-sm text-cream-200/65 font-sans leading-relaxed">{l}</p>
                      ))}
                    </div>
                  </a>
                ) : (
                  <div
                    className="flex flex-col gap-4 p-6 h-full"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span style={{ color: "#C9A84C" }}>{item.icon}</span>
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-cream-200/35 mb-2">{item.label}</p>
                      {item.lines.map((l) => (
                        <p key={l} className="text-sm text-cream-200/65 font-sans leading-relaxed">{l}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="px-6 md:px-16 pb-24">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="p-8 lg:p-10"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {status === "sent" ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-6" style={{ color: "#C9A84C" }}>✓</div>
                <h3 className="font-display text-cream-100 text-2xl mb-3" style={{ fontWeight: 300 }}>
                  Message Received
                </h3>
                <p className="text-cream-200/40 text-xs font-sans">We will respond within 24 hours.</p>
              </div>
            ) : (
              <>
                <p className="text-[9px] tracking-[0.35em] uppercase mb-8" style={{ color: "#C9A84C" }}>
                  Send a Message
                </p>
                <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div suppressHydrationWarning>
                    <label className="block text-[8px] tracking-[0.3em] uppercase text-cream-200/40 mb-2">Full Name *</label>
                    <input suppressHydrationWarning required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
                  </div>
                  <div suppressHydrationWarning>
                    <label className="block text-[8px] tracking-[0.3em] uppercase text-cream-200/40 mb-2">Email Address *</label>
                    <input suppressHydrationWarning type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" className={inputCls} />
                  </div>
                  <div suppressHydrationWarning>
                    <label className="block text-[8px] tracking-[0.3em] uppercase text-cream-200/40 mb-2">Phone</label>
                    <input suppressHydrationWarning type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" className={inputCls} />
                  </div>
                  <div suppressHydrationWarning>
                    <label className="block text-[8px] tracking-[0.3em] uppercase text-cream-200/40 mb-2">Subject</label>
                    <select suppressHydrationWarning value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputCls} style={{ cursor: "pointer", colorScheme: "dark" }}>
                      <option value="" style={{ background: "#1A0E0A" }}>Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s} style={{ background: "#1A0E0A" }}>{s}</option>)}
                    </select>
                  </div>
                  <div suppressHydrationWarning className="sm:col-span-2">
                    <label className="block text-[8px] tracking-[0.3em] uppercase text-cream-200/40 mb-2">Message *</label>
                    <textarea suppressHydrationWarning required rows={6} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="How can we help?" className={inputCls} style={{ resize: "vertical" }} />
                  </div>

                  {status === "error" && (
                    <p className="sm:col-span-2 text-red-400/70 text-xs">Something went wrong. Please try again or call us.</p>
                  )}

                  <div className="sm:col-span-2 flex items-center gap-6 mt-1">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="text-[10px] tracking-[0.3em] uppercase font-sans px-10 py-4 transition-opacity"
                      style={{ background: "#C9A84C", color: "#0D0704", opacity: status === "sending" ? 0.6 : 1 }}
                    >
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                    <p className="text-xs text-cream-200/30 font-sans hidden sm:block">
                      Or call <a href="tel:+2347071259011" style={{ color: "#C9A84C" }}>+234 707 125 9011</a>
                    </p>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            {/* Hotel Hours */}
            <div className="p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[8px] tracking-[0.3em] uppercase text-cream-200/35 mb-5">Hotel Hours</p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Check-In", time: "12:00 PM" },
                  { label: "Check-Out", time: "10:00 AM" },
                  { label: "Restaurant", time: "6:00 AM to 11:00 PM" },
                  { label: "Pool & Spa", time: "7:00 AM to 9:00 PM" },
                ].map((h) => (
                  <div key={h.label} className="flex items-center justify-between">
                    <span className="text-xs text-cream-200/45 font-sans">{h.label}</span>
                    <span className="text-xs font-sans" style={{ color: "#C9A84C" }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[8px] tracking-[0.3em] uppercase text-cream-200/35 mb-5">Follow Us</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61553201672579"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-cream-200/50 hover:text-[#C9A84C] transition-colors font-sans"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/hebronhotelandsuitsowerri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-cream-200/50 hover:text-[#C9A84C] transition-colors font-sans"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  @hebronhotelandsuitsowerri
                </a>
              </div>
            </div>

            {/* Directions CTA */}
            <a
              href="https://maps.app.goo.gl/78UGgffSnjdgy8vm6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 transition-all duration-300 group"
              style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", background: "rgba(201,168,76,0.04)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,168,76,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(201,168,76,0.04)")}
            >
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1">Get Directions</p>
                <p className="text-xs text-cream-200/40 font-sans">Opens in Google Maps</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="relative">
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)" }} />

        <motion.div
          className="relative overflow-hidden"
          style={{ height: "520px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div
            className="absolute top-0 left-0 z-10 px-8 py-6 flex flex-col gap-1"
            style={{ background: "linear-gradient(to bottom right, rgba(13,7,4,0.92), transparent)" }}
          >
            <p className="text-[8px] tracking-[0.35em] uppercase" style={{ color: "#C9A84C" }}>Our Location</p>
            <p className="text-xs text-cream-200/55 font-sans">Obinze, Owerri · Imo State, Nigeria</p>
          </div>

          <a
            href="https://maps.app.goo.gl/78UGgffSnjdgy8vm6"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-8 z-10 flex items-center gap-3 px-5 py-2.5 text-[9px] tracking-[0.25em] uppercase font-sans transition-colors"
            style={{ background: "rgba(13,7,4,0.85)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", backdropFilter: "blur(8px)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            Get Directions
          </a>

          <iframe
            title="Hebron Hotels & Suites Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.0349711253157!2d6.9585238!3d5.4116449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10425defbf82717f%3A0x63ab6ad189e21e2d!2sHebron%20Hotels%20and%20Suites!5e0!3m2!1sen!2sus!4v1781823853116!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{
              border: "none",
              filter: "grayscale(100%) brightness(0.55) contrast(1.1)",
              display: "block",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #0D0704)" }}
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
