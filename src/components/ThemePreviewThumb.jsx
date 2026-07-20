const SWATCHES = {
  light: { bg: '#faf9f7', card: '#ffffff', border: '#e7e5e4', accent: '#3a7a2b' },
  dark: { bg: '#121212', card: '#1e1e1e', border: '#33312f', accent: '#69b158' },
  'high-contrast': { bg: '#0a0a0a', card: '#0a0a0a', border: '#ffffff', accent: '#6ee7a0' },
}

export default function ThemePreviewThumb({ variant }) {
  if (variant === 'system') {
    return (
      <div
        className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line"
        style={{ background: 'linear-gradient(135deg, #faf9f7 50%, #121212 50%)' }}
        aria-hidden="true"
      >
        <span className="material-symbols-rounded absolute left-1.5 top-1.5 text-[13px]" style={{ color: '#3a7a2b' }}>
          light_mode
        </span>
        <span
          className="material-symbols-rounded absolute bottom-1 right-1.5 text-[13px]"
          style={{ color: '#69b158' }}
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
