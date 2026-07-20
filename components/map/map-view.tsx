"use client";

import { useEffect } from "react";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Marker,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import type { Place } from "@/lib/types";
import { GOOGLE_MAPS_MAP_ID } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "./category-meta";

const DEFAULT_CENTER = { lat: 49.2, lng: 10.2 };
const DEFAULT_ZOOM = 7;

interface MapViewProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** 지도 클릭 → 좌표와 함께 장소 추가 다이얼로그 열기 */
  onMapClick: (lat: number, lng: number) => void;
}

/** 선택된 장소로 지도 이동 (Map 자식으로 렌더) */
function MapController({ selected }: { selected: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selected) return;
    map.panTo({ lat: selected.lat, lng: selected.lng });
    const zoom = map.getZoom();
    if (zoom !== undefined && zoom < 12) map.setZoom(13);
  }, [map, selected]);

  return null;
}

/** 카테고리 이모지 커스텀 핀 (mapId 있을 때만 사용 가능) */
function CategoryPin({ place, selected }: { place: Place; selected: boolean }) {
  const meta = CATEGORY_META[place.category];
  return (
    <motion.div
      initial={false}
      animate={{ scale: selected ? 1.25 : 1, y: selected ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative flex flex-col items-center"
      style={{ transformOrigin: "bottom center" }}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-base",
          selected ? "shadow-lg" : "shadow-md"
        )}
        style={{ backgroundColor: meta.color }}
      >
        <span className="drop-shadow-sm" aria-hidden>
          {meta.emoji}
        </span>
      </div>
      {/* 핀 꼬리 */}
      <div
        className="-mt-px h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent"
        style={{ borderTopColor: meta.color }}
        aria-hidden
      />
      {selected && (
        <div className="absolute -bottom-6 whitespace-nowrap rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold text-background shadow-md">
          {place.name}
        </div>
      )}
    </motion.div>
  );
}

/** 구글 지도 (CONFIGURED 모드) — 상위에서 APIProvider로 감싸야 함 */
export function MapView({ places, selectedId, onSelect, onMapClick }: MapViewProps) {
  const selected = places.find((p) => p.id === selectedId) ?? null;
  const hasMapId = Boolean(GOOGLE_MAPS_MAP_ID);

  const handleClick = (e: MapMouseEvent) => {
    const ll = e.detail.latLng;
    if (ll) onMapClick(Number(ll.lat.toFixed(6)), Number(ll.lng.toFixed(6)));
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border shadow-[var(--shadow-soft)]">
      <GoogleMap
        mapId={GOOGLE_MAPS_MAP_ID || undefined}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI={false}
        onClick={handleClick}
        className="h-full w-full"
      >
        <MapController selected={selected} />

        {hasMapId
          ? places.map((place) => (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                zIndex={place.id === selectedId ? 1000 : undefined}
                onClick={() => onSelect(place.id)}
                title={place.name}
              >
                <CategoryPin place={place} selected={place.id === selectedId} />
              </AdvancedMarker>
            ))
          : places.map((place) => (
              <Marker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                title={place.name}
                onClick={() => onSelect(place.id)}
              />
            ))}
      </GoogleMap>

      {/* 지도 클릭 → 장소 추가 힌트 */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
        <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm">
          <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
          지도를 길게 눌러(클릭해) 장소를 추가할 수 있어요
        </div>
      </div>
    </div>
  );
}

/* ─── PREVIEW 모드 — API 키 미설정 시 플레이스홀더 ─── */

/** 미리 배치된 장식 이모지 핀 (SSR 안정성을 위해 고정 좌표) */
const DECO_PINS: { emoji: string; top: string; left: string; delay: number }[] = [
  { emoji: "🏰", top: "22%", left: "18%", delay: 0 },
  { emoji: "🎄", top: "38%", left: "68%", delay: 0.15 },
  { emoji: "🍽", top: "62%", left: "30%", delay: 0.3 },
  { emoji: "🏨", top: "70%", left: "74%", delay: 0.45 },
  { emoji: "✈️", top: "18%", left: "78%", delay: 0.6 },
  { emoji: "🚗", top: "55%", left: "52%", delay: 0.75 },
];

/** 지도 플레이스홀더 (PREVIEW 모드) */
export function MapPreview({ placeCount }: { placeCount: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
      {/* 그리드 + 그라디언트 배경 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse at 30% 20%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 55%)",
            "radial-gradient(ellipse at 75% 80%, color-mix(in oklch, var(--success) 9%, transparent), transparent 55%)",
            "linear-gradient(color-mix(in oklch, var(--border) 55%, transparent) 1px, transparent 1px)",
            "linear-gradient(90deg, color-mix(in oklch, var(--border) 55%, transparent) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
        aria-hidden
      />

      {/* 장식 핀 */}
      {DECO_PINS.map((pin) => (
        <motion.span
          key={pin.emoji}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ delay: pin.delay + 0.2, duration: 0.6 }}
          className="absolute select-none text-2xl"
          style={{ top: pin.top, left: pin.left }}
          aria-hidden
        >
          {pin.emoji}
        </motion.span>
      ))}

      {/* 중앙 안내 카드 */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 1.02, 0.73, 1] }}
          className="glass max-w-sm rounded-2xl p-8 text-center shadow-[var(--shadow-lifted)]"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-4xl shadow-sm">
            🗺️
          </div>
          <h2 className="text-base font-semibold">지도 미리보기 모드</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Google Maps API 키를 설정하면 실제 지도가 표시됩니다
          </p>
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground">
            .env.local의 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </p>
          <p className="mt-4 text-xs text-muted-foreground/80">
            지도 없이도 <span className="font-semibold text-foreground">{placeCount}개 장소</span>를 목록에서
            자유롭게 관리할 수 있어요
          </p>
        </motion.div>
      </div>
    </div>
  );
}
