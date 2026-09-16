/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F0E3",
        bgAlt: "#ECE4D0",
        ink: "#14302B",
        inkSoft: "#3B554E",
        paper: "#FBF8F1",
        gold: "#D98E30",
        goldDeep: "#AD6E20",
        water: "#1D4B44",
        waterDeep: "#0E2622",
        ok: "#3F7D4C",
        warn: "#C97A2A",
        alert: "#B14A3B",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
      borderRadius: { s: "4px", m: "14px", l: "28px" },
    },
  },
  plugins: [],
};
