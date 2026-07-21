"use client";

import { ChevronRight, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";
import { EmojiIcon } from "@/components/ui/emoji-icon";
import type { ItineraryDay } from "@/lib/types";

/**
 * 도시별 체류 요약 스트립 — 숙소 기준으로 연속된 밤을 묶어
 * "프랑크푸르트 1박 → … → 뮌헨 4박 → 출국" 형태로 보여줍니다.
 * (당일치기 이동은 체류 도시에 흡수되고 별도 표기)
 */

interface CityStay {
  city: string;
  emoji: string;
  nights: number;
  firstDayId: string;
  dayNumbers: number[];
  dayTrips: string[];
  accommodationKey: string;
}

function base(text: string): string {
  return text.replace(/\(.*?\)/g, "").split("→")[0].trim();
}

function computeStays(days: ItineraryDay[]): {
  stays: CityStay[];
  departure?: ItineraryDay;
} {
  const stays: CityStay[] = [];
  let departure: ItineraryDay | undefined;

  for (const day of days) {
    const hasStay = day.accommodation && day.accommodation !== "-";
    if (!hasStay) {
      departure = day;
      continue;
    }
    const accommodationKey = base(day.accommodation);
    const cityName = base(day.city);
    const prev = stays[stays.length - 1];

    if (prev && prev.accommodationKey === accommodationKey) {
      prev.nights += 1;
      prev.dayNumbers.push(day.dayNumber);
      if (cityName !== prev.city && !prev.dayTrips.includes(cityName)) {
        prev.dayTrips.push(cityName);
      }
    } else {
      stays.push({
        city: cityName,
        emoji: day.cityEmoji,
        nights: 1,
        firstDayId: day.id,
        dayNumbers: [day.dayNumber],
        dayTrips: [],
        accommodationKey,
      });
    }
  }
  return { stays, departure };
}

export function CityStays({
  days,
  onSelectDay,
}: {
  days: ItineraryDay[];
  onSelectDay: (dayId: string) => void;
}) {
  const { stays, departure } = computeStays(days);
  if (stays.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mb-6 overflow-x-auto pb-1"
      aria-label="도시별 체류 기간"
    >
      <div className="flex w-max items-stretch gap-1.5">
        {stays.map((stay, i) => {
          const range =
            stay.dayNumbers.length > 1
              ? `D${stay.dayNumbers[0]}–D${stay.dayNumbers[stay.dayNumbers.length - 1]}`
              : `D${stay.dayNumbers[0]}`;
          return (
            <div key={stay.firstDayId} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              )}
              <button
                onClick={() => onSelectDay(stay.firstDayId)}
                className="group flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-left shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] active:scale-[0.98]"
              >
                <EmojiIcon emoji={stay.emoji} className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold leading-tight">{stay.city}</span>
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-bold leading-none text-primary">
                      {stay.nights}박
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">
                    {range}
                    {stay.dayTrips.length > 0 && ` · ${stay.dayTrips.join("·")} 당일치기`}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
        {departure && (
          <div className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            <button
              onClick={() => onSelectDay(departure.id)}
              className="flex items-center gap-2 rounded-xl border border-dashed bg-muted/40 px-3 py-2 transition-all hover:border-primary/40 active:scale-[0.98]"
            >
              <PlaneTakeoff className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="block text-sm font-semibold leading-tight">출국</span>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">
                  D{departure.dayNumber}
                </span>
              </span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
