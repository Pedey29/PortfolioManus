/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'uww-purple': '#5E2F8B',
        'uww-black': '#000000',
        'uww-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
