import Anthropic from '@anthropic-ai/sdk'
import { Diary } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function generateAlert({
  stock, change, buyReason, pastDiaries
}: {
  stock: string
  change: string
  buyReason: string
  pastDiaries: Diary[]
}): Promise<{ quote: string; author: string; message: string }> {

  const panicSells = pastDiaries
    .filter(d => d.type === 'sell' && d.reason?.includes('무서'))
    .length
  const totalSells = pastDiaries.filter(d => d.type === 'sell').length
  const panicRatio = totalSells > 0 ? Math.round(panicSells / totalSells * 100) : 0

  const prompt = `
당신은 투자자의 감정적 판단을 막아주는 AI 투자 코치입니다.
차분하고 따뜻한 말투로, 판단을 강요하지 않고 생각할 기회만 줍니다.

현재 상황:
- 종목: ${stock}
- 오늘 변동: ${change}
- 매수 이유: "${buyReason}"
- 과거 패닉셀 비율: ${panicRatio}%

다음 JSON 형식으로만 응답하세요:
{
  "quote": "유명 투자자의 명언 (워렌버핏/피터린치/찰리멍거/하워드막스 중)",
  "author": "명언의 주인",
  "message": "2-3문장. 팔지 말라고 하지 말고, '지금 이 판단이 감정인지 확인해봐'는 뉘앙스로. 과거 패턴 ${panicRatio > 0 ? '언급' : '언급 안 함'}."
}
`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }]
  })

  try {
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return JSON.parse(text)
  } catch {
    return {
      quote: "시장이 패닉에 빠질 때 탐욕스러워라. 탐욕이 극에 달할 때 두려워하라.",
      author: "워렌 버핏",
      message: "잠깐. 지금 이 판단이 공포에서 나온 건 아닌지 한 번만 확인해봐. 매수 이유가 바뀌었어?"
    }
  }
}
