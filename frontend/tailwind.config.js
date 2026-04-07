/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dcBlack: '#050505',       // Deep background black
        dcPanel: '#121212',       // Slightly lighter black for cards
        dcLeafGreen: '#4ade80',   // Vibrant leaf green for active states
        dcDarkGreen: '#166534',   // Dark green for subtle highlights
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean, professional font
      }
    },
  },
  plugins: [],
}