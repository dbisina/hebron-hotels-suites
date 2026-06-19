"use client";

import { motion } from "framer-motion";
import { eventsContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/hooks/useInView";

interface EventsCms {
  eyebrow?: string;
  headline?: string;
  items?: Array<{ type: string; description: string }>;
}

interface EventImgMap { [type: string]: string }

// ─── Shared easing ────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Event panel ──────────────────────────────────────────────────────────────

interface EventPanelProps {
  type: string;
  description: string;
  index: number;
}

function EventPanel({ type, description, index, imageSrc: imgOverride }: EventPanelProps & { imageSrc?: string }) {
  const imageSrc = imgOverride || `/images/events/${type.toLowerCase()}.jpg`;
  const { ref, inView } = useInView(0.15);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      className="group relative h-64 md:h-96 overflow-hidden bg-brown-800"
    >
      {/* Photography — scale reveal on viewport enter */}
      <motion.div
        className="w-full h-full"
        initial={{ scale: 1.08 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.0, delay: index * 0.1, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={type}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 to-transparent pointer-events-none" />

      {/* Text at bottom — fade up after panel reveals */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-8 py-8"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.3, ease: EASE }}
      >
        <h3
          className="font-display text-white leading-none mb-2"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300 }}
        >
          {type}
        </h3>
        <p className="font-sans text-cream-200/70 text-xs leading-relaxed max-w-xs">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function Events({ cms, eventImages }: { cms?: EventsCms | null; eventImages?: EventImgMap }) {
  const { ref: headerRef, inView: headerInView } = useInView(0.2);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.3);

  const eyebrow = cms?.eyebrow || eventsContent.eyebrow;
  const headline = cms?.headline || eventsContent.headline;
  const items = cms?.items || eventsContent.items;

  const headlineLines = headline.split("\n");

  return (
    <section id="events" className="bg-brown-950">
      {/* Header */}
      <div
        ref={headerRef as React.RefObject<HTMLDivElement>}
        className="py-20 px-8 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-5"
        >
          <SectionLabel light>{eyebrow}</SectionLabel>
        </motion.div>

        {/* Headline: line-by-line clip reveal */}
        <h2
          className="font-display text-cream-100 leading-[0.93] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)", fontWeight: 300 }}
        >
          {headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={headerInView ? { y: "0%" } : {}}
                transition={{ duration: 0.75, delay: 0.08 + i * 0.08, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* Photography grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {items.map((item, i) => (
          <EventPanel
            key={item.type}
            type={item.type}
            description={item.description}
            index={i}
            imageSrc={eventImages?.[item.type.toLowerCase()]}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        ref={ctaRef as React.RefObject<HTMLDivElement>}
        className="py-20 flex justify-center"
      >
        <motion.a
          href="tel:+2347071259011"
          className="border border-gold-600/40 text-gold-400 text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-gold-600/10 transition-colors block w-fit"
          initial={{ opacity: 0, y: 16 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          Plan Your Event
        </motion.a>
      </div>
    </section>
  );
}
