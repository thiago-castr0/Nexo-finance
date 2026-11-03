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
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          red: {
            DEFAULT: "#E11D48",
            light: "#FFF1F2",
            border: "#FECDD3",
            dark: "#BE123C",
          },
          purple: {
            DEFAULT: "#7C3AED",
            light: "#F5F3FF",
            border: "#DDD6FE",
            dark: "#6D28D9",
          },
        },
        semantic: {
          income: {
            DEFAULT: "#16A34A",
            light: "#F0FDF4",
            border: "#BBF7D0",
          },
          expense: {
            DEFAULT: "#DC2626",
            light: "#FEF2F2",
            border: "#FECACA",
          },
          warning: {
            DEFAULT: "#D97706",
            light: "#FFFBEB",
            border: "#FDE68A",
          },
          info: {
            DEFAULT: "#2563EB",
            light: "#EFF6FF",
            border: "#BFDBFE",
          },
        },
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
