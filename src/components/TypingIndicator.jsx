export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-alt px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-ink-faint animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-ink-faint animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-ink-faint animate-bounce" />
      </div>
    </div>
  )
}
