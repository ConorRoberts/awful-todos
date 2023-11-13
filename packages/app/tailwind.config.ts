import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,astro}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        grey: colors.neutral,
      },
    },
  },

  plugins: [require("tailwind-scrollbar")],
};

export default config;
