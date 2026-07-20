import Icon from './Icon'

export default function StartScreen({ onStart }) {
  return (
    <div className="flex min-h-svh flex-col bg-stone-50 px-6 pb-8 pt-10">
      <div className="flex items-center gap-1.5">
        <Icon name="eco" className="text-xl text-leaf-600" />
        <span className="text-sm font-bold tracking-tight text-stone-900">새싹</span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-[2.5rem] font-extrabold leading-[1.15] tracking-tight text-stone-900">
          마음에도
          <br />
          <span className="text-leaf-600">돌봄</span>이 필요해요
        </h1>
        <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-stone-500">
          기후 위기가 불안하고, 무겁고, 지치게 느껴질 때. 대화를 나누며 오늘의 나에게 맞는
          작은 실천을 찾아보세요. 행동이 곧 치유가 됩니다.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-xl bg-leaf-600 py-4 text-[15px] font-bold text-white transition hover:bg-leaf-700 active:scale-[0.99]"
      >
        마음 나누러 가기
      </button>
    </div>
  )
}
