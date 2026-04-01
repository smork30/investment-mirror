'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  loading: boolean
  alertData: { stock: string; change: string; reason: string } | null
  alertContent: { quote: string; author: string; message: string } | null
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export default function AlertSheet({ open, loading, alertData, alertContent, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState('')

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-line rounded-full mx-auto mt-3 mb-1" />

            {loading ? (
              <div className="flex flex-col items-center py-16 gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sub text-[13px]">AI가 패턴 분석 중...</p>
              </div>
            ) : (
              <>
                {/* 명언 배너 */}
                {alertContent && (
                  <div className="mx-5 mt-4 bg-primary rounded-xl p-4">
                    <p className="text-white/60 text-[11px] font-medium mb-2 tracking-wide uppercase">오늘의 지혜</p>
                    <p className="text-white text-[14px] font-medium leading-relaxed mb-2">{alertContent.quote}</p>
                    <p className="text-white/60 text-[12px]">— {alertContent.author}</p>
                  </div>
                )}

                <div className="px-5 py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-danger-dim text-danger text-[11px] font-semibold px-2.5 py-1 rounded-md">매도 전 확인</span>
                  </div>
                  <h2 className="text-[18px] font-bold text-ink mb-5 tracking-tight">
                    {alertContent?.message || '지금 이게 판단이야, 감정이야?'}
                  </h2>

                  {/* 컨텍스트 */}
                  <div className="bg-bg rounded-xl overflow-hidden mb-4">
                    {[
                      { label: '종목', value: alertData?.stock || '' },
                      { label: '오늘 변동', value: alertData?.change || '', color: 'text-danger' },
                      { label: '매수 이유', value: `"${(alertData?.reason || '').slice(0,20)}..."`, color: 'text-success' },
                      { label: '그 이유 지금도?', value: '바뀌지 않았어', color: 'text-success' },
                    ].map((r, i, arr) => (
                      <div key={i} className={`flex justify-between items-center px-4 py-3 ${i < arr.length - 1 ? 'border-b border-line' : ''}`}>
                        <span className="text-muted text-[13px]">{r.label}</span>
                        <span className={`text-[13px] font-medium ${r.color || 'text-ink'}`}>{r.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 과거 패턴 */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                    <p className="text-primary text-[11px] font-semibold mb-2 tracking-wide uppercase">📖 6개월 전 동일 상황</p>
                    <p className="text-sub text-[13px] leading-relaxed">비슷한 하락에서 팔았고, <span className="text-ink font-medium">3일 후 +12% 반등했어.</span> 그때 이유도 "전쟁 무서워서"였어.</p>
                  </div>

                  <p className="text-[15px] font-semibold text-ink mb-3">팔겠다면 — 이유가 뭐야?</p>
                  <textarea
                    className="w-full bg-bg border border-line rounded-xl p-4 text-ink text-[14px] resize-none outline-none focus:border-primary transition-colors mb-4"
                    rows={2}
                    placeholder="이유를 적으면 3개월 후 결과를 확인할 수 있어"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />

                  <div className="flex flex-col gap-2 pb-safe">
                    <button
                      onClick={() => { onCancel(); setReason('') }}
                      className="w-full py-4 bg-success text-white rounded-xl font-semibold text-[15px] active:opacity-90 transition-opacity"
                    >
                      보유하기로 했어
                    </button>
                    <button
                      onClick={() => { onConfirm(reason || '이유 없이 팔았어'); setReason('') }}
                      className="w-full py-4 bg-bg border border-line text-sub rounded-xl font-medium text-[15px] active:bg-line transition-colors"
                    >
                      이유 기록하고 매도
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
