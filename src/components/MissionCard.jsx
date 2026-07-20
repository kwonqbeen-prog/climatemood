import Icon from './Icon'
import { useTheme } from '../contexts/ThemeContext'

export default function MissionCard({ mission, onClick }) {
  const { resolvedTheme } = useTheme()
  const showLabel = resolvedTheme === 'high-contrast'

  return (
    <button
      type="button"
      onClick={() => onClick(mission)}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition active:scale-[0.99] ${
        mission.isCompleted
          ? 'border-line bg-surface-sunken opacity-70'
          : 'border-line bg-surface-alt hover:border-accent'
      }`}
    >
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-ink truncate">{mission.title}</span>
        <span className="block text-xs text-accent">{mission.category}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {mission.isCompleted ? (
          <>
            {showLabel && <span className="text-xs font-bold text-success">완료</span>}
            <Icon name="check_circle" filled className="text-success" />
          </>
        ) : (
          <>
            {showLabel && <span className="text-xs font-bold text-ink-muted">더보기</span>}
            <Icon name="chevron_right" className="text-ink-faint" />
          </>
        )}
      </span>
    </button>
  )
}
