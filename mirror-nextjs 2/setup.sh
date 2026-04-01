#!/bin/bash
echo "======================================"
echo "  투자 미러 — 배포 세팅 스크립트"
echo "======================================"
echo ""

# 1. 의존성 설치
echo "[1/4] 패키지 설치 중..."
npm install

# 2. .env.local 확인
echo ""
echo "[2/4] 환경변수 확인..."
if [ ! -f .env.local ]; then
  echo "ERROR: .env.local 파일이 없습니다"
  exit 1
fi
echo ".env.local 확인됨"

# 3. 빌드 테스트
echo ""
echo "[3/4] 빌드 테스트..."
npm run build

# 4. 완료
echo ""
echo "[4/4] 완료!"
echo ""
echo "======================================"
echo "다음 단계:"
echo "1. Vercel 배포: npx vercel --prod"
echo "2. 로컬 실행: npm run dev"
echo "======================================"
