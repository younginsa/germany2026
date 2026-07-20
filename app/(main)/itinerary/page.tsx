"use client";

/**
 * 일정 페이지 — 10일 여정 타임라인 + 구글 독스 스타일 인라인 댓글.
 *
 * ?day=<dayId>            해당 일차 자동 펼침 + 스크롤
 * ?comment=<commentId>    해당 댓글 하이라이트로 스크롤 + 플래시 + 패널 오픈
 */

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, MessagesSquare } from "lucide-react";
import { useComments, useItineraryDays } from "@/hooks/use-app-data";
import {
  InlineCommentsProvider,
  useInlineComments,
} from "@/hooks/use-inline-comments";
import { DayCard } from "@/components/itinerary/day-card";
import { CityStays } from "@/components/itinerary/city-stays";
import { CommentPanel } from "@/components/itinerary/comment-panel";
import { SelectionToolbar } from "@/components/itinerary/selection-toolbar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

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
  const { showResolved, setShowResolved, expandDay, focusComment } = useInlineComments();

  const itineraryComments = useMemo(
    () => comments.filter((c) => c.anchor.targetType === "itinerary"),
    [comments]
  );
  const unresolvedCount = useMemo(
    () => itineraryComments.filter((c) => !c.resolved).length,
    [itineraryComments]
  );

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
      <header className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">일정</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            10일간의 여정 · 프랑크푸르트에서 뮌헨까지
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="accent">
              <MessagesSquare />
              댓글 {itineraryComments.length}개
            </Badge>
            {unresolvedCount > 0 && (
              <Badge variant="warning">
                <MessageCircle />
                미해결 {unresolvedCount}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              💡 일정 텍스트를 드래그하면 바로 댓글을 남길 수 있어요
            </span>
          </div>
        </div>
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
          해결된 댓글 숨기기
          <Switch
            checked={!showResolved}
            onCheckedChange={(checked) => setShowResolved(!checked)}
            aria-label="해결된 댓글 숨기기"
          />
        </label>
      </header>

      {/* 도시별 체류 요약 */}
      <CityStays
        days={days}
        onSelectDay={(dayId) => {
          expandDay(dayId);
          window.setTimeout(() => {
            document
              .getElementById(`day-card-${dayId}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 250);
        }}
      />

      {/* 타임라인 */}
      <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-[21px] before:top-4 before:hidden before:w-px before:bg-border sm:pl-11 sm:before:block">
        {days.map((day) => (
          <li key={day.id} className="relative">
            <span
              aria-hidden
              className="absolute left-[-28px] top-7 hidden size-3 rounded-full border-2 border-primary bg-background sm:block"
            />
            <DayCard day={day} />
          </li>
        ))}
      </ol>

      {/* 인라인 댓글 오버레이 */}
      <SelectionToolbar />
      <CommentPanel />
    </div>
  );
}
