-- ============================================================
-- 0002 — 계정 ↔ 프로필 연결
--
-- 로그인 사용자가 자신의 trip_members 행에 profile_id를 기록할 수
-- 있도록 update 정책을 추가합니다. (0001에는 select/insert만 있었음)
-- 마지막 update는 기존 자동 연결을 해제해, 다음 로그인 시
-- 프로필 선택 화면이 표시되도록 합니다.
-- ============================================================

drop policy if exists "members: 본인 수정" on public.trip_members;
create policy "members: 본인 수정" on public.trip_members
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

update public.trip_members set profile_id = null;
