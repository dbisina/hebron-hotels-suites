"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { heroContent } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = heroContent.frameCount; // 101

// Phase boundaries for prioritised loading
const PHASE_1_END = 12;   // critical — load sync before paint
const PHASE_2_END = 50;   // eager — load immediately after phase 1
// phase 3: remainder loaded via requestIdleCallback

function padded(n: number) {
  return String(n).padStart(3, "0");
}

function frameSrc(n: number) {
  return `/frames/ezgif-frame-${padded(n)}.jpg`;
}

// Pre-generate all src strings once
const SRCS = Array.from({ length: FRAME_COUNT }, (_, i) => frameSrc(i + 1));

interface HeroCanvasProps {
  desktopMode?: "frames" | "photo";
  mobileMode?: "frames" | "photo";
  desktopPhoto?: string;
  mobilePhoto?: string;
}

// ─── Photo-mode hero (static background, no scroll trap) ──────────────────────
function HeroPhoto({ photo, fallback }: { photo?: string; fallback?: string }) {
  const src = photo || fallback;
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {src ? (
        <img
          src={src}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center" }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #1A0E0A 0%, #0D0704 100%)" }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,7,4,0.35) 0%, transparent 35%, transparent 55%, rgba(13,7,4,0.85) 100%)",
        }}
      />

      {/* Hero text */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end pb-32 px-8 md:px-16 lg:px-24 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-6 font-sans">
          {heroContent.eyebrow}
        </p>
        <h1
          className="font-display text-white text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-[-0.02em]"
          style={{ fontWeight: 300 }}
        >
          {heroContent.headline.split("\n").map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>
        <p className="text-cream-200/80 font-sans text-base md:text-lg max-w-md tracking-wide mt-6">
          {heroContent.subheadline}
        </p>
      </motion.div>

      {/* Scroll progress bar (still present for booking bar context) */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </div>
  );
}

// ─── Main HeroCanvas ────────────────────────────────────────────────────────────
export function HeroCanvas({
  desktopMode = "frames",
  mobileMode = "frames",
  desktopPhoto,
  mobilePhoto,
}: HeroCanvasProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const effectiveMode = isMobile ? mobileMode : desktopMode;
  const effectivePhoto = isMobile ? mobilePhoto : desktopPhoto;

  // Photo mode — render static hero, no scroll trap
  if (effectiveMode === "photo") {
    return <HeroPhoto photo={effectivePhoto} />;
  }

  // Frame mode — scroll animation
  return <HeroFrames />;
}

// ─── Scroll-frame animation (original logic, extracted) ────────────────────────
function HeroFrames() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  const progress = useScrollProgress(containerRef as React.RefObject<HTMLElement>);

  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.naturalWidth || !img.naturalHeight) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const x = (cssW - drawW) / 2;
    const y = (cssH - drawH) / 2;

    ctx.fillStyle = "#0D0704";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.drawImage(img, x, y, drawW, drawH);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr | 0;
      canvas.height = window.innerHeight * dpr | 0;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const img = imagesRef.current[currentFrameRef.current];
      if (img && loadedRef.current[currentFrameRef.current]) drawFrame(img);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  useEffect(() => {
    const imgs = imagesRef.current;
    const loaded = loadedRef.current;

    function loadOne(i: number, onDone?: () => void) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        if (onDone) onDone();
      };
      img.src = SRCS[i];
      imgs[i] = img;
    }

    let phase1Done = 0;
    function afterPhase1() {
      phase1Done++;
      if (phase1Done === 1) {
        const img = imgs[0];
        if (img) { drawFrame(img); setReady(true); }
      }
      if (phase1Done === PHASE_1_END) loadPhase2();
    }

    for (let i = 0; i < PHASE_1_END; i++) loadOne(i, afterPhase1);

    function loadPhase2() {
      for (let i = PHASE_1_END; i < PHASE_2_END; i++) loadOne(i);
      loadPhase3();
    }

    function loadPhase3() {
      let i = PHASE_2_END;
      function loadBatch(deadline: IdleDeadline) {
        while (i < FRAME_COUNT && deadline.timeRemaining() > 4) { loadOne(i); i++; }
        if (i < FRAME_COUNT) requestIdleCallback(loadBatch, { timeout: 1000 });
      }
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(loadBatch, { timeout: 500 });
      } else {
        function safariLoad() {
          const batch = 5;
          const end = Math.min(i + batch, FRAME_COUNT);
          for (; i < end; i++) loadOne(i);
          if (i < FRAME_COUNT) setTimeout(safariLoad, 32);
        }
        setTimeout(safariLoad, 100);
      }
    }
  }, [drawFrame]);

  useEffect(() => {
    const targetIdx = Math.min(Math.round(progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const imgs = imagesRef.current;
      const loaded = loadedRef.current;
      if (loaded[targetIdx]) {
        currentFrameRef.current = targetIdx;
        drawFrame(imgs[targetIdx]!);
        return;
      }
      let best = -1, bestDist = Infinity;
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (loaded[i]) {
          const d = Math.abs(i - targetIdx);
          if (d < bestDist) { bestDist = d; best = i; }
        }
      }
      if (best >= 0) drawFrame(imgs[best]!);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress, drawFrame]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 block"
          aria-hidden
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
        />

        {!ready && (
          <div
            className="absolute inset-0 bg-brown-950"
            style={{ background: "linear-gradient(160deg, #1A0E0A 0%, #0D0704 100%)" }}
          />
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,7,4,0.3) 0%, transparent 30%, transparent 60%, rgba(13,7,4,0.9) 100%)",
          }}
        />

        <AnimatePresence>
          {progress > 0.5 && (
            <motion.div
              key="hero-text"
              className="absolute inset-0 flex flex-col justify-end pb-32 px-8 md:px-16 lg:px-24 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-6 font-sans"
              >
                {heroContent.eyebrow}
              </motion.p>
              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                  className="font-display text-white text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-[-0.02em]"
                  style={{ fontWeight: 300 }}
                >
                  {heroContent.headline.split("\n").map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-cream-200/80 font-sans text-base md:text-lg max-w-md tracking-wide mt-6"
              >
                {heroContent.subheadline}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {progress <= 0.5 && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
            >
              <span className="text-cream-200/50 text-[10px] tracking-[0.3em] uppercase font-sans">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-gold-500/80 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
          <motion.div className="h-full bg-gold-500" style={{ scaleX: progress, transformOrigin: "left" }} />
        </div>
      </div>
    </div>
  );
}
