"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmojiIcon } from "@/components/ui/emoji-icon";
import { useTrip } from "@/hooks/use-app-data";
import { DdayBadge } from "@/components/home/countdown";
import { StatCards } from "@/components/home/stat-cards";
import { WeatherCard } from "@/components/home/weather-card";
import { ChecklistProgress } from "@/components/home/checklist-progress";
import { DayPreview } from "@/components/home/day-preview";

const EASE: [number, number, number, number] = [0.21, 1.02, 0.73, 1];

function Section({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/** "2026-12-18" ~ "2026-12-27" → "2026.12.18 – 12.27" */
function formatRange(start: string, end: string): string {
  const [sy, sm, sd] = start.split("-");
  const [, em, ed] = end.split("-");
  return `${sy}.${sm}.${sd} – ${em}.${ed}`;
}

export default function HomePage() {
  const trip = useTrip();

  return (
    <div className="space-y-8">
      {/* ─── 히어로 + 카운트다운 ─────────────────── */}
      <Section>
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
          />
          <div className="relative">
            {/* 상단: 트리 아이콘 + D-day 배지 */}
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <EmojiIcon emoji={trip.coverEmoji} className="h-7 w-7 text-primary" />
              </div>
              <DdayBadge targetDate={trip.startDate} />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {trip.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                <MapPin />
                {trip.destination}
              </Badge>
              <Badge variant="secondary" className="tabular-nums">
                <CalendarDays />
                {formatRange(trip.startDate, trip.endDate)}
              </Badge>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {trip.description}
            </p>

            {/* 여행 요약 + 날씨 (기존 카운트다운 자리) */}
            <div className="mt-7">
              <StatCards />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 일정 미리보기 · 체크리스트 · 날씨 ── */}
      <Section delay={0.12}>
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DayPreview />
          </div>
          <div className="flex flex-col gap-4">
            <ChecklistProgress />
            <div className="flex-1">
              <WeatherCard />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
