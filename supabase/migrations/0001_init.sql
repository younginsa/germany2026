-- ============================================================
-- 독일 2026 여행 워크스페이스 — 초기 스키마
--
-- 각 도메인 엔티티는 { id, trip_id, payload(jsonb) } 구조로 저장됩니다.
-- payload는 앱의 TypeScript 타입(lib/types.ts)과 1:1 직렬화되며,
-- 자주 조회되는 키는 생성 컬럼 + 인덱스로 확장할 수 있습니다.
-- 모든 테이블은 RLS로 보호되며, 여행 멤버(profiles.user_id)만 접근 가능합니다.
-- ============================================================

-- ─── 테이블 ─────────────────────────────────────────────────

create table if not exists public.trips (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 사용자 계정 ↔ 프로필 연결 (Supabase Auth)
create table if not exists public.trip_members (
  user_id uuid references auth.users(id) on delete cascade,
  trip_id text references public.trips(id) on delete cascade,
  profile_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, trip_id)
);

do $$
declare
  t text;
begin
  foreach t in array array[
    'families', 'profiles', 'itinerary_days', 'comments',
    'checklist_groups', 'checklist_items', 'places', 'posts',
    'documents', 'notifications', 'activity_logs'
  ] loop
    execute format($f$
      create table if not exists public.%I (
        id text primary key,
        trip_id text not null references public.trips(id) on delete cascade,
        payload jsonb not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    $f$, t);
    execute format('create index if not exists %I on public.%I (trip_id)', t || '_trip_idx', t);
  end loop;
end $$;

-- ─── updated_at 자동 갱신 ───────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'trips', 'families', 'profiles', 'itinerary_days', 'comments',
    'checklist_groups', 'checklist_items', 'places', 'posts',
    'documents', 'notifications', 'activity_logs'
  ] loop
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',
      t || '_touch', t
    );
  end loop;
end $$;

-- ─── RLS ────────────────────────────────────────────────────

create or replace function public.is_trip_member(p_trip_id text)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.trip_members m
    where m.trip_id = p_trip_id and m.user_id = auth.uid()
  );
$$;

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;

drop policy if exists "trips: 멤버 읽기" on public.trips;
create policy "trips: 멤버 읽기" on public.trips
  for select using (public.is_trip_member(id));

drop policy if exists "trips: 멤버 쓰기" on public.trips;
create policy "trips: 멤버 쓰기" on public.trips
  for all using (public.is_trip_member(id)) with check (public.is_trip_member(id));

-- 최초 시드를 위해: 여행이 하나도 없으면 로그인 사용자가 생성 가능
drop policy if exists "trips: 최초 생성" on public.trips;
create policy "trips: 최초 생성" on public.trips
  for insert with check (auth.uid() is not null);

drop policy if exists "members: 본인 행 읽기" on public.trip_members;
create policy "members: 본인 행 읽기" on public.trip_members
  for select using (user_id = auth.uid());

drop policy if exists "members: 본인 등록" on public.trip_members;
create policy "members: 본인 등록" on public.trip_members
  for insert with check (user_id = auth.uid());

do $$
declare
  t text;
begin
  foreach t in array array[
    'families', 'profiles', 'itinerary_days', 'comments',
    'checklist_groups', 'checklist_items', 'places', 'posts',
    'documents', 'notifications', 'activity_logs'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "멤버 접근" on public.%I', t);
    execute format($f$
      create policy "멤버 접근" on public.%I
        for all
        using (public.is_trip_member(trip_id))
        with check (public.is_trip_member(trip_id))
    $f$, t);
  end loop;
end $$;

-- ─── Realtime ───────────────────────────────────────────────

do $$
declare
  t text;
begin
  foreach t in array array[
    'trips', 'families', 'profiles', 'itinerary_days', 'comments',
    'checklist_groups', 'checklist_items', 'places', 'posts',
    'documents', 'notifications', 'activity_logs'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then
      null;
    end;
  end loop;
end $$;

-- ─── Storage 버킷 (문서/보드 이미지) ─────────────────────────

insert into storage.buckets (id, name, public)
values ('trip-files', 'trip-files', false)
on conflict (id) do nothing;

drop policy if exists "trip-files: 인증 사용자 읽기" on storage.objects;
create policy "trip-files: 인증 사용자 읽기" on storage.objects
  for select using (bucket_id = 'trip-files' and auth.uid() is not null);

drop policy if exists "trip-files: 인증 사용자 업로드" on storage.objects;
create policy "trip-files: 인증 사용자 업로드" on storage.objects
  for insert with check (bucket_id = 'trip-files' and auth.uid() is not null);

drop policy if exists "trip-files: 인증 사용자 삭제" on storage.objects;
create policy "trip-files: 인증 사용자 삭제" on storage.objects
  for delete using (bucket_id = 'trip-files' and auth.uid() is not null);
