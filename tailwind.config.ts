import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#faf6f1",
          100: "#f3ebe0",
          200: "#e6d5be",
          300: "#d4b794",
          400: "#c49a6b",
          500: "#b8834f",
          600: "#a66d3e",
          700: "#8a5535",
          800: "#714630",
          900: "#5d3b29",
          950: "#321d14",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;