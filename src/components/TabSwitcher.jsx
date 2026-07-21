const TABS = [
  { key: 'chat', label: '이야기' },
  { key: 'dashboard', label: '나의 지구' },
]

export default function TabSwitcher({ active, onChange }) {
  const activeIndex = Math.max(0, TABS.findIndex((tab) => tab.key === active))

  return (
    <div role="tablist" aria-label="화면 전환" className="relative inline-flex rounded-full bg-surface-sunken p-1">
      <span
        aria-hidden="true"
        className="absolute inset-y-1 rounded-full bg-surface-alt shadow-sm transition-transform duration-300 ease-out"
        style={{
          left: '4px',
          width: `calc((100% - 8px) / ${TABS.length})`,
          transform: `translateX(calc(100% * ${activeIndex}))`,
        }}
      />
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            active === tab.key ? 'text-ink' : 'text-ink-muted'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
