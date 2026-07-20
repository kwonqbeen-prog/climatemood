import { useTheme } from '../contexts/ThemeContext'
import IconButton from './IconButton'
import ThemePreviewThumb from './ThemePreviewThumb'

const THEME_CHOICES = [
  { value: 'light', label: '라이트 모드' },
  { value: 'dark', label: '다크 모드' },
  { value: 'system', label: '시스템 설정 따르기' },
  { value: 'high-contrast', label: '고대비 모드 (포용성 모드)' },
]

const COLORBLIND_CHOICES = [
  { value: 'none', label: '없음' },
  { value: 'red-green', label: '적록색약 (protanopia, deuteranopia)' },
  { value: 'blue-yellow', label: '청황색약 (tritanopia)' },
]

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full border border-line transition ${
          checked ? 'bg-accent' : 'bg-surface-sunken'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-alt shadow-sm transition-all ${
            checked ? 'left-6' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsScreen({ onBack }) {
  const { settings, saveState, setTheme, setColorblind, setFontScale, setReduceMotion, setBoldText, saveNow } =
    useTheme()

  return (
    <div className="min-h-svh flex-1 bg-surface px-4 py-6">
      <header className="relative flex items-center justify-center pb-4 text-center">
        <IconButton
          icon="arrow_back"
          label="뒤로가기"
          onClick={onBack}
          className="absolute left-0 text-ink-muted transition hover:text-ink"
        />
        <h1 className="text-lg font-bold text-ink">화면 및 접근성</h1>
      </header>

      <section className="mt-2">
        <h2 className="mb-3 text-sm font-bold text-ink">화면 모드</h2>
        <div role="radiogroup" aria-label="화면 모드" className="space-y-2">
          {THEME_CHOICES.map((choice) => {
            const checked = settings.theme === choice.value
            return (
              <label
                key={choice.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  checked ? 'border-accent bg-accent-soft' : 'border-line bg-surface-alt'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={choice.value}
                  checked={checked}
                  onChange={() => setTheme(choice.value)}
                  className="h-4 w-4 shrink-0 accent-[color:var(--color-accent)]"
                />
                <ThemePreviewThumb variant={choice.value} />
                <span className="text-sm font-semibold text-ink">{choice.label}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-ink">세부 조정</h2>
        <div className="rounded-xl border border-line bg-surface-alt px-4">
          <div className="border-b border-line py-3">
            <label htmlFor="colorblind" className="block text-sm font-semibold text-ink">
              색약 보정
            </label>
            <p className="mt-0.5 text-xs text-ink-muted">
              성공/실패/경고 색상을 구분이 뚜렷한 값으로 바꾸고, 상태는 항상 아이콘과 함께 표시해요.
            </p>
            <select
              id="colorblind"
              value={settings.colorblind}
              onChange={(e) => setColorblind(e.target.value)}
              className="mt-2 w-full rounded-lg border border-line-input bg-surface-alt px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            >
              {COLORBLIND_CHOICES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-b border-line py-3">
            <div className="flex items-center justify-between">
              <label htmlFor="font-scale" className="text-sm font-semibold text-ink">
                글자 크기
              </label>
              <span className="text-sm font-semibold text-ink-muted">{Math.round(settings.fontScale * 100)}%</span>
            </div>
            <input
              id="font-scale"
              type="range"
              min={0.9}
              max={2}
              step={0.05}
              value={settings.fontScale}
              onChange={(e) => setFontScale(e.target.value)}
              className="mt-2 w-full accent-[color:var(--color-accent)]"
            />
          </div>

          <ToggleRow
            label="움직임 줄이기"
            description="애니메이션과 전환 효과를 최소화해요."
            checked={settings.reduceMotion}
            onChange={setReduceMotion}
          />
          <ToggleRow
            label="굵은 텍스트"
            description="전체 텍스트를 더 굵게 표시해요."
            checked={settings.boldText}
            onChange={setBoldText}
          />
        </div>
      </section>

      <button
        type="button"
        onClick={saveNow}
        className="mt-8 w-full rounded-xl bg-accent py-3 text-sm font-bold text-accent-on transition hover:bg-accent-strong active:scale-[0.99]"
      >
        {saveState === 'saving' ? '저장 중...' : saveState === 'saved' ? '저장됨' : '변경사항 저장'}
      </button>
    </div>
  )
}
