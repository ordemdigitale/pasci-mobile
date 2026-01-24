/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#E05017',
        'brand-green': '#2a591d',
      },
      fontFamily: {
        poppins: ['Poppins'],
        karla: ['Karla'],
      }
    },
  },
  plugins: [],
}
