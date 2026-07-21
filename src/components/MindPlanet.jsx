import { CATEGORIES, CATEGORY_META } from '../data/constants'

// 임계값은 조정 가능한 PLACEHOLDER — 실제 성장 곡선은 후속 컬러/밸런싱 세션에서 튜닝
function getStage(totalCompleted) {
  if (totalCompleted === 0) return 'seed'
  if (totalCompleted < 5) return 'growing'
  return 'flourishing'
}

function getDominantCategory(history) {
  const counts = {}
  for (const mission of history) {
    counts[mission.category] = (counts[mission.category] ?? 0) + 1
  }
  let best = CATEGORIES[0]
  let bestCount = -1
  for (const category of CATEGORIES) {
    const count = counts[category] ?? 0
    if (count > bestCount) {
      best = category
      bestCount = count
    }
  }
  return best
}

// 정적 배경 장식 — 화면 전체에 은은하게 흩뿌려진 별. 랜덤 생성이 아니라 고정 좌표라
// 리렌더링마다 위치가 바뀌지 않는다.
const STARS = [
  { top: '6%', left: '18%', size: 3 },
  { top: '12%', left: '82%', size: 2 },
  { top: '20%', left: '45%', size: 2 },
  { top: '9%', left: '62%', size: 2 },
  { top: '28%', left: '10%', size: 2 },
  { top: '32%', left: '92%', size: 3 },
  { top: '40%', left: '30%', size: 2 },
  { top: '46%', left: '70%', size: 2 },
  { top: '54%', left: '15%', size: 3 },
  { top: '58%', left: '55%', size: 2 },
  { top: '64%', left: '88%', size: 2 },
  { top: '70%', left: '38%', size: 2 },
  { top: '76%', left: '8%', size: 2 },
  { top: '80%', left: '68%', size: 3 },
  { top: '86%', left: '25%', size: 2 },
  { top: '90%', left: '80%', size: 2 },
]

export default function MindPlanet({ totalCompleted, history }) {
  const stage = getStage(totalCompleted)
  const dominantCategory = getDominantCategory(history)
  const categorySlug = CATEGORY_META[dominantCategory]?.slug ?? 'life'

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="mind-planet__star absolute rounded-full"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
        />
      ))}
      <div className="flex h-full items-center justify-center">
        <div
          className="mind-planet__orb h-56 w-56 rounded-full sm:h-64 sm:w-64"
          data-planet-stage={stage}
          data-planet-category={categorySlug}
        />
      </div>
    </div>
  )
}
