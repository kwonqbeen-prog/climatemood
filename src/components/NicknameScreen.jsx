import { useState } from 'react'

export default function NicknameScreen({ auth }) {
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = displayName.trim()
    if (!trimmed) return
    setSubmitting(true)
    await auth.updateDisplayName(trimmed)
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-leaf-50 to-sky-50 px-6 text-center">
      <div className="text-5xl">🌱</div>
      <h1 className="mt-3 text-xl font-bold text-leaf-900">반가워요!</h1>
      <p className="mt-2 text-sm text-leaf-600">새싹이 뭐라고 불러드리면 좋을까요?</p>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xs text-left">
        <input
          type="text"
          required
          maxLength={20}
          autoFocus
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="예: 규빈"
          className="w-full rounded-xl border border-leaf-100 px-4 py-3 text-sm outline-none focus:border-leaf-400"
        />
        {auth.authError && <p className="mt-2 text-xs font-medium text-rose-500">{auth.authError}</p>}
        <button
          type="submit"
          disabled={submitting || !displayName.trim()}
          className="mt-4 w-full rounded-full bg-leaf-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-leaf-600 active:scale-95 disabled:bg-leaf-300"
        >
          {submitting ? '저장 중...' : '시작하기'}
        </button>
      </form>
    </div>
  )
}
