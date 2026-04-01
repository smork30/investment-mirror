// 클라이언트에서 API 호출하는 함수들

const getHeaders = (userId: string) => ({
  'Content-Type': 'application/json',
  'x-user-id': userId,
})

export const api = {
  async getDiaries(userId: string) {
    const res = await fetch('/api/diary', { headers: getHeaders(userId) })
    return res.json()
  },
  async saveDiary(userId: string, data: object) {
    const res = await fetch('/api/diary', {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    })
    return res.json()
  },
  async getStocks(userId: string) {
    const res = await fetch('/api/stocks', { headers: getHeaders(userId) })
    return res.json()
  },
  async getAlert(userId: string, data: object) {
    const res = await fetch('/api/alert', {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    })
    return res.json()
  },
}
