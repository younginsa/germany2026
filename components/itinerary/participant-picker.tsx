"use client";

/**
 * ParticipantPicker — 시간별 일정 항목의 참여 멤버를 태그합니다.
 * 아무도 선택하지 않으면 전원 참여로 간주합니다.
 */

import { Check, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { tripStore, useProfiles } from "@/hooks/use-app-data";
import { cn, initialsOf } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/types";

export function ParticipantPicker({ day, itemIndex }: { day: ItineraryDay; itemIndex: number }) {
  const profiles = useProfiles();
  const item = day.schedule[itemIndex];
  const tagged = item?.participantIds ?? [];

  if (!item || profiles.length < 2) return null;

  function toggle(profileId: string) {
    const next = tagged.includes(profileId)
      ? tagged.filter((id) => id !== profileId)
      : [...tagged, profileId];
    const schedule = day.schedule.map((s, i) =>
      i === itemIndex ? { ...s, participantIds: next.length > 0 ? next : undefined } : s
    );
    tripStore.upsertRow("itineraryDays", { ...day, schedule });
  }

  const taggedProfiles = tagged
    .map((id) => profiles.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="참여 멤버 선택"
          className="mt-0.5 flex shrink-0 items-center rounded-full p-0.5 transition-colors hover:bg-accent"
        >
          {taggedProfiles.length > 0 ? (
            <span className="flex -space-x-1.5">
              {taggedProfiles.slice(0, 3).map((p) => (
                <Avatar key={p.id} className="size-4.5 border border-card">
                  <AvatarFallback hue={p.hue} className="text-[8px]">
                    {initialsOf(p.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </span>
          ) : (
            <UsersRound className="size-3.5 text-muted-foreground/50" aria-hidden />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-2">
        <p className="px-2 pb-1.5 pt-1 text-xs font-medium text-muted-foreground">
          누가 참여하나요?
        </p>
        <div className="space-y-0.5">
          {profiles.map((p) => {
            const on = tagged.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                  on && "font-medium"
                )}
              >
                <Avatar className="size-5">
                  <AvatarFallback hue={p.hue} className="text-[9px]">
                    {initialsOf(p.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                {on && <Check className="size-3.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
        <p className="px-2 pb-1 pt-1.5 text-[11px] leading-snug text-muted-foreground">
          아무도 선택하지 않으면 전원 참여로 표시돼요
        </p>
      </PopoverContent>
    </Popover>
  );
}
