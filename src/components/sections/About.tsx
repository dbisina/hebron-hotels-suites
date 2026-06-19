"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface AboutCms {
  eyebrow?: string;
  headline?: string;
  body?: string;
  image?: string;
  stats?: Array<{ value: string; label: string }>;
}

export function About({ cms }: { cms?: AboutCms | null }) {
  const { ref: statsRef, inView: statsInView } = useInView(0.3);
  const { ref: sectionRef, inView: sectionInView } = useInView(0.15);

  const eyebrow = cms?.eyebrow || aboutContent.eyebrow;
  const headline = cms?.headline || aboutContent.headline;
  const body = cms?.body || aboutContent.body;
  const image = cms?.image || "/images/about.jpg";
  const stats = cms?.stats || aboutContent.stats;

  const headlineLines = headline.split("\n");

  return (
    <section
      id="about"
      className="bg-[#FDFAF4] min-h-screen lg:grid lg:grid-cols-[55%_45%] overflow-hidden"
    >
      {/* Left — full-bleed image */}
      <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-[#2D1A0E] overflow-hidden">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <img
            src={image}
            alt="Hebron Hotels & Suites interior"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>
      </div>

      {/* Right — text content */}
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="flex items-center px-12 py-20 lg:py-32"
      >
        <div className="w-full max-w-lg">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mb-8"
          >
            <SectionLabel>{eyebrow}</SectionLabel>
          </motion.div>

          {/* Headline — line-by-line clip reveal */}
          <h2
            className="font-display text-[#2D1A0E] text-5xl md:text-6xl leading-[1] tracking-[-0.01em] mb-8"
            style={{ fontWeight: 300, fontFamily: "var(--font-cormorant)" }}
          >
            {headlineLines.map((line, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  animate={sectionInView ? { y: "0%" } : {}}
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

          {/* Rule */}
          <motion.div
            className="h-px bg-[#C9A84C]/30 mb-8"
            initial={{ scaleX: 0 }}
            animate={sectionInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            style={{ transformOrigin: "left" }}
          />

          {/* Body */}
          <motion.p
            className="text-[#2D1A0E]/80 text-base leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          >
            {body}
          </motion.p>

          {/* Stats row */}
          <div
            ref={statsRef as React.RefObject<HTMLDivElement>}
            className="flex items-baseline gap-0"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.7 + i * 0.12,
                  ease: EASE,
                }}
                className={cn(
                  "flex-1 text-center",
                  i < stats.length - 1 &&
                    "border-r border-[#2D1A0E]/15"
                )}
              >
                <div
                  className="text-[#D4AF37] text-4xl md:text-5xl leading-none mb-1.5"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[#2D1A0E]/50 text-[10px] tracking-[0.25em] uppercase"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
