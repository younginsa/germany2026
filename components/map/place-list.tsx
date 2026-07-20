"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MapPinOff } from "lucide-react";
import type { ItineraryDay, Place } from "@/lib/types";
import { useFamilyById, useProfileById } from "@/hooks/use-app-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaceCard } from "./place-card";

interface PlaceListProps {
  places: Place[];
  days: ItineraryDay[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** 스크롤 장소 목록 — 선택된 카드로 자동 스크롤 */
export function PlaceList({ places, days, selectedId, onSelect }: PlaceListProps) {
  const profileById = useProfileById();
  const familyById = useFamilyById();
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedId || !viewportRef.current) return;
    const el = viewportRef.current.querySelector<HTMLElement>(`[data-place-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  if (places.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center">
        <MapPinOff className="h-8 w-8 text-muted-foreground/50" aria-hidden />
        <p className="text-sm font-medium text-muted-foreground">조건에 맞는 장소가 없어요</p>
        <p className="text-xs text-muted-foreground/70">검색어나 카테고리 필터를 바꿔보세요</p>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div ref={viewportRef} className="flex flex-col gap-2 pb-4 pr-2">
        <AnimatePresence initial={false} mode="popLayout">
          {places.map((place, i) => {
            const author = profileById(place.authorId);
            const family = author ? familyById(author.familyId) : undefined;
            return (
              <PlaceCard
                key={place.id}
                place={place}
                author={author}
                authorHue={family?.hue}
                days={days}
                selected={place.id === selectedId}
                onSelect={() => onSelect(place.id)}
                index={i}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
