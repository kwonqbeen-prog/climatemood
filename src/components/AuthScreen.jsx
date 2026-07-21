import { useState } from 'react'
import Icon from './Icon'

export default function AuthScreen({ auth }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSignupDone(false)
    if (mode === 'login') {
      await auth.signInWithEmail(email, password)
    } else {
      const ok = await auth.signUpWithEmail(email, password)
      if (ok) setSignupDone(true)
    }
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-surface px-6">
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-center gap-1.5">
          <Icon name="public" className="text-2xl text-accent" />
          <span className="text-lg font-bold tracking-tight text-ink">지구 마음</span>
        </div>
        <p className="mt-1 text-center text-xs text-ink-muted">마음을 돌보다, 지구를 돌보다</p>

        <div className="mt-8 flex border-b border-line">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 border-b-2 py-2.5 text-sm font-bold transition ${
              mode === 'login' ? 'border-accent text-ink' : 'border-transparent text-ink-muted'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 border-b-2 py-2.5 text-sm font-bold transition ${
              mode === 'signup' ? 'border-accent text-ink' : 'border-transparent text-ink-muted'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-ink-muted">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line-input bg-surface-alt px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold text-ink-muted">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line-input bg-surface-alt px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
              placeholder="6자 이상"
            />
          </div>

          {auth.authError && (
            <p className="text-xs font-medium text-danger">{auth.authError}</p>
          )}
          {signupDone && (
            <p className="text-xs font-medium text-success">
              가입 확인 메일을 보냈어요. 메일함을 확인한 뒤 로그인해주세요.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="cta-neutral w-full rounded-xl py-3 text-sm font-bold transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
          >
            {mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="mt-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-muted">또는</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          onClick={auth.signInWithKakao}
          className="mt-4 w-full rounded-xl bg-[#FEE500] py-3 text-sm font-bold text-[#191919] transition active:scale-[0.99]"
        >
          카카오로 계속하기
        </button>
      </div>
    </div>
  )
}
