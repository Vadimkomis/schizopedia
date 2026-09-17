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
        canvas: { DEFAULT: "#ffffff", dark: "#0d1522" },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f6f7fb",
          dark: "#141f30",
          "dark-subtle": "#192638",
        },
        ink: {
          DEFAULT: "#000000",
          inverse: "#eef4fb",
          muted: "#585858",
          "muted-dark": "#a5b2c2",
        },
        line: { DEFAULT: "#dedede", strong: "#949494", dark: "#2a3a4f" },
        accent: {
          DEFAULT: "#00538a",
          hover: "#00436f",
          dark: "#9bc1df",
          "dark-hover": "#bed8ec",
        },
        brand: {
          50: "#eef3fb",
          100: "#e1ecf6",
          200: "#c4d9ed",
          300: "#9bc1df",
          400: "#70a4ce",
          500: "#377eae",
          600: "#00538a",
          700: "#00436f",
          800: "#003757",
          900: "#002b45",
        },
      },
      fontFamily: {
        sans: ["'Public Sans Variable'", "'Public Sans'", ...fontFamily.sans],
        heading: ["'Newsreader Variable'", "'Newsreader'", ...fontFamily.serif],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
