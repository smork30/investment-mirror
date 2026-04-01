import { NextRequest, NextResponse } from 'next/server'
const getClient = () => { const { createClient } = require('@supabase/supabase-js'); return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://x.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY||'x') }
const QUOTES = [{quote:"시장이 패닉에 빠질 때 탐욕스러워라.",author:"워렌 버핏"},{quote:"단기적으로 시장은 인기투표 기계지만 장기적으로는 체중계다.",author:"벤저민 그레이엄"},{quote:"참을성은 투자자의 가장 큰 미덕이다.",author:"찰리 멍거"}]
export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
          const { stock, change, buyReason } = await req.json()
          const q = QUOTES[Math.floor(Math.random()*QUOTES.length)]
          if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'REPLACE_WITH_YOUR_KEY') {
                  return NextResponse.json({ quote: q.quote, author: q.author, message: `${stock} 매도 전 잠깐. 지금 이 판단이 감정인지 근거있는 판단인지 확인해봐. 매수 이유가 바뀌었어?` })
          }
          const supabase = getClient()
          const { data: past } = await supabase.from('diaries').select('*').eq('user_id', userId).order('created_at',{ascending:false}).limit(10)
          const panicCount = (past||[]).filter((d:any)=>d.reason?.includes('무서')||d.reason?.includes('공포')).length
          const Anthropic = require('@anthropic-ai/sdk')
          const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
          const res = await client.messages.create({ model:'claude-sonnet-4-20250514', max_tokens:300, messages:[{role:'user',content:`투자자가 ${stock}(${change}) 매도하려함. 매수이유:"${buyReason}". 패닉셀이력:${panicCount}회. 차분하게 감정vs판단 확인해주는 2문장. JSON만: {"quote":"명언","author":"이름","message":"메시지"}`}] })
          const text = res.content[0].type==='text'?res.content[0].text:''
          return NextResponse.json(JSON.parse(text))
    } catch (e:any) {
          const q = QUOTES[0]
          return NextResponse.json({ quote: q.quote, author: q.author, message: "지금 이 판단이 감정인지 확인해봐. 매수 이유가 바뀌었어?" })
    }
}
