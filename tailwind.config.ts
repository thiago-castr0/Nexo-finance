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
        nexo: {
          red: {
            500: "#DC2626",
            400: "#E85950",
            300: "#EE7870",
            200: "#F59B92",
            100: "#FACBC2",
          },
          purple: {
            500: "#692296",
            400: "#7E32B5",
            300: "#A466D1",
            200: "#C59BE3",
            100: "#DEC5EF",
          },
          alert: {
            500: "#EA920F",
            400: "#EDAD12",
            300: "#ECC023",
            200: "#ECD54A",
            100: "#EDE08D",
          },
          success: {
            500: "#0CB853",
            400: "#13BD5B",
            300: "#46C87D",
            200: "#7BD6A0",
            100: "#BCE5CB",
          },
          danger: {
            500: "#DF2929",
            400: "#E54541",
            300: "#EC6862",
            200: "#F4948C",
            100: "#F9C5BD",
          },
          info: {
            500: "#2572CE",
            400: "#448BDE",
            300: "#65A2E6",
            200: "#8CB9EB",
            100: "#BCD6F2",
          },
          neutral: {
            black: "#09090B",
            900: "#18181B",
            700: "#3F3F46",
            500: "#71717A",
            300: "#D4D4D8",
            200: "#E4E4E7",
            100: "#F4F4F5",
            white: "#FFFFFF",
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
