import Icon from './Icon'

export default function ThemeToggleSwitch({ isDark, onToggle, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full border border-line bg-surface-sunken transition ${className}`}
    >
      <span
        className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface-alt shadow-sm transition-all ${
          isDark ? 'left-6' : 'left-0.5'
        }`}
      >
        <Icon name={isDark ? 'dark_mode' : 'light_mode'} filled className="text-[13px] text-ink-muted" />
      </span>
    </button>
  )
}
