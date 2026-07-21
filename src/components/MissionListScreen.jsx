import { useEffect, useState } from 'react'
import Icon from './Icon'
import IconButton from './IconButton'
import { useTheme } from '../contexts/ThemeContext'
import { addMissions, getCompletedHistory, getIncompleteMissions } from '../data/storage'

async function loadData() {
  const [history, incompleteAll] = await Promise.all([getCompletedHistory(), getIncompleteMissions()])
  return { history, incomplete: incompleteAll.slice(0, 3) }
}

const EMPTY_DATA = { history: [], incomplete: [] }

export default function MissionListScreen({ onBack }) {
  const [data, setData] = useState(EMPTY_DATA)
  const [justAdded, setJustAdded] = useState(null)
  const { resolvedTheme } = useTheme()
  const showLabel = resolvedTheme === 'high-contrast'

  useEffect(() => {
    loadData().then(setData)
  }, [])

  const retryMission = async (mission) => {
    await addMissions([{ title: mission.title, description: mission.description, category: mission.category }])
    setData(await loadData())
    setJustAdded(mission.id)
    setTimeout(() => setJustAdded(null), 2000)
  }

  return (
    <div className="min-h-svh flex-1 space-y-6 bg-surface px-4 py-6">
      <header className="relative flex items-center justify-center pb-2 text-center">
        <IconButton
          icon="arrow_back"
          label="뒤로가기"
          onClick={onBack}
          className="absolute left-0 text-ink-muted transition hover:text-ink"
        />
        <h1 className="text-lg font-bold text-ink">미션 구경하기</h1>
      </header>

      {data.incomplete.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold text-ink">이런 미션 어때요?</h2>
          <div className="space-y-2">
            {data.incomplete.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 rounded-xl bg-surface-alt p-3">
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
        {data.history.length === 0 ? (
          <p className="rounded-xl bg-surface-alt p-4 text-center text-sm text-ink-muted">
            아직 완료한 미션이 없어요. 대화를 시작해보세요!
          </p>
        ) : (
          <div className="space-y-2">
            {data.history.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 rounded-xl bg-surface-alt p-3">
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
