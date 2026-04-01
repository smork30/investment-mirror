export type DiaryType = 'buy' | 'sell' | 'feel'
export type DiaryResult = 'pending' | 'win' | 'loss'

export interface Diary {
  id: string
  user_id: string
  type: DiaryType
  stock: string | null
  reason: string | null
  emotion: string | null
  date: string
  result: DiaryResult
  result_note: string | null
  created_at: string
}

export interface Stock {
  id: string
  user_id: string
  name: string
  ticker: string
  emoji: string
  shares: number
  buy_price: number
  current_price: number
  change_percent: number
  buy_reason: string | null
}

export interface AlertContext {
  stock: string
  change: string
  reason: string
  pastPattern?: string
}
