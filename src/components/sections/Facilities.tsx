"use client";

import { motion } from "framer-motion";
import { facilitiesContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/hooks/useInView";

interface FacilitiesCms {
  eyebrow?: string;
  headline?: string;
  items?: Array<{ icon: string; title: string }>;
}

const DEFAULT_FACILITY_IMAGES: [string, string, string, string] = [
  "/images/facility-1.jpg",
  "/images/facility-2.jpg",
  "/images/facility-3.jpg",
  "/images/facility-4.jpg",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const iconPaths: Record<string, string> = {
  wifi: "M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01",
  pool: "M2 12h20M2 12c0-3.31 1.34-6.31 3.51-8.49M22 12c0-3.31-1.34-6.31-3.51-8.49M2 12c0 3.31 1.34 6.31 3.51 8.49M22 12c0 3.31-1.34 6.31-3.51 8.49",
  gym: "M6.5 6.5h11M6.5 6.5v11M17.5 6.5v11M3 12h18M6.5 17.5h11",
  breakfast:
    "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3",
  spa: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  car: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2M9 22a2 2 0 100-4 2 2 0 000 4zM20 22a2 2 0 100-4 2 2 0 000 4z",
  dining:
    "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
  concierge:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z",
};

const FACILITY_ALT = ["Swimming pool at Hebron Hotels", "Fitness centre at Hebron Hotels", "Spa and wellness at Hebron Hotels", "Dining at Hebron Hotels"];

export function Facilities({ cms, facilityImages }: { cms?: FacilitiesCms | null; facilityImages?: [string, string, string, string] }) {
  const images = facilityImages ?? DEFAULT_FACILITY_IMAGES;
  const { ref: stripRef, inView: stripInView } = useInView(0.2);
  const { ref: headerRef, inView: headerInView } = useInView(0.2);
  const { ref: gridRef, inView: gridInView } = useInView(0.2);

  const eyebrow = cms?.eyebrow || facilitiesContent.eyebrow;
  const headline = cms?.headline || facilitiesContent.headline;
  const items = cms?.items || facilitiesContent.items;

  const headlineLines = headline.split("\n");

  return (
    <section id="facilities" className="bg-[#FDFAF4] overflow-hidden">
      {/* Photography strip */}
      <div
        ref={stripRef as React.RefObject<HTMLDivElement>}
        className="overflow-x-auto flex gap-0.5 w-full"
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            className="w-72 h-48 lg:w-96 lg:h-64 flex-shrink-0 bg-[#2D1A0E] overflow-hidden rounded-none"
            initial={{ opacity: 0, x: 40 }}
            animate={stripInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: i * 0.08,
              ease: EASE,
            }}
          >
            <img
              src={src}
              alt={FACILITY_ALT[i] ?? "Hebron Hotels facility"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div
        ref={headerRef as React.RefObject<HTMLDivElement>}
        className="max-w-screen-xl mx-auto px-6 md:px-16 pt-20 pb-12 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <SectionLabel className="mb-6 block">
            {eyebrow}
          </SectionLabel>
        </motion.div>

        {/* Headline — line-by-line clip reveal */}
        <h2
          className="text-[#2D1A0E] text-5xl md:text-6xl leading-[1] tracking-[-0.01em]"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
          }}
        >
          {headlineLines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{
                  duration: 0.85,
                  delay: 0.2 + i * 0.12,
                  ease: EASE,
                }}
              >
                {i === 1 ? <em>{line}</em> : line}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      {/* Amenity list — 4 cols desktop, 2 cols mobile */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 pb-24">
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.icon}
              initial={{ opacity: 0, y: 24 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.06,
                ease: EASE,
              }}
              className="flex flex-col items-start gap-3"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={iconPaths[item.icon] ?? ""} />
              </svg>
              <span
                className="text-[#2D1A0E] text-base tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
