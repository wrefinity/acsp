/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A1A4A', // Deep Blue
          light: '#0D47A1',   // Accent Blue
        },
        secondary: {
          DEFAULT: '#1DB954', // Cyber Green
          light: '#00E676',   // Accent Green
        },
        neutral: {
          DEFAULT: '#F5F7FA', // Neutral Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}