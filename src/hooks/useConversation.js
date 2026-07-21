import { useCallback, useRef, useState } from 'react'
import { askSolar } from '../api/solarClient'
import { conversationPrompt, missionPrompt, encouragementPrompt } from '../prompts/systemPrompts'
import { emotionLabelFromEnum, clampMissionCount, getCategoryPlan, EMOTION_ENUM_KEYS } from '../data/constants'
import { pickFallbackMissions } from '../data/missionPool'
import {
  addMissions,
  addSession,
  completeMission,
  getSessions,
  getTodayMissions,
  getTodayChatMessages,
  addChatMessage,
  getUserMemories,
  addUserMemory,
} from '../data/storage'

let nextId = 1
function makeMessageId() {
  nextId += 1
  return `m-${nextId}`
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readProposedFlag() {
  try {
    return localStorage.getItem('climatemood.mission_suggested_date') === todayKey()
  } catch {
    return false
  }
}

function writeProposedFlag() {
  try {
    localStorage.setItem('climatemood.mission_suggested_date', todayKey())
  } catch {
    // localStorage unavailable — non-fatal, worst case a mission gets suggested twice in one day
  }
}

const ENERGY_LABELS = { 1: '무기력(미션 1개)', 3: '보통(미션 3개)', 5: '의욕적(미션 5개)' }
const ENTRY_CHIPS = [
  '오늘 기분을 이야기하고 싶어요',
  '마음이 좀 복잡해요',
  '오늘의 미션을 추천해주세요',
  '그냥 이야기만 나누고 싶어요',
]
const FALLBACK_TURN = {
  mode: 'freechat',
  stage: 'freechat',
  reply_message: '지금은 연결이 원활하지 않아요. 잠시 후 다시 말씀해주시겠어요?',
  emotion_type: null,
  energy_level: null,
  suggested_chips: [],
  suggest_mission: false,
  mission_hint: null,
  missions: null,
  memory_note: null,
}

export function useConversation({ displayName } = {}) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiDegraded, setApiDegraded] = useState(false)
  const [todayMissionExists, setTodayMissionExists] = useState(false)

  const startedRef = useRef(false)
  const todayMissionExistsRef = useRef(false)
  const knownEmotionRef = useRef(null)
  const knownEnergyRef = useRef(null)
  const proposedTodayRef = useRef(readProposedFlag())
  const missionsGeneratingRef = useRef(false)
  const historyRef = useRef([])
  const memoriesRef = useRef([])

  const pushMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: makeMessageId(), ...msg }])
    addChatMessage(msg).catch((err) => console.error('채팅 메시지 저장 실패', err))
  }, [])

  const markTodayMissionExists = useCallback((value) => {
    todayMissionExistsRef.current = value
    setTodayMissionExists(value)
  }, [])

  const generateMissions = useCallback(async () => {
    const emotionLabel = emotionLabelFromEnum(knownEmotionRef.current) ?? '알 수 없음'
    const count = clampMissionCount(knownEnergyRef.current)
    const energyLabel = ENERGY_LABELS[count]

    const existingSessions = await getSessions()
    const offset = existingSessions.length % 4
    const categoryPlan = getCategoryPlan(count, offset)

    setLoading(true)
    let result
    try {
      result = await askSolar({
        systemPrompt: missionPrompt({ emotionLabel, energyLabel, categoryPlan, displayName }),
        userMessage: '미션을 생성해주세요.',
      })
    } catch (err) {
      console.error('미션 생성 실패, 기본 미션으로 대체합니다.', err)
      setApiDegraded(true)
      result = { message: '오늘은 이런 미션들이 어떠세요?', missions: pickFallbackMissions(categoryPlan) }
    }
    setLoading(false)

    const missionDrafts = Array.isArray(result.missions) && result.missions.length
      ? result.missions
      : pickFallbackMissions(categoryPlan)

    const savedMissions = await addMissions(missionDrafts)
    await addSession({
      emotionType: knownEmotionRef.current,
      energyLevel: count,
      missionCount: savedMissions.length,
    })

    pushMessage({
      role: 'ai',
      type: 'missions',
      text: result.message,
      missions: savedMissions,
      missionIds: savedMissions.map((m) => m.id),
    })
    markTodayMissionExists(true)
  }, [displayName, markTodayMissionExists, pushMessage])

  const sendMessage = useCallback(
    async (userText, { silent = false, entryOffer = false } = {}) => {
      if (!silent) {
        pushMessage({ role: 'user', type: 'text', text: userText })
      }
      setLoading(true)

      const systemPrompt = conversationPrompt({
        knownEmotionLabel: emotionLabelFromEnum(knownEmotionRef.current),
        knownEnergyLevel: knownEnergyRef.current ? ENERGY_LABELS[knownEnergyRef.current] : null,
        alreadyProposedMissionToday: proposedTodayRef.current,
        todayMissionExists: todayMissionExistsRef.current,
        displayName,
        memories: memoriesRef.current,
      })

      let result
      try {
        result = await askSolar({ systemPrompt, userMessage: userText, history: historyRef.current })
        setApiDegraded(false)
      } catch (err) {
        console.error('Solar API 호출 실패, 기본 응답으로 대체합니다.', err)
        setApiDegraded(true)
        result = FALLBACK_TURN
      }
      setLoading(false)

      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: userText },
        { role: 'assistant', content: JSON.stringify(result) },
      ].slice(-20)

      if (result.emotion_type && EMOTION_ENUM_KEYS.includes(result.emotion_type)) {
        knownEmotionRef.current = result.emotion_type
      }
      if (result.energy_level) {
        knownEnergyRef.current = clampMissionCount(result.energy_level)
      }
      // mission_hint is not assigned to knownEmotionRef here on purpose — it's an unconfirmed
      // guess from freechat. The model sees its own past mission_hint values via history and
      // uses them to soft-confirm once the user actually enters mission mode.

      if (typeof result.memory_note === 'string' && result.memory_note.trim()) {
        const note = result.memory_note.trim()
        memoriesRef.current = [...memoriesRef.current, note].slice(-20)
        addUserMemory(note).catch((err) => console.error('메모리 저장 실패', err))
      }

      // Entry card (first visit of the day) is a deterministic UI affordance, not something the
      // model decides — it doesn't consume the once-per-day auto-suggestion budget.
      const entryOfferShown = entryOffer && !todayMissionExistsRef.current

      // suggest_mission only means something in freechat — ignore it if the model echoes
      // it back while already inside the mission-collection flow.
      const shouldSuggest =
        !entryOfferShown &&
        result.mode === 'freechat' &&
        Boolean(result.suggest_mission) &&
        !proposedTodayRef.current &&
        !todayMissionExistsRef.current
      if (shouldSuggest) {
        proposedTodayRef.current = true
        writeProposedFlag()
      }

      pushMessage({
        role: 'ai',
        type: 'text',
        text: result.reply_message,
        chips: entryOfferShown
          ? ENTRY_CHIPS
          : Array.isArray(result.suggested_chips)
            ? result.suggested_chips.slice(0, 3)
            : [],
        offerMission: entryOfferShown || shouldSuggest,
        rawModelJson: result,
      })

      // Trigger mission generation as soon as both values are confirmed, rather than waiting
      // for the model to self-report stage: "mission_ready" — it doesn't always flip stage
      // the same turn it fills in the second value, which would otherwise strand the user.
      const readyForMissions =
        knownEmotionRef.current &&
        knownEnergyRef.current &&
        !todayMissionExistsRef.current &&
        !missionsGeneratingRef.current

      if (readyForMissions) {
        missionsGeneratingRef.current = true
        await generateMissions()
        missionsGeneratingRef.current = false
      }
    },
    [displayName, generateMissions, pushMessage],
  )

  const start = useCallback(async () => {
    if (startedRef.current) return
    startedRef.current = true

    setLoading(true)
    const [missions, memories, todayMessages] = await Promise.all([
      getTodayMissions().catch((err) => {
        console.error('오늘의 미션 조회 실패', err)
        return []
      }),
      getUserMemories().catch((err) => {
        console.error('메모리 조회 실패', err)
        return []
      }),
      getTodayChatMessages().catch((err) => {
        console.error('오늘의 대화 조회 실패', err)
        return []
      }),
    ])
    markTodayMissionExists(missions.length > 0)
    memoriesRef.current = memories
    setLoading(false)

    if (todayMessages.length > 0) {
      // Resume today's conversation instead of greeting again — reconstruct the model-facing
      // history and known values from what was persisted earlier today.
      setMessages(todayMessages)
      historyRef.current = todayMessages
        .filter((m) => m.role === 'user' || m.rawModelJson)
        .map((m) =>
          m.role === 'user'
            ? { role: 'user', content: m.text }
            : { role: 'assistant', content: JSON.stringify(m.rawModelJson) },
        )
        .slice(-20)

      todayMessages.forEach((m) => {
        if (!m.rawModelJson) return
        if (m.rawModelJson.emotion_type && EMOTION_ENUM_KEYS.includes(m.rawModelJson.emotion_type)) {
          knownEmotionRef.current = m.rawModelJson.emotion_type
        }
        if (m.rawModelJson.energy_level) {
          knownEnergyRef.current = clampMissionCount(m.rawModelJson.energy_level)
        }
      })

      // Edge case: the user reloaded in the brief window after both values were confirmed but
      // before mission generation ran — finish the job now instead of leaving them stranded.
      if (
        knownEmotionRef.current &&
        knownEnergyRef.current &&
        !todayMissionExistsRef.current &&
        !missionsGeneratingRef.current
      ) {
        missionsGeneratingRef.current = true
        await generateMissions()
        missionsGeneratingRef.current = false
      }
      return
    }

    await sendMessage(
      '(사용자가 방금 앱을 열었습니다. 자연스럽게 환영 인사를 건네고 마음 상태에 관심을 가져주세요.)',
      { silent: true, entryOffer: true },
    )
  }, [generateMissions, markTodayMissionExists, sendMessage])

  const requestMissionFlow = useCallback(() => {
    sendMessage('오늘의 맞춤 미션을 받고 싶어요')
  }, [sendMessage])

  const completeMissionWithFeedback = useCallback(
    async (missionId, difficulty) => {
      const updated = await completeMission(missionId, difficulty)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.type === 'missions'
            ? { ...msg, missions: msg.missions.map((m) => (m.id === missionId ? updated : m)) }
            : msg,
        ),
      )
      setLoading(true)
      let result
      try {
        result = await askSolar({
          systemPrompt: encouragementPrompt({ missionTitle: updated.title, difficulty, displayName }),
          userMessage: '응원 메시지를 생성해주세요.',
        })
      } catch (err) {
        console.error('응원 메시지 생성 실패, 기본 메시지로 대체합니다.', err)
        setApiDegraded(true)
        result = { message: '정말 잘하셨어요! 작은 실천이 모여 큰 변화를 만듭니다.' }
      }
      setLoading(false)
      pushMessage({ role: 'ai', type: 'text', text: result.message })
    },
    [displayName, pushMessage],
  )

  return {
    messages,
    loading,
    apiDegraded,
    todayMissionExists,
    start,
    sendMessage,
    requestMissionFlow,
    completeMissionWithFeedback,
  }
}
