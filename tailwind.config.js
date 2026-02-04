import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", ...fontFamily.sans],
        heading: ["'Sora'", ...fontFamily.sans],
      },
      boxShadow: {
        neon: "0 20px 45px rgba(79, 70, 229, 0.35)",
        "inner-glow": "inset 0 0 25px rgba(59, 130, 246, 0.25)",
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(14,165,233,0.08) 45%, rgba(236,72,153,0.15) 100%)",
      },
      animation: {
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: 0.5 },
          "70%": { transform: "scale(1.1)", opacity: 0 },
          "100%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
