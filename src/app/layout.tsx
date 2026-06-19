import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { ConditionalNav } from "@/components/layout/ConditionalNav";

/* ─── Google Fonts ──────────────────────────────────────────────────────────── */
const playfair = Playfair_Display({
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

/* ─── Viewport ──────────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0704",
};

/* ─── SEO Metadata ──────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Hebron Hotels & Suites Owerri | Home of Comfort & Relaxation",
  description:
    "Experience ultimate luxury at Hebron Hotels and Suites in Owerri, Nigeria. Premium rooms, spa, pool, and world-class hospitality.",
  keywords: [
    "Hebron Hotels",
    "Hebron Hotels and Suites",
    "Hebron Hotels Owerri",
    "luxury hotel Owerri",
    "hotel Nigeria",
    "Owerri accommodation",
    "luxury suites Nigeria",
    "hotel pool Owerri",
    "spa hotel Owerri",
    "business hotel Owerri",
    "Imo State hotel",
    "boutique hotel Nigeria",
  ],
  authors: [{ name: "Hebron Hotels & Suites" }],
  creator: "Hebron Hotels & Suites",
  publisher: "Hebron Hotels & Suites",
  metadataBase: new URL("https://hebronhotels.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://hebronhotels.com",
    siteName: "Hebron Hotels & Suites",
    title: "Hebron Hotels & Suites Owerri | Home of Comfort & Relaxation",
    description:
      "Experience ultimate luxury at Hebron Hotels and Suites in Owerri, Nigeria. Premium rooms, spa, pool, and world-class hospitality.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Hebron Hotels & Suites, Owerri, Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hebron Hotels & Suites Owerri | Home of Comfort & Relaxation",
    description:
      "Experience ultimate luxury at Hebron Hotels and Suites in Owerri, Nigeria. Premium rooms, spa, pool, and world-class hospitality.",
    images: ["/logo.png"],
    creator: "@hebronhotels",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ─── Root Layout ───────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        <ConditionalNav />
        {children}
      </body>
    </html>
  );
}
