export const EMOTION_TYPES = [
  { enumKey: 'anxiety', key: '불안형', label: '불안해요', hint: '기후 관련 뉴스나 미래가 자꾸 불안하게 느껴져요' },
  { enumKey: 'helplessness', key: '무력감형', label: '무기력해요', hint: '내가 뭘 해도 소용없을 것 같은 기분이에요' },
  { enumKey: 'guilt', key: '죄책감형', label: '죄책감이 들어요', hint: '내 행동이 환경에 나쁜 영향을 주는 것 같아 마음이 무거워요' },
  { enumKey: 'info_fatigue', key: '정보피로형', label: '지쳤어요', hint: '기후 관련 정보가 너무 많아서 피로하고 무뎌졌어요' },
]

export const EMOTION_ENUM_KEYS = EMOTION_TYPES.map((e) => e.enumKey)

export function emotionLabelFromEnum(enumKey) {
  return EMOTION_TYPES.find((e) => e.enumKey === enumKey)?.key ?? null
}

// energy_level now comes directly from the LLM as the mission count (1/3/5).
export const ENERGY_LEVELS = [
  { value: 1, description: '오늘은 힘이 별로 없어요' },
  { value: 3, description: '보통이에요' },
  { value: 5, description: '의욕이 넘쳐요' },
]

const VALID_MISSION_COUNTS = ENERGY_LEVELS.map((e) => e.value)

export function clampMissionCount(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 3
  return VALID_MISSION_COUNTS.reduce((closest, v) =>
    Math.abs(v - n) < Math.abs(closest - n) ? v : closest,
  )
}

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
