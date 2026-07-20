/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f1f9f0',
          100: '#dcefd8',
          200: '#b9dfb1',
          300: '#8fca82',
          400: '#69b158',
          500: '#4c9639',
          600: '#3a7a2b',
          700: '#2f6124',
          800: '#284e20',
          900: '#22421c',
        },
        clay: {
          50: '#fdf4ee',
          100: '#f8e3d3',
          200: '#f0c7a6',
          300: '#e4a274',
          400: '#d17f4a',
          500: '#b8632f',
          600: '#8f4c24',
        },
      },
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out',
        'pop-in': 'pop-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
