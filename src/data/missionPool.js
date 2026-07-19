export const MISSION_POOL = {
  '생활 실천': [
    { title: '대중교통으로 이동하기', description: '자동차 대신 버스나 지하철을 이용해보세요. 작은 선택이 쌓이면 큰 변화가 됩니다.' },
    { title: '텀블러 사용하기', description: '오늘 마시는 음료는 일회용 컵 대신 텀블러에 담아보세요.' },
    { title: '안 쓰는 플러그 뽑기', description: '집에서 사용하지 않는 가전 플러그를 뽑아 대기전력을 줄여보세요.' },
  ],
  '가치 연결': [
    { title: '기후 다큐 5분 보기', description: '짧은 다큐멘터리나 영상 하나를 보며 내 행동의 의미를 다시 느껴보세요.' },
    { title: '친환경 소비 하나 골라보기', description: '오늘 하나의 소비에서 조금 더 친환경적인 선택을 해보세요.' },
    { title: '내가 아끼는 자연 떠올리기', description: '내가 지키고 싶은 자연의 모습을 하나 떠올리고 짧게 적어보세요.' },
  ],
  '마음 챙김': [
    { title: '창밖 하늘 3분 바라보기', description: '잠시 하던 일을 멈추고 하늘이나 나무를 3분만 바라보며 숨을 골라보세요.' },
    { title: '식물에 물 주기', description: '집이나 주변의 식물에게 물을 주며 잠시 마음을 가라앉혀보세요.' },
    { title: '걱정 적어보고 접어두기', description: '마음에 걸리는 걱정 하나를 종이에 적고, 잠시 접어 서랍에 넣어두세요.' },
  ],
  '함께하기': [
    { title: '가족에게 한마디 나누기', description: '오늘 느낀 감정을 가족이나 친구에게 짧게 이야기해보세요.' },
    { title: '함께하는 사람 응원하기', description: '기후 행동을 하고 있는 누군가에게 응원 메시지를 보내보세요.' },
    { title: 'SNS에 작은 실천 공유하기', description: '오늘 한 작은 실천을 SNS나 메신저로 한 사람에게 공유해보세요.' },
  ],
}

export function pickFallbackMissions(categoryPlan) {
  const usedIndexByCategory = {}
  return categoryPlan.map((category) => {
    const pool = MISSION_POOL[category] ?? MISSION_POOL['생활 실천']
    const idx = (usedIndexByCategory[category] ?? 0) % pool.length
    usedIndexByCategory[category] = idx + 1
    return { ...pool[idx], category }
  })
}
