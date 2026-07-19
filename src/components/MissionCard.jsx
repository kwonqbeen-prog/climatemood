import { CATEGORY_META } from '../data/constants'

export default function MissionCard({ mission, onClick }) {
  const meta = CATEGORY_META[mission.category] ?? { emoji: '🌱' }
  return (
    <button
      type="button"
      onClick={() => onClick(mission)}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition active:scale-[0.98] ${
        mission.isCompleted
          ? 'border-leaf-200 bg-leaf-50 opacity-70'
          : 'border-leaf-200 bg-white hover:border-leaf-400 hover:shadow-md'
      }`}
    >
      <span className="text-xl">{meta.emoji}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-leaf-900 truncate">{mission.title}</span>
        <span className="block text-xs text-leaf-500">{mission.category}</span>
      </span>
      {mission.isCompleted ? (
        <span className="text-xs font-semibold text-leaf-500">완료 ✓</span>
      ) : (
        <span className="text-leaf-300">›</span>
      )}
    </button>
  )
}
