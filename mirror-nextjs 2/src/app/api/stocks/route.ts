import { NextRequest, NextResponse } from 'next/server'
const getClient = () => { const { createClient } = require('@supabase/supabase-js'); return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://x.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY||'x') }
const PRICES: Record<string,{price:number;change:number}> = {'005930':{price:56300,change:-18.3},'QQQ':{price:468,change:-12.1},'012450':{price:824000,change:3.5}}
export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try { const supabase = getClient(); const { data, error } = await supabase.from('stocks').select('*').eq('user_id', userId); if (error) throw error; const updated = (data||[]).map((s:any)=>({...s,current_price:PRICES[s.ticker]?.price??s.current_price,change_percent:PRICES[s.ticker]?.change??s.change_percent})); return NextResponse.json(updated) } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try { const body = await req.json(); const supabase = getClient(); const { data, error } = await supabase.from('stocks').insert({...body,user_id:userId}).select().single(); if (error) throw error; return NextResponse.json(data) } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
