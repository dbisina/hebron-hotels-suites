"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Step types
type Step = "dates" | "rooms" | "details" | "payment" | "confirm";

interface RoomResult {
  room: {
    id: string; slug: string; name: string; description: string;
    size: string; occupancy: string; image: string; amenities: string;
    pricePerNight: number; featured: boolean;
  };
  available: number;
  inventoryIds: string[];
}

interface AvailabilityData {
  rooms: RoomResult[];
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const STEP_LABELS: Record<Step, string> = {
  dates: "Dates",
  rooms: "Select Room",
  details: "Your Details",
  payment: "Payment",
  confirm: "Confirmed",
};
const STEPS: Step[] = ["dates", "rooms", "details", "payment", "confirm"];

export function BookingFlow() {
  const params = useSearchParams();

  const [step, setStep] = useState<Step>("dates");
  const [checkIn, setCheckIn] = useState(params.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") ?? "");
  const [guests, setGuests] = useState(parseInt(params.get("guests") ?? "1", 10));

  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResult | null>(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [discountInput, setDiscountInput] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const [bookingId, setBookingId] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function resetBooking() {
    setStep("dates");
    setSelectedRoom(null);
    setSelectedInventoryId("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setDiscountInput("");
    setDiscountAmount(0);
    setDiscountError("");
    setDiscountApplied(false);
    setBookingId("");
    setBookingRef("");
    setError("");
  }

  // Auto-advance to rooms step if dates are pre-filled
  useEffect(() => {
    if (checkIn && checkOut && params.get("checkIn")) {
      fetchRooms(checkIn, checkOut, guests);
      setStep("rooms");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRooms(ci: string, co: string, g: number) {
    setLoadingRooms(true);
    setError("");
    try {
      const res = await fetch(`/api/availability?checkIn=${ci}&checkOut=${co}&guests=${g}`);
      const data = await res.json() as AvailabilityData;
      setAvailability(data);
    } catch {
      setError("Failed to load available rooms. Please try again.");
    }
    setLoadingRooms(false);
  }

  const totalAmount = selectedRoom
    ? Math.max(0, selectedRoom.room.pricePerNight * (availability?.nights ?? 1) - discountAmount)
    : 0;

  async function applyDiscount() {
    if (!discountInput.trim()) return;
    setDiscountError("");
    const res = await fetch("/api/discount/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: discountInput,
        amount: selectedRoom ? selectedRoom.room.pricePerNight * (availability?.nights ?? 1) : 0,
      }),
    });
    const data = await res.json() as { discountAmount?: number; error?: string };
    if (!res.ok) {
      setDiscountError(data.error ?? "Invalid code");
    } else {
      setDiscountAmount(data.discountAmount ?? 0);
      setDiscountApplied(true);
    }
  }

  async function createBooking(): Promise<boolean> {
    if (!selectedRoom || !availability) return false;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inventoryId: selectedInventoryId,
        checkIn: availability.checkIn,
        checkOut: availability.checkOut,
        nights: availability.nights,
        guests: availability.guests,
        guestName,
        guestEmail,
        guestPhone,
        amount: totalAmount,
        discountCode: discountApplied ? discountInput.toUpperCase() : "",
        discountAmount,
      }),
    });
    const data = await res.json() as { bookingId?: string; bookingRef?: string; error?: string };
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Booking failed");
      return false;
    }
    setBookingId(data.bookingId ?? "");
    setBookingRef(data.bookingRef ?? "");
    return true;
  }

  async function handlePaystackSuccess(reference: string) {
    const res = await fetch(`/api/bookings/${bookingId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paystackRef: reference }),
    });
    if (res.ok) {
      setStep("confirm");
    } else {
      setError("Payment received but verification failed. Please contact us with ref: " + reference);
    }
  }

  function openPaystack() {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      setError("Payment system not configured. Please contact us directly to complete your booking.");
      return;
    }
    const win = window as unknown as {
      PaystackPop?: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } }
    };
    if (!win.PaystackPop) {
      setError("Paystack not loaded. Please refresh and try again.");
      return;
    }
    const handler = win.PaystackPop.setup({
      key: paystackKey,
      email: guestEmail,
      amount: Math.round(totalAmount * 100), // kobo, integer
      ref: bookingRef,
      currency: "NGN",
      metadata: { name: guestName, phone: guestPhone, bookingRef },
      onClose: () => {},
      callback: (response: { reference: string }) => {
        handlePaystackSuccess(response.reference);
      },
    });
    handler.openIframe();
  }

  const stIdx = STEPS.indexOf(step);

  return (
    <>
      {/* Paystack inline script */}
      <script src="https://js.paystack.co/v1/inline.js" async />

      <div className={`${step === "rooms" ? "max-w-screen-xl" : "max-w-2xl"} mx-auto px-6 py-12 transition-none`}>
        {/* Progress bar */}
        <div className="flex items-center gap-0 mb-12">
          {STEPS.filter((s) => s !== "confirm").map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className="flex items-center gap-2"
                style={{ opacity: STEPS.indexOf(s) <= stIdx ? 1 : 0.3 }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]"
                  style={{
                    background: STEPS.indexOf(s) < stIdx ? "#C9A84C"
                      : STEPS.indexOf(s) === stIdx ? "#1A0E0A" : "transparent",
                    border: STEPS.indexOf(s) >= stIdx ? "1px solid rgba(26,14,10,0.2)" : "none",
                    color: STEPS.indexOf(s) <= stIdx ? "#F9F1E3" : "#1A0E0A",
                  }}
                >
                  {STEPS.indexOf(s) < stIdx ? "✓" : i + 1}
                </div>
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A0E0A]/50 hidden sm:block">
                  {STEP_LABELS[s]}
                </span>
              </div>
              {i < 3 && <div className="flex-1 h-px mx-3" style={{ background: "rgba(26,14,10,0.1)" }} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded">
            {error}
          </div>
        )}

        {/* ── Step: DATES ── */}
        {step === "dates" && (
          <DateStep
            checkIn={checkIn} setCheckIn={setCheckIn}
            checkOut={checkOut} setCheckOut={setCheckOut}
            guests={guests} setGuests={setGuests}
            onNext={() => { fetchRooms(checkIn, checkOut, guests); setStep("rooms"); }}
          />
        )}

        {/* ── Step: ROOMS ── */}
        {step === "rooms" && (
          <RoomsStep
            loading={loadingRooms}
            data={availability}
            onSelect={(room, invId) => { setSelectedRoom(room); setSelectedInventoryId(invId); setStep("details"); }}
            onBack={() => setStep("dates")}
          />
        )}

        {/* ── Step: DETAILS ── */}
        {step === "details" && selectedRoom && (
          <DetailsStep
            room={selectedRoom}
            nights={availability?.nights ?? 1}
            guests={availability?.guests ?? guests}
            guestName={guestName} setGuestName={setGuestName}
            guestEmail={guestEmail} setGuestEmail={setGuestEmail}
            guestPhone={guestPhone} setGuestPhone={setGuestPhone}
            discountInput={discountInput} setDiscountInput={setDiscountInput}
            discountAmount={discountAmount} discountApplied={discountApplied}
            discountError={discountError} onApplyDiscount={applyDiscount}
            totalAmount={totalAmount}
            onBack={() => setStep("rooms")}
            onNext={async () => {
              const ok = await createBooking();
              if (ok) setStep("payment");
            }}
            submitting={submitting}
          />
        )}

        {/* ── Step: PAYMENT ── */}
        {step === "payment" && (
          <PaymentStep
            bookingRef={bookingRef}
            totalAmount={totalAmount}
            guestEmail={guestEmail}
            onPay={openPaystack}
            onBack={() => setStep("details")}
            onCancel={resetBooking}
          />
        )}

        {/* ── Step: CONFIRM ── */}
        {step === "confirm" && (
          <ConfirmStep bookingRef={bookingRef} guestName={guestName} guestEmail={guestEmail} />
        )}
      </div>
    </>
  );
}

// ─── Sub-step components ──────────────────────────────────────────────────────

const INPUT = "w-full bg-white border border-[rgba(26,14,10,0.12)] text-[#1A0E0A] text-sm px-4 py-3 outline-none focus:border-[#C9A84C]/50 transition-colors rounded";
const LABEL = "block text-[9px] tracking-[0.25em] uppercase text-[#1A0E0A]/40 mb-2";

function DateStep({ checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, onNext }: {
  checkIn: string; setCheckIn: (v: string) => void;
  checkOut: string; setCheckOut: (v: string) => void;
  guests: number; setGuests: (v: number) => void;
  onNext: () => void;
}) {
  const [today, setToday] = useState("");
  useEffect(() => { setToday(new Date().toISOString().split("T")[0]); }, []);
  const valid = checkIn && checkOut && checkIn < checkOut;
  return (
    <div>
      <h1 className="font-display text-3xl text-[#1A0E0A] mb-8" style={{ fontWeight: 300 }}>
        When are you staying?
      </h1>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Check-in</label>
            <input suppressHydrationWarning type="date" min={today} value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Check-out</label>
            <input suppressHydrationWarning type="date" min={checkIn || today} value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)} className={INPUT} />
          </div>
        </div>
        <div>
          <label className={LABEL}>Guests</label>
          <select suppressHydrationWarning value={guests} onChange={(e) => setGuests(+e.target.value)} className={INPUT}>
            {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
          </select>
        </div>
        <button
          onClick={onNext} disabled={!valid}
          className="py-4 text-[11px] tracking-[0.25em] uppercase transition-colors mt-2 disabled:opacity-40"
          style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
        >
          Search Available Rooms
        </button>
      </div>
    </div>
  );
}

function RoomsStep({ loading, data, onSelect, onBack }: {
  loading: boolean; data: AvailabilityData | null;
  onSelect: (room: RoomResult, invId: string) => void;
  onBack: () => void;
}) {
  if (loading) return <div className="text-center py-20 text-[#1A0E0A]/40 text-sm">Checking availability…</div>;
  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-[#1A0E0A]" style={{ fontWeight: 300 }}>
            Available Rooms
          </h1>
          <p className="text-xs text-[#1A0E0A]/40 mt-1">
            {data.checkIn} → {data.checkOut} · {data.nights} nights · {data.guests} guest{data.guests !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={onBack} className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/40 hover:text-[#1A0E0A] transition-colors">
          ← Edit Dates
        </button>
      </div>

      {data.rooms.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#1A0E0A]/40 text-sm mb-4">No rooms available for these dates.</p>
          <button onClick={onBack} className="text-[10px] tracking-[0.2em] uppercase text-[#C9A84C]">Try Different Dates</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.rooms.map((r) => (
            <div
              key={r.room.id}
              className="bg-white overflow-hidden flex flex-col"
              style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 12 }}
            >
              <div className="bg-[#2D1A0E] overflow-hidden min-h-[180px]">
                <img src={r.room.image} alt={r.room.name} className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-base text-[#1A0E0A]" style={{ fontWeight: 400 }}>
                        {r.room.name}
                      </h3>
                      {r.room.featured && (
                        <span className="text-[9px] px-2 py-0.5 tracking-[0.15em] uppercase flex-shrink-0"
                          style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", borderRadius: 99 }}>
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#1A0E0A]/50 leading-relaxed mb-3">{r.room.description}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#1A0E0A]/40 tracking-[0.1em] uppercase">
                      <span>{r.room.size}</span>
                      <span>·</span>
                      <span>{r.room.occupancy}</span>
                      <span>·</span>
                      <span>{r.available} room{r.available !== 1 ? "s" : ""} left</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="min-w-0">
                      <span className="font-display text-lg text-[#1A0E0A]" style={{ fontWeight: 300 }}>
                        {r.room.pricePerNight > 0 ? `₦${r.room.pricePerNight.toLocaleString()}` : "Contact us"}
                      </span>
                      {r.room.pricePerNight > 0 && (
                        <span className="text-[10px] text-[#1A0E0A]/40 ml-1">/ night</span>
                      )}
                      {r.room.pricePerNight > 0 && data.nights > 1 && (
                        <div className="text-[10px] text-[#1A0E0A]/30 mt-0.5">
                          ₦{(r.room.pricePerNight * data.nights).toLocaleString()} total
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onSelect(r, r.inventoryIds[0])}
                      className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors"
                      style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
                    >
                      Select
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailsStep({
  room, nights, guests, guestName, setGuestName, guestEmail, setGuestEmail,
  guestPhone, setGuestPhone, discountInput, setDiscountInput, discountAmount,
  discountApplied, discountError, onApplyDiscount, totalAmount, onBack, onNext, submitting,
}: {
  room: RoomResult; nights: number; guests: number;
  guestName: string; setGuestName: (v: string) => void;
  guestEmail: string; setGuestEmail: (v: string) => void;
  guestPhone: string; setGuestPhone: (v: string) => void;
  discountInput: string; setDiscountInput: (v: string) => void;
  discountAmount: number; discountApplied: boolean;
  discountError: string; onApplyDiscount: () => void;
  totalAmount: number; onBack: () => void; onNext: () => void; submitting: boolean;
}) {
  const subtotal = room.room.pricePerNight * nights;
  const valid = guestName.trim() && guestEmail.trim();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-[#1A0E0A]" style={{ fontWeight: 300 }}>Your Details</h1>
        <button onClick={onBack} className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/40 hover:text-[#1A0E0A] transition-colors">← Back</button>
      </div>

      {/* Summary */}
      <div className="bg-white p-5 mb-6" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}>
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex-shrink-0 bg-[#2D1A0E] overflow-hidden rounded">
            <img src={room.room.image} alt={room.room.name} className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div>
            <div className="text-sm font-medium text-[#1A0E0A]">{room.room.name}</div>
            <div className="text-[10px] text-[#1A0E0A]/40 mt-0.5">{nights} nights · {guests} guests</div>
            {room.room.pricePerNight > 0 && (
              <div className="text-sm text-[#1A0E0A] mt-1">₦{subtotal.toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className={LABEL}>Full Name *</label>
          <input className={INPUT} value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="John Doe" />
        </div>
        <div>
          <label className={LABEL}>Email Address *</label>
          <input type="email" className={INPUT} value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className={LABEL}>Phone Number</label>
          <input type="tel" className={INPUT} value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+234..." />
        </div>

        {/* Discount */}
        <div>
          <label className={LABEL}>Discount Code</label>
          <div className="flex gap-2">
            <input
              className={`${INPUT} flex-1`}
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
              disabled={discountApplied}
              placeholder="HEBRON10"
            />
            <button
              onClick={onApplyDiscount}
              disabled={discountApplied || !discountInput.trim()}
              className="px-4 text-[10px] tracking-[0.15em] uppercase flex-shrink-0 disabled:opacity-40"
              style={{ border: "1px solid rgba(26,14,10,0.15)", borderRadius: 6, color: "#1A0E0A" }}
            >
              Apply
            </button>
          </div>
          {discountError && <p className="text-xs text-red-500 mt-1">{discountError}</p>}
          {discountApplied && (
            <p className="text-xs text-green-600 mt-1">✓ Discount applied: ₦{discountAmount.toLocaleString()} off</p>
          )}
        </div>

        {/* Total */}
        {room.room.pricePerNight > 0 && (
          <div className="border-t border-[rgba(26,14,10,0.06)] pt-4 mt-2">
            <div className="flex justify-between text-sm text-[#1A0E0A]/50 mb-1">
              <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-1">
                <span>Discount</span><span>−₦{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-medium text-[#1A0E0A] mt-2">
              <span>Total</span>
              <span className="font-display text-xl" style={{ fontWeight: 300 }}>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          onClick={onNext} disabled={!valid || submitting}
          className="py-4 text-[11px] tracking-[0.25em] uppercase transition-colors mt-2 disabled:opacity-40"
          style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
        >
          {submitting ? "Processing…" : "Proceed to Payment"}
        </button>

        <p className="text-[10px] text-[#1A0E0A]/35 font-sans text-center leading-relaxed mt-1">
          By proceeding you agree to our{" "}
          <a href="/refund-policy" target="_blank" className="underline hover:text-[#C9A84C] transition-colors">
            Refund Policy
          </a>
        </p>
      </div>
    </div>
  );
}

function PaymentStep({ bookingRef, totalAmount, guestEmail, onPay, onBack, onCancel }: {
  bookingRef: string; totalAmount: number; guestEmail: string;
  onPay: () => void; onBack: () => void; onCancel: () => void;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
        <span style={{ color: "#C9A84C", fontSize: 20 }}>🔒</span>
      </div>
      <h1 className="font-display text-3xl text-[#1A0E0A] mb-2" style={{ fontWeight: 300 }}>Secure Payment</h1>
      <p className="text-sm text-[#1A0E0A]/40 mb-8">Booking #{bookingRef}</p>

      <div className="bg-white p-6 mb-8 text-left" style={{ border: "1px solid rgba(26,14,10,0.06)", borderRadius: 10 }}>
        <div className="flex justify-between mb-2">
          <span className="text-xs text-[#1A0E0A]/40">Amount</span>
          <span className="font-display text-2xl text-[#1A0E0A]" style={{ fontWeight: 300 }}>
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-[#1A0E0A]/40">Billing email</span>
          <span className="text-xs text-[#1A0E0A]/70">{guestEmail}</span>
        </div>
      </div>

      <button
        onClick={onPay}
        className="w-full py-4 text-[11px] tracking-[0.25em] uppercase mb-4"
        style={{ background: "#1A0E0A", color: "#F9F1E3", borderRadius: 6 }}
      >
        Pay ₦{totalAmount.toLocaleString()} with Paystack
      </button>
      <div className="flex items-center justify-center gap-6">
        <button onClick={onBack} className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/30 hover:text-[#1A0E0A]/60 transition-colors">
          ← Go Back
        </button>
        <span className="text-[#1A0E0A]/15 text-[10px]">|</span>
        <button onClick={onCancel} className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/20 hover:text-red-400/60 transition-colors">
          Cancel Booking
        </button>
      </div>

      <p className="text-[10px] text-[#1A0E0A]/20 mt-6">
        Powered by Paystack · Card, bank transfer, and more accepted
      </p>
    </div>
  );
}

function ConfirmStep({ bookingRef, guestName, guestEmail }: {
  bookingRef: string; guestName: string; guestEmail: string;
}) {
  return (
    <div className="text-center py-8">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)" }}
      >
        <span style={{ color: "#C9A84C", fontSize: 28 }}>✓</span>
      </div>
      <h1 className="font-display text-4xl text-[#1A0E0A] mb-3" style={{ fontWeight: 300 }}>
        Booking Confirmed
      </h1>
      <p className="text-[#1A0E0A]/50 text-sm mb-6 max-w-xs mx-auto">
        Thank you, {guestName.split(" ")[0]}. A confirmation has been sent to{" "}
        <span className="text-[#1A0E0A]/70">{guestEmail}</span>.
      </p>
      <div
        className="inline-block px-6 py-3 mb-8"
        style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8 }}
      >
        <span className="text-[9px] tracking-[0.25em] uppercase text-[#C9A84C]/70 block mb-1">Booking Reference</span>
        <span className="font-display text-xl text-[#1A0E0A]" style={{ fontWeight: 400 }}>
          {bookingRef}
        </span>
      </div>
      <div>
        <Link
          href="/"
          className="text-[10px] tracking-[0.2em] uppercase text-[#1A0E0A]/40 hover:text-[#1A0E0A] transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
