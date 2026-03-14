/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './lib/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E8734A',
        secondary: '#F5C878',
        background: '#FDFAF5',
        surface: '#FFF8EE',
        textPrimary: '#1A1208',
        textMuted: '#8C7355',
        accent: '#D44A2A',
        success: '#4CAF72',
        error: '#E84A4A'
      }
    }
  },
  plugins: []
};
