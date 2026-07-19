export const EMOTION_TYPES = [
  { key: '불안형', label: '불안해요', hint: '기후 관련 뉴스나 미래가 자꾸 불안하게 느껴져요' },
  { key: '무력감형', label: '무기력해요', hint: '내가 뭘 해도 소용없을 것 같은 기분이에요' },
  { key: '죄책감형', label: '죄책감이 들어요', hint: '내 행동이 환경에 나쁜 영향을 주는 것 같아 마음이 무거워요' },
  { key: '정보피로형', label: '지쳤어요', hint: '기후 관련 정보가 너무 많아서 피로하고 무뎌졌어요' },
]

export const ENERGY_LEVELS = [
  { key: '무기력', label: '오늘은 힘이 없어요', missionCount: 1 },
  { key: '보통', label: '보통이에요', missionCount: 3 },
  { key: '의욕적', label: '의욕이 넘쳐요', missionCount: 5 },
]

export const CATEGORIES = ['생활 실천', '가치 연결', '마음 챙김', '함께하기']

export const CATEGORY_META = {
  '생활 실천': { emoji: '🌍', purpose: '자기효능감' },
  '가치 연결': { emoji: '💬', purpose: '의미 부여' },
  '마음 챙김': { emoji: '🌿', purpose: '정서 조절' },
  '함께하기': { emoji: '🤝', purpose: '연결감' },
}

export const DIFFICULTY_OPTIONS = ['쉬움', '적당함', '어려움']

export function getCategoryPlan(count, offset = 0) {
  const plan = []
  for (let i = 0; i < count; i += 1) {
    plan.push(CATEGORIES[(offset + i) % CATEGORIES.length])
  }
  return plan
}

export function missionCountFor(energyKey) {
  return ENERGY_LEVELS.find((e) => e.key === energyKey)?.missionCount ?? 3
}
