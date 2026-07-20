# 독일 가족여행 2026

2026년 12월 18일부터 27일까지 두 가족이 함께 떠나는 독일 겨울여행 일정 웹사이트입니다.

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- React 19
- CSS (모바일 우선 반응형)
- localStorage 기반 가족별 체크리스트

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증

```bash
npm run typecheck
npm run build
```

## Vercel 배포

1. Vercel에 로그인합니다.
2. **Add New → Project**를 선택합니다.
3. GitHub의 `younginsa/germany2026` 저장소를 Import합니다.
4. Framework Preset이 **Next.js**인지 확인합니다.
5. 별도 환경변수 없이 **Deploy**를 누릅니다.

이후 `main` 브랜치에 변경사항이 병합될 때마다 Vercel이 자동으로 재배포합니다.

## 체크리스트 저장 방식

가족 A와 가족 B의 체크 상태는 브라우저 `localStorage`의 `germany2026-checklist` 키에 저장됩니다. 계정 동기화 방식이 아니므로 다른 기기나 다른 브라우저에는 자동으로 공유되지 않습니다.

## 여행 정보 주의

크리스마스마켓 운영시간, 공휴일 영업, 렌터카 장비 및 보험 조건은 변경될 수 있습니다. 출발 직전에 공식 사이트와 예약처에서 다시 확인하세요.
