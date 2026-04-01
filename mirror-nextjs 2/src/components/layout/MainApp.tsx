'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomeTab from '@/components/tabs/HomeTab'
import DiaryTab from '@/components/tabs/DiaryTab'
import PatternTab from '@/components/tabs/PatternTab'
import { api } from '@/lib/api'
import { Diary, Stock } from '@/types'

const TABS = [
  { id: 0, label: '홈' },
  { id: 1, label: '일기' },
  { id: 2, label: '패턴' },
]

export default function MainApp({ userId }: { userId: string }) {
  const [tab, setTab] = useState(0)
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [stocks, setStocks] = useState<Stock[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [d, s] = await Promise.all([
      api.getDiaries(userId),
      api.getStocks(userId),
    ])
    if (Array.isArray(d)) setDiaries(d)
    if (Array.isArray(s)) setStocks(s)
  }

  async function addDiary(data: Partial<Diary>) {
    const saved = await api.saveDiary(userId, data)
    if (saved?.id) setDiaries(prev => [saved, ...prev])
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 탑바 */}
      <header className="bg-surface border-b border-line flex-shrink-0">
        <div className="flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪞</span>
            <span className="font-bold text-[17px] text-ink tracking-tight">
              투자 <span className="text-primary">미러</span>
            </span>
          </div>
          <div className="flex gap-1">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:bg-bg transition-colors"
              onClick={() => setTab(1)}
            >✏️</button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:bg-bg transition-colors">
              🔔
            </button>
          </div>
        </div>
        {/* 탭 */}
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-[13px] font-medium border-b-2 transition-all ${
                tab === t.id
                  ? 'text-primary border-primary'
                  : 'text-muted border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {tab === 0 && (
            <motion.div key="home" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} className="absolute inset-0 overflow-y-auto">
              <HomeTab userId={userId} stocks={stocks} diaries={diaries} onAddDiary={addDiary} onRefresh={loadData} />
            </motion.div>
          )}
          {tab === 1 && (
            <motion.div key="diary" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} className="absolute inset-0 overflow-y-auto">
              <DiaryTab diaries={diaries} stocks={stocks} onAddDiary={addDiary} />
            </motion.div>
          )}
          {tab === 2 && (
            <motion.div key="pattern" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} className="absolute inset-0 overflow-y-auto">
              <PatternTab diaries={diaries} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
