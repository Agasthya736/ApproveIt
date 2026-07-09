import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16233A",
        "ink-deep": "#0F1826",
        paper: "#F3EEE1",
        "paper-line": "#DDD5C0",
        stamp: "#C1443A",
        sage: "#6B9080",
        brass: "#C6A15B",
      },
    },
  },
  plugins: [],
};
export default config;
