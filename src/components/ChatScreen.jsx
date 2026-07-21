import { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'
import MissionCard from './MissionCard'
import MissionModal from './MissionModal'
import Icon from './Icon'
import IconButton from './IconButton'
import TabSwitcher from './TabSwitcher'
import ThemeToggleSwitch from './ThemeToggleSwitch'
import { useTheme } from '../contexts/ThemeContext'

export default function ChatScreen({ conv, activeTab, onTabChange }) {
  const { messages, loading, apiDegraded, todayMissionExists, start, sendMessage, requestMissionFlow, completeMissionWithFeedback } = conv
  const [selectedMission, setSelectedMission] = useState(null)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const { resolvedTheme, toggleQuickTheme } = useTheme()

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
  const lastIsCurrentAiTurn = !loading && lastMessage?.role === 'ai'
  const activeChips = lastIsCurrentAiTurn && Array.isArray(lastMessage.chips) ? lastMessage.chips : []
  const showMissionOffer = lastIsCurrentAiTurn && Boolean(lastMessage.offerMission)

  const handleSend = (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    sendMessage(trimmed)
    setInput('')
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-surface">
      <header className="sticky top-0 z-30 flex items-center justify-center bg-surface-alt/95 px-4 py-3 backdrop-blur">
        <TabSwitcher active={activeTab} onChange={onTabChange} />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <ThemeToggleSwitch isDark={resolvedTheme === 'dark'} onToggle={toggleQuickTheme} />
        </div>
      </header>

      {apiDegraded && (
        <div className="bg-warning-soft px-4 py-2 text-center text-xs text-warning">
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

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend(input)
        }}
        className="bg-surface-alt px-3 py-3"
      >
        {showMissionOffer && (
          <button
            type="button"
            onClick={requestMissionFlow}
            className="mb-2 flex w-full items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-left transition active:scale-[0.99]"
          >
            <Icon name="auto_awesome" className="text-lg text-accent" />
            <span className="flex-1 text-sm font-bold text-ink">오늘의 맞춤 미션 받기</span>
            <Icon name="arrow_forward" className="text-base text-accent" />
          </button>
        )}
        {activeChips.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {activeChips.map((chip, i) => (
              <button
                key={`${chip}-${i}`}
                type="button"
                onClick={() => handleSend(chip)}
                className="rounded-full bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-accent-soft hover:text-accent active:scale-95"
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
            className="flex-1 rounded-full bg-surface-sunken px-4 py-2.5 text-sm text-ink outline-none disabled:opacity-60"
          />
          <IconButton
            type="submit"
            icon="arrow_upward"
            label="전송"
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-full bg-accent p-2.5 text-accent-on transition hover:bg-accent-strong disabled:bg-disabled disabled:text-disabled-ink"
            iconClassName="text-xl"
          />
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
