import { create } from 'zustand'
import { Diary, Stock } from '@/types'

interface MirrorStore {
  userId: string | null
  diaries: Diary[]
  stocks: Stock[]
  isLoading: boolean

  setUserId: (id: string) => void
  setDiaries: (d: Diary[]) => void
  setStocks: (s: Stock[]) => void
  addDiary: (d: Diary) => void
  setLoading: (v: boolean) => void
}

export const useMirrorStore = create<MirrorStore>((set) => ({
  userId: null,
  diaries: [],
  stocks: [],
  isLoading: false,

  setUserId: (id) => set({ userId: id }),
  setDiaries: (diaries) => set({ diaries }),
  setStocks: (stocks) => set({ stocks }),
  addDiary: (d) => set((s) => ({ diaries: [d, ...s.diaries] })),
  setLoading: (isLoading) => set({ isLoading }),
}))
