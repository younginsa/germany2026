"use client";

import { CalendarDays, Car, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  useFamilies,
  useItineraryDays,
  useProfiles,
  useTrip,
} from "@/hooks/use-app-data";

/** "뮌헨 (크리스마스 이브)" · "뮌헨 → 인천" 등을 기본 도시명으로 정규화 */
function baseCity(city: string): string {
  return city.split("→")[0].split("(")[0].trim();
}

export function StatCards() {
  const trip = useTrip();
  const days = useItineraryDays();
  const families = useFamilies();
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
      label: "가족",
      value: `${families.length}가족 ${profiles.length}명`,
      sub: `어른 ${adults} · 아이 ${kids}`,
    },
    {
      icon: Car,
      label: "이동 거리",
      value: "약 800km",
      sub: "9인승 렌터카",
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
    </div>
  );
}
