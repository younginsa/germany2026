"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { PlaceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ALL_CATEGORIES, CATEGORY_META, withAlpha } from "./category-meta";

interface CategoryFilterProps {
  /** 비어 있으면 "전체" */
  selected: PlaceCategory[];
  onChange: (next: PlaceCategory[]) => void;
  /** 카테고리별 장소 수 (뱃지 표시용) */
  counts?: Partial<Record<PlaceCategory, number>>;
  /** 호텔 비교 모드 토글 칩 (선택) — 켜져 있으면 카테고리 칩은 꺼진 상태로 보여요 */
  hotelCompare?: { active: boolean; count: number; onToggle: () => void };
  className?: string;
}

const HOTEL_META = CATEGORY_META.hotel;

/** 가로 스크롤 멀티 토글 카테고리 칩 */
export function CategoryFilter({
  selected,
  onChange,
  counts,
  hotelCompare,
  className,
}: CategoryFilterProps) {
  const hotelActive = hotelCompare?.active ?? false;
  const isAll = selected.length === 0 && !hotelActive;

  const toggle = (cat: PlaceCategory) => {
    if (selected.includes(cat)) onChange(selected.filter((c) => c !== cat));
    else onChange([...selected, cat]);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      role="group"
      aria-label="카테고리 필터"
    >
      {hotelCompare && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={hotelCompare.onToggle}
          aria-pressed={hotelActive}
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            hotelActive ? "shadow-sm" : "bg-card hover:bg-accent"
          )}
          style={
            hotelActive
              ? { backgroundColor: HOTEL_META.color, borderColor: HOTEL_META.color, color: HOTEL_META.fg }
              : { borderColor: withAlpha(HOTEL_META.color, 0.5), color: HOTEL_META.color }
          }
        >
          <Star className="h-3.5 w-3.5" aria-hidden />
          호텔 비교
          <span
            className="ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums"
            style={
              hotelActive
                ? { backgroundColor: "rgba(255,255,255,0.25)" }
                : { backgroundColor: withAlpha(HOTEL_META.color, 0.12) }
            }
          >
            {hotelCompare.count}
          </span>
        </motion.button>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => onChange([])}
        aria-pressed={isAll}
        className={cn(
          "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          isAll
            ? "border-transparent bg-foreground text-background shadow-sm"
            : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        전체
      </motion.button>

      {ALL_CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        const active = !hotelActive && selected.includes(cat);
        const count = counts?.[cat] ?? 0;
        return (
          <motion.button
            key={cat}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => toggle(cat)}
            aria-pressed={active}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "shadow-sm" : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            style={
              active
                ? { backgroundColor: meta.color, borderColor: meta.color, color: meta.fg }
                : { borderColor: withAlpha(meta.color, 0.25) }
            }
          >
            <meta.icon className="h-3.5 w-3.5" aria-hidden />
            {meta.label}
            {count > 0 && (
              <span
                className="ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums"
                style={
                  active
                    ? { backgroundColor: "rgba(255,255,255,0.25)" }
                    : { backgroundColor: withAlpha(meta.color, 0.12), color: meta.color }
                }
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
