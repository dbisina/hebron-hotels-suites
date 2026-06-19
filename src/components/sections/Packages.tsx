"use client";

import { motion } from "framer-motion";
import { packagesContent, membershipContent } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/hooks/useInView";

// ─── Package card ──────────────────────────────────────────────────────────────

interface PackageCardProps {
  pkg: (typeof packagesContent.packages)[number];
  index: number;
}

function PackageCard({ pkg, index }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="px-8 md:px-10 py-12 flex flex-col"
    >
      {/* Highlight */}
      <p className="text-gold-600 text-[9px] tracking-[0.4em] uppercase mb-4">
        {pkg.highlight}
      </p>

      {/* Name */}
      <h3
        className="font-display text-brown-900 text-2xl mb-4 leading-snug"
        style={{ fontWeight: 400 }}
      >
        {pkg.name}
      </h3>

      {/* Description */}
      <p className="font-sans text-sm text-brown-700/70 leading-relaxed mb-8">
        {pkg.description}
      </p>

      {/* Includes */}
      <ul className="flex flex-col gap-2 flex-1">
        {pkg.includes.map((item) => (
          <li key={item} className="font-sans text-xs text-brown-700/60">
            <span className="mr-2 text-brown-700/40">—</span>
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        className="text-brown-900 text-xs tracking-[0.2em] uppercase border-b border-brown-900/30 pb-0.5 mt-8 inline-block hover:border-brown-900 transition-colors w-fit"
      >
        Reserve Package
      </a>
    </motion.div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function Packages() {
  const { ref: headerRef, inView: headerInView } = useInView(0.15);

  return (
    <section id="packages" className="bg-[#FDFAF4]">
      {/* Header */}
      <div
        ref={headerRef as React.RefObject<HTMLDivElement>}
        className="py-20 px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <SectionLabel>{packagesContent.eyebrow}</SectionLabel>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-display text-brown-900 leading-[0.93] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)", fontWeight: 300 }}
        >
          {packagesContent.headline.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h2>
      </div>

      {/* Package grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-brown-800/10">
        {packagesContent.packages.map((pkg, i) => (
          <PackageCard key={pkg.name} pkg={pkg} index={i} />
        ))}
      </div>

      {/* Membership strip */}
      <div className="bg-brown-900 py-20 px-8 text-center mt-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto flex flex-col items-center gap-6"
        >
          <h2
            className="font-display text-cream-100 leading-[0.93] tracking-[-0.01em]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
          >
            {membershipContent.headline.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="font-sans text-sm text-cream-100/60 leading-relaxed">
            {membershipContent.body}
          </p>

          <a
            href="#contact"
            className="border border-gold-600/40 text-gold-400 text-xs tracking-[0.25em] uppercase px-8 py-3 hover:bg-gold-600/10 transition-colors"
          >
            {membershipContent.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
