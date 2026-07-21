/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 실제 UI는 전부 아래의 시맨틱 토큰(surface/ink/accent 등, index.css의 CSS 변수를
        // 가리킴)을 통해서만 색을 쓴다. brand/clay는 그 변수들의 값을 고를 때 참고한
        // 원본 색상 램프일 뿐 어떤 클래스명으로도 직접 쓰이지 않는다. 브랜드 컬러를
        // 바꿀 때는 이 램프를 새 색상으로 교체한 뒤, index.css 상단 주석의 체크리스트를
        // 따라가면 된다.
        // PLACEHOLDER: 코랄→앰버 "새벽/여명" 방향의 참고 램프. 600/700이 :root의
        // --color-accent/--color-accent-strong과 같은 값(기존 초록 램프와 동일한 관례).
        brand: {
          50: '#fdf4ee',
          100: '#fbe3d3',
          200: '#f6c3a6',
          300: '#ffab7a',
          400: '#ff8a65',
          500: '#f2703f',
          600: '#8a5a4a',
          700: '#6e4438',
          800: '#4a2d26',
          900: '#2e1c18',
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
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        'surface-sunken': 'var(--color-surface-sunken)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        'ink-faint': 'var(--color-ink-faint)',
        line: 'var(--color-line)',
        'line-input': 'var(--color-line-input)',
        accent: 'var(--color-accent)',
        'accent-strong': 'var(--color-accent-strong)',
        'accent-soft': 'var(--color-accent-soft)',
        'accent-on': 'var(--color-accent-on)',
        highlight: 'var(--color-highlight)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        'warning-soft': 'var(--color-warning-soft)',
        disabled: 'var(--color-disabled-bg)',
        'disabled-ink': 'var(--color-disabled-ink)',
        focus: 'var(--color-focus-ring)',
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
