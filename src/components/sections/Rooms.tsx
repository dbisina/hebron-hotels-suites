"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { roomsContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GoldDivider } from "@/components/ui/GoldDivider";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Room = { slug: string; name: string; description: string; size: string; occupancy: string; image: string; amenities: string[] | string; featured?: boolean };

interface RoomsCms { eyebrow?: string; headline?: string }

// ─── Shared easing ────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Room panel ───────────────────────────────────────────────────────────────

function RoomPanel({ room }: { room: Room }) {
  const { ref, inView } = useInView(0.08);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Full-bleed image */}
      <div className="relative w-full h-[60vh] bg-brown-800 overflow-hidden">
        {/* Animated image: scale(1.05→1) + opacity(0→1) on mount/tab-change */}
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>

        {/* Bottom scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Room name — bottom left, clip-up reveal */}
        <div className="absolute bottom-8 left-8 md:left-16 overflow-hidden">
          <motion.h3
            className="font-display text-white leading-none"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {room.name}
          </motion.h3>
        </div>

        {/* Featured badge — top right */}
        {room.featured && (
          <div className="absolute top-8 right-8">
            <span className="border border-white/30 text-white text-[10px] tracking-[0.3em] uppercase px-4 py-1.5 inline-block">
              Signature Suite
            </span>
          </div>
        )}
      </div>

      {/* Details row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-[rgba(26,14,10,0.08)]">
        {/* Left: info */}
        <div className="px-4 sm:px-8 md:px-16 py-8 md:py-12">
          {/* Size + Occupancy */}
          <motion.div
            className="flex items-center gap-8 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <div>
              <p className="font-display text-[#C9A84C] text-2xl leading-none mb-1" style={{ fontWeight: 300 }}>
                {room.size}
              </p>
              <p className="font-sans text-[#1A0E0A]/40 text-[10px] tracking-[0.3em] uppercase">Room Size</p>
            </div>
            <div className="w-px h-8 bg-[rgba(26,14,10,0.12)]" />
            <div>
              <p className="font-display text-[#C9A84C] text-2xl leading-none mb-1" style={{ fontWeight: 300 }}>
                {room.occupancy}
              </p>
              <p className="font-sans text-[#1A0E0A]/40 text-[10px] tracking-[0.3em] uppercase">Occupancy</p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="font-sans text-[#1A0E0A]/55 text-sm leading-relaxed mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            {room.description}
          </motion.p>

          {/* Amenities — 2-col plain list */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {(Array.isArray(room.amenities) ? room.amenities : JSON.parse(room.amenities as string) as string[]).map((amenity: string, i: number) => (
              <motion.li
                key={amenity}
                className="font-sans text-xs text-[#1A0E0A]/55 leading-relaxed flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.28 + i * 0.04, ease: EASE }}
              >
                <span className="w-1 h-1 rounded-full bg-[rgba(26,14,10,0.25)] shrink-0" aria-hidden="true" />
                {amenity}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right: CTA */}
        <div className="px-4 sm:px-8 md:px-16 py-8 md:py-12 border-t md:border-t-0 md:border-l border-[rgba(26,14,10,0.08)] flex flex-col justify-center gap-5">
          <motion.a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 font-sans text-xs tracking-[0.25em] uppercase transition-all duration-300"
            style={{ background: "#1A0E0A", color: "#F7F3EE" }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
          >
            Reserve This Room
          </motion.a>
          <motion.a
            href="#contact"
            className="font-sans text-xs tracking-[0.2em] uppercase text-[#1A0E0A]/35 hover:text-[#1A0E0A] transition-colors text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.52, ease: EASE }}
          >
            Enquire
          </motion.a>
        </div>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function Rooms({ dbRooms, cms }: { dbRooms?: Room[] | null; cms?: RoomsCms | null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref: sectionRef, inView: sectionInView } = useInView(0.1);

  const eyebrow = cms?.eyebrow || roomsContent.eyebrow;
  const headline = cms?.headline || roomsContent.headline;

  const rooms: Room[] = (dbRooms && dbRooms.length > 0)
    ? dbRooms.map((r) => ({
        ...r,
        amenities: (typeof r.amenities === "string" ? JSON.parse(r.amenities) : r.amenities) as string[],
      }))
    : (roomsContent.rooms as unknown as Room[]);

  const headlineLines = headline.split("\n");

  return (
    <section
      id="accommodation"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="bg-[#FDFAF4]"
    >
      {/* Header */}
      <div className="px-4 sm:px-8 md:px-16 pt-20 md:pt-36 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-5"
        >
          <SectionLabel>{eyebrow}</SectionLabel>
        </motion.div>

        {/* Headline: line-by-line clip reveal */}
        <h2
          className="font-display text-[#1A0E0A] leading-[0.93] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)", fontWeight: 300 }}
        >
          {headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={sectionInView ? { y: "0%" } : {}}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>

      {/* Room selector tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="flex items-center gap-5 sm:gap-8 px-4 sm:px-8 md:px-16 mb-0 overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="Room categories"
      >
        {rooms.map((room, i) => (
          <button
            key={room.slug}
            role="tab"
            aria-selected={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "font-sans text-xs tracking-[0.25em] uppercase whitespace-nowrap pb-4 transition-colors duration-200 outline-none",
              activeIndex === i
                ? "text-[#1A0E0A] border-b border-[#C9A84C]"
                : "text-[#1A0E0A]/30 hover:text-[#1A0E0A]"
            )}
          >
            {room.name}
          </button>
        ))}
      </motion.div>

      {/* Animated room panel — AnimatePresence keyed on room index */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={rooms[activeIndex].slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <RoomPanel room={rooms[activeIndex]} />
        </motion.div>
      </AnimatePresence>

      {/* Bottom spacing */}
      <div className="pb-24 md:pb-36" />
    </section>
  );
}
