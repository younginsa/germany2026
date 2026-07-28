"use client";

/**
 * 일정 페이지 — 10일 여정 타임라인 + 구글 독스 스타일 인라인 댓글.
 *
 * ?day=<dayId>            해당 일차 자동 펼침 + 스크롤
 * ?comment=<commentId>    해당 댓글 하이라이트로 스크롤 + 플래시 + 패널 오픈
 */

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCog } from "lucide-react";
import {
  useComments,
  useItineraryDays,
  useProfiles,
  useTrip,
} from "@/hooks/use-app-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, initialsOf } from "@/lib/utils";
import {
  InlineCommentsProvider,
  useInlineComments,
} from "@/hooks/use-inline-comments";
import { DayCard } from "@/components/itinerary/day-card";
import { DayEditDialog } from "@/components/itinerary/day-edit-dialog";
import { StructureDialog } from "@/components/itinerary/structure-dialog";
import { CommentPanel } from "@/components/itinerary/comment-panel";
import { SelectionToolbar } from "@/components/itinerary/selection-toolbar";
import type { ItineraryDay } from "@/lib/types";

/** "뮌헨 (크리스마스 이브)" · "뮌헨 → 인천" 등을 기본 도시명으로 정규화 */
function baseCity(city: string): string {
  return city.split("→")[0].split("(")[0].trim();
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={null}>
      <InlineCommentsProvider>
        <ItineraryContent />
      </InlineCommentsProvider>
    </Suspense>
  );
}

function ItineraryContent() {
  const searchParams = useSearchParams();
  const days = useItineraryDays();
  const comments = useComments();
  const profiles = useProfiles();
  const trip = useTrip();
  const { expandDay, focusComment } = useInlineComments();
  const [viewFilter, setViewFilter] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [structureOpen, setStructureOpen] = useState(false);

  // editingDay가 스토어 변경으로 갱신되면 최신 내용 반영
  const editingCurrent = editingDay
    ? (days.find((d) => d.id === editingDay.id) ?? editingDay)
    : null;

  const firstCity = days.length > 0 ? baseCity(days[0].city) : "";
  const lastCity = days.length > 0 ? baseCity(days[days.length - 1].city) : "";

  /* URL 파라미터 처리 — 최초 1회 (comment는 스토어 로드 후에 찾힐 수 있어 재시도 허용) */
  const handledRef = useRef(false);
  useEffect(() => {
    if (handledRef.current) return;
    const dayParam = searchParams.get("day");
    const commentParam = searchParams.get("comment");

    if (commentParam) {
      const target = comments.find((c) => c.id === commentParam);
      if (target) {
        handledRef.current = true;
        focusComment(target, { openPanel: true, scroll: true });
        return;
      }
      // 아직 스토어 하이드레이션 전일 수 있음 → 다음 comments 변경 시 재시도
      if (dayParam) expandDay(dayParam);
      return;
    }

    handledRef.current = true;
    if (dayParam && days.some((d) => d.id === dayParam)) {
      expandDay(dayParam);
      window.setTimeout(() => {
        document
          .getElementById(`day-card-${dayParam}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, [searchParams, comments, days, expandDay, focusComment]);

  return (
    <div className="animate-fade-up">
      {/* 헤더 */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">일정</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {days.length}일간의 여정
              {firstCity && lastCity && ` · ${firstCity}에서 ${lastCity}까지`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setStructureOpen(true)}
          >
            <CalendarCog className="size-4" />
            일정 구성
          </Button>
        </div>

        {/* 멤버별 보기 필터 */}
        {profiles.length > 1 && (
          <div className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setViewFilter(null)}
              aria-pressed={viewFilter === null}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                viewFilter === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              전체
            </button>
            {profiles.map((p) => {
              const active = viewFilter === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setViewFilter(active ? null : p.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Avatar className="size-5">
                    <AvatarFallback hue={p.hue} className="text-[9px]">
                      {initialsOf(p.name)}
                    </AvatarFallback>
                  </Avatar>
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* 타임라인 */}
      <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:hidden before:w-px before:bg-border sm:pl-11 sm:before:block">
        {days.map((day) => (
          <li key={day.id} className="relative">
            <span
              aria-hidden
              className="absolute left-[-28px] top-7 hidden size-3 rounded-full border-2 border-primary bg-background sm:block"
            />
            <DayCard day={day} viewFilter={viewFilter} onEdit={setEditingDay} />
          </li>
        ))}
      </ol>

      {/* 일정 편집 */}
      <DayEditDialog day={editingCurrent} onClose={() => setEditingDay(null)} />
      <StructureDialog
        open={structureOpen}
        onOpenChange={setStructureOpen}
        days={days}
        trip={trip}
      />

      {/* 인라인 댓글 오버레이 */}
      <SelectionToolbar />
      <CommentPanel />
    </div>
  );
}
