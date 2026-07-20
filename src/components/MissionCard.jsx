import Icon from './Icon'

export default function MissionCard({ mission, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(mission)}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition active:scale-[0.99] ${
        mission.isCompleted
          ? 'border-stone-200 bg-stone-100 opacity-70'
          : 'border-stone-200 bg-white hover:border-leaf-500'
      }`}
    >
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-stone-900 truncate">{mission.title}</span>
        <span className="block text-xs text-leaf-700">{mission.category}</span>
      </span>
      {mission.isCompleted ? (
        <Icon name="check_circle" filled className="text-leaf-600" />
      ) : (
        <Icon name="chevron_right" className="text-stone-300" />
      )}
    </button>
  )
}
