/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdf8',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00b779',
          600: '#008c5c',
          700: '#006040',
          800: '#004028',
          900: '#002014',
          DEFAULT: '#00b779',
        },
      },
      boxShadow: {
        'brand': '0 4px 14px rgba(0,183,121,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-lg': '0 4px 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'spin-slow': 'spin 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}
