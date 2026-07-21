export default function StartScreen({ onStart }) {
  return (
    <div className="flex min-h-svh flex-col bg-surface px-6 pb-8 pt-10">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-tight text-ink">
          마음을 돌보다,
          <br />
          지구를 돌보다
        </h1>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
          기후 위기가 불안하고, 무겁고, 지치게 느껴질 때.
          <br />
          대화를 나누며 오늘의 나에게 맞는 작은 실천을 찾아보세요.
          <br />
          행동이 곧 치유가 됩니다.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="cta-neutral w-full rounded-xl py-4 text-[0.9375rem] font-bold transition hover:opacity-90 active:scale-[0.99]"
      >
        시작하기
      </button>
    </div>
  )
}
