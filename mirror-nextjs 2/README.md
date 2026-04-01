# 투자 미러 — Next.js 풀스택 서비스

## 지금 바로 실행하는 법

### 1단계 — .env.local 파일 수정
```
NEXT_PUBLIC_SUPABASE_URL=https://dsbrsjqrpipsdpheiwdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_Supabase_anon_key_붙여넣기
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_key_붙여넣기
ANTHROPIC_API_KEY=여기에_새로만든_Claude_API_키_붙여넣기
```

Supabase 키 위치:
→ https://supabase.com/dashboard/project/dsbrsjqrpipsdpheiwdn/settings/api-keys

### 2단계 — Supabase DB 스키마 실행
→ https://supabase.com/dashboard/project/dsbrsjqrpipsdpheiwdn/sql/new
→ supabase_schema.sql 파일 내용 복사해서 붙여넣고 Run

### 3단계 — 로컬 실행
```bash
cd mirror-nextjs
npm install
npm run dev
```
→ http://localhost:3000 에서 확인

### 4단계 — Vercel 배포
```bash
npm install -g vercel
vercel login   # shuna3300@gmail.com 으로 로그인
vercel --prod
```
환경변수 설정할 때 .env.local 내용 그대로 입력

---

## 완성된 기능
- 홈: 포트폴리오 현황 + 뉴스 영향
- 매도 전 알림: Claude AI가 과거 패턴 분석 + 명언
- 투자 일기: 매수/매도/감정 기록 (DB 저장)
- 패턴 분석: 3개 이상 기록시 활성화

## 파일 구조
```
src/
  app/
    page.tsx              # 메인 진입점
    api/
      diary/route.ts      # 일기 CRUD API
      stocks/route.ts     # 종목 API
      alert/route.ts      # Claude AI 알림 생성 API
  components/
    layout/
      MainApp.tsx         # 탭 네비게이션
      LoginScreen.tsx     # 로그인 화면
    tabs/
      HomeTab.tsx         # 홈 탭
      DiaryTab.tsx        # 일기 탭
      PatternTab.tsx      # 패턴 탭
    ui/
      AlertSheet.tsx      # 매도 전 알림 (핵심 기능)
      RecordSheet.tsx     # 기록 입력 모달
  lib/
    supabase.ts           # DB 연결
    claude.ts             # AI 알림 생성
    api.ts                # API 호출 함수
    store.ts              # Zustand 상태관리
```
