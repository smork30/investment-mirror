import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateAlert } from '@/lib/claude'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { stock, change, buyReason } = await req.json()

  // 과거 일기 가져오기
  const { data: pastDiaries } = await supabase
    .from('diaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Claude API로 맞춤 알림 생성
  const alert = await generateAlert({
    stock, change, buyReason,
    pastDiaries: pastDiaries || []
  })

  return NextResponse.json(alert)
}
