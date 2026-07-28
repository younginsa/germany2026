"use client";

import { CalendarDays, CloudSnow, MapPin, Snowflake, Users, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  useItineraryDays,
  useProfiles,
  useTrip,
} from "@/hooks/use-app-data";

/** 12월 독일 평년 날씨 — 프랑크푸르트(도착) · 뮌헨(마지막) */
const WEATHER: { city: string; icon: LucideIcon; low: number; high: number }[] = [
  { city: "프랑크푸르트", icon: CloudSnow, low: -1, high: 4 },
  { city: "뮌헨", icon: Snowflake, low: -5, high: 1 },
];

/** "뮌헨 (크리스마스 이브)" · "뮌헨 → 인천" 등을 기본 도시명으로 정규화 */
function baseCity(city: string): string {
  return city.split("→")[0].split("(")[0].trim();
}

export function StatCards() {
  const trip = useTrip();
  const days = useItineraryDays();
  const profiles = useProfiles();

  const dayMs = 86_400_000;
  const totalDays =
    Math.round(
      (new Date(`${trip.endDate}T00:00:00`).getTime() -
        new Date(`${trip.startDate}T00:00:00`).getTime()) /
        dayMs
    ) + 1;

  const cityCount = new Set(days.map((d) => baseCity(d.city))).size;
  const kids = profiles.filter((p) => p.role === "아이").length;
  const adults = profiles.length - kids;

  const stats = [
    {
      icon: CalendarDays,
      label: "여행 기간",
      value: `${totalDays}일`,
      sub: `${totalDays - 1}박 ${totalDays}일`,
    },
    {
      icon: MapPin,
      label: "방문 도시",
      value: `${cityCount}곳`,
      sub: "로맨틱 가도 따라",
    },
    {
      icon: Users,
      label: "동행인",
      value: `${profiles.length}명`,
      sub: `어른 ${adults} · 아이 ${kids}`,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-start gap-3 p-4 sm:p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <stat.icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-0.5 truncate text-base font-bold tracking-tight sm:text-lg">
              {stat.value}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        </Card>
      ))}

      {/* 독일 날씨 — 두 도시 한 카드에 (다른 요약 카드와 같은 레이아웃) */}
      <Card className="flex items-start gap-3 p-4 sm:p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Snowflake className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">독일 날씨</p>
          <div className="mt-1 space-y-1">
            {WEATHER.map((w) => (
              <div key={w.city} className="flex items-center gap-1.5">
                <w.icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-xs font-medium">{w.city}</span>
                <span className="shrink-0 text-xs tabular-nums">
                  <span className="font-semibold">{w.high}°</span>
                  <span className="text-muted-foreground"> / {w.low}°</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
