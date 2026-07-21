-- ============================================================
-- 0003 — 동행인 모델 전환에 따른 데이터 리셋
--
-- 사전 구성된 가족(섭섭이네/태오네) 모델을 제거하고, 로그인한
-- 사용자가 자동으로 멤버가 되는 모델로 전환합니다. 기존 시드
-- 데이터를 비워, 다음 로그인 시 새 시드(일정/장소만)로 다시
-- 채워지도록 합니다. families 테이블은 더 이상 사용하지 않습니다.
-- ============================================================

truncate table
  public.trips,
  public.families,
  public.profiles,
  public.itinerary_days,
  public.comments,
  public.checklist_groups,
  public.checklist_items,
  public.places,
  public.posts,
  public.documents,
  public.notifications,
  public.activity_logs;

update public.trip_members set profile_id = null;
