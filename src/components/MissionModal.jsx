import { useState } from 'react'
import { DIFFICULTY_OPTIONS } from '../data/constants'
import Icon from './Icon'

export default function MissionModal({ mission, onClose, onComplete }) {
  const [pickingDifficulty, setPickingDifficulty] = useState(false)
  if (!mission) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 text-stone-300 transition hover:text-stone-600"
        >
          <Icon name="close" className="text-xl" />
        </button>

        <p className="text-xs font-semibold text-leaf-700">{mission.category}</p>
        <h3 className="mt-2 text-lg font-bold text-stone-900 pr-6">{mission.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">{mission.description}</p>

        {mission.isCompleted ? (
          <div className="mt-6 rounded-xl bg-stone-100 px-4 py-3 text-center text-sm font-semibold text-stone-600">
            완료한 미션이에요 · 체감 난이도 {mission.difficultyFeedback}
          </div>
        ) : pickingDifficulty ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-stone-700">이 미션은 어느 정도였나요?</p>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onComplete(mission.id, opt)}
                  className="flex-1 rounded-lg border border-stone-200 py-2 text-sm font-semibold text-stone-700 hover:border-leaf-500 hover:text-leaf-700"
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
            className="mt-6 w-full rounded-xl bg-leaf-600 py-3 text-sm font-bold text-white hover:bg-leaf-700"
          >
            완료했어요
          </button>
        )}
      </div>
    </div>
  )
}
