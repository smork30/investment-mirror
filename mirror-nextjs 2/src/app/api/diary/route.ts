import { NextRequest, NextResponse } from 'next/server'
const getClient = () => { const { createClient } = require('@supabase/supabase-js'); return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://x.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY||'x') }
export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try { const supabase = getClient(); const { data, error } = await supabase.from('diaries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50); if (error) throw error; return NextResponse.json(data || []) } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try { const body = await req.json(); const now = new Date(); const date = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`; const supabase = getClient(); const { data, error } = await supabase.from('diaries').insert({ ...body, user_id: userId, date, result: 'pending' }).select().single(); if (error) throw error; return NextResponse.json(data) } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
