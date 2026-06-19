import { Suspense } from "react";
import Link from "next/link";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata = { title: "Book Your Stay — Hebron Hotels & Suites" };

export default function BookPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#FDFAF4", fontFamily: "var(--font-inter)" }}
    >
      {/* Minimal header */}
      <header
        className="px-8 py-5 flex items-center justify-between border-b"
        style={{ borderColor: "rgba(26,14,10,0.06)", background: "rgba(253,250,244,0.97)" }}
      >
        <Link
          href="/"
          className="text-lg tracking-[0.25em] uppercase"
          style={{ fontFamily: "var(--font-cormorant)", color: "#1A0E0A", fontWeight: 400 }}
        >
          Hebron Hotels
        </Link>
        <Link
          href="/"
          className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/40 hover:text-[#1A0E0A]/70 transition-colors"
        >
          ← Back to site
        </Link>
      </header>

      <Suspense>
        <BookingFlow />
      </Suspense>
    </div>
  );
}
