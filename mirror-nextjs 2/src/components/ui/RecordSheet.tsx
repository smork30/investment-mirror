'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Diary, Stock } from '@/types'

const TYPES = [
  { id: 'buy' as const, label: '📈 매수' },
  { id: 'sell' as const, label: '📉 매도' },
  { id: 'feel' as const, label: '💭 감정' },
]
const EMOTIONS = ['😰 불안', '😌 평온', '😤 확신', '🤔 모름']

export default function RecordSheet({ open, stocks, onSave, onClose }: {
  open: boolean; stocks: Stock[]; onSave: (d: Partial<Diary>) => void; onClose: () => void
}) {
  const [type, setType] = useState<'buy'|'sell'|'feel'>('buy')
  const [stock, setStock] = useState('')
  const [reason, setReason] = useState('')
  const [emotion, setEmotion] = useState('')

  function reset() { setType('buy'); setStock(''); setReason(''); setEmotion('') }

  function save() {
    if (type !== 'feel' && !stock) return
    if (type === 'feel' && !emotion) return
    if ((type === 'buy' || type === 'sell') && !reason.trim()) return
    onSave({ type, stock: stock || null, reason: reason.trim() || null, emotion: emotion || null })
    reset(); onClose()
  }

  const placeholder = type === 'buy' ? '예) 반도체 사이클 바닥이라서' : type === 'sell' ? '예) 전쟁 무서워서, 목표 달성' : '한 마디 더 (선택)'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => { reset(); onClose() }} />
          <motion.div initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
            transition={{ type:'spring', damping:25, stiffness:200 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface rounded-t-2xl z-50 max-h-[88vh] overflow-y-auto">
            <div className="w-10 h-1 bg-line rounded-full mx-auto mt-3" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h3 className="text-[17px] font-bold text-ink">기록 남기기</h3>
              <button onClick={() => { reset(); onClose() }} className="w-8 h-8 bg-bg rounded-full flex items-center justify-center text-sub text-lg">×</button>
            </div>
            <div className="px-5 py-5 space-y-5">
              <div>
                <p className="text-[13px] font-medium text-sub mb-2.5">무슨 기록이야?</p>
                <div className="flex gap-2">
                  {TYPES.map(t => (
                    <button key={t.id} onClick={() => setType(t.id)}
                      className={`flex-1 py-2.5 rounded-2xl text-[13px] font-medium border-[1.5px] transition-all ${type === t.id ? 'border-primary bg-primary-dim text-primary' : 'border-line bg-bg text-sub'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {type !== 'feel' && (
                <div>
                  <p className="text-[13px] font-medium text-sub mb-2.5">어떤 종목?</p>
                  <div className="flex flex-wrap gap-2">
                    {(stocks.length > 0 ? stocks : [
                      { id:'1', name:'삼성전자' }, { id:'2', name:'나스닥ETF' }, { id:'3', name:'한화에어로' }
                    ] as any[]).map((s: any) => (
                      <button key={s.id} onClick={() => setStock(s.name)}
                        className={`px-4 py-2 rounded-2xl text-[13px] font-medium border-[1.5px] transition-all ${stock === s.name ? 'border-primary bg-primary-dim text-primary' : 'border-line bg-bg text-sub'}`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[13px] font-medium text-sub mb-2.5">
                  {type === 'buy' ? '왜 샀어?' : type === 'sell' ? '왜 팔았어?' : '지금 어때?'}
                </p>
                {type === 'feel' ? (
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map(e => (
                      <button key={e} onClick={() => setEmotion(e)}
                        className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium border-[1.5px] transition-all ${emotion === e ? (e.includes('불안') ? 'border-danger bg-danger-dim text-danger' : 'border-primary bg-primary-dim text-primary') : 'border-line bg-bg text-sub'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea className="w-full bg-bg border-[1.5px] border-line rounded-xl px-4 py-3.5 text-ink text-[14px] resize-none outline-none focus:border-primary transition-colors"
                    rows={2} placeholder={placeholder} value={reason} onChange={e => setReason(e.target.value)} />
                )}
              </div>

              <button onClick={save} className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-[15px]">
                기록 저장하기
              </button>
              <div className="pb-safe" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
