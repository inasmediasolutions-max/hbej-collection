import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#111111',      // Primary Black
          secondary: '#C9A227',    // Luxury Gold
          bg: '#F8F6F2',           // Ivory Background
          accent: '#4A4A4A',       // Charcoal Gray
          gold: '#C9A227',
          'gold-hover': '#B58F1F',
          charcoal: '#4A4A4A',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
