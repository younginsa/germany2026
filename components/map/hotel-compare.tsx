"use client";

import { useEffect, useRef, useState } from "react";
import { AdvancedMarker, Marker, useMap } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, Hotel, MapPinOff, Star, X } from "lucide-react";
import {
  HOTEL_CANDIDATES,
  HOTEL_EXTRA_CHANNELS,
  MAP_ANCHORS,
  STAY_DATES,
  distanceKm,
  hotelBookingLinks,
  type HotelCandidate,
  type MapAnchor,
} from "@/lib/data/hotel-candidates";
import { GOOGLE_MAPS_MAP_ID } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_META, withAlpha } from "./category-meta";

const HOTEL_COLOR = CATEGORY_META.hotel.color;
const CRUISE = MAP_ANCHORS.find((a) => a.id === "cruise")!;
const AIRPORT = MAP_ANCHORS.find((a) => a.id === "airport")!;

const rankOf = (id: string) => HOTEL_CANDIDATES.findIndex((h) => h.id === id) + 1;
const km = (hotel: HotelCandidate, anchor: MapAnchor) => distanceKm(hotel, anchor).toFixed(1);

/* ─── 지도 레이어 (Map 자식으로 렌더) ─── */

/** 순위 + 평점 배지 핀 */
function HotelPin({ hotel, rank, selected }: { hotel: HotelCandidate; rank: number; selected: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ scale: selected ? 1.15 : 1, y: selected ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative flex flex-col items-center"
      style={{ transformOrigin: "bottom center" }}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full border-2 border-white py-0.5 pl-0.5 pr-2 text-[11px] font-bold tabular-nums text-white",
          selected ? "shadow-lg" : "shadow-md"
        )}
        style={{ backgroundColor: HOTEL_COLOR }}
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px]">
          {rank}
        </span>
        <Star className="h-3 w-3 fill-current" aria-hidden />
        {hotel.rating.toFixed(1)}
      </div>
      <div
        className="-mt-px h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent"
        style={{ borderTopColor: HOTEL_COLOR }}
        aria-hidden
      />
      {selected && (
        <div className="absolute -bottom-6 whitespace-nowrap rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold text-background shadow-md">
          {hotel.name}
        </div>
      )}
    </motion.div>
  );
}

/** 크루즈·공항·시내 기준점 핀 */
function AnchorPin({ anchor }: { anchor: MapAnchor }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-card text-lg shadow-md">
        {anchor.emoji}
      </div>
      <span className="mt-1 whitespace-nowrap rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-semibold text-background shadow-sm">
        {anchor.short}
      </span>
    </div>
  );
}

/** 호텔 후보 + 기준점 마커 — 선택이 없으면 전체가 보이게, 선택하면 그 호텔로 확대 */
export function HotelLayer({
  hotels,
  selectedId,
  onSelect,
}: {
  hotels: HotelCandidate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  const hasMapId = Boolean(GOOGLE_MAPS_MAP_ID);
  const selected = hotels.find((h) => h.id === selectedId) ?? null;

  useEffect(() => {
    if (!map) return;
    if (selected) {
      map.panTo({ lat: selected.lat, lng: selected.lng });
      if ((map.getZoom() ?? 0) < 14) map.setZoom(14);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    for (const p of [...hotels, ...MAP_ANCHORS]) bounds.extend({ lat: p.lat, lng: p.lng });
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    map.fitBounds(
      bounds,
      desktop
        ? { top: 72, right: 48, bottom: 48, left: 428 }
        : { top: 130, right: 24, bottom: 220, left: 24 }
    );
  }, [map, selected, hotels]);

  return (
    <>
      {MAP_ANCHORS.map((a) =>
        hasMapId ? (
          <AdvancedMarker key={a.id} position={{ lat: a.lat, lng: a.lng }} zIndex={500} title={`${a.name} · ${a.memo}`}>
            <AnchorPin anchor={a} />
          </AdvancedMarker>
        ) : (
          <Marker
            key={a.id}
            position={{ lat: a.lat, lng: a.lng }}
            title={`${a.name} · ${a.memo}`}
            label={{ text: a.emoji, fontSize: "16px" }}
          />
        )
      )}
      {hotels.map((h) => {
        const rank = rankOf(h.id);
        const isSelected = h.id === selectedId;
        return hasMapId ? (
          <AdvancedMarker
            key={h.id}
            position={{ lat: h.lat, lng: h.lng }}
            zIndex={isSelected ? 1000 : 100 - rank}
            onClick={() => onSelect(h.id)}
            title={h.name}
          >
            <HotelPin hotel={h} rank={rank} selected={isSelected} />
          </AdvancedMarker>
        ) : (
          <Marker
            key={h.id}
            position={{ lat: h.lat, lng: h.lng }}
            title={`${rank}. ${h.name} ★${h.rating.toFixed(1)}`}
            label={String(rank)}
            onClick={() => onSelect(h.id)}
          />
        );
      })}
    </>
  );
}

/* ─── 목록 (데스크톱 사이드 패널 · 모바일 바텀시트) ─── */

export function HotelList({
  hotels,
  selectedId,
  onSelect,
}: {
  hotels: HotelCandidate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedId || !viewportRef.current) return;
    const el = viewportRef.current.querySelector<HTMLElement>(`[data-hotel-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  if (hotels.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center">
        <MapPinOff className="h-8 w-8 text-muted-foreground/50" aria-hidden />
        <p className="text-sm font-medium text-muted-foreground">검색어에 맞는 호텔이 없어요</p>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div ref={viewportRef} className="flex flex-col gap-2 pb-4 pr-2">
        {hotels.map((h) => {
          const rank = rankOf(h.id);
          const selected = h.id === selectedId;
          return (
            <button
              key={h.id}
              type="button"
              data-hotel-id={h.id}
              onClick={() => onSelect(h.id)}
              aria-pressed={selected}
              className={cn(
                "w-full rounded-xl border bg-card p-3 text-left transition-colors hover:bg-accent/60",
                selected && "border-primary ring-1 ring-primary/40"
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums text-white"
                  style={{ backgroundColor: HOTEL_COLOR }}
                >
                  {rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{h.name}</p>
                    {h.badge && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-semibold text-primary">
                        {h.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                    <span className="font-semibold tabular-nums text-foreground">{h.rating.toFixed(1)}</span>
                    <span className="tabular-nums">({h.reviews.toLocaleString()})</span>
                    <span aria-hidden>·</span>
                    <span className="truncate">{h.area}</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/85">{h.summary}</p>
                  <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                    🚢 크루즈 {km(h, CRUISE)}km · ✈️ 공항 {km(h, AIRPORT)}km
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        <div className="mt-2 rounded-xl border border-dashed p-3">
          <p className="text-[11px] font-semibold text-muted-foreground">다른 예약 채널</p>
          <ul className="mt-1.5 space-y-1">
            {HOTEL_EXTRA_CHANNELS.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1 text-xs text-primary underline-offset-2 hover:underline"
                >
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/80">
            평점 트립어드바이저(2026-10) · 거리는 직선 · 가격은 4인 한 방 연말 추정(세금 포함)이라 날짜 지정 실견적이 아니에요
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}

/* ─── 상세 카드 — 4인 가격 · 예약 링크 ─── */

export function HotelDetailCard({ hotel, onClose }: { hotel: HotelCandidate; onClose: () => void }) {
  const [stayIndex, setStayIndex] = useState(0);
  const stay = STAY_DATES[stayIndex];
  const links = hotelBookingLinks(hotel, stay.checkIn, stay.checkOut);
  const rank = rankOf(hotel.id);

  return (
    <motion.div
      key={hotel.id}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.21, 1.02, 0.73, 1] }}
      className="glass pointer-events-auto max-h-[calc(100dvh-17rem)] w-full overflow-y-auto rounded-2xl p-4 shadow-[var(--shadow-lifted)] sm:max-w-sm lg:max-h-[calc(100dvh-5rem)]"
    >
      <div className="flex items-start gap-3">
        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm"
          style={{ backgroundColor: withAlpha(HOTEL_COLOR, 0.16) }}
          aria-hidden
        >
          <Hotel className="h-5 w-5" style={{ color: HOTEL_COLOR }} />
          <span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold tabular-nums text-white"
            style={{ backgroundColor: HOTEL_COLOR }}
          >
            {rank}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold">{hotel.name}</h3>
            {hotel.badge && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-px text-[10px] font-semibold text-primary">
                {hotel.badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-semibold tabular-nums text-foreground">{hotel.rating.toFixed(1)}</span>
            <span className="tabular-nums">리뷰 {hotel.reviews.toLocaleString()}개 · 트립어드바이저</span>
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground/80">{hotel.area}</p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="닫기">
          <X />
        </Button>
      </div>

      {/* 4인 가격 */}
      <div className="mt-3 rounded-lg bg-muted/60 px-3 py-2.5">
        <p className="text-[11px] text-muted-foreground">4인 1박 · 세금 포함 연말 추정</p>
        <p className="mt-0.5 text-base font-bold tabular-nums">{hotel.price}</p>
        <p className="mt-1 text-xs leading-relaxed">{hotel.room}</p>
        {hotel.confirmOccupancy && (
          <p className="mt-1.5 flex gap-1 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            4인 한 방 가능 여부 호텔 확인 — &lsquo;어른 2 + 아이(6세) + 아기침대(2세)&rsquo;
          </p>
        )}
        {hotel.priceAlt && (
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">대안: {hotel.priceAlt}</p>
        )}
      </div>

      {/* 기준점까지 거리 */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border px-2.5 py-2">
          <p className="text-[11px] text-muted-foreground">🚢 크루즈 센터</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {km(hotel, CRUISE)}km · 택시 {hotel.taxi.cruise}
          </p>
        </div>
        <div className="rounded-lg border px-2.5 py-2">
          <p className="text-[11px] text-muted-foreground">✈️ 창이공항</p>
          <p className="mt-0.5 font-semibold tabular-nums">
            {km(hotel, AIRPORT)}km · 택시 {hotel.taxi.airport}
          </p>
        </div>
      </div>

      <dl className="mt-3 space-y-2 text-xs leading-relaxed">
        <div>
          <dt className="font-semibold text-success">아이 포인트</dt>
          <dd className="mt-0.5 text-foreground/90">{hotel.kids}</dd>
        </div>
        <div>
          <dt className="font-semibold text-destructive">주의할 점</dt>
          <dd className="mt-0.5 text-foreground/90">{hotel.caution}</dd>
        </div>
        <div>
          <dt className="font-semibold text-muted-foreground">멤버십</dt>
          <dd className="mt-0.5 text-foreground/90">{hotel.membership}</dd>
        </div>
      </dl>

      {/* 예약 링크 — 날짜·인원 채워서 열기 */}
      <div className="mt-3 border-t pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-muted-foreground">예약 · 어른 2 + 아이 2 (6·2세) 1박</p>
          <div className="flex shrink-0 rounded-full border p-0.5" role="group" aria-label="숙박 날짜">
            {STAY_DATES.map((d, i) => (
              <button
                key={d.checkIn}
                type="button"
                onClick={() => setStayIndex(i)}
                aria-pressed={i === stayIndex}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                  i === stayIndex ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 gap-1 px-2.5 text-xs")}
            >
              {l.label}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/80">
          사이트마다 날짜·인원이 채워져 열려요 — 공식·구글 호텔은 화면에서 다시 선택해 주세요.
        </p>
      </div>
    </motion.div>
  );
}
