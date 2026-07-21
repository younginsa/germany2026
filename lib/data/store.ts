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

/** 새 멤버 아바타 hue 팔레트 */
const MEMBER_HUE_PALETTE = [275, 155, 30, 200, 330, 90, 250] as const;

class TripStore {
  private data: AppData = seedData;
  private listeners = new Set<Listener>();
  private loaded = false;
  private authReady = false;
  private realtimeReady = false;
  private authUserId: string | null = null;
  private currentUserId: string = DEMO_CURRENT_USER_ID;

  /* ─── 구독 (useSyncExternalStore 용) ─────────────── */

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): AppData => this.data;
  getServerSnapshot = (): AppData => seedData;

  getCurrentUserId = () => this.currentUserId;

  /** 사용 중이지 않은 아바타 hue 선택 */
  private nextHue(): number {
    const used = new Set(this.data.profiles.map((p) => p.hue));
    return (
      MEMBER_HUE_PALETTE.find((h) => !used.has(h)) ??
      MEMBER_HUE_PALETTE[this.data.profiles.length % MEMBER_HUE_PALETTE.length]
    );
  }

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
      void this.initSupabase();
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
      // 데모 모드: 게스트 프로필 보장 (가입 절차 없이 바로 사용)
      if (!this.data.profiles.some((p) => p.id === this.currentUserId)) {
        this.currentUserId = DEMO_CURRENT_USER_ID;
        if (!this.data.profiles.some((p) => p.id === DEMO_CURRENT_USER_ID)) {
          this.data = {
            ...this.data,
            profiles: [
              ...this.data.profiles,
              { id: DEMO_CURRENT_USER_ID, name: "나", isOwner: true, hue: 275 },
            ],
          };
          this.persistLocal();
        }
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
    // Supabase 모드: 계정 ↔ 프로필 연결을 서버에도 기록해 기기 간에 유지
    if (this.authUserId) {
      const sb = getSupabaseBrowserClient();
      if (sb) {
        void sb
          .from("trip_members")
          .update({ profile_id: id })
          .eq("user_id", this.authUserId)
          .eq("trip_id", this.data.trip.id);
      }
    }
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

  /**
   * Supabase 모드 부팅.
   * 로그인 세션이 있을 때만 데이터를 읽고 씁니다 — 로그인 전에는
   * RLS가 모든 요청을 거부하므로(401) 아무 것도 시도하지 않습니다.
   * 매직 링크 로그인 완료(onAuthStateChange) 시 자동으로 합류/하이드레이션합니다.
   */
  private async initSupabase() {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;

    sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) void this.onAuthenticated();
    });

    const {
      data: { session },
    } = await sb.auth.getSession();
    if (session?.user) void this.onAuthenticated();
  }

  /**
   * 로그인 사용자를 공유 여행의 멤버로 등록(합류)한 뒤 데이터를 가져옵니다.
   * 여행이 아직 없으면 최초 로그인 사용자가 트립+시드를 생성합니다.
   * (멤버 등록·최초 생성 모두 마이그레이션의 RLS 정책이 허용)
   */
  private async onAuthenticated() {
    if (this.authReady) return;
    this.authReady = true;

    const sb = getSupabaseBrowserClient();
    if (!sb) {
      this.authReady = false;
      return;
    }
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) {
      this.authReady = false;
      return;
    }

    const tripId = seedData.trip.id;

    // 트립 생성 시도 — 성공하면 "내가 첫 사용자"이므로 시드를 채웁니다.
    // 이미 있으면 유니크 충돌(23505)로 실패 → 시드하지 않고 하이드레이션.
    const { error: insErr } = await sb
      .from("trips")
      .insert({ id: tripId, payload: seedData.trip });
    const iCreatedTrip = !insErr;
    if (insErr && insErr.code !== "23505") {
      console.warn("[supabase] trip 생성 실패:", insErr.message);
    }

    // 공유 여행에 본인 등록 (멱등). FK 때문에 트립이 존재한 뒤에 실행.
    // profile_id는 아직 미정(null) — 프로필 선택 다이얼로그에서 연결합니다.
    await sb.from("trip_members").upsert(
      { user_id: user.id, trip_id: tripId, profile_id: null },
      { onConflict: "user_id,trip_id", ignoreDuplicates: true }
    );

    if (iCreatedTrip) {
      await this.seedChildTables(tripId);
      this.data = deepClone(seedData);
      this.emit();
    } else {
      await this.hydrateFromSupabase();
    }

    this.authUserId = user.id;
    await this.ensureProfile(user.id, tripId, {
      name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "여행자",
      email: user.email ?? "",
    });

    if (!this.realtimeReady) {
      this.realtimeReady = true;
      this.subscribeRealtime();
    }
  }

  /**
   * 로그인 계정의 프로필을 보장합니다.
   * 1) trip_members에 연결된 프로필이 있으면 그대로 사용
   * 2) 같은 이메일의 프로필이 있으면(설정에서 미리 추가된 동행인) 연결
   * 3) 없으면 Google 이름으로 새 프로필을 만들어 연결
   */
  private async ensureProfile(
    userId: string,
    tripId: string,
    google: { name: string; email: string }
  ) {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    const { data: rows } = await sb
      .from("trip_members")
      .select("profile_id")
      .eq("user_id", userId)
      .eq("trip_id", tripId)
      .limit(1);
    const linkedId = rows?.[0]?.profile_id as string | null | undefined;

    let profile =
      (linkedId && this.data.profiles.find((p) => p.id === linkedId)) ||
      (google.email && this.data.profiles.find((p) => p.email === google.email)) ||
      null;

    if (!profile) {
      profile = {
        id: newId("p"),
        name: google.name,
        email: google.email || undefined,
        isOwner: this.data.profiles.length === 0,
        hue: this.nextHue(),
      };
      this.upsertRow("profiles", profile);
    }
    // setCurrentUser가 trip_members.profile_id도 갱신합니다
    this.setCurrentUser(profile.id);
  }

  /** 모든 도메인 테이블을 읽어 메모리 상태로 반영 (트립은 이미 존재한다고 가정) */
  private async hydrateFromSupabase() {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;

    const { data: tripRows } = await sb.from("trips").select("payload").limit(1);
    const next: AppData = {
      ...deepClone(seedData),
      trip: (tripRows?.[0]?.payload as Trip) ?? seedData.trip,
    };
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

  /** 최초 생성자만 호출 — 시드의 자식 행들을 업로드 */
  private async seedChildTables(tripId: string) {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    for (const key of Object.keys(TABLE_OF) as EntityKey[]) {
      const rows = (seedData[key] as { id: string }[]).map((row) => ({
        id: row.id,
        trip_id: tripId,
        payload: row,
      }));
      if (rows.length) await sb.from(TABLE_OF[key]).upsert(rows);
    }
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
    if (isSupabaseConfigured) void this.uploadAll();
  }

  /** 현재 메모리 상태 전체를 Supabase에 업로드 (가져오기/초기화 시) */
  private async uploadAll() {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    const tripId = this.data.trip.id;
    await sb.from("trips").upsert({ id: tripId, payload: this.data.trip });
    for (const key of Object.keys(TABLE_OF) as EntityKey[]) {
      const rows = (this.data[key] as { id: string }[]).map((row) => ({
        id: row.id,
        trip_id: tripId,
        payload: row,
      }));
      if (rows.length) await sb.from(TABLE_OF[key]).upsert(rows);
    }
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
