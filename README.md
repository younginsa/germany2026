# 🎄 독일 2026 — 여행 워크스페이스

두 가족이 함께 만드는 독일 크리스마스 마켓 여행 계획 웹앱.
단순한 일정표가 아니라 **일정 · 인라인 댓글 · 체크리스트 · 지도 · 아이디어 보드 · 문서함**을 갖춘 협업 워크스페이스입니다.

모든 UI는 한국어이며, Linear/Notion 수준의 디자인 품질을 목표로 합니다.

## 기술 스택

- **Next.js 15** (App Router) + TypeScript (strict)
- **TailwindCSS v4** + shadcn/ui 스타일 컴포넌트 + Framer Motion
- **Supabase** — Auth(매직 링크) · Realtime · Storage · Postgres(RLS)
- **Google Maps** (`@vis.gl/react-google-maps`)
- **React Query** / `useSyncExternalStore` 기반 동기화 엔진
- Vercel 배포

## 빠른 시작 (데모 모드)

환경변수 없이 바로 실행됩니다. 데이터는 `localStorage`에 저장되고,
탭 간 실시간 동기화까지 동작합니다.

```bash
npm install
npm run dev
```

http://localhost:3000 접속 → 로그인 화면에서 프로필 선택 → 시작.

> 데모 모드에서는 우측 상단 아바타 메뉴로 사용자를 전환하며
> 여러 가족 구성원의 협업 흐름을 시험해볼 수 있습니다.

## Supabase 연결 (실서비스 모드)

1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/0001_init.sql` 실행
   (테이블 + RLS + Realtime + Storage 버킷 `trip-files` 생성)
3. `.env.local` 작성:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. Authentication → URL Configuration에서 Site URL / Redirect URL 등록
   (`http://localhost:3000`, 배포 도메인)

환경변수가 감지되면 앱이 자동으로 전환됩니다:
이메일 매직 링크 로그인 → 첫 로그인 시 시드 데이터 업로드 → 이후 모든 변경이
Postgres에 저장되고 `postgres_changes` 실시간 구독으로 모든 멤버에게 반영됩니다.

### 저장 구조

각 도메인 테이블은 `{ id, trip_id, payload(jsonb) }` 구조로,
`payload`는 `lib/types.ts`의 TypeScript 타입과 1:1 직렬화됩니다.
자주 조회하는 키가 생기면 생성 컬럼 + 인덱스로 확장하세요.
모든 테이블은 `trip_members` 기반 RLS로 보호됩니다.

## Google Maps 연결

1. Google Cloud Console에서 **Maps JavaScript API**와 **Places API** 활성화
2. `.env.local`에 추가:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=       # 선택 — 커스텀 마커(AdvancedMarker)용
```

키가 없으면 지도 페이지는 프리뷰 모드로 동작합니다 (장소 목록·추가는 그대로 사용 가능).

## Vercel 배포

```bash
vercel
```

또는 GitHub 저장소를 Vercel에 연결하고 환경변수 3개를 추가하면 끝입니다.

## 폴더 구조

```
app/
  (main)/            # 내비게이션이 있는 메인 앱
    page.tsx         # 홈 대시보드
    itinerary/       # 일정 + 인라인 댓글
    map/             # 지도
    checklist/       # 체크리스트 매트릭스
    board/           # 아이디어 보드 (메이슨리)
    documents/       # 문서함
    settings/        # 설정
  login/             # 매직 링크 / 데모 프로필 로그인
  auth/callback/     # Supabase 인증 콜백
components/
  ui/                # shadcn 스타일 프리미티브
  layout/            # 내비게이션 · 알림 · 전역 검색
  home|itinerary|checklist|map|board|documents/
hooks/
  use-app-data.ts    # 데이터 훅 (실시간 반영)
lib/
  types.ts           # 도메인 타입 (스키마와 1:1)
  data/              # 시드 데이터 + 동기화 스토어
  supabase/          # 클라이언트 (browser/server)
supabase/
  migrations/        # 스키마 + RLS + Realtime + Storage
```

## 아키텍처 노트

- **동기화 엔진** (`lib/data/store.ts`): 단일 스토어가 데모(localStorage + storage
  이벤트)와 Supabase(하이드레이션 + upsert + postgres_changes)를 같은 API로 제공
  → 기능 코드는 백엔드를 모릅니다.
- **인라인 댓글**: 텍스트 오프셋 기반 앵커(`CommentAnchor`)로 저장, 텍스트가 수정되면
  `selectedText` 재탐색으로 방어적 복구.
- **확장 준비**: 경비 정산, 항공편 현황, AI 어시스턴트, 오프라인 모드, 사진 타임라인
  등은 엔티티 추가(`lib/types.ts` + 마이그레이션 + 훅)만으로 확장 가능한 구조입니다.
