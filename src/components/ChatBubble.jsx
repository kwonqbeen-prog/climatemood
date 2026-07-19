export default function ChatBubble({ role, text }) {
  const isAi = role === 'ai'
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isAi
            ? 'bg-white text-leaf-900 rounded-bl-sm shadow-sm border border-leaf-100'
            : 'bg-leaf-500 text-white rounded-br-sm'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
