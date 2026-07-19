const MISSIONS_KEY = 'climatemood.missions'
const SESSIONS_KEY = 'climatemood.sessions'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getMissions() {
  return readJSON(MISSIONS_KEY, [])
}

export function addMissions(missionDrafts) {
  const created = missionDrafts.map((m) => ({
    id: makeId(),
    title: m.title,
    description: m.description,
    category: m.category,
    createdDate: todayISO(),
    isCompleted: false,
    difficultyFeedback: null,
  }))
  const all = [...getMissions(), ...created]
  writeJSON(MISSIONS_KEY, all)
  return created
}

export function completeMission(id, difficultyFeedback) {
  const all = getMissions().map((m) =>
    m.id === id ? { ...m, isCompleted: true, difficultyFeedback } : m,
  )
  writeJSON(MISSIONS_KEY, all)
  return all.find((m) => m.id === id)
}

export function getTodayMissions() {
  const today = todayISO()
  return getMissions().filter((m) => m.createdDate === today)
}

export function getTodayCompletedCount() {
  return getTodayMissions().filter((m) => m.isCompleted).length
}

export function getTotalCompletedCount() {
  return getMissions().filter((m) => m.isCompleted).length
}

export function getCompletedHistory() {
  return getMissions()
    .filter((m) => m.isCompleted)
    .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1))
}

export function getIncompleteMissions() {
  const today = todayISO()
  return getMissions().filter((m) => !m.isCompleted && m.createdDate !== today)
}

export function getSessions() {
  return readJSON(SESSIONS_KEY, [])
}

export function addSession(session) {
  const all = [...getSessions(), { ...session, date: todayISO() }]
  writeJSON(SESSIONS_KEY, all)
  return all
}
