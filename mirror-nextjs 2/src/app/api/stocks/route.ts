import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 기본 종목 데이터 (실제 API 연동 전 목업)
const MOCK_PRICES: Record<string, { price: number; change: number }> = {
  '005930': { price: 56300, change: -18.3 },
  'QQQ':    { price: 468,   change: -12.1 },
  '012450': { price: 824000, change: 3.5  },
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error }, { status: 500 })

  // 실시간 가격 업데이트 (목업)
  const updated = (data || []).map(s => ({
    ...s,
    current_price: MOCK_PRICES[s.ticker]?.price ?? s.current_price,
    change_percent: MOCK_PRICES[s.ticker]?.change ?? s.change_percent,
  }))

  return NextResponse.json(updated)
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('stocks')
    .insert({ ...body, user_id: userId })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
