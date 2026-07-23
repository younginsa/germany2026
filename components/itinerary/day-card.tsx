"use client";

/**
 * DayCard — 펼침/접힘 가능한 일차 카드.
 * 모든 텍스트 섹션은 CommentableText를 통해 렌더링되어
 * 드래그-댓글과 하이라이트를 지원합니다.
 */

import { useMemo, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  CalendarDays,
  Car,
  CarFront,
  ChevronDown,
  Clock,
  MessageCircle,
  NotebookPen,
  Snowflake,
  SquareParking,
  TreePine,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { EmojiIcon } from "@/components/ui/emoji-icon";
import { useComments } from "@/hooks/use-app-data";
import { useInlineComments } from "@/hooks/use-inline-comments";
import { CommentableText } from "@/components/itinerary/commentable-text";
import { ParticipantPicker } from "@/components/itinerary/participant-picker";
import { Card } from "@/components/ui/card";
import { cn, formatDateKo } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/types";

function hasValue(v: string): boolean {
  const t = v.trim();
  return t.length > 0 && t !== "-";
}

function Section({
  icon: Icon,
  label,
  className,
  children,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-tight text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </h4>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function DayCard({
  day,
  viewFilter = null,
}: {
  day: ItineraryDay;
  /** 선택된 멤버 id — 참여하지 않는 시간별 항목을 흐리게 표시 */
  viewFilter?: string | null;
}) {
  const { isDayExpanded, toggleDay, openPanel, showResolved } = useInlineComments();
  const allComments = useComments();
  const expanded = isDayExpanded(day.id);

  const commentCount = useMemo(
    () =>
      allComments.filter(
        (c) =>
          c.anchor.targetType === "itinerary" &&
          c.anchor.targetId === day.id &&
          (showResolved || !c.resolved)
      ).length,
    [allComments, day.id, showResolved]
  );

  const preview = hasValue(day.accommodation)
    ? { icon: BedDouble, text: day.accommodation }
    : hasValue(day.transportation)
      ? { icon: Car, text: day.transportation }
      : null;

  return (
    <Card
      id={`day-card-${day.id}`}
      className={cn(
        "scroll-mt-24 overflow-hidden transition-shadow",
        expanded && "shadow-[var(--shadow-lifted)]"
      )}
    >
      {/* 헤더 (접힘 상태 요약) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDay(day.id)}
          aria-expanded={expanded}
          className="flex w-full items-center gap-3 p-4 pr-20 text-left transition-colors hover:bg-secondary/40 sm:gap-4 sm:p-5 sm:pr-24"
        >
          <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <span className="text-[9px] font-semibold leading-none tracking-widest">DAY</span>
            <span className="mt-0.5 text-base font-bold leading-none tabular-nums">
              {day.dayNumber}
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted-foreground">
              {formatDateKo(day.date, { weekday: true })}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 truncate text-base font-semibold">
              <EmojiIcon emoji={day.cityEmoji} className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{day.city}</span>
            </span>
            {!expanded && preview && (
              <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <preview.icon className="h-3 w-3 shrink-0" aria-hidden />
                <span className="truncate">{preview.text}</span>
              </span>
            )}
          </span>
        </button>

        <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 sm:right-5">
          {commentCount > 0 && (
            <button
              type="button"
              onClick={() => openPanel(day.id)}
              aria-label={`${day.dayNumber}일차 댓글 ${commentCount}개 보기`}
              className="pointer-events-auto flex items-center gap-1 rounded-full bg-[var(--highlight)] px-2 py-1 text-[11px] font-semibold text-foreground/80 transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="size-3" />
              {commentCount}
            </button>
          )}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </div>
      </div>

      {/* 펼침 콘텐츠 */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.35, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-x-6 gap-y-4 border-t px-4 pb-5 pt-4 sm:grid-cols-2 sm:px-5">
              <Section icon={CalendarDays} label="날짜 / 도시">
                <span className="text-muted-foreground">
                  {formatDateKo(day.date, { weekday: true })} ·{" "}
                </span>
                <EmojiIcon
                  emoji={day.cityEmoji}
                  className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-primary"
                />
                <CommentableText dayId={day.id} fieldKey="city" text={day.city} />
              </Section>

              {hasValue(day.accommodation) && (
                <Section icon={BedDouble} label="숙소">
                  <CommentableText
                    dayId={day.id}
                    fieldKey="accommodation"
                    text={day.accommodation}
                  />
                </Section>
              )}

              {hasValue(day.transportation) && (
                <Section icon={Car} label="이동" className="sm:col-span-2">
                  <CommentableText
                    dayId={day.id}
                    fieldKey="transportation"
                    text={day.transportation}
                  />
                </Section>
              )}

              {day.schedule.length > 0 && (
                <Section icon={Clock} label="일정" className="sm:col-span-2">
                  <ol className="space-y-2.5">
                    {day.schedule.map((item, i) => {
                      const tagged = item.participantIds ?? [];
                      const dimmed =
                        viewFilter !== null && tagged.length > 0 && !tagged.includes(viewFilter);
                      return (
                        <li
                          key={i}
                          className={cn(
                            "flex items-start gap-3 transition-opacity",
                            dimmed && "opacity-35"
                          )}
                        >
                          <span className="mt-0.5 w-12 shrink-0 rounded-md bg-secondary py-0.5 text-center text-[11px] font-medium tabular-nums text-secondary-foreground">
                            {item.time}
                          </span>
                          <CommentableText
                            dayId={day.id}
                            fieldKey={`schedule.${i}`}
                            text={`${item.title}${item.description ? ` — ${item.description}` : ""}`}
                            className="min-w-0 flex-1"
                          />
                          <ParticipantPicker day={day} itemIndex={i} />
                        </li>
                      );
                    })}
                  </ol>
                </Section>
              )}

              {day.restaurants.some(hasValue) && (
                <Section icon={UtensilsCrossed} label="맛집" className="sm:col-span-2">
                  <ul className="space-y-1.5">
                    {day.restaurants.map((restaurant, i) =>
                      hasValue(restaurant) ? (
                        <li key={i} className="flex items-start gap-2">
                          <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                          <CommentableText
                            dayId={day.id}
                            fieldKey={`restaurants.${i}`}
                            text={restaurant}
                            className="min-w-0 flex-1"
                          />
                        </li>
                      ) : null
                    )}
                  </ul>
                </Section>
              )}

              {hasValue(day.christmasMarket) && (
                <Section icon={TreePine} label="크리스마스 마켓" className="sm:col-span-2">
                  <CommentableText
                    dayId={day.id}
                    fieldKey="christmasMarket"
                    text={day.christmasMarket}
                  />
                </Section>
              )}

              {hasValue(day.parking) && (
                <Section icon={SquareParking} label="주차">
                  <CommentableText dayId={day.id} fieldKey="parking" text={day.parking} />
                </Section>
              )}

              {hasValue(day.notes) && (
                <Section icon={NotebookPen} label="메모">
                  <CommentableText dayId={day.id} fieldKey="notes" text={day.notes} />
                </Section>
              )}

              {hasValue(day.rentalCarNotes) && (
                <Section icon={CarFront} label="렌터카 메모">
                  <CommentableText
                    dayId={day.id}
                    fieldKey="rentalCarNotes"
                    text={day.rentalCarNotes}
                  />
                </Section>
              )}

              {hasValue(day.winterDrivingNotes) && (
                <Section icon={Snowflake} label="겨울 운전 참고">
                  <CommentableText
                    dayId={day.id}
                    fieldKey="winterDrivingNotes"
                    text={day.winterDrivingNotes}
                  />
                </Section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
