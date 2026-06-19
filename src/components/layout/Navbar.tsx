"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-brown-900/95 backdrop-blur-xl border-b border-gold-800/20 py-3"
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/logo-transp.png"
                alt={siteConfig.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden md:block">
              <p className="text-gold-400 font-serif text-lg leading-tight tracking-wide">
                Hebron
              </p>
              <p className="text-cream-200/50 text-[9px] tracking-[0.35em] uppercase">
                Hotels & Suites
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-cream-200/70 hover:text-gold-400 text-[11px] tracking-[0.25em] uppercase font-sans transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right — CTA + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+2347071259011"
              className="hidden md:flex items-center gap-2 text-gold-400 text-[11px] tracking-[0.2em] uppercase font-sans hover:text-gold-300 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Reserve
            </a>

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
              aria-label="Open menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "block h-px bg-cream-100 transition-all duration-300",
                    i === 1 ? "w-5" : "w-7"
                  )}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brown-950/98 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-cream-200/60 hover:text-gold-400 transition-colors p-2"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-4xl text-cream-100 hover:text-gold-400 transition-colors duration-300 tracking-tight"
                  style={{ fontWeight: 300 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="p-10 text-center">
              <p className="text-cream-200/30 text-xs tracking-[0.3em] uppercase">
                {siteConfig.location}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
