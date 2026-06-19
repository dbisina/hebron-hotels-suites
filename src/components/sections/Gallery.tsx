"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { galleryContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface GalleryImage { src: string; alt: string; category: string }
interface GalleryCms { eyebrow?: string; headline?: string }

const EASE = [0.22, 1, 0.36, 1] as const;

const CATEGORIES = ["All", "Rooms", "Facilities", "Dining", "Events", "Exterior"] as const;
type Category = (typeof CATEGORIES)[number];

function categoryMatch(imgCat: string, filter: Category) {
  if (filter === "All") return true;
  return imgCat.trim().toLowerCase() === filter.toLowerCase();
}

export function Gallery({ images: dbImages, cms }: { images?: GalleryImage[] | null; cms?: GalleryCms | null }) {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  const allImages = dbImages && dbImages.length > 0 ? dbImages : galleryContent.images;
  const eyebrow = cms?.eyebrow || galleryContent.eyebrow;
  const headline = cms?.headline || galleryContent.headline;

  const visible = allImages.filter((img) =>
    categoryMatch(img.category, activeFilter)
  );

  // Layout: first image "hero" (spans 2 rows), rest fill right column then bottom row
  const [hero, ...rest] = visible;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="bg-[#0D0704] py-24 overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-6"
            >
              <SectionLabel className="text-gold-600">{eyebrow}</SectionLabel>
            </motion.div>
            <h2
              className="font-display text-cream-100 leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300 }}
            >
              {headline.split("\n").map((line: string, i: number) => (
                <div key={i} style={{ overflow: "hidden" }}>
                  <motion.span
                    className="block"
                    initial={{ y: "100%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
                  >
                    {i === 1 ? <em>{line}</em> : line}
                  </motion.span>
                </div>
              ))}
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="text-[10px] tracking-[0.25em] uppercase px-4 py-2 transition-all duration-300"
                style={{
                  borderRadius: 99,
                  border: "1px solid",
                  borderColor: activeFilter === cat ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.1)",
                  color: activeFilter === cat ? "#C9A84C" : "rgba(255,255,255,0.35)",
                  background: activeFilter === cat ? "rgba(201,168,76,0.06)" : "transparent",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        {visible.length === 0 ? (
          <div className="text-center py-20 text-white/20 text-sm">No images in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] lg:grid-cols-[2fr_1fr_1fr] gap-1.5">
            {/* Hero cell — full height left column */}
            {hero && (
              <motion.div
                key={hero.src}
                className="relative overflow-hidden bg-[#1A0E0A] group md:row-span-2"
                style={{ minHeight: 480 }}
                initial={{ opacity: 0, scale: 1.04 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                <motion.img
                  src={hero.src}
                  alt={hero.alt}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                  style={{ y: parallaxY }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-cream-100/90 text-sm font-sans">{hero.alt}</p>
                </div>
              </motion.div>
            )}

            {/* Right / remaining cells */}
            {rest.slice(0, 5).map((img, i) => (
              <motion.div
                key={img.src}
                className="relative overflow-hidden bg-[#1A0E0A] group"
                style={{ minHeight: i < 2 ? 235 : 280 }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-cream-100/80 text-xs font-sans">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Caption bar */}
        <motion.div
          className="flex items-center justify-between mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-white/20 text-[10px] tracking-[0.25em] uppercase font-sans">
            Hebron Hotels &amp; Suites, Owerri, Nigeria
          </span>
          <div className="h-px flex-1 mx-8 bg-white/5" />
          <span className="text-white/20 text-[10px] tracking-[0.25em] uppercase font-sans">
            {visible.length} of {allImages.length}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
