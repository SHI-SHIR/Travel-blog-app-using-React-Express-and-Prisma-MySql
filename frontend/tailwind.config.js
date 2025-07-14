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
      merri: ['"Merriweather"', 'serif'],
      lora: ['"Lora"', 'serif'],
      vollkorn: ['"Vollkorn Rounded"', 'serif'],
      poppins: ['"Poppins"', 'sans-serif'],
  },
}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'), // since you have this plugin
  ],
};