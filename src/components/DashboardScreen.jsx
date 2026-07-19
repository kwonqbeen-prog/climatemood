import { useEffect, useState } from 'react'
import { CATEGORY_META } from '../data/constants'
import {
  addMissions,
  getCompletedHistory,
  getIncompleteMissions,
  getTodayCompletedCount,
  getTodayMissions,
  getTotalCompletedCount,
} from '../data/storage'

function loadStats() {
  return {
    todayMissions: getTodayMissions(),
    todayCompleted: getTodayCompletedCount(),
    total: getTotalCompletedCount(),
    history: getCompletedHistory(),
    incomplete: getIncompleteMissions().slice(0, 3),
  }
}

export default function DashboardScreen() {
  const [stats, setStats] = useState(loadStats)
  const [justAdded, setJustAdded] = useState(null)

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const retryMission = (mission) => {
    addMissions([{ title: mission.title, description: mission.description, category: mission.category }])
    setStats(loadStats())
    setJustAdded(mission.id)
    setTimeout(() => setJustAdded(null), 2000)
  }

  return (
    <div className="min-h-svh flex-1 space-y-6 bg-leaf-50 px-4 py-6">
      <header className="text-center">
        <h1 className="text-lg font-bold text-leaf-900">나의 기록</h1>
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
                <span className="text-xl">{CATEGORY_META[mission.category]?.emoji ?? '🌱'}</span>
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
                  {justAdded === mission.id ? '추가됨 ✓' : '다시 도전'}
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
                <span className="text-xl">{CATEGORY_META[mission.category]?.emoji ?? '🌱'}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-leaf-900">{mission.title}</p>
                  <p className="text-xs text-leaf-500">
                    {mission.createdDate} · 체감 난이도 {mission.difficultyFeedback}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-leaf-500">완료 ✓</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
