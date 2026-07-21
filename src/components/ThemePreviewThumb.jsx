// 라이트/다크/고대비 3개를 동시에 보여주는 미리보기라 CSS 변수(현재 테마 값만 읽힘)를
// 못 쓰고 값을 하드코딩했다. index.css의 --color-surface/--color-accent 등을 바꿀 때는
// 여기도 같은 값으로 맞춰줘야 한다.
const SWATCHES = {
  light: { bg: '#faf9f7', card: '#ffffff', border: '#e7e5e4', accent: '#8a5a4a' },
  dark: { bg: '#121212', card: '#1e1e1e', border: '#33312f', accent: '#d8a08e' },
  'high-contrast': { bg: '#0a0a0a', card: '#0a0a0a', border: '#ffffff', accent: '#ffb199' },
}

export default function ThemePreviewThumb({ variant }) {
  if (variant === 'system') {
    return (
      <div
        className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line"
        style={{ background: 'linear-gradient(135deg, #faf9f7 50%, #121212 50%)' }}
        aria-hidden="true"
      >
        <span className="material-symbols-rounded absolute left-1.5 top-1.5 text-[13px]" style={{ color: '#8a5a4a' }}>
          light_mode
        </span>
        <span
          className="material-symbols-rounded absolute bottom-1 right-1.5 text-[13px]"
          style={{ color: '#d8a08e' }}
        >
          dark_mode
        </span>
      </div>
    )
  }
  const s = SWATCHES[variant]
  return (
    <div
      className="h-11 w-16 shrink-0 overflow-hidden rounded-md border"
      style={{ background: s.bg, borderColor: s.border }}
      aria-hidden="true"
    >
      <div className="h-3 w-full border-b" style={{ background: s.card, borderColor: s.border }} />
      <div className="flex h-full items-end p-1.5">
        <div className="h-2 w-8 rounded-full" style={{ background: s.accent }} />
      </div>
    </div>
  )
}
