'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import MainApp from '@/components/layout/MainApp'
import LoginScreen from '@/components/layout/LoginScreen'

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 개발/데모 모드: 로그인 없이 데모 유저 사용
    const demoId = 'demo-user-001'
    setUserId(demoId)
    setLoading(false)

    // 실제 인증 (Supabase 세팅 후 활성화)
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setUserId(session?.user?.id ?? null)
    //   setLoading(false)
    // })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return userId ? <MainApp userId={userId} /> : <LoginScreen />
}
