import { useEffect, useState } from 'react'
import Icon from './Icon'
import IconButton from './IconButton'
import MindPlanet from './MindPlanet'
import { useTheme } from '../contexts/ThemeContext'
import {
  addMissions,
  getCompletedHistory,
  getIncompleteMissions,
  getTodayCompletedCount,
  getTodayMissions,
  getTotalCompletedCount,
} from '../data/storage'

async function loadStats() {
  const [todayMissions, todayCompleted, total, history, incompleteAll] = await Promise.all([
    getTodayMissions(),
    getTodayCompletedCount(),
    getTotalCompletedCount(),
    getCompletedHistory(),
    getIncompleteMissions(),
  ])
  return {
    todayMissions,
    todayCompleted,
    total,
    history,
    incomplete: incompleteAll.slice(0, 3),
  }
}

const EMPTY_STATS = { todayMissions: [], todayCompleted: 0, total: 0, history: [], incomplete: [] }

export default function DashboardScreen({ onSignOut, onOpenSettings, onViewMissions }) {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [justAdded, setJustAdded] = useState(null)
  const { resolvedTheme } = useTheme()
  const showLabel = resolvedTheme === 'high-contrast'

  useEffect(() => {
    loadStats().then(setStats)
  }, [])

  const retryMission = async (mission) => {
    await addMissions([{ title: mission.title, description: mission.description, category: mission.category }])
    setStats(await loadStats())
    setJustAdded(mission.id)
    setTimeout(() => setJustAdded(null), 2000)
  }
  return (
    <div className="min-h-svh flex-1 space-y-6 bg-surface px-4 py-6">
      <header className="flex items-center justify-center text-center relative">
        <h1 className="text-lg font-bold text-ink">나의 기록</h1>
        <div className="absolute right-0 flex items-center gap-3">
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

      <MindPlanet totalCompleted={stats.total} history={stats.history} />

      <div className="rounded-2xl border border-line bg-surface-alt p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface p-3 text-center">
            <p className="text-xs font-medium text-ink-muted">오늘의 미션</p>
            <p className="mt-1 text-2xl font-bold text-accent">
              {stats.todayCompleted}
              <span className="text-sm font-medium text-ink-muted"> / {stats.todayMissions.length}</span>
            </p>
          </div>
          <div className="rounded-xl bg-surface p-3 text-center">
            <p className="text-xs font-medium text-ink-muted">누적 완료</p>
            <p className="mt-1 text-2xl font-bold text-highlight">{stats.total}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewMissions}
          className="cta-gradient mt-3 w-full rounded-xl py-3 text-sm font-bold transition active:scale-[0.99]"
        >
          이런 미션도 있어요 · 미션 구경하기
        </button>
      </div>

      {stats.incomplete.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold text-ink">이런 미션 어때요?</h2>
          <div className="space-y-2">
            {stats.incomplete.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface-alt p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{mission.title}</p>
                  <p className="text-xs text-accent">{mission.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => retryMission(mission)}
                  disabled={justAdded === mission.id}
                  className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-on disabled:bg-disabled disabled:text-disabled-ink"
                >
                  {justAdded === mission.id ? '추가됨' : '다시 도전'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-bold text-ink">완료한 미션 히스토리</h2>
        {stats.history.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface-alt p-4 text-center text-sm text-ink-muted">
            아직 완료한 미션이 없어요. 대화를 시작해보세요!
          </p>
        ) : (
          <div className="space-y-2">
            {stats.history.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface-alt p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{mission.title}</p>
                  <p className="text-xs text-ink-muted">
                    {mission.createdDate} · 체감 난이도 {mission.difficultyFeedback}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1">
                  {showLabel && <span className="text-xs font-bold text-success">완료</span>}
                  <Icon name="check_circle" filled className="text-success" />
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
