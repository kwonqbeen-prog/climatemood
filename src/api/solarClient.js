const BASE_URL = 'https://api.upstage.ai/v1'
const MODEL = 'solar-pro3'
const API_KEY = import.meta.env.VITE_UPSTAGE_API_KEY

function stripCodeFence(text) {
  const trimmed = text.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fenced ? fenced[1] : trimmed
}

function extractJsonObject(text) {
  const cleaned = stripCodeFence(text)
  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1))
    }
    throw new Error('Solar 응답을 JSON으로 해석하지 못했습니다.')
  }
}

export async function askSolar({ systemPrompt, userMessage, history = [] }) {
  if (!API_KEY) {
    throw new Error('VITE_UPSTAGE_API_KEY가 설정되어 있지 않습니다.')
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ]

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.8,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Solar API 오류 (${res.status}): ${detail.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Solar 응답에 내용이 없습니다.')
  }
  return extractJsonObject(content)
}
