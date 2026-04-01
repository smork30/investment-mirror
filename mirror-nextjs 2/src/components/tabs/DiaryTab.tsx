'use client'
import { useState } from 'react'
import { Diary, Stock } from '@/types'
import RecordSheet from '@/components/ui/RecordSheet'

const TYPE_CFG = {
  buy:  { label: '매수', cls: 'bg-green-50 text-green-600' },
  sell: { label: '매도', cls: 'bg-red-50 text-red-500' },
  feel: { label: '감정', cls: 'bg-blue-50 text-blue-500' },
}

export default function DiaryTab({ diaries, stocks, onAddDiary }: {
  diaries: Diary[]; stocks: Stock[]; onAddDiary: (d: Partial<Diary>) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="text-[15px] font-semibold text-ink">투자 일기</span>
        <button onClick={() => setOpen(true)} className="text-[13px] text-primary font-medium">+ 기록하기</button>
      </div>

      {diaries.length === 0 ? (
        <div className="flex flex-col items-center py-16 px-6 text-center gap-3">
          <span className="text-4xl opacity-20">📔</span>
          <p className="text-[16px] font-semibold text-sub">아직 기록이 없어</p>
          <p className="text-[13px] text-muted leading-relaxed">매수할 때, 불안할 때, 팔 때<br/>한 줄씩 남겨봐.</p>
        </div>
      ) : (
        <div className="bg-surface mx-0 mb-2">
          {diaries.map((d, i) => {
            const cfg = TYPE_CFG[d.type] || TYPE_CFG.feel
            const content = d.type === 'feel' ? d.emotion : d.reason
            return (
              <div key={d.id} className={`px-5 py-4 ${i > 0 ? 'border-t border-line' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${cfg.cls}`}>{cfg.label}</span>
                  <span className="text-[12px] text-muted">{d.date}</span>
                  {d.stock && <span className="text-[12px] font-semibold text-ink ml-auto">{d.stock}</span>}
                </div>
                <p className="text-[14px] text-sub leading-relaxed mb-1.5">{content || '—'}</p>
                {d.result === 'pending' && <p className="text-[12px] text-muted">3개월 후 결과 확인 예정</p>}
                {d.result === 'loss' && <p className="text-[12px] text-danger">↩ {d.result_note}</p>}
                {d.result === 'win' && <p className="text-[12px] text-success">✓ {d.result_note}</p>}
              </div>
            )
          })}
        </div>
      )}

      <div className="px-5">
        <button onClick={() => setOpen(true)} className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-[15px]">
          새 기록 남기기
        </button>
      </div>

      <RecordSheet open={open} stocks={stocks} onSave={onAddDiary} onClose={() => setOpen(false)} />
    </div>
  )
}
