import { supabase } from '../lib/supabaseClient'

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

async function getUserId() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    throw new Error('로그인이 필요합니다.')
  }
  return data.user.id
}

function toMission(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    createdDate: row.created_date,
    isCompleted: row.is_completed,
    difficultyFeedback: row.difficulty_feedback,
  }
}

export async function getMissions() {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map(toMission)
}

export async function addMissions(missionDrafts) {
  const userId = await getUserId()
  const today = todayISO()
  const rows = missionDrafts.map((m) => ({
    user_id: userId,
    title: m.title,
    description: m.description,
    category: m.category,
    created_date: today,
    is_completed: false,
    difficulty_feedback: null,
  }))
  const { data, error } = await supabase.from('missions').insert(rows).select()
  if (error) throw error
  return data.map(toMission)
}

export async function completeMission(id, difficultyFeedback) {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('missions')
    .update({ is_completed: true, difficulty_feedback: difficultyFeedback })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return toMission(data)
}

export async function getTodayMissions() {
  const missions = await getMissions()
  const today = todayISO()
  return missions.filter((m) => m.createdDate === today)
}

export async function getTodayCompletedCount() {
  const todayMissions = await getTodayMissions()
  return todayMissions.filter((m) => m.isCompleted).length
}

export async function getTotalCompletedCount() {
  const missions = await getMissions()
  return missions.filter((m) => m.isCompleted).length
}

export async function getCompletedHistory() {
  const missions = await getMissions()
  return missions
    .filter((m) => m.isCompleted)
    .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))
}

export async function getIncompleteMissions() {
  const missions = await getMissions()
  const today = todayISO()
  return missions.filter((m) => !m.isCompleted && m.createdDate !== today)
}

export async function getSessions() {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map((row) => ({
    date: row.date,
    emotionType: row.emotion_type,
    energyLevel: row.energy_level,
    missionCount: row.mission_count,
  }))
}

export async function addSession(session) {
  const userId = await getUserId()
  const { error } = await supabase.from('sessions').insert({
    user_id: userId,
    emotion_type: session.emotionType,
    energy_level: session.energyLevel,
    mission_count: session.missionCount,
    date: todayISO(),
  })
  if (error) throw error
  return getSessions()
}

function toChatMessage(row, missionsById) {
  return {
    id: row.id,
    role: row.role,
    type: row.type,
    text: row.text,
    chips: row.chips ?? [],
    offerMission: row.offer_mission,
    missions:
      row.type === 'missions'
        ? (row.mission_ids ?? []).map((id) => missionsById[id]).filter(Boolean)
        : undefined,
    rawModelJson: row.raw_model_json,
  }
}

export async function getTodayChatMessages() {
  const userId = await getUserId()
  const today = todayISO()
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('created_date', today)
    .order('created_at', { ascending: true })
  if (error) throw error

  const needsMissions = data.some((row) => (row.mission_ids ?? []).length > 0)
  const missionsById = needsMissions
    ? Object.fromEntries((await getTodayMissions()).map((m) => [m.id, m]))
    : {}

  return data.map((row) => toChatMessage(row, missionsById))
}

export async function addChatMessage(msg) {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      role: msg.role,
      type: msg.type ?? 'text',
      text: msg.text ?? null,
      chips: msg.chips ?? [],
      offer_mission: Boolean(msg.offerMission),
      mission_ids: msg.missionIds ?? [],
      raw_model_json: msg.rawModelJson ?? null,
      created_date: todayISO(),
    })
    .select()
    .single()
  if (error) throw error
  return toChatMessage(data, {})
}

export async function getUserMemories(limit = 20) {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('user_memories')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data.map((row) => row.content)
}

export async function addUserMemory(content) {
  const userId = await getUserId()
  const { error } = await supabase.from('user_memories').insert({ user_id: userId, content })
  if (error) throw error
}
