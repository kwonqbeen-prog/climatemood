import { useState } from 'react'
import Icon from './Icon'
import ThemePreviewThumb from './ThemePreviewThumb'
import { systemPrefersDark, useTheme } from '../contexts/ThemeContext'

const CHOICES = [
  { value: 'light', label: '라이트 모드' },
  { value: 'dark', label: '다크 모드' },
  { value: 'high-contrast', label: '접근성 모드' },
]

export default function ThemeOnboardingScreen({ onDone }) {
  const { setTheme } = useTheme()
  const detected = systemPrefersDark() ? 'dark' : 'light'
  const [selected, setSelected] = useState(detected)

  const confirm = () => {
    setTheme(selected)
    onDone()
  }

  return (
    <div className="flex min-h-svh flex-col bg-surface px-6 py-10">
      <div className="flex items-center gap-1.5">
        <Icon name="public" className="text-xl text-accent" />
        <span className="text-sm font-bold tracking-tight text-ink">지구 마음</span>
      </div>

      <div className="mt-8 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-ink">화면 모드를 선택해주세요</h1>
        <p className="mt-2 text-sm text-ink-muted">나중에 설정에서 언제든 바꿀 수 있어요.</p>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-2 text-xs font-semibold text-accent">
          <Icon name="info" className="text-base shrink-0" />
          기기 설정을 확인해보니 {detected === 'dark' ? '다크' : '라이트'} 모드를 쓰고 계시네요. 아래에 미리 선택해뒀어요.
        </div>

        <div role="radiogroup" aria-label="화면 모드" className="mt-6 space-y-2">
          {CHOICES.map((choice) => {
            const checked = selected === choice.value
            return (
              <label
                key={choice.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition ${
                  checked ? 'bg-accent-soft' : 'bg-surface-alt'
                }`}
              >
                <input
                  type="radio"
                  name="theme-onboarding"
                  value={choice.value}
                  checked={checked}
                  onChange={() => setSelected(choice.value)}
                  className="h-4 w-4 shrink-0 accent-[color:var(--color-accent)]"
                />
                <ThemePreviewThumb variant={choice.value} />
                <span className="text-sm font-semibold text-ink">{choice.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={confirm}
          className="cta-neutral w-full rounded-xl py-3.5 text-sm font-bold transition hover:opacity-90 active:scale-[0.99]"
        >
          이 모드로 시작하기
        </button>
        <button
          type="button"
          onClick={onDone}
          className="w-full py-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
