import { useEffect, useState } from 'react'
import Icon from './Icon'
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

export default function DashboardScreen({ onSignOut }) {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [justAdded, setJustAdded] = useState(null)

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
    <div className="min-h-svh flex-1 space-y-6 bg-leaf-50 px-4 py-6">
      <header className="flex items-center justify-center text-center relative">
        <h1 className="text-lg font-bold text-leaf-900">나의 기록</h1>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="로그아웃"
          className="absolute right-0 text-leaf-400 transition hover:text-leaf-600"
        >
          <Icon name="logout" />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-leaf-500">오늘의 미션</p>
          <p className="mt-1 text-2xl font-bold text-leaf-900">
            {stats.todayCompleted}
            <span className="text-sm font-medium text-leaf-400"> / {stats.todayMissions.length}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-medium text-leaf-500">누적 완료</p>
          <p className="mt-1 text-2xl font-bold text-leaf-900">{stats.total}</p>
        </div>
      </div>

      {stats.incomplete.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold text-leaf-800">이런 미션 어때요?</h2>
          <div className="space-y-2">
            {stats.incomplete.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-leaf-900">{mission.title}</p>
                  <p className="text-xs text-leaf-500">{mission.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => retryMission(mission)}
                  disabled={justAdded === mission.id}
                  className="shrink-0 rounded-full bg-leaf-500 px-3 py-1.5 text-xs font-bold text-white disabled:bg-leaf-300"
                >
                  {justAdded === mission.id ? '추가됨' : '다시 도전'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-bold text-leaf-800">완료한 미션 히스토리</h2>
        {stats.history.length === 0 ? (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-leaf-400 shadow-sm">
            아직 완료한 미션이 없어요. 대화를 시작해보세요!
          </p>
        ) : (
          <div className="space-y-2">
            {stats.history.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-leaf-900">{mission.title}</p>
                  <p className="text-xs text-leaf-500">
                    {mission.createdDate} · 체감 난이도 {mission.difficultyFeedback}
                  </p>
                </div>
                <Icon name="check_circle" filled className="shrink-0 text-leaf-500" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
