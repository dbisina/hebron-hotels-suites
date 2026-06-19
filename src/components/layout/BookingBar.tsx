"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DIVIDER = (
  <span
    aria-hidden
    className="divider"
    style={{ width: 1, alignSelf: "stretch", flexShrink: 0 }}
  />
);

export function BookingBar() {
  const pathname = usePathname();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  // 0 = glass, 1 = solid
  const [prog, setProg] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  const hide = pathname !== "/";

  const dateSummary = checkIn && checkOut
    ? `${checkIn} – ${checkOut}`
    : checkIn
    ? `From ${checkIn}`
    : "Select dates";

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const vh = window.innerHeight;
    const barH = bar.offsetHeight || 56;
    const startY = barH / 2 + 24 - vh / 2;

    gsap.set(bar, { y: startY, opacity: 0 });
    gsap.to(bar, { opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" });

    gsap.to(bar, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: `${vh}px top`,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setProg(p);

          if (!bar) return;
          // Background: glass → cream
          bar.style.background = `rgba(249,241,227,${0.06 + p * 0.91})`;
          // Border: subtle white → warm brown
          bar.style.borderColor = `rgba(139,90,43,${0.05 + p * 0.12})`;
          // Backdrop: 20px blur throughout
          bar.style.backdropFilter = `blur(20px)`;
          (bar.style as unknown as Record<string, string>).webkitBackdropFilter = `blur(20px)`;
          // Divider alpha
          bar.style.setProperty("--divider-alpha", String(0.08 + p * 0.1));
        },
      },
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [hide]);

  if (hide) return null;

  // Interpolated text colors
  const textColor = `rgba(${Math.round(255 - (255 - 26) * prog)},${Math.round(255 - (255 - 14) * prog)},${Math.round(255 - (255 - 10) * prog)},${0.5 + prog * 0.5})`;
  const labelColor = `rgba(${Math.round(255 - (255 - 78) * prog)},${Math.round(255 - (255 - 46) * prog)},${Math.round(255 - (255 - 22) * prog)},${0.4 + prog * 0.25})`;
  const dividerColor = `rgba(${prog > 0.5 ? "139,90,43" : "255,255,255"},${prog > 0.5 ? 0.12 : 0.1})`;

  async function submitEnquiry(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...enquiryForm,
        checkIn: checkIn || "TBD",
        checkOut: checkOut || "TBD",
        guests,
      }),
    });
    setSent(true);
    setSending(false);
  }

  const labelStyle = {
    fontSize: 9,
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: labelColor,
    marginBottom: 2,
    display: "block",
    transition: "color 0.3s",
  };

  const inputStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: textColor,
    fontSize: 14,
    width: "100%",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "color 0.3s",
  };

  const dividerEl = (
    <span
      aria-hidden
      style={{ width: 1, alignSelf: "stretch", background: dividerColor, flexShrink: 0, transition: "background 0.3s" }}
    />
  );

  return (
    <>
      <div
        ref={barRef}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-3xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.06) inset",
          borderRadius: 9999,
        }}
      >
        {/* ── Desktop ── */}
        <div className="hidden md:flex items-center" style={{ borderRadius: 9999 }}>
          {/* Check-in */}
          <div className="flex flex-col px-6 py-3.5 flex-1 cursor-pointer">
            <label htmlFor="bbar-checkin" className="cursor-pointer" style={labelStyle}>
              Check-in
            </label>
            <input
              suppressHydrationWarning
              id="bbar-checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={inputStyle}
            />
          </div>

          {dividerEl}

          {/* Check-out */}
          <div className="flex flex-col px-6 py-3.5 flex-1 cursor-pointer">
            <label htmlFor="bbar-checkout" className="cursor-pointer" style={labelStyle}>
              Check-out
            </label>
            <input
              suppressHydrationWarning
              id="bbar-checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={inputStyle}
            />
          </div>

          {dividerEl}

          {/* Guests */}
          <div
            className="relative flex flex-col px-6 py-3.5 flex-1 cursor-pointer select-none"
            onClick={() => setGuestsOpen((o) => !o)}
          >
            <span style={labelStyle}>Guests</span>
            <span style={{ color: textColor, fontSize: 14, fontFamily: "inherit", transition: "color 0.3s" }}>
              {guests} {guests === 1 ? "Guest" : "Guests"}
            </span>

            {guestsOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-44"
                style={{
                  background: "rgba(249,241,227,0.98)",
                  border: "1px solid rgba(139,90,43,0.15)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setGuests(n); setGuestsOpen(false); }}
                    style={{
                      width: "100%",
                      padding: "10px 20px",
                      textAlign: "left",
                      fontSize: 13,
                      fontFamily: "inherit",
                      background: guests === n ? "rgba(139,90,43,0.08)" : "transparent",
                      color: guests === n ? "#1A0E0A" : "rgba(26,14,10,0.6)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {dividerEl}

          {/* Actions */}
          <div className="flex items-center gap-2 px-4 py-3.5" style={{ flexShrink: 0 }}>
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "inherit",
                color: prog > 0.5 ? "#2D1A0E" : "rgba(255,255,255,0.8)",
                border: `1px solid ${prog > 0.5 ? "rgba(45,26,14,0.25)" : "rgba(255,255,255,0.2)"}`,
                borderRadius: 9999,
                padding: "10px 20px",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = prog > 0.5 ? "rgba(45,26,14,0.05)" : "rgba(255,255,255,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Enquire
            </button>
            <a
              href={`/book?guests=${guests}${checkIn ? `&checkIn=${checkIn}&checkOut=${checkOut}` : ""}`}
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "inherit",
                color: "#F9F1E3",
                background: "#1A0E0A",
                borderRadius: 9999,
                padding: "10px 24px",
                textDecoration: "none",
                transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2D1A0E")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1A0E0A")}
            >
              Book
            </a>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div
          className="flex md:hidden items-center justify-between px-5 py-3"
          style={{ borderRadius: 9999 }}
        >
          <div>
            <span style={{ ...labelStyle, marginBottom: 2 }}>Reserve</span>
            <span style={{ color: textColor, fontSize: 13, fontFamily: "inherit", transition: "color 0.3s" }}>
              {dateSummary} · {guests} guest{guests !== 1 ? "s" : ""}
            </span>
          </div>
          <a
            href={`/book?guests=${guests}${checkIn ? `&checkIn=${checkIn}&checkOut=${checkOut}` : ""}`}
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              color: "#F9F1E3",
              background: "#1A0E0A",
              borderRadius: 9999,
              padding: "8px 20px",
              textDecoration: "none",
            }}
          >
            Book
          </a>
        </div>
      </div>

      {/* ── Enquiry modal ── */}
      {enquiryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,7,4,0.85)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setEnquiryOpen(false); setSent(false); } }}
        >
          <div
            className="w-full max-w-sm p-8"
            style={{ background: "#1A0E0A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12 }}
          >
            {sent ? (
              <div className="text-center py-4">
                <div style={{ color: "#C9A84C", fontSize: 32, marginBottom: 16 }}>✓</div>
                <h3 className="font-display text-cream-100 text-xl mb-2" style={{ fontWeight: 300 }}>Enquiry Sent</h3>
                <p className="text-cream-100/40 text-xs mb-6">We will be in touch within 24 hours.</p>
                <button onClick={() => { setEnquiryOpen(false); setSent(false); }} className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "#C9A84C" }}>Close</button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-cream-100 text-xl mb-1" style={{ fontWeight: 300 }}>Make an Enquiry</h3>
                <p className="text-cream-100/30 text-xs mb-6 font-sans">
                  {checkIn && checkOut ? `${checkIn} → ${checkOut} · ${guests} guest${guests !== 1 ? "s" : ""}` : "Fill in your stay details below"}
                </p>
                <form onSubmit={submitEnquiry} className="flex flex-col gap-4">
                  {([["name", "Name", "text", true], ["email", "Email", "email", true], ["phone", "Phone", "tel", false]] as const).map(([key, label, type, req]) => (
                    <div key={key}>
                      <label className="block text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
                      <input
                        type={type}
                        required={req}
                        value={enquiryForm[key as keyof typeof enquiryForm]}
                        onChange={(e) => setEnquiryForm((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full text-sm px-3 py-2.5 outline-none transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)", borderRadius: 4 }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Message</label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm((p) => ({ ...p, message: e.target.value }))}
                      className="w-full text-sm px-3 py-2.5 outline-none transition-colors resize-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)", borderRadius: 4 }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="py-3 text-[10px] tracking-[0.25em] uppercase mt-1 transition-opacity"
                    style={{ background: "#C9A84C", color: "#0D0704", borderRadius: 4, opacity: sending ? 0.6 : 1 }}
                  >
                    {sending ? "Sending…" : "Send Enquiry"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
