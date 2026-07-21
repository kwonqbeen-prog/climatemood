import { useEffect, useState } from 'react'
import Icon from './Icon'
import IconButton from './IconButton'
import MindPlanet from './MindPlanet'
import TabSwitcher from './TabSwitcher'
import { getTodayCompletedCount, getTodayMissions, getTotalCompletedCount } from '../data/storage'

async function loadStats() {
  const [todayMissions, todayCompleted, total] = await Promise.all([
    getTodayMissions(),
    getTodayCompletedCount(),
    getTotalCompletedCount(),
  ])
  return { todayMissions, todayCompleted, total }
}

const EMPTY_STATS = { todayMissions: [], todayCompleted: 0, total: 0 }

export default function DashboardScreen({ activeTab, onTabChange, onSignOut, onOpenSettings, onViewMissions }) {
  const [stats, setStats] = useState(EMPTY_STATS)

  useEffect(() => {
    loadStats().then(setStats)
  }, [])

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-surface">
      <header className="relative flex items-center justify-center px-4 py-3">
        <TabSwitcher active={activeTab} onChange={onTabChange} />
        <div className="absolute right-4 flex items-center gap-3">
          <IconButton
            icon="settings"
            label="화면 및 접근성"
            onClick={onOpenSettings}
            className="text-ink-muted transition hover:text-ink"
          />
          <IconButton
            icon="logout"
            label="로그아웃"
            onClick={onSignOut}
            className="text-ink-muted transition hover:text-ink"
          />
        </div>
      </header>

      <div className="relative min-h-[45vh] flex-1">
        <MindPlanet totalCompleted={stats.total} />
      </div>

      <div className="space-y-4 px-4 pb-6 pt-2">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-xs font-medium text-ink-muted">오늘의 미션</p>
            <p className="mt-1 text-2xl font-bold text-accent">
              {stats.todayCompleted}
              <span className="text-sm font-medium text-ink-muted"> / {stats.todayMissions.length}</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-ink-muted">성공한 미션</p>
            <p className="mt-1 text-2xl font-bold text-highlight">{stats.total}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewMissions}
          className="w-full rounded-2xl bg-surface-alt px-4 py-3 text-left transition hover:bg-accent-soft active:scale-[0.99]"
        >
          <span className="block text-xs font-medium text-ink-muted">이런 미션도 있어요</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-lg font-extrabold text-accent">
            미션 구경하기
            <Icon name="arrow_forward" className="text-xl" />
          </span>
        </button>
      </div>
    </div>
  )
}
