import { useCallback, useState } from 'react'
import { askSolar } from '../api/solarClient'
import {
  greetingPrompt,
  emotionQuestionFollowupPrompt,
  missionPrompt,
  encouragementPrompt,
} from '../prompts/systemPrompts'
import { EMOTION_TYPES, ENERGY_LEVELS, getCategoryPlan, missionCountFor } from '../data/constants'
import { pickFallbackMissions } from '../data/missionPool'
import { addMissions, addSession, completeMission, getSessions } from '../data/storage'

let nextId = 1
function makeMessageId() {
  nextId += 1
  return `m-${nextId}`
}

export function useConversation() {
  const [messages, setMessages] = useState([])
  const [stage, setStage] = useState('idle')
  const [emotionKey, setEmotionKey] = useState(null)
  const [energyKey, setEnergyKey] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiDegraded, setApiDegraded] = useState(false)

  const pushMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: makeMessageId(), ...msg }])
  }, [])

  const runStage = useCallback(async (systemPrompt, userMessage, fallback) => {
    setLoading(true)
    try {
      const result = await askSolar({ systemPrompt, userMessage })
      setLoading(false)
      return result
    } catch (err) {
      console.error('Solar API 호출 실패, 기본 응답으로 대체합니다.', err)
      setApiDegraded(true)
      setLoading(false)
      return fallback
    }
  }, [])

  const start = useCallback(async () => {
    setStage('greeting')
    const result = await runStage(
      greetingPrompt(),
      '대화를 시작해주세요.',
      { message: '안녕하세요, 오늘 만나서 반가워요. 요즘 기후 관련해서 마음에 걸리는 일이 있으셨나요?' },
    )
    pushMessage({ role: 'ai', type: 'text', text: result.message })
    setStage('awaiting_emotion')
  }, [pushMessage, runStage])

  const selectEmotion = useCallback(
    async (key) => {
      const emotion = EMOTION_TYPES.find((e) => e.key === key)
      setEmotionKey(key)
      pushMessage({ role: 'user', type: 'text', text: emotion.label })
      setStage('loading_energy_prompt')
      const result = await runStage(
        emotionQuestionFollowupPrompt(emotion.label),
        '다음 질문을 생성해주세요.',
        { message: `${emotion.label} 마음, 저도 함께 느껴져요. 오늘은 실천할 힘이 얼마나 남아있으신가요?` },
      )
      pushMessage({ role: 'ai', type: 'text', text: result.message })
      setStage('awaiting_energy')
    },
    [pushMessage, runStage],
  )

  const selectEnergy = useCallback(
    async (key) => {
      const energy = ENERGY_LEVELS.find((e) => e.key === key)
      const emotion = EMOTION_TYPES.find((e) => e.key === emotionKey)
      setEnergyKey(key)
      pushMessage({ role: 'user', type: 'text', text: energy.label })
      setStage('loading_missions')

      const count = missionCountFor(key)
      const offset = getSessions().length % 4
      const categoryPlan = getCategoryPlan(count, offset)

      const result = await runStage(
        missionPrompt({ emotionLabel: emotion.label, energyLabel: energy.label, categoryPlan }),
        '미션을 생성해주세요.',
        { message: '오늘은 이런 미션들이 어떠세요?', missions: pickFallbackMissions(categoryPlan) },
      )

      const missionDrafts = Array.isArray(result.missions) && result.missions.length
        ? result.missions
        : pickFallbackMissions(categoryPlan)

      const savedMissions = addMissions(missionDrafts)
      addSession({ emotionType: emotionKey, energyLevel: key, missionCount: savedMissions.length })

      pushMessage({ role: 'ai', type: 'missions', text: result.message, missions: savedMissions })
      setStage('awaiting_mission_interaction')
    },
    [emotionKey, pushMessage, runStage],
  )

  const completeMissionWithFeedback = useCallback(
    async (missionId, difficulty) => {
      const updated = completeMission(missionId, difficulty)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.type === 'missions'
            ? {
                ...msg,
                missions: msg.missions.map((m) => (m.id === missionId ? updated : m)),
              }
            : msg,
        ),
      )
      const result = await runStage(
        encouragementPrompt({ missionTitle: updated.title, difficulty }),
        '응원 메시지를 생성해주세요.',
        { message: '정말 잘하셨어요! 작은 실천이 모여 큰 변화를 만듭니다 🌱' },
      )
      pushMessage({ role: 'ai', type: 'text', text: result.message })
    },
    [pushMessage, runStage],
  )

  return {
    messages,
    stage,
    loading,
    apiDegraded,
    emotionKey,
    energyKey,
    start,
    selectEmotion,
    selectEnergy,
    completeMissionWithFeedback,
  }
}
