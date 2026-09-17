import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        canvas: { DEFAULT: "#f7f9fc", dark: "#0d1522" },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f1f5f9",
          dark: "#141f30",
          "dark-subtle": "#192638",
        },
        ink: {
          DEFAULT: "#162033",
          inverse: "#eef4fb",
          muted: "#5f6b7a",
          "muted-dark": "#a5b2c2",
        },
        line: { DEFAULT: "#dce3ec", dark: "#2a3a4f" },
        accent: {
          DEFAULT: "#005b96",
          hover: "#004874",
          dark: "#78a9ff",
          "dark-hover": "#9bbfff",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["'Public Sans Variable'", "'Public Sans'", ...fontFamily.sans],
        heading: ["'Newsreader Variable'", "'Newsreader'", ...fontFamily.serif],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
