import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdf9',
          100: '#fdf6ec',
          200: '#faedd9',
          300: '#f5e0bf',
        },
        peach: {
          50: '#fff3ea',
          100: '#ffe4d1',
          200: '#ffc9a3',
          300: '#ffb088',
          400: '#ff9866',
          500: '#f5804a',
          600: '#e06636',
          700: '#b8502a',
        },
        blush: {
          100: '#fbe4e4',
          200: '#f6c6c9',
          300: '#eea3ab',
          400: '#e5808f',
        },
        cocoa: {
          400: '#a6795f',
          500: '#8a6249',
          600: '#6b4a37',
          700: '#4d362a',
          800: '#332419',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(180,120,90,0.08), 0 1px 3px rgba(180,120,90,0.06)',
        card: '0 6px 24px rgba(180,120,90,0.10)',
        warm: '0 8px 28px rgba(245,128,74,0.18)',
      },
      fontFamily: {
        sans: ['Quicksand', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(180,120,90,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(180,120,90,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '22px 22px',
      },
    },
  },
  plugins: [],
};

export default config;
