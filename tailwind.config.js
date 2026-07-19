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
        sky: {
          50: '#eef7fb',
          100: '#d7edf6',
          200: '#b0dbee',
          300: '#7fc2e1',
          400: '#4ba3cd',
          500: '#2f86b3',
        },
      },
      fontFamily: {
        sans: ['"Pretendard"', '-apple-system', 'BlinkMacSystemFont', '"Apple SD Gothic Neo"', '"Malgun Gothic"', 'sans-serif'],
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
