/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beer: {
          50: '#fff8eb',
          100: '#ffebc7',
          200: '#ffd78a',
          300: '#ffbe4d',
          400: '#ffa724',
          500: '#f98407',
          600: '#dd6102',
          700: '#b74206',
          800: '#94330c',
          900: '#7a2b0d',
          950: '#461402',
        },
        foam: {
          50: '#fefefe',
          100: '#faf9f6',
          200: '#f5f3ed',
          300: '#ebe7dc',
          400: '#ddd6c5',
          500: '#ccc2aa',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-russo)'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'foam-bubble': 'foam-bubble 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249, 132, 7, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(249, 132, 7, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'foam-bubble': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
