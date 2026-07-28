"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, Star, X } from "lucide-react";
import type { Place, PlaceCategory } from "@/lib/types";
import { GOOGLE_MAPS_API_KEY, isGoogleMapsConfigured } from "@/lib/supabase/config";
import { useItineraryDays, usePlaces } from "@/hooks/use-app-data";
import { Button } from "@/components/ui/button";
import { AddPlaceDialog, type PlaceCandidate } from "@/components/map/add-place-dialog";
import { CategoryFilter } from "@/components/map/category-filter";
import { MapPreview, MapView } from "@/components/map/map-view";
import { MapBottomSheet, type SheetSnap } from "@/components/map/map-bottom-sheet";
import { PlaceDetailCard } from "@/components/map/place-detail-card";
import { PlaceList } from "@/components/map/place-list";

/** 검색어 매칭 — 이름/메모/주소 */
function matchesQuery(place: Place, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [place.name, place.memo ?? "", place.address ?? ""].some((v) =>
    v.toLowerCase().includes(needle)
  );
}

function MapPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const places = usePlaces();
  const days = useItineraryDays();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [candidate, setCandidate] = useState<PlaceCandidate | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("half");

  // ?place=<id> 딥링크 → 마운트/파라미터 변경 시 해당 장소 선택
  const placeParam = searchParams.get("place");
  useEffect(() => {
    if (placeParam) {
      setSelectedId(placeParam);
      setCandidate(null);
      setSheetSnap("peek");
    }
  }, [placeParam]);

  const select = useCallback(
    (id: string) => {
      setSelectedId(id);
      setCandidate(null);
      setSheetSnap("peek");
      router.replace(`/map?place=${id}`, { scroll: false });
    },
    [router]
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    router.replace("/map", { scroll: false });
  }, [router]);

  // 검색어만 반영한 목록 (칩 카운트용)
  const searched = useMemo(
    () => places.filter((p) => matchesQuery(p, query.trim())),
    [places, query]
  );

  // 검색어 + 카테고리 반영한 최종 목록 (리스트 & 마커 공용)
  const filtered = useMemo(() => {
    const byCat =
      categories.length === 0 ? searched : searched.filter((p) => categories.includes(p.category));
    return [...byCat].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [searched, categories]);

  const counts = useMemo(() => {
    const acc: Partial<Record<PlaceCategory, number>> = {};
    for (const p of searched) acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, [searched]);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedId) ?? null,
    [places, selectedId]
  );

  // 지도에서 장소/지점 선택 → 이미 저장된 곳이면 선택, 아니면 저장 후보로
  const handlePick = useCallback(
    (c: PlaceCandidate) => {
      if (c.googlePlaceId) {
        const existing = places.find((p) => p.googlePlaceId === c.googlePlaceId);
        if (existing) {
          select(existing.id);
          return;
        }
      }
      setSelectedId(null);
      setCandidate(c);
      setSheetSnap("peek");
    },
    [places, select]
  );

  const countLabel = (
    <>
      저장된 장소 <span className="font-semibold text-foreground tabular-nums">{places.length}</span>곳
      {filtered.length !== places.length && (
        <span className="text-muted-foreground"> · {filtered.length}곳 표시</span>
      )}
    </>
  );

  // 단일 검색 바 — 왼쪽 뒤로 화살표(일정으로) + 검색 입력 + 오른쪽 검색 아이콘
  const searchBar = (
    <div className="flex h-11 w-full items-center gap-1 rounded-full border bg-card px-1 shadow-[var(--shadow-soft)]">
      <Link
        href="/itinerary"
        aria-label="일정으로 돌아가기"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </Link>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="장소 검색…"
        aria-label="장소 검색"
        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <span className="flex size-9 shrink-0 items-center justify-center text-muted-foreground" aria-hidden>
        <Search className="h-4 w-4" />
      </span>
    </div>
  );

  const content = (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* ─── 지도 레이어 (전체 화면) ─── */}
      <div className="absolute inset-0">
        {isGoogleMapsConfigured ? (
          <MapView
            fullscreen
            places={filtered}
            selectedId={selectedId}
            onSelect={select}
            onPickCandidate={handlePick}
            candidate={candidate}
          />
        ) : (
          <MapPreview fullscreen placeCount={places.length} />
        )}
      </div>

      {/* ─── 데스크톱 사이드 패널 ─── */}
      <aside className="absolute inset-y-0 left-0 z-20 hidden w-[380px] flex-col gap-3 border-r bg-card/95 p-4 backdrop-blur lg:flex">
        {searchBar}
        <p className="px-1 text-xs text-muted-foreground">{countLabel}</p>
        <PlaceList places={filtered} days={days} selectedId={selectedId} onSelect={select} />
      </aside>

      {/* ─── 데스크톱: 필터 칩을 지도 위(패널 오른쪽 상단)에 플로팅 (배경 없이 칩만) ─── */}
      <div className="pointer-events-none absolute left-[396px] right-4 top-4 z-30 hidden lg:block">
        <div className="pointer-events-auto inline-flex max-w-full">
          <CategoryFilter selected={categories} onChange={setCategories} counts={counts} className="pb-0" />
        </div>
      </div>

      {/* ─── 모바일 상단 오버레이 (뒤로 + 검색 + 카테고리) ─── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 space-y-2 px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] lg:hidden"
      >
        <div className="pointer-events-auto flex">{searchBar}</div>
        <div className="pointer-events-auto">
          <CategoryFilter selected={categories} onChange={setCategories} counts={counts} />
        </div>
      </div>

      {/* ─── 선택된 장소 상세 / 저장 후보 ─── */}
      <div className="pointer-events-none absolute inset-x-3 bottom-[136px] z-40 lg:inset-x-auto lg:bottom-4 lg:left-[396px] lg:w-[360px]">
        <AnimatePresence mode="wait">
          {selectedPlace ? (
            <div key={`sel-${selectedPlace.id}`} className="pointer-events-auto">
              <PlaceDetailCard place={selectedPlace} days={days} onClose={clearSelection} />
            </div>
          ) : candidate ? (
            <motion.div
              key="candidate"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="pointer-events-auto rounded-2xl border bg-card p-4 shadow-[var(--shadow-lifted)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{candidate.name || "선택한 위치"}</p>
                  {candidate.address ? (
                    <p className="truncate text-xs text-muted-foreground">{candidate.address}</p>
                  ) : (
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {candidate.lat.toFixed(4)}, {candidate.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCandidate(null)}
                  aria-label="닫기"
                  className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Button className="mt-3 w-full" onClick={() => setAddOpen(true)}>
                <Star />이 장소 저장
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ─── 모바일 바텀시트 ─── */}
      <MapBottomSheet
        snap={sheetSnap}
        onSnapChange={setSheetSnap}
        header={<p className="text-sm text-muted-foreground">{countLabel}</p>}
      >
        <PlaceList places={filtered} days={days} selectedId={selectedId} onSelect={select} />
      </MapBottomSheet>

      <AddPlaceDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        candidate={candidate}
        days={days}
        onSaved={select}
      />
    </div>
  );

  if (isGoogleMapsConfigured) {
    return <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>{content}</APIProvider>;
  }
  return content;
}

export default function MapPage() {
  return (
    <Suspense fallback={null}>
      <MapPageInner />
    </Suspense>
  );
}
