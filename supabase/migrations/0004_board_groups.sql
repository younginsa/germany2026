-- ============================================================
-- 0004 — 자료 그룹 (보드 + 문서 통합)
--
-- 보드와 문서를 하나의 "자료" 탭으로 합치면서, 주제별로 카드와
-- 파일을 묶는 board_groups 테이블을 추가합니다.
-- 카드/파일의 소속은 payload.groupId 로 저장됩니다 (컬럼 변경 없음).
-- ============================================================

create table if not exists public.board_groups (
  id text primary key,
  trip_id text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists board_groups_touch on public.board_groups;
create trigger board_groups_touch
  before update on public.board_groups
  for each row execute function public.touch_updated_at();

alter table public.board_groups enable row level security;

drop policy if exists "멤버 접근" on public.board_groups;
create policy "멤버 접근" on public.board_groups
  for all
  using (public.is_trip_member(trip_id))
  with check (public.is_trip_member(trip_id));

do $$
begin
  alter publication supabase_realtime add table public.board_groups;
exception when duplicate_object then
  null;
end $$;
