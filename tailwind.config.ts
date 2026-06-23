import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111315",
        paper: "#f7f4ef",
        line: "rgba(17, 19, 21, 0.12)"
      },
      boxShadow: {
        soft: "0 20px 70px rgba(17, 19, 21, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
