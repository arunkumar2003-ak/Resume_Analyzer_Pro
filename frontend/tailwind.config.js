/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: "#131B2E",
        border: "#232D42",
        gold: "#F0B429",
        ink: "#E7ECF5",
        muted: "#94A3B8",
        success: "#34D399",
        danger: "#F87171",
      },
    },
  },
  plugins: [],
}
