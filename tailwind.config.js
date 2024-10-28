/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2CFD94',
        secondary: '#9a27d5',
        'dark-gray': '#131722'
      }
    },
  },
  plugins: [],
}

