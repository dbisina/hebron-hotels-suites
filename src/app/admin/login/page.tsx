"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Login failed");
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0D0704" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-12">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.2)",
              boxShadow: "0 0 40px rgba(201,168,76,0.08)",
            }}
          >
            <span
              style={{
                color: "#C9A84C",
                fontSize: 24,
                fontFamily: "var(--font-cormorant)",
                fontWeight: 400,
              }}
            >
              H
            </span>
          </div>
          <span
            className="text-2xl tracking-[0.35em] uppercase mb-1"
            style={{ color: "rgba(249,241,227,0.9)", fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
          >
            Hebron
          </span>
          <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase">Admin Console</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-2.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              suppressHydrationWarning
              className="w-full text-sm px-4 py-3.5 outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                color: "rgba(249,241,227,0.9)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            />
          </div>

          <div>
            <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-2.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              suppressHydrationWarning
              className="w-full text-sm px-4 py-3.5 outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                color: "rgba(249,241,227,0.9)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            />
          </div>

          {error && (
            <div
              className="px-4 py-3 text-xs text-center"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6, color: "rgba(252,165,165,0.9)" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all duration-200 disabled:opacity-50"
            style={{
              background: loading ? "rgba(201,168,76,0.7)" : "#C9A84C",
              color: "#0D0704",
              fontWeight: 600,
              borderRadius: 6,
              letterSpacing: "0.3em",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[9px] text-white/12 tracking-[0.2em] uppercase mt-10">
          Hebron Hotels & Suites · Owerri
        </p>
      </div>
    </div>
  );
}
