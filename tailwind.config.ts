import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#dbeeff",
          200: "#b6deff",
          300: "#76c3ff",
          400: "#2ea8fd",
          500: "#0a8de8",
          600: "#006ec5",
          700: "#0058a0",
          800: "#064b84",
          900: "#0a3f6e",
          950: "#07273f",
        },
        slate: {
          850: "#162032",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
