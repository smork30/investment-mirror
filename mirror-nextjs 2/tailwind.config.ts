import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f2f4f6',
        surface: '#ffffff',
        ink: '#191f28',
        ink2: '#333d4b',
        sub: '#4e5968',
        muted: '#8b95a1',
        line: '#e5e8eb',
        primary: '#3182f6',
        'primary-dim': 'rgba(49,130,246,0.08)',
        danger: '#f04452',
        'danger-dim': 'rgba(240,68,82,0.06)',
        success: '#00b493',
        'success-dim': 'rgba(0,180,147,0.06)',
        warning: '#ff9500',
      },
      fontFamily: { sans: ['Noto Sans KR', 'sans-serif'] },
      borderRadius: { xl: '16px', '2xl': '20px' },
    },
  },
  plugins: [],
}
export default config
