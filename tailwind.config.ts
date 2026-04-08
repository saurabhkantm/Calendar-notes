import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#1a6eb5",
          soft: "#e8f1fb",
          dark: "#4a9de0",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#1e1c19",
        },
        cal: {
          bg: "#f8f6f2",
          "bg-dark": "#141210",
          border: "#e8e2d9",
          "border-dark": "#2e2b27",
          muted: "#8c8580",
          "muted-dark": "#7a756f",
          note: "#fffbf5",
          "note-dark": "#1a1814",
          "note-border": "#f0e8d8",
          "note-border-dark": "#2e2b27",
          weekend: "#c0392b",
          "weekend-dark": "#e06060",
          other: "#c8c3be",
          "other-dark": "#3a3733",
          range: "#deedf8",
          "range-dark": "#1a2f42",
        },
      },
      animation: {
        "slide-in": "slideIn 0.25s ease",
        "fade-in": "fadeIn 0.2s ease",
      },
      keyframes: {
        slideIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
