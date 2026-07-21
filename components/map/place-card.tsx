"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { ItineraryDay, Place, Profile } from "@/lib/types";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CATEGORY_META, withAlpha } from "./category-meta";

interface PlaceCardProps {
  place: Place;
  author?: Profile;
  authorHue?: number;
  days: ItineraryDay[];
  selected: boolean;
  onSelect: () => void;
  index: number;
}

/** 장소 목록 카드 — 클릭 시 선택/지도 이동 */
export function PlaceCard({ place, author, authorHue, days, selected, onSelect, index }: PlaceCardProps) {
  const meta = CATEGORY_META[place.category];
  const linkedDays = days
    .filter((d) => place.dayIds.includes(d.id))
    .sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <motion.button
      type="button"
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.3), ease: [0.21, 1.02, 0.73, 1] }}
      onClick={onSelect}
      data-place-id={place.id}
      className={cn(
        "group w-full rounded-xl border bg-card p-3 text-left shadow-[var(--shadow-soft)] transition-all",
        "hover:-translate-y-px hover:shadow-[var(--shadow-lifted)]",
        selected && "ring-2 ring-offset-1 ring-offset-background"
      )}
      style={selected ? ({ "--tw-ring-color": meta.color } as React.CSSProperties) : undefined}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm"
          style={{ backgroundColor: withAlpha(meta.color, 0.14) }}
          aria-hidden
        >
          <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{place.name}</p>
            <span
              className="shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium"
              style={{ backgroundColor: withAlpha(meta.color, 0.12), color: meta.color }}
            >
              {meta.label}
            </span>
          </div>

          {place.memo && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{place.memo}</p>
          )}
          {!place.memo && place.address && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              {place.address}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback hue={authorHue} className="text-[9px]">
                  {author ? initialsOf(author.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-[11px] text-muted-foreground">
                {author?.name ?? "알 수 없음"} · {relativeTimeKo(place.createdAt)}
              </span>
            </div>

            {linkedDays.length > 0 && (
              <div className="flex shrink-0 items-center gap-1">
                {linkedDays.slice(0, 4).map((d) => (
                  <span
                    key={d.id}
                    className="rounded-md bg-accent px-1.5 py-px text-[10px] font-semibold text-accent-foreground"
                    title={`${d.dayNumber}일차 · ${d.city}`}
                  >
                    D{d.dayNumber}
                  </span>
                ))}
                {linkedDays.length > 4 && (
                  <span className="text-[10px] text-muted-foreground">+{linkedDays.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
