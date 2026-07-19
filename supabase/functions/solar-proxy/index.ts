// Supabase Edge Function: solar-proxy
// 역할: 브라우저에 Upstage API 키를 노출하지 않고, 서버(Edge Function) 안에서만
// Solar LLM(Upstage)을 호출합니다. 프론트엔드는 이 함수만 호출합니다.
//
// 배포 방법:
//   supabase functions deploy solar-proxy
// 시크릿 등록 (한 번만):
//   supabase secrets set UPSTAGE_API_KEY=up_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
//
// 기본적으로 Supabase는 이 함수 호출 시 Authorization 헤더의 사용자 JWT를
// 검증합니다(로그인하지 않은 사용자는 호출 불가). 대시보드의
// Edge Functions > solar-proxy > "Enforce JWT Verification" 옵션이 켜져
// 있는지 확인하세요 (기본값 on).

const UPSTAGE_BASE_URL = 'https://api.upstage.ai/v1'
const MODEL = 'solar-pro3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('UPSTAGE_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'UPSTAGE_API_KEY 시크릿이 설정되어 있지 않습니다.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { systemPrompt, userMessage, history = [] } = await req.json()

    if (!systemPrompt || !userMessage) {
      return new Response(JSON.stringify({ error: 'systemPrompt / userMessage가 필요합니다.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage },
    ]

    const upstageRes = await fetch(`${UPSTAGE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.8,
      }),
    })

    if (!upstageRes.ok) {
      const detail = await upstageRes.text().catch(() => '')
      return new Response(
        JSON.stringify({ error: `Solar API 오류 (${upstageRes.status}): ${detail.slice(0, 200)}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const data = await upstageRes.json()
    const content = data?.choices?.[0]?.message?.content

    if (!content) {
      return new Response(JSON.stringify({ error: 'Solar 응답에 내용이 없습니다.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
