import { useState } from 'react'
import { CATEGORY_META, DIFFICULTY_OPTIONS } from '../data/constants'

export default function MissionModal({ mission, onClose, onComplete }) {
  const [pickingDifficulty, setPickingDifficulty] = useState(false)
  if (!mission) return null
  const meta = CATEGORY_META[mission.category] ?? { emoji: '🌱' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-leaf-500">
          <span className="text-lg">{meta.emoji}</span>
          <span>{mission.category}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-leaf-900">{mission.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-leaf-700">{mission.description}</p>

        {mission.isCompleted ? (
          <div className="mt-6 rounded-xl bg-leaf-50 px-4 py-3 text-center text-sm font-semibold text-leaf-600">
            완료한 미션이에요 · 체감 난이도 {mission.difficultyFeedback}
          </div>
        ) : pickingDifficulty ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-leaf-800">이 미션은 어느 정도였나요?</p>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onComplete(mission.id, opt)}
                  className="flex-1 rounded-lg border border-leaf-300 py-2 text-sm font-semibold text-leaf-700 hover:bg-leaf-50"
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
            className="mt-6 w-full rounded-lg bg-leaf-500 py-3 text-sm font-bold text-white hover:bg-leaf-600"
          >
            완료했어요
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-lg py-2 text-sm text-leaf-400 hover:text-leaf-600"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
