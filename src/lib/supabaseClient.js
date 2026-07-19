import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 설정되어 있지 않습니다. .env 파일을 확인하세요.',
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
