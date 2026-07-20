"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Snowflake, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTrip } from "@/hooks/use-app-data";
import { Countdown } from "@/components/home/countdown";
import { StatCards } from "@/components/home/stat-cards";
import { WeatherStrip } from "@/components/home/weather-card";
import { FamilyCards } from "@/components/home/family-cards";
import { QuickActions } from "@/components/home/quick-actions";
import { RecentComments } from "@/components/home/recent-comments";
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
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              {trip.coverEmoji}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
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

            <div className="mt-7">
              <Countdown targetDate={trip.startDate} />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 여행 요약 ────────────────────────────── */}
      <Section delay={0.06}>
        <StatCards />
      </Section>

      {/* ─── 도시별 날씨 ──────────────────────────── */}
      <Section delay={0.12}>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Snowflake className="h-4 w-4" />
          12월 독일 날씨
        </h2>
        <WeatherStrip />
      </Section>

      {/* ─── 빠른 이동 ────────────────────────────── */}
      <Section delay={0.18}>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Zap className="h-4 w-4" />
          바로가기
        </h2>
        <QuickActions />
      </Section>

      {/* ─── 일정 미리보기 · 댓글 · 체크리스트 · 가족 ── */}
      <Section delay={0.24}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <DayPreview />
            <RecentComments />
          </div>
          <div className="space-y-4">
            <ChecklistProgress />
            <FamilyCards />
          </div>
        </div>
      </Section>
    </div>
  );
}
