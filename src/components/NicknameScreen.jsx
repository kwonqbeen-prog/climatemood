import { useState } from 'react'
import Icon from './Icon'

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
    <div className="flex min-h-svh flex-col items-center justify-center bg-stone-50 px-6 text-center">
      <Icon name="eco" className="text-3xl text-leaf-600" />
      <h1 className="mt-4 text-xl font-bold tracking-tight text-stone-900">반가워요!</h1>
      <p className="mt-2 text-sm text-stone-500">새싹이 뭐라고 불러드리면 좋을까요?</p>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xs text-left">
        <input
          type="text"
          required
          maxLength={20}
          autoFocus
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="예: 규빈"
          className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-leaf-500"
        />
        {auth.authError && <p className="mt-2 text-xs font-medium text-rose-500">{auth.authError}</p>}
        <button
          type="submit"
          disabled={submitting || !displayName.trim()}
          className="mt-4 w-full rounded-xl bg-leaf-600 py-3 text-sm font-bold text-white transition hover:bg-leaf-700 active:scale-[0.99] disabled:bg-stone-300"
        >
          {submitting ? '저장 중...' : '시작하기'}
        </button>
      </form>
    </div>
  )
}
