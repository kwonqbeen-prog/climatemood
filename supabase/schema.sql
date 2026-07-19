-- climatemood: Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 그대로 실행하세요.

-- 1. missions 테이블
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  created_date date not null default current_date,
  is_completed boolean not null default false,
  difficulty_feedback text,
  created_at timestamptz not null default now()
);

create index if not exists missions_user_id_idx on public.missions(user_id);
create index if not exists missions_user_created_date_idx on public.missions(user_id, created_date);

alter table public.missions enable row level security;

drop policy if exists "missions_select_own" on public.missions;
create policy "missions_select_own" on public.missions
  for select using (auth.uid() = user_id);

drop policy if exists "missions_insert_own" on public.missions;
create policy "missions_insert_own" on public.missions
  for insert with check (auth.uid() = user_id);

drop policy if exists "missions_update_own" on public.missions;
create policy "missions_update_own" on public.missions
  for update using (auth.uid() = user_id);

drop policy if exists "missions_delete_own" on public.missions;
create policy "missions_delete_own" on public.missions
  for delete using (auth.uid() = user_id);

-- 2. sessions 테이블 (대화 세션 기록: 감정 유형, 에너지 레벨)
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion_type text not null,
  energy_level text not null,
  mission_count int not null default 0,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_idx on public.sessions(user_id);

alter table public.sessions enable row level security;

drop policy if exists "sessions_select_own" on public.sessions;
create policy "sessions_select_own" on public.sessions
  for select using (auth.uid() = user_id);

drop policy if exists "sessions_insert_own" on public.sessions;
create policy "sessions_insert_own" on public.sessions
  for insert with check (auth.uid() = user_id);

-- 3. chat_messages 테이블 (당일 대화 기록 — 날짜별로만 유지, 무기한 보관 아님)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'ai')),
  type text not null default 'text' check (type in ('text', 'missions')),
  text text,
  chips jsonb not null default '[]'::jsonb,
  offer_mission boolean not null default false,
  mission_ids uuid[] not null default '{}',
  raw_model_json jsonb,
  created_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_user_date_idx on public.chat_messages(user_id, created_date, created_at);

alter table public.chat_messages enable row level security;

drop policy if exists "chat_messages_select_own" on public.chat_messages;
create policy "chat_messages_select_own" on public.chat_messages
  for select using (auth.uid() = user_id);

drop policy if exists "chat_messages_insert_own" on public.chat_messages;
create policy "chat_messages_insert_own" on public.chat_messages
  for insert with check (auth.uid() = user_id);

-- 4. user_memories 테이블 (장기 기억 — 대화 전체가 아니라 AI가 판단한 핵심 인사이트만 짧게 저장)
create table if not exists public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists user_memories_user_id_idx on public.user_memories(user_id, created_at);

alter table public.user_memories enable row level security;

drop policy if exists "user_memories_select_own" on public.user_memories;
create policy "user_memories_select_own" on public.user_memories
  for select using (auth.uid() = user_id);

drop policy if exists "user_memories_insert_own" on public.user_memories;
create policy "user_memories_insert_own" on public.user_memories
  for insert with check (auth.uid() = user_id);
