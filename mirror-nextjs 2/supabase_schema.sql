-- ============================================
-- 투자 미러 DB 스키마
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 테이블 생성
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  email text,
  name text,
  created_at timestamptz default now()
);

create table if not exists stocks (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  name text not null,
  ticker text not null,
  emoji text default 'stock',
  shares numeric default 0,
  buy_price numeric default 0,
  current_price numeric default 0,
  change_percent numeric default 0,
  buy_reason text,
  created_at timestamptz default now()
);

create table if not exists diaries (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  type text check (type in ('buy','sell','feel')) not null,
  stock text,
  reason text,
  emotion text,
  date text not null,
  result text default 'pending' check (result in ('pending','win','loss')),
  result_note text,
  created_at timestamptz default now()
);

-- 2. 인덱스 (성능)
create index if not exists idx_stocks_user on stocks(user_id);
create index if not exists idx_diaries_user on diaries(user_id);
create index if not exists idx_diaries_created on diaries(created_at desc);

-- 3. 데모 데이터 (이모지 없이)
insert into stocks (user_id, name, ticker, emoji, shares, buy_price, current_price, change_percent, buy_reason)
values
  ('demo-user-001', '삼성전자', '005930', 'KR', 100, 68500, 56300, -17.8, '반도체 사이클 바닥. HBM 기대.'),
  ('demo-user-001', '나스닥ETF', 'QQQ', 'US', 50, 520, 468, -10.0, 'AI 랠리 지속될 것 같아서.'),
  ('demo-user-001', '한화에어로', '012450', 'KR', 20, 795000, 824000, 3.6, '방산 수주잔고 55조, 수혜 지속.')
on conflict do nothing;

insert into diaries (user_id, type, stock, reason, emotion, date, result, result_note)
values
  ('demo-user-001', 'buy', '삼성전자', '반도체 사이클 바닥이라서. HBM 인증 기대.', null, '2026.01.15', 'pending', null),
  ('demo-user-001', 'feel', null, null, 'anxious', '2026.03.28', 'pending', null),
  ('demo-user-001', 'sell', '삼성전자', '전쟁 무서워서 팔았음', null, '2025.09.12', 'loss', '팔고 3일 후 +12% 반등. 패닉셀이었어.')
on conflict do nothing;
