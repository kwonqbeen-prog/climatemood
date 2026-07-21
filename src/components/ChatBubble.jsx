export default function ChatBubble({ role, text }) {
  const isAi = role === 'ai'
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed whitespace-pre-wrap ${
          isAi
            ? 'bg-surface-alt text-ink rounded-bl-sm'
            : 'bg-accent text-accent-on rounded-br-sm'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
