import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '투자 미러',
  description: '내가 왜 틀렸는지 알려주는 유일한 앱',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg">
        <div className="mx-auto max-w-[430px] min-h-screen bg-bg relative">
          {children}
        </div>
      </body>
    </html>
  )
}
