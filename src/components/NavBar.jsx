const TABS = [
  { key: 'chat', label: '대화' },
  { key: 'dashboard', label: '기록' },
]

export default function NavBar({ active, onChange }) {
  return (
    <nav className="sticky bottom-0 z-40 flex border-t border-stone-200 bg-white/95 backdrop-blur">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex-1 border-t-2 py-3.5 text-sm font-semibold transition ${
            active === tab.key
              ? 'border-leaf-600 text-stone-900'
              : 'border-transparent text-stone-400'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
