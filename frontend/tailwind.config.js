/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F766E", // teal–ayurveda feel
        secondary: "#22C55E",
        background: "#F8FAFC",
      },
    },
  },
  plugins: [],
};
