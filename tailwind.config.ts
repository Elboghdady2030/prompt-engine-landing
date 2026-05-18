import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        steel: "#1E293B",
        sand: "#E2E8F0",
        copper: "#B45309",
        signal: "#D97706",
        mint: "#0F766E",
        danger: "#B91C1C",
      },
      boxShadow: {
        panel: "0 12px 40px rgba(15, 23, 42, 0.10)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
