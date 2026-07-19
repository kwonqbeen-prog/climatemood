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
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-leaf-50 to-sky-50 px-6">
      <div className="w-full max-w-xs text-center">
        <Icon name="eco" className="text-5xl text-leaf-500" />
        <h1 className="mt-3 text-xl font-bold text-leaf-900">새싹</h1>
        <p className="mt-1 text-sm font-medium text-leaf-600">기후 마음 케어</p>

        <div className="mt-8 flex rounded-full bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
              mode === 'login' ? 'bg-leaf-500 text-white' : 'text-leaf-400'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
              mode === 'signup' ? 'bg-leaf-500 text-white' : 'text-leaf-400'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-leaf-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-leaf-100 px-3 py-2.5 text-sm outline-none focus:border-leaf-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold text-leaf-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-leaf-100 px-3 py-2.5 text-sm outline-none focus:border-leaf-400"
              placeholder="6자 이상"
            />
          </div>

          {auth.authError && (
            <p className="text-xs font-medium text-rose-500">{auth.authError}</p>
          )}
          {signupDone && (
            <p className="text-xs font-medium text-leaf-600">
              가입 확인 메일을 보냈어요. 메일함을 확인한 뒤 로그인해주세요.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-leaf-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-leaf-600 active:scale-95 disabled:bg-leaf-300"
          >
            {mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2 text-leaf-300">
          <div className="h-px flex-1 bg-leaf-100" />
          <span className="text-xs">또는</span>
          <div className="h-px flex-1 bg-leaf-100" />
        </div>

        <button
          type="button"
          onClick={auth.signInWithKakao}
          className="mt-4 w-full rounded-full bg-[#FEE500] py-3 text-sm font-bold text-[#191919] shadow-md transition active:scale-95"
        >
          카카오로 계속하기
        </button>
      </div>
    </div>
  )
}
