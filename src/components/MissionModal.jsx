import { useState } from 'react'
import { DIFFICULTY_OPTIONS } from '../data/constants'
import IconButton from './IconButton'

export default function MissionModal({ mission, onClose, onComplete }) {
  const [pickingDifficulty, setPickingDifficulty] = useState(false)
  if (!mission) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-surface-alt p-6 shadow-[var(--shadow-modal)] animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          icon="close"
          label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 text-ink-faint transition hover:text-ink"
          iconClassName="text-xl"
        />

        <p className="text-xs font-semibold text-accent">{mission.category}</p>
        <h3 className="mt-2 text-lg font-bold text-ink pr-6">{mission.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{mission.description}</p>

        {mission.isCompleted ? (
          <div className="mt-6 rounded-xl bg-surface-sunken px-4 py-3 text-center text-sm font-semibold text-ink-muted">
            완료한 미션이에요 · 체감 난이도 {mission.difficultyFeedback}
          </div>
        ) : pickingDifficulty ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-ink">이 미션은 어느 정도였나요?</p>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onComplete(mission.id, opt)}
                  className="flex-1 rounded-lg bg-surface-sunken py-2 text-sm font-semibold text-ink-muted hover:bg-accent-soft hover:text-accent"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPickingDifficulty(true)}
            className="mt-6 w-full rounded-xl bg-accent py-3 text-sm font-bold text-accent-on hover:bg-accent-strong"
          >
            완료했어요
          </button>
        )}
      </div>
    </div>
  )
}
