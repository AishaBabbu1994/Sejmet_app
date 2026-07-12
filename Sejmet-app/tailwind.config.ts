import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14162A",
          800: "#1B1E38",
          700: "#232748",
          600: "#2E3358",
        },
        parchment: {
          DEFAULT: "#F4ECD8",
          dim: "#E8DDC0",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C77A",
          dim: "#8C7130",
        },
        teal: {
          DEFAULT: "#2E8F87",
          light: "#4FB3AA",
        },
        terra: "#C1584A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabicDisplay: ["var(--font-reem)", "sans-serif"],
        arabicBody: ["var(--font-naskh)", "serif"],
      },
      boxShadow: {
        seal: "0 6px 20px -6px rgba(201, 162, 75, 0.45)",
      },
      backgroundImage: {
        weave:
          "radial-gradient(circle at 1px 1px, rgba(244,236,216,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;
