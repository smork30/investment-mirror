import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// DB 스키마 초기화 SQL (Supabase SQL Editor에서 실행)
export const SCHEMA_SQL = `
-- 사용자 프로필
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  created_at timestamptz default now()
);

-- 보유 종목
create table if not exists stocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  ticker text not null,
  emoji text default '📈',
  shares numeric default 0,
  buy_price numeric default 0,
  current_price numeric default 0,
  change_percent numeric default 0,
  buy_reason text,
  created_at timestamptz default now()
);

-- 투자 일기
create table if not exists diaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text check (type in ('buy','sell','feel')) not null,
  stock text,
  reason text,
  emotion text,
  date text not null,
  result text default 'pending' check (result in ('pending','win','loss')),
  result_note text,
  created_at timestamptz default now()
);

-- RLS 활성화
alter table profiles enable row level security;
alter table stocks enable row level security;
alter table diaries enable row level security;

-- 정책: 본인 데이터만 접근
create policy "본인 프로필만" on profiles for all using (auth.uid() = id);
create policy "본인 종목만" on stocks for all using (auth.uid() = user_id);
create policy "본인 일기만" on diaries for all using (auth.uid() = user_id);
`
