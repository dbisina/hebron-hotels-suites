"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  options?: { offset?: number; end?: number }
) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalScroll = rect.height - windowH;
      const scrolled = -rect.top;
      const raw = scrolled / totalScroll;
      setProgress(Math.min(Math.max(raw, 0), 1));
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ref, options]);

  return progress;
}
