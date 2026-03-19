// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b3d91",
        "primary-dark": "#062a5f",
        gold: "#d4af37",
        "gold-dark": "#b8922b",
      },
    },
  },
  plugins: [],
};
