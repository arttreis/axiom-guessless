import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:  '#FF6B35',
          amber:   '#FF922B',
          yellow:  '#FFD43B',
          purple:  '#CC5DE8',
          blue:    '#4D96FF',
          green:   '#1A936F',
        },
        dark: {
          DEFAULT: '#0A0A0F',
          2:       '#111118',
          3:       '#1A1A24',
          4:       '#242433',
        },
        text: {
          primary:   '#F5F5F0',
          secondary: '#A0A0B0',
          muted:     '#60607A',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeUp 0.6s ease forwards',
        'float':    'float 4s ease-in-out infinite',
        'shimmer':  'shimmer 3s linear infinite',
        'grad-move': 'gradMove 6s ease infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        gradMove: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
