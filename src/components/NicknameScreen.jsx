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
    <div className="flex min-h-svh flex-col items-center justify-center bg-surface px-6 text-center">
      <Icon name="public" className="text-3xl text-accent" />
      <h1 className="mt-4 text-xl font-bold tracking-tight text-ink">반가워요!</h1>
      <p className="mt-2 text-sm text-ink-muted">지구 마음이 뭐라고 불러드리면 좋을까요?</p>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xs text-left">
        <input
          type="text"
          required
          maxLength={20}
          autoFocus
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="예: 규빈"
          className="w-full rounded-lg border border-line-input bg-surface-alt px-4 py-3 text-sm text-ink outline-none focus:border-accent"
        />
        {auth.authError && <p className="mt-2 text-xs font-medium text-danger">{auth.authError}</p>}
        <button
          type="submit"
          disabled={submitting || !displayName.trim()}
          className="cta-neutral mt-4 w-full rounded-xl py-3 text-sm font-bold transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
        >
          {submitting ? '저장 중...' : '시작하기'}
        </button>
      </form>
    </div>
  )
}
