import { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'
import MissionCard from './MissionCard'
import MissionModal from './MissionModal'
import { EMOTION_TYPES, ENERGY_LEVELS } from '../data/constants'

export default function ChatScreen({ conv }) {
  const { messages, stage, loading, apiDegraded, start, selectEmotion, selectEnergy, completeMissionWithFeedback } = conv
  const [selectedMission, setSelectedMission] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (stage === 'idle') {
      start()
    }
  }, [stage, start])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, loading, stage])

  const activeMission = selectedMission
    ? messages
        .flatMap((m) => m.missions ?? [])
        .find((m) => m.id === selectedMission) ?? selectedMission
    : null

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-leaf-50">
      <header className="sticky top-0 z-30 border-b border-leaf-100 bg-white/95 px-4 py-3 text-center backdrop-blur">
        <span className="text-sm font-bold text-leaf-800">🌱 새싹과의 대화</span>
      </header>

      {apiDegraded && (
        <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
          AI 연결이 원활하지 않아 기본 응답으로 대화를 이어가고 있어요.
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            <ChatBubble role={msg.role} text={msg.text} />
            {msg.type === 'missions' && (
              <div className="grid gap-2 pl-1 pr-8">
                {msg.missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} onClick={(m) => setSelectedMission(m.id)} />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <TypingIndicator />}

        {stage === 'awaiting_emotion' && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {EMOTION_TYPES.map((e) => (
              <button
                key={e.key}
                type="button"
                onClick={() => selectEmotion(e.key)}
                className="rounded-full border border-leaf-300 bg-white px-4 py-2 text-sm font-semibold text-leaf-700 shadow-sm transition hover:border-leaf-500 hover:bg-leaf-50 active:scale-95"
              >
                {e.label}
              </button>
            ))}
          </div>
        )}

        {stage === 'awaiting_energy' && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {ENERGY_LEVELS.map((e) => (
              <button
                key={e.key}
                type="button"
                onClick={() => selectEnergy(e.key)}
                className="rounded-full border border-leaf-300 bg-white px-4 py-2 text-sm font-semibold text-leaf-700 shadow-sm transition hover:border-leaf-500 hover:bg-leaf-50 active:scale-95"
              >
                {e.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MissionModal
        mission={activeMission}
        onClose={() => setSelectedMission(null)}
        onComplete={(id, difficulty) => {
          completeMissionWithFeedback(id, difficulty)
          setSelectedMission(null)
        }}
      />
    </div>
  )
}
