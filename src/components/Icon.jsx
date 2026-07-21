export default function Icon({ name, filled = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      // 아이콘 폰트가 아직 로드되지 않았거나 로드에 실패하면 이름 문자열("arrow_forward" 등)이
      // 그대로 텍스트로 보이는데, 크기를 1em 정사각형으로 고정 + overflow-hidden으로 잘라내야
      // 옆에 있는 flex 형제 요소(특히 flex-1 텍스트)를 밀어내며 레이아웃이 깨지는 걸 막는다.
      className={`material-symbols-rounded inline-block h-[1em] w-[1em] overflow-hidden align-middle${filled ? ' icon-fill' : ''} ${className}`}
    >
      {name}
    </span>
  )
}
