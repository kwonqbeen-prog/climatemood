import Icon from './Icon'

export default function StartScreen({ onStart }) {
  return (
    <div className="flex min-h-svh flex-col bg-surface px-6 pb-8 pt-10">
      <div className="flex items-center gap-1.5">
        <Icon name="public" className="text-xl text-accent" />
        <span className="text-sm font-bold tracking-tight text-ink">지구 마음</span>
      </div>
      <p className="mt-1 text-xs text-ink-muted">마음을 돌보다, 지구를 돌보다</p>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-tight text-ink">
          마음에도
          <br />
          <span className="text-accent">돌봄</span>이 필요해요
        </h1>
        <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ink-muted">
          기후 위기가 불안하고, 무겁고, 지치게 느껴질 때. 대화를 나누며 오늘의 나에게 맞는
          작은 실천을 찾아보세요. 행동이 곧 치유가 됩니다.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="cta-gradient w-full rounded-xl py-4 text-[0.9375rem] font-bold transition active:scale-[0.99]"
      >
        마음 나누러 가기
      </button>
    </div>
  )
}
