// 임계값은 조정 가능한 PLACEHOLDER — 실제 성장 곡선은 후속 컬러/밸런싱 세션에서 튜닝
function getStage(totalCompleted) {
  if (totalCompleted === 0) return 'seed'
  if (totalCompleted < 5) return 'growing'
  return 'flourishing'
}

// 정적 배경 장식 — 화면 전체에 흩뿌려진 별. 랜덤 생성이 아니라 고정 좌표라
// 리렌더링마다 위치가 바뀌지 않는다. 원형(dot)/사각별(sparkle) 두 형태와 두 크기(5/8)를
// 섞어서 다채로운 느낌을 준다.
const STARS = [
  { top: '6%', left: '18%', size: 8, shape: 'sparkle' },
  { top: '12%', left: '82%', size: 5, shape: 'dot' },
  { top: '20%', left: '45%', size: 5, shape: 'dot' },
  { top: '9%', left: '62%', size: 5, shape: 'sparkle' },
  { top: '28%', left: '10%', size: 5, shape: 'dot' },
  { top: '32%', left: '92%', size: 8, shape: 'dot' },
  { top: '40%', left: '30%', size: 5, shape: 'sparkle' },
  { top: '46%', left: '70%', size: 5, shape: 'dot' },
  { top: '54%', left: '15%', size: 8, shape: 'sparkle' },
  { top: '58%', left: '55%', size: 5, shape: 'dot' },
  { top: '64%', left: '88%', size: 5, shape: 'dot' },
  { top: '70%', left: '38%', size: 5, shape: 'sparkle' },
  { top: '76%', left: '8%', size: 5, shape: 'dot' },
  { top: '80%', left: '68%', size: 8, shape: 'dot' },
  { top: '86%', left: '25%', size: 5, shape: 'sparkle' },
  { top: '90%', left: '80%', size: 5, shape: 'dot' },
]

export default function MindPlanet({ totalCompleted }) {
  const stage = getStage(totalCompleted)

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`mind-planet__star mind-planet__star--${star.shape} absolute`}
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
        />
      ))}
      <div className="flex h-full items-center justify-center">
        <div className="mind-planet__orb h-56 w-56 rounded-full sm:h-64 sm:w-64" data-planet-stage={stage} />
      </div>
    </div>
  )
}
