'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Diary, Stock } from '@/types'
import AlertSheet from '@/components/ui/AlertSheet'
import RecordSheet from '@/components/ui/RecordSheet'
import { api } from '@/lib/api'

const DEMO_STOCKS: Stock[] = [
  { id:'s1', user_id:'demo', name:'삼성전자', ticker:'005930', emoji:'🇰🇷', shares:100, buy_price:68500, current_price:56300, change_percent:-17.8, buy_reason:'반도체 사이클 바닥이라서. HBM 기대.' },
  { id:'s2', user_id:'demo', name:'나스닥ETF', ticker:'QQQ', emoji:'🇺🇸', shares:50, buy_price:520, current_price:468, change_percent:-10.0, buy_reason:'AI 랠리 지속될 것 같아서.' },
  { id:'s3', user_id:'demo', name:'한화에어로', ticker:'012450', emoji:'🛡️', shares:20, buy_price:795000, current_price:824000, change_percent:3.6, buy_reason:'방산 수주잔고 55조, 수혜 지속.' },
]

export default function HomeTab({ userId, stocks: propStocks, diaries, onAddDiary, onRefresh }: {
  userId: string; stocks: Stock[]; diaries: Diary[]; onAddDiary: (d: Partial<Diary>) => void; onRefresh: () => void
}) {
  const stocks = propStocks.length > 0 ? propStocks : DEMO_STOCKS
  const [alertData, setAlertData] = useState<null | { stock: string; change: string; reason: string }>(null)
  const [alertContent, setAlertContent] = useState<null | { quote: string; author: string; message: string }>(null)
  const [alertLoading, setAlertLoading] = useState(false)
  const [recordOpen, setRecordOpen] = useState(false)

  const total = stocks.reduce((a, s) => a + s.current_price * s.shares, 0)
  const totalBuy = stocks.reduce((a, s) => a + s.buy_price * s.shares, 0)
  const totalChg = totalBuy > 0 ? ((total - totalBuy) / totalBuy * 100) : 0

  async function openAlert(stock: Stock) {
    setAlertData({ stock: stock.name, change: `${stock.change_percent > 0 ? '+' : ''}${stock.change_percent.toFixed(1)}%`, reason: stock.buy_reason || '' })
    setAlertLoading(true)
    try {
      const content = await api.getAlert(userId, {
        stock: stock.name,
        change: `${stock.change_percent.toFixed(1)}%`,
        buyReason: stock.buy_reason || '',
      })
      setAlertContent(content)
    } catch {
      setAlertContent({
        quote: "시장이 패닉에 빠질 때 탐욕스러워라.",
        author: "워렌 버핏",
        message: "지금 이 판단이 감정인지 확인해봐. 매수 이유가 바뀌었어?"
      })
    }
    setAlertLoading(false)
  }

  async function onSellConfirm(reason: string) {
    if (!alertData) return
    await onAddDiary({ type: 'sell', stock: alertData.stock, reason, result: 'pending' })
    setAlertData(null)
    setAlertContent(null)
  }

  return (
    <div className="pb-6">
      {/* 포트폴리오 히어로 */}
      <div className="bg-surface px-5 pt-6 pb-5 mb-2">
        <p className="text-muted text-[13px] mb-2">총 자산</p>
        <p className="text-[32px] font-bold text-ink tracking-tighter mb-2">
          {Math.round(total).toLocaleString('ko-KR')}원
        </p>
        <div className="flex items-center gap-2">
          <span className={`text-[13px] font-medium px-2.5 py-1 rounded-md ${totalChg >= 0 ? 'bg-success-dim text-success' : 'bg-danger-dim text-danger'}`}>
            {totalChg >= 0 ? '▲' : '▼'} {Math.abs(totalChg).toFixed(1)}%
          </span>
          <span className="text-muted text-[13px]">오늘</span>
        </div>
      </div>

      {/* 뉴스 영향 */}
      <div className="bg-surface mx-0 mb-2 px-5 py-4 cursor-pointer active:bg-bg transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse" />
          <span className="text-danger text-[11px] font-semibold tracking-wide uppercase">오늘 영향</span>
        </div>
        <p className="text-[14px] font-semibold text-ink mb-1">미-이란 전쟁 3일째 — 호르무즈 긴장</p>
        <p className="text-[13px] text-sub">내 주식 영향: <span className="text-danger font-medium">삼성전자 -18.3% · 나스닥ETF -12.1%</span></p>
      </div>

      {/* 매도 전 확인 */}
      <div className="bg-surface mb-2">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
          <div className="w-9 h-9 rounded-[10px] bg-primary-dim flex items-center justify-center text-lg flex-shrink-0">🪞</div>
          <div>
            <p className="text-[14px] font-semibold text-ink">매도 전에 한 번만 확인해봐</p>
            <p className="text-[12px] text-muted">종목 탭하면 AI가 과거 패턴 분석해줘</p>
          </div>
        </div>
        <div className="flex divide-x divide-line">
          {stocks.filter(s => s.change_percent < 0).slice(0, 2).map(s => (
            <button key={s.id} onClick={() => openAlert(s)} className="flex-1 py-3 px-3 flex flex-col items-center gap-1 active:bg-bg transition-colors">
              <span className="text-[13px] font-semibold text-danger">{s.name}</span>
              <span className="text-[12px] text-danger">{s.change_percent.toFixed(1)}%</span>
              <span className="text-[11px] text-muted">확인하기</span>
            </button>
          ))}
          {stocks.filter(s => s.change_percent >= 0).slice(0, 1).map(s => (
            <button key={s.id} className="flex-1 py-3 px-3 flex flex-col items-center gap-1">
              <span className="text-[13px] font-semibold text-success">{s.name}</span>
              <span className="text-[12px] text-success">+{s.change_percent.toFixed(1)}%</span>
              <span className="text-[11px] text-muted">보유 중</span>
            </button>
          ))}
        </div>
      </div>

      {/* 보유 종목 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="text-[15px] font-semibold text-ink">보유 종목</span>
        <span className="text-[13px] text-primary">전체보기</span>
      </div>
      <div className="bg-surface mb-2">
        {stocks.map((s, i) => (
          <button key={s.id} onClick={() => s.change_percent < 0 && openAlert(s)} className={`w-full flex items-center gap-3.5 px-5 py-4 active:bg-bg transition-colors ${i > 0 ? 'border-t border-line' : ''}`}>
            <div className="w-10 h-10 rounded-[12px] bg-bg flex items-center justify-center text-xl flex-shrink-0">{s.emoji}</div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[14px] font-semibold text-ink truncate">{s.name}</p>
              <p className="text-[12px] text-muted">{s.shares}주 · {s.ticker}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[14px] font-semibold text-ink">{s.current_price.toLocaleString()}</p>
              <span className={`text-[12px] font-medium px-2 py-0.5 rounded ${s.change_percent >= 0 ? 'bg-success-dim text-success' : 'bg-danger-dim text-danger'}`}>
                {s.change_percent >= 0 ? '+' : ''}{s.change_percent.toFixed(1)}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 기록 버튼 */}
      <div className="px-5">
        <button onClick={() => setRecordOpen(true)} className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-[15px] active:bg-blue-600 transition-colors">
          오늘의 판단 기록하기
        </button>
      </div>

      {/* Alert Sheet */}
      <AlertSheet
        open={!!alertData}
        loading={alertLoading}
        alertData={alertData}
        alertContent={alertContent}
        onConfirm={onSellConfirm}
        onCancel={() => { setAlertData(null); setAlertContent(null) }}
      />

      {/* Record Sheet */}
      <RecordSheet open={recordOpen} stocks={stocks} onSave={onAddDiary} onClose={() => setRecordOpen(false)} />
    </div>
  )
}
