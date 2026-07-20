"use client";

import type { AppData, EntityKey, EntityOf, Trip } from "@/lib/types";
import { seedData, DEMO_CURRENT_USER_ID } from "@/lib/data/seed";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * TripStore — 앱 전체의 단일 데이터 엔진.
 *
 * · 데모 모드: localStorage 영속 + storage 이벤트로 탭 간 실시간 동기화
 * · Supabase 모드: 초기 로드 → 테이블 하이드레이션, 변경 시 upsert/delete,
 *   postgres_changes 실시간 구독으로 다른 사용자의 변경 반영
 *
 * 각 테이블은 { id, trip_id, payload(jsonb) } 구조로 저장되어
 * 도메인 타입과 1:1 로 직렬화됩니다. (supabase/migrations 참고)
 */

const LS_KEY = "germany2026:data:v1";
const LS_USER_KEY = "germany2026:user";

const TABLE_OF: Record<EntityKey, string> = {
  families: "families",
  profiles: "profiles",
  itineraryDays: "itinerary_days",
  comments: "comments",
  checklistGroups: "checklist_groups",
  checklistItems: "checklist_items",
  places: "places",
  posts: "posts",
  documents: "documents",
  notifications: "notifications",
  activityLogs: "activity_logs",
};

const ENTITY_OF_TABLE: Record<string, EntityKey> = Object.fromEntries(
  Object.entries(TABLE_OF).map(([k, v]) => [v, k as EntityKey])
) as Record<string, EntityKey>;

type Listener = () => void;

function deepClone<T>(v: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

class TripStore {
  private data: AppData = seedData;
  private listeners = new Set<Listener>();
  private loaded = false;
  private currentUserId: string = DEMO_CURRENT_USER_ID;

  /* ─── 구독 (useSyncExternalStore 용) ─────────────── */

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): AppData => this.data;
  getServerSnapshot = (): AppData => seedData;

  getCurrentUserId = () => this.currentUserId;

  private emit() {
    this.data = { ...this.data };
    this.listeners.forEach((l) => l());
  }

  /* ─── 초기화 ─────────────────────────────────────── */

  /** 클라이언트 마운트 후 1회 호출 — 하이드레이션 미스매치를 피하기 위해 effect에서 실행 */
  init() {
    if (this.loaded || typeof window === "undefined") return;
    this.loaded = true;

    const savedUser = window.localStorage.getItem(LS_USER_KEY);
    if (savedUser) this.currentUserId = savedUser;

    if (isSupabaseConfigured) {
      void this.hydrateFromSupabase();
      this.subscribeRealtime();
    } else {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          this.data = { ...seedData, ...(JSON.parse(raw) as AppData) };
        } catch {
          this.data = deepClone(seedData);
        }
      } else {
        this.data = deepClone(seedData);
        this.persistLocal();
      }
      // 탭 간 실시간 동기화 (데모 모드의 "realtime")
      window.addEventListener("storage", (e) => {
        if (e.key === LS_KEY && e.newValue) {
          try {
            this.data = JSON.parse(e.newValue) as AppData;
            this.emit();
          } catch {
            /* noop */
          }
        }
      });
    }
    this.emit();
  }

  setCurrentUser(id: string) {
    this.currentUserId = id;
    if (typeof window !== "undefined") window.localStorage.setItem(LS_USER_KEY, id);
    this.emit();
  }

  private persistLocal() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(this.data));
    } catch {
      /* 용량 초과 등은 무시 (메모리 상태는 유지) */
    }
  }

  /* ─── Supabase 동기화 ────────────────────────────── */

  private async hydrateFromSupabase() {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;

    const { data: tripRows } = await sb.from("trips").select("id, payload").limit(1);
    if (!tripRows || tripRows.length === 0) {
      // 빈 프로젝트 → 시드 데이터 업로드
      await this.seedSupabase();
      return;
    }
    const next: AppData = { ...deepClone(seedData), trip: tripRows[0].payload as Trip };
    await Promise.all(
      (Object.keys(TABLE_OF) as EntityKey[]).map(async (key) => {
        const { data: rows } = await sb.from(TABLE_OF[key]).select("payload");
        if (rows) {
          (next[key] as unknown[]) = rows.map((r) => r.payload);
        }
      })
    );
    this.data = next;
    this.emit();
  }

  private async seedSupabase() {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    const tripId = seedData.trip.id;
    await sb.from("trips").upsert({ id: tripId, payload: seedData.trip });
    for (const key of Object.keys(TABLE_OF) as EntityKey[]) {
      const rows = (seedData[key] as { id: string }[]).map((row) => ({
        id: row.id,
        trip_id: tripId,
        payload: row,
      }));
      if (rows.length) await sb.from(TABLE_OF[key]).upsert(rows);
    }
    this.data = deepClone(seedData);
    this.emit();
  }

  private subscribeRealtime() {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    sb.channel("trip-realtime")
      .on("postgres_changes", { event: "*", schema: "public" }, (change) => {
        const entity = ENTITY_OF_TABLE[change.table];
        if (change.table === "trips") {
          const payload = (change.new as { payload?: Trip })?.payload;
          if (payload) {
            this.data = { ...this.data, trip: payload };
            this.emit();
          }
          return;
        }
        if (!entity) return;
        if (change.eventType === "DELETE") {
          const oldId = (change.old as { id?: string })?.id;
          if (!oldId) return;
          (this.data[entity] as { id: string }[]) = (
            this.data[entity] as { id: string }[]
          ).filter((r) => r.id !== oldId);
        } else {
          const payload = (change.new as { payload?: { id: string } })?.payload;
          if (!payload) return;
          const list = this.data[entity] as { id: string }[];
          const idx = list.findIndex((r) => r.id === payload.id);
          if (idx >= 0) list[idx] = payload;
          else list.push(payload);
          (this.data[entity] as { id: string }[]) = [...list];
        }
        this.emit();
      })
      .subscribe();
  }

  /* ─── 변경 API ───────────────────────────────────── */

  setTrip(trip: Trip) {
    this.data = { ...this.data, trip };
    this.afterChange();
    const sb = getSupabaseBrowserClient();
    if (sb) void sb.from("trips").upsert({ id: trip.id, payload: trip });
  }

  upsertRow<K extends EntityKey>(entity: K, row: EntityOf[K]) {
    const list = this.data[entity] as { id: string }[];
    const idx = list.findIndex((r) => r.id === row.id);
    const next = [...list];
    if (idx >= 0) next[idx] = row;
    else next.push(row);
    (this.data[entity] as unknown[]) = next;
    this.afterChange();
    const sb = getSupabaseBrowserClient();
    if (sb)
      void sb
        .from(TABLE_OF[entity])
        .upsert({ id: row.id, trip_id: this.data.trip.id, payload: row });
  }

  deleteRow(entity: EntityKey, id: string) {
    (this.data[entity] as { id: string }[]) = (
      this.data[entity] as { id: string }[]
    ).filter((r) => r.id !== id);
    this.afterChange();
    const sb = getSupabaseBrowserClient();
    if (sb) void sb.from(TABLE_OF[entity]).delete().eq("id", id);
  }

  /** 여러 행을 한 번에 교체 (재정렬 등) */
  replaceAll<K extends EntityKey>(entity: K, rows: EntityOf[K][]) {
    (this.data[entity] as unknown[]) = rows;
    this.afterChange();
    const sb = getSupabaseBrowserClient();
    if (sb) {
      const payload = rows.map((row) => ({
        id: (row as { id: string }).id,
        trip_id: this.data.trip.id,
        payload: row,
      }));
      void sb.from(TABLE_OF[entity]).upsert(payload);
    }
  }

  /** 전체 데이터 교체 (가져오기/초기화) */
  importAll(data: AppData) {
    this.data = deepClone(data);
    this.afterChange();
    if (isSupabaseConfigured) void this.seedSupabase();
  }

  resetToSeed() {
    this.importAll(seedData);
  }

  private afterChange() {
    if (!isSupabaseConfigured) this.persistLocal();
    this.emit();
  }
}

export const tripStore = new TripStore();

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
