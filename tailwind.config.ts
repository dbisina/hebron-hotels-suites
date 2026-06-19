import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          950: "#0D0704",
          900: "#1A0E0A",
          800: "#2D1A0E",
          700: "#3D2412",
          600: "#4E2E16",
          500: "#6B3F1E",
        },
        gold: {
          300: "#F0D98C",
          400: "#E8C96A",
          500: "#D4AF37",
          600: "#C9A84C",
          700: "#A8892A",
          800: "#7A6320",
        },
        cream: {
          50: "#FDFAF4",
          100: "#F9F1E3",
          200: "#F0E0C4",
          300: "#E8D0A8",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: "0.4em",
        "ultra-wide": "0.6em",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1.2s ease forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
