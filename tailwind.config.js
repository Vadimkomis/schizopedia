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
          50: "#eff9f5",
          100: "#d9f1e7",
          200: "#b9e3d3",
          300: "#83ccb5",
          400: "#4caf90",
          500: "#2f9074",
          600: "#24745e",
          700: "#1f5d4d",
          800: "#1d4b40",
          900: "#1a3e35",
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
