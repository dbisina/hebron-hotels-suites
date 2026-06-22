"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // ChunkLoadError = stale JS chunk after a new deploy — hard reload fetches fresh chunks
    if (error?.name === "ChunkLoadError" || error?.message?.includes("Loading chunk")) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D0704",
        color: "#E8DFD0",
        fontFamily: "Georgia, serif",
        gap: 24,
        padding: 32,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(232,223,208,0.4)" }}>
        Something went wrong
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 300, margin: 0 }}>We hit an unexpected error</h1>
      <p style={{ fontSize: 14, color: "rgba(232,223,208,0.5)", maxWidth: 360 }}>
        This usually resolves itself. Try refreshing the page.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 24px",
            background: "#C9A84C",
            color: "#0D0704",
            border: "none",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Refresh Page
        </button>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            background: "transparent",
            color: "rgba(232,223,208,0.5)",
            border: "1px solid rgba(232,223,208,0.15)",
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
