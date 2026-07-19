const TABS = [
  { key: 'chat', label: '대화', icon: '💬' },
  { key: 'dashboard', label: '기록', icon: '📋' },
]

export default function NavBar({ active, onChange }) {
  return (
    <nav className="sticky bottom-0 z-40 flex border-t border-leaf-100 bg-white/95 backdrop-blur">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition ${
            active === tab.key ? 'text-leaf-600' : 'text-leaf-300'
          }`}
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
