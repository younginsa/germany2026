"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, Plane } from "lucide-react";
import { EmojiIcon } from "@/components/ui/emoji-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useItineraryDays } from "@/hooks/use-app-data";
import { formatDateKo } from "@/lib/utils";

/** 여행 첫날(Day 1) 미리보기 */
export function DayPreview() {
  const days = useItineraryDays();
  const day = days[0];
  if (!day) return null;

  const preview = day.schedule.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge>DAY {day.dayNumber}</Badge>
            <CardTitle className="flex items-center gap-1.5">
              <EmojiIcon emoji={day.cityEmoji} className="h-4 w-4 text-primary" />
              {day.city}
            </CardTitle>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {formatDateKo(day.date, { weekday: true })}
          </span>
        </div>
        <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <Plane className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{day.transportation}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-2.5">
          {preview.map((item) => (
            <li key={`${item.time}-${item.title}`} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-semibold tabular-nums text-secondary-foreground">
                {item.time}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
        {day.schedule.length > preview.length && (
          <p className="text-xs text-muted-foreground">
            외 {day.schedule.length - preview.length}개 일정
          </p>
        )}

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <BedDouble className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{day.accommodation}</span>
          </p>
          <Link
            href={`/itinerary?day=${day.id}`}
            className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-primary hover:underline"
          >
            일정 전체 보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
