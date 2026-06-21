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
        teal: {
          surface: "#edf7f4",
          border: "#c7e3da",
        },
      },
      fontFamily: {
        sans: ["'Public Sans Variable'", "'Public Sans'", ...fontFamily.sans],
        heading: ["'Newsreader Variable'", "'Newsreader'", ...fontFamily.serif],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.03), 0 2px 8px rgba(15, 23, 42, 0.04)",
        "card-hover":
          "0 4px 10px rgba(15, 23, 42, 0.05), 0 16px 36px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
