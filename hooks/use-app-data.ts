"use client";

import { useEffect, useSyncExternalStore } from "react";
import { tripStore, newId } from "@/lib/data/store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  AppData,
  AppNotification,
  NotificationType,
  Profile,
} from "@/lib/types";

/** 스토어 초기화 — Providers 안에서 1회 호출 */
export function useStoreInit() {
  useEffect(() => {
    tripStore.init();
  }, []);
}

/** 전체 앱 데이터 (실시간 반영) */
export function useAppData(): AppData {
  return useSyncExternalStore(
    tripStore.subscribe,
    tripStore.getSnapshot,
    tripStore.getServerSnapshot
  );
}


export function useTrip() {
  return useAppData().trip;
}

export function useProfiles() {
  return useAppData().profiles;
}

export function useItineraryDays() {
  const days = useAppData().itineraryDays;
  return [...days].sort((a, b) => a.dayNumber - b.dayNumber);
}

export function useComments() {
  return useAppData().comments;
}

export function useChecklistGroups() {
  const groups = useAppData().checklistGroups;
  return [...groups].sort((a, b) => a.order - b.order);
}

export function useChecklistItems() {
  const items = useAppData().checklistItems;
  return [...items].sort((a, b) => a.order - b.order);
}

export function usePlaces() {
  return useAppData().places;
}

export function usePosts() {
  const posts = useAppData().posts;
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function useDocuments() {
  const docs = useAppData().documents;
  return [...docs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function useNotifications() {
  const list = useAppData().notifications;
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** 프로필이 아직 준비되지 않은 짧은 순간에 쓰는 플레이스홀더 */
const PENDING_PROFILE: Profile = { id: "p-pending", name: "나" };

/** 현재 로그인한 사용자 프로필 (로그인 직후 생성 전에는 플레이스홀더) */
export function useCurrentUser(): Profile {
  const data = useAppData();
  const id = useSyncExternalStore(
    tripStore.subscribe,
    tripStore.getCurrentUserId,
    tripStore.getCurrentUserId
  );
  return data.profiles.find((p) => p.id === id) ?? data.profiles[0] ?? PENDING_PROFILE;
}

export function useIsDemo() {
  return !isSupabaseConfigured;
}

/** 프로필 id → 프로필 조회 유틸 */
export function useProfileById() {
  const data = useAppData();
  return (id: string) => data.profiles.find((p) => p.id === id);
}

/** 알림 발행 헬퍼 — 각 기능에서 변경 시 호출 */
export function pushNotification(input: {
  type: NotificationType;
  actorId: string;
  message: string;
  href: string;
}) {
  const notification: AppNotification = {
    id: newId("n"),
    tripId: tripStore.getSnapshot().trip.id,
    createdAt: new Date().toISOString(),
    readBy: [input.actorId],
    ...input,
  };
  tripStore.upsertRow("notifications", notification);
}

export { tripStore, newId };
