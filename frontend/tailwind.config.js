/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths to your source files
  ],
  theme: {
    extend: {
  fontFamily: {
      playfair: ['"Playfair Display"', 'serif'],
      space: ['"Space Grotesk"', 'sans-serif'],
      poppins: ['"Poppins"', 'sans-serif'],
      my_font: ['MyFont', 'sans-serif'],
      quote_font: ['QuoteFont', 'sans-serif'],
  },
}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'), // since you have this plugin
  ],
};