"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import type { Place, PlaceCategory } from "@/lib/types";
import {
  GOOGLE_MAPS_API_KEY,
  isGoogleMapsConfigured,
} from "@/lib/supabase/config";
import { useItineraryDays, usePlaces } from "@/hooks/use-app-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddPlaceDialog } from "@/components/map/add-place-dialog";
import { CategoryFilter } from "@/components/map/category-filter";
import { MapPreview, MapView } from "@/components/map/map-view";
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
  const [prefill, setPrefill] = useState<{ lat: number; lng: number } | null>(null);

  // ?place=<id> 딥링크 → 마운트/파라미터 변경 시 해당 장소 선택
  const placeParam = searchParams.get("place");
  useEffect(() => {
    if (placeParam) setSelectedId(placeParam);
  }, [placeParam]);

  const select = useCallback(
    (id: string) => {
      setSelectedId(id);
      router.replace(`/map?place=${id}`, { scroll: false });
    },
    [router]
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    router.replace("/map", { scroll: false });
  }, [router]);

  // 검색어만 반영한 목록 (칩 카운트용)
  const searched = useMemo(() => places.filter((p) => matchesQuery(p, query.trim())), [places, query]);

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

  const openAddDialog = useCallback((coords: { lat: number; lng: number } | null) => {
    setPrefill(coords);
    setAddOpen(true);
  }, []);

  const content = (
    <div className="-mb-16 flex h-[calc(100dvh-7rem)] flex-col gap-4 lg:flex-row">
      {/* ─── 사이드바: 검색 + 필터 + 목록 ─── */}
      <aside className="order-2 flex min-h-0 flex-1 flex-col gap-3 lg:order-1 lg:w-[380px] lg:flex-none">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold tracking-tight">지도</h1>
            <p className="text-xs text-muted-foreground">
              저장된 장소 <span className="font-semibold text-foreground">{places.length}</span>곳
              {filtered.length !== places.length && ` · ${filtered.length}곳 표시 중`}
            </p>
          </div>
          <Button size="sm" onClick={() => openAddDialog(null)}>
            <Plus />새 장소
          </Button>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소 검색…"
            className="pl-9"
            aria-label="장소 검색"
          />
        </div>

        <CategoryFilter selected={categories} onChange={setCategories} counts={counts} />

        <PlaceList places={filtered} days={days} selectedId={selectedId} onSelect={select} />
      </aside>

      {/* ─── 지도 / 미리보기 ─── */}
      <div className="relative order-1 h-[40dvh] shrink-0 lg:order-2 lg:h-auto lg:flex-1">
        {isGoogleMapsConfigured ? (
          <MapView
            places={filtered}
            selectedId={selectedId}
            onSelect={select}
            onMapClick={(lat, lng) => openAddDialog({ lat, lng })}
          />
        ) : (
          <MapPreview placeCount={places.length} />
        )}

        {/* 선택된 장소 상세 오버레이 */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex justify-start sm:inset-x-auto sm:left-3 sm:w-[380px] lg:bottom-4 lg:left-4">
          <AnimatePresence mode="wait">
            {selectedPlace && (
              <PlaceDetailCard
                key={selectedPlace.id}
                place={selectedPlace}
                days={days}
                onClose={clearSelection}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AddPlaceDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        prefill={prefill}
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

function MapPageFallback() {
  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col gap-4 lg:flex-row">
      <div className="order-2 flex-1 animate-pulse rounded-2xl bg-muted lg:order-1 lg:w-[380px] lg:flex-none" />
      <div className="order-1 h-[40dvh] animate-pulse rounded-2xl bg-muted lg:order-2 lg:h-auto lg:flex-1" />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapPageFallback />}>
      <MapPageInner />
    </Suspense>
  );
}
