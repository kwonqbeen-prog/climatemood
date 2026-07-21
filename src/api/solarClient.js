import { supabase } from '../lib/supabaseClient'

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

// Solar(Upstage) API는 더 이상 브라우저에서 직접 호출하지 않습니다.
// API 키 노출을 막기 위해 Supabase Edge Function(solar-proxy)을 경유합니다.
export async function askSolar({ systemPrompt, userMessage, history = [] }) {
  const { data, error } = await supabase.functions.invoke('solar-proxy', {
    body: { systemPrompt, userMessage, history },
  })

  if (error) {
    // supabase-js only gives a generic "non-2xx status code" message by default — the actual
    // reason (rate limit, Upstage error, etc.) is in the response body, which it doesn't parse
    // for us. Read it from error.context so failures are diagnosable from the console alone.
    const detail = await error.context
      ?.clone()
      .json()
      .then((body) => body?.error)
      .catch(() => null)
    throw new Error(`Solar API 프록시 호출 실패: ${detail ?? error.message}`)
  }
  if (data?.error) {
    throw new Error(data.error)
  }
  if (!data?.content) {
    throw new Error('Solar 응답에 내용이 없습니다.')
  }

  return extractJsonObject(data.content)
}
