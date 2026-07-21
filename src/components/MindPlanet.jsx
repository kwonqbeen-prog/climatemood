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

export default function MindPlanet({ totalCompleted, history }) {
  const stage = getStage(totalCompleted)
  const dominantCategory = getDominantCategory(history)
  const categorySlug = CATEGORY_META[dominantCategory]?.slug ?? 'life'

  return (
    <div className="relative flex items-center justify-center py-6" aria-hidden="true">
      {stage === 'seed' && (
        <>
          <span className="absolute left-[30%] top-[18%] h-1 w-1 rounded-full bg-ink-faint/40" />
          <span className="absolute right-[28%] top-[30%] h-1.5 w-1.5 rounded-full bg-ink-faint/40" />
          <span className="absolute bottom-[22%] left-[38%] h-1 w-1 rounded-full bg-ink-faint/40" />
        </>
      )}
      <div
        className="mind-planet__orb h-40 w-40 rounded-full"
        data-planet-stage={stage}
        data-planet-category={categorySlug}
      />
    </div>
  )
}
