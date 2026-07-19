export default function StartScreen({ onStart }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-leaf-50 to-sky-50 px-6 text-center">
      <div className="text-6xl">🌱</div>
      <h1 className="mt-4 text-2xl font-bold text-leaf-900">새싹</h1>
      <p className="mt-2 text-sm font-medium text-leaf-600">기후 마음 케어</p>
      <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-leaf-700">
        기후 위기가 불안하고, 무겁고, 지치게 느껴질 때. 대화를 나누며 오늘의 나에게 맞는
        작은 실천을 찾아보세요. 행동이 곧 치유가 됩니다.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-10 rounded-full bg-leaf-500 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-leaf-600 active:scale-95"
      >
        마음 나누러 가기
      </button>
    </div>
  )
}
