import Link from "next/link";
import Image from "next/image";
import { siteConfig, navLinks } from "@/lib/content";
import { GoldDivider } from "@/components/ui/GoldDivider";

// ─── SVG Icons ─────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 text-gold-500"
      aria-hidden="true"
    >
      <path
        d="M2 2C2 1.44772 2.44772 1 3 1H5.27924C5.46469 1 5.63312 1.11116 5.70711 1.28206L6.75736 3.76393C6.84082 3.95912 6.78878 4.18668 6.62902 4.32558L5.30327 5.48L5.34127 5.60002C5.84419 7.1396 7.02282 8.37878 8.53553 8.96284L8.66667 9L9.82558 7.62902C9.97033 7.46448 10.2001 7.41116 10.3994 7.49843L12.7189 8.5C12.8904 8.57504 13 8.74349 13 8.93054V11C13 11.5523 12.5523 12 12 12C6.47715 12 2 7.52285 2 2Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 text-gold-500"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="12" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M1.5 3.5L7 7.5L12.5 3.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 mt-0.5 text-gold-500"
      aria-hidden="true"
    >
      <path
        d="M7 1C4.79086 1 3 2.79086 3 5C3 7.99998 7 13 7 13C7 13 11 7.99998 11 5C11 2.79086 9.20914 1 7 1Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 text-gold-500"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M7 4V7L9 9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Footer columns ─────────────────────────────────────────────────────────

function BrandColumn() {
  return (
    <div className="flex flex-col gap-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <Image
            src="/logo-transp.png"
            alt={siteConfig.name}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="font-serif text-2xl tracking-widest text-gold-400 leading-none">
            HEBRON
          </p>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-cream-100/50 mt-1">
            Hotels &amp; Suites
          </p>
        </div>
      </div>

      <div className="w-10 h-px bg-gold-600/50" />

      <p className="font-sans text-sm text-cream-100/50 leading-relaxed max-w-[200px]">
        {siteConfig.tagline}
      </p>

      {/* Social icons */}
      <div className="flex items-center gap-3 mt-1">
        <a
          href={siteConfig.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hebron Hotels on Facebook"
          className="group flex items-center justify-center w-9 h-9 rounded-full border border-gold-600/40 text-gold-500/70 transition-all duration-300 hover:bg-gold-600 hover:border-gold-600 hover:text-brown-950"
        >
          <FacebookIcon />
        </a>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hebron Hotels on Instagram"
          className="group flex items-center justify-center w-9 h-9 rounded-full border border-gold-600/40 text-gold-500/70 transition-all duration-300 hover:bg-gold-600 hover:border-gold-600 hover:text-brown-950"
        >
          <InstagramIcon />
        </a>
      </div>
    </div>
  );
}

function NavigationColumn() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-500 font-semibold mb-1">
        Navigation
      </p>
      <nav>
        <ul className="flex flex-col gap-3">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="font-sans text-sm tracking-[0.12em] uppercase text-cream-100/50 transition-colors duration-200 hover:text-gold-400"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function ContactColumn() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-500 font-semibold mb-1">
        Contact
      </p>

      <ul className="flex flex-col gap-4">
        <li>
          <a
            href={`tel:${siteConfig.phone}`}
            className="group flex items-center gap-2.5 text-cream-100/55 hover:text-cream-100 transition-colors duration-200"
          >
            <PhoneIcon />
            <span className="font-sans text-sm">{siteConfig.phone}</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex items-start gap-2.5 text-cream-100/55 hover:text-cream-100 transition-colors duration-200"
          >
            <EmailIcon />
            <span className="font-sans text-sm break-all">{siteConfig.email}</span>
          </a>
        </li>
        <li>
          <div className="flex items-start gap-2.5 text-cream-100/55">
            <LocationIcon />
            <address className="font-sans text-sm not-italic leading-relaxed">
              {siteConfig.address}
            </address>
          </div>
        </li>
      </ul>
    </div>
  );
}

function HoursColumn() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-500 font-semibold mb-1">
        Hours
      </p>

      <ul className="flex flex-col gap-5">
        <li className="flex items-start gap-2.5">
          <ClockIcon />
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500/80 mb-1">
              Check-in
            </p>
            <p className="font-sans text-sm text-cream-100/70">
              From {siteConfig.checkIn}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-2.5">
          <ClockIcon />
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500/80 mb-1">
              Check-out
            </p>
            <p className="font-sans text-sm text-cream-100/70">
              By {siteConfig.checkOut}
            </p>
          </div>
        </li>
        <li className="mt-2">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500/80 mb-2">
            Concierge
          </p>
          <p className="font-sans text-sm text-cream-100/70">24 / 7</p>
        </li>
      </ul>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0704] text-cream-100">
      {/* Wide ornate top divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <GoldDivider variant="ornate" />
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <BrandColumn />
          <NavigationColumn />
          <ContactColumn />
          <HoursColumn />
        </div>
      </div>

      {/* Bottom strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoldDivider variant="full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-cream-100/35 tracking-wide">
            &copy; {currentYear} {siteConfig.name} Owerri. All rights reserved.
          </p>
          <Link
            href="/refund-policy"
            className="font-sans text-[11px] text-cream-100/30 hover:text-gold-400 transition-colors tracking-wide"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
