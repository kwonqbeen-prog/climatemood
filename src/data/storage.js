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
