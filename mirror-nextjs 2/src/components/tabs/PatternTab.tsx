'use client'
import { Diary } from '@/types'

export default function PatternTab({ diaries }: { diaries: Diary[] }) {
  const total = diaries.length
  const pct = Math.round(Math.min(total / 12, 1) * 100)
  const sells = diaries.filter(d => d.type === 'sell')
  const panicSells = sells.filter(d => d.reason && (d.reason.includes('무서') || d.reason.includes('공포') || d.reason.includes('불안')))
  const panicRatio = sells.length > 0 ? Math.round(panicSells.length / sells.length * 100) : 0
  const emoCnts = ['😰 불안', '😌 평온', '😤 확신', '🤔 모름'].map(e => diaries.filter(d => d.emotion === e).length)
  const maxE = Math.max(...emoCnts, 1)
  const emoColors = ['bg-danger', 'bg-success', 'bg-primary', 'bg-muted']

  if (total < 3) {
    return (
      <div className="pb-6">
        <div className="flex items-center px-5 pt-5 pb-3">
          <span className="text-[15px] font-semibold text-ink">내 패턴</span>
        </div>
        <div className="bg-surface mx-0 px-6 py-12 flex flex-col items-center text-center gap-4">
          <span className="text-5xl opacity-20">🔍</span>
          <p className="text-[18px] font-bold text-sub">아직 데이터가 부족해</p>
          <p className="text-[14px] text-muted leading-relaxed">기록이 쌓일수록 내 패턴이 보여.<br/>매수할 때, 팔 때, 불안할 때 남겨봐.</p>
          <div className="w-48 bg-line rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[12px] text-muted">{total} / 12개 기록됨</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-6">
      <div className="flex items-center px-5 pt-5 pb-3">
        <span className="text-[15px] font-semibold text-ink">내 패턴</span>
      </div>

      {panicRatio > 0 && (
        <div className="bg-surface mb-2 px-5 py-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[12px] bg-red-50 flex items-center justify-center text-xl">⚠️</div>
            <p className="text-[15px] font-semibold text-ink">발견된 패턴</p>
          </div>
          <p className="text-[14px] text-sub leading-relaxed">
            매도 {sells.length}건 중 <span className="text-danger font-semibold">{panicRatio}%</span>가{' '}
            <span className="text-ink font-semibold">공포·불안이 이유였어.</span><br/>
            감정으로 판단하면 대부분 후회해. 이게 네 데이터야.
          </p>
        </div>
      )}

      <div className="bg-surface mb-2 px-5 py-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-blue-50 flex items-center justify-center text-xl">📊</div>
          <p className="text-[15px] font-semibold text-ink">기록 요약</p>
        </div>
        <p className="text-[14px] text-sub leading-relaxed mb-4">
          총 <span className="text-ink font-semibold">{total}개</span> 기록 중{' '}
          매수 <span className="text-ink font-semibold">{diaries.filter(d=>d.type==='buy').length}건</span>{' '}·{' '}
          매도 <span className="text-ink font-semibold">{sells.length}건</span>{' '}·{' '}
          감정 <span className="text-ink font-semibold">{diaries.filter(d=>d.type==='feel').length}건</span>
        </p>
        <div className="flex items-end gap-1.5 h-16 mb-1.5">
          {emoCnts.map((n, i) => (
            <div key={i} className={`flex-1 rounded-t-md opacity-75 ${emoColors[i]}`} style={{ height: `${Math.max(n/maxE*100, 8)}%` }} />
          ))}
        </div>
        <div className="flex">
          {['불안','평온','확신','모름'].map((l,i) => (
            <p key={i} className="flex-1 text-center text-[11px] text-muted">{l}</p>
          ))}
        </div>
      </div>

      <div className="bg-surface mb-2 px-5 py-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-green-50 flex items-center justify-center text-xl">💡</div>
          <p className="text-[15px] font-semibold text-ink">다음에 이렇게 해봐</p>
        </div>
        <p className="text-[14px] text-sub leading-relaxed">
          매도 버튼 전에{' '}
          <span className="text-ink font-semibold">"지금 이게 감정인가, 판단인가?"</span>{' '}
          한 번만 물어봐.<br/>투자 미러 알림이 그걸 대신 해줄 거야.
        </p>
      </div>
    </div>
  )
}
