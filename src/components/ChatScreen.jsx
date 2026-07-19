import { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'
import MissionCard from './MissionCard'
import MissionModal from './MissionModal'
import Icon from './Icon'

export default function ChatScreen({ conv }) {
  const { messages, loading, apiDegraded, todayMissionExists, start, sendMessage, requestMissionFlow, completeMissionWithFeedback } = conv
  const [selectedMission, setSelectedMission] = useState(null)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, loading])

  const activeMission = selectedMission
    ? messages.flatMap((m) => m.missions ?? []).find((m) => m.id === selectedMission) ?? selectedMission
    : null

  const lastMessage = messages[messages.length - 1]
  const activeChips =
    !loading && lastMessage?.role === 'ai' && Array.isArray(lastMessage.chips) ? lastMessage.chips : []

  const handleSend = (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    sendMessage(trimmed)
    setInput('')
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-leaf-50">
      <header className="sticky top-0 z-30 border-b border-leaf-100 bg-white/95 px-4 py-3 text-center backdrop-blur">
        <span className="text-sm font-bold text-leaf-800">새싹과의 대화</span>
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
            {msg.offerMission && (
              <button
                type="button"
                onClick={requestMissionFlow}
                className="rounded-xl border border-leaf-300 bg-white px-4 py-3 text-left text-sm font-semibold text-leaf-700 shadow-sm transition hover:border-leaf-500 hover:bg-leaf-50 active:scale-[0.98]"
              >
                오늘의 맞춤 미션 받기
              </button>
            )}
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

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend(input)
        }}
        className="border-t border-leaf-100 bg-white px-3 py-3"
      >
        {activeChips.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {activeChips.map((chip, i) => (
              <button
                key={`${chip}-${i}`}
                type="button"
                onClick={() => handleSend(chip)}
                className="rounded-full border border-leaf-300 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-700 shadow-sm transition hover:border-leaf-500 hover:bg-leaf-50 active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={todayMissionExists ? '마음을 편하게 적어보세요' : '오늘 하루는 어떠셨나요?'}
            disabled={loading}
            className="flex-1 rounded-full border border-leaf-200 px-4 py-2.5 text-sm outline-none focus:border-leaf-400 disabled:bg-leaf-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="전송"
            className="flex shrink-0 items-center justify-center rounded-full bg-leaf-500 p-2.5 text-white transition hover:bg-leaf-600 disabled:bg-leaf-200"
          >
            <Icon name="arrow_upward" className="text-xl" />
          </button>
        </div>
      </form>

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
