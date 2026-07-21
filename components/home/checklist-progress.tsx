"use client";

import Link from "next/link";
import { ArrowRight, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useChecklistItems, useProfiles } from "@/hooks/use-app-data";
import { memberDotColor } from "@/components/checklist/checklist-utils";

/** 체크리스트 전체 진행률 — "checked"만 완료로 집계, "na" 칸은 분모에서 제외 */
export function ChecklistProgress() {
  const members = useProfiles();
  const items = useChecklistItems();

  let done = 0;
  let total = 0;
  const perMember = members.map((member) => {
    let memberDone = 0;
    let memberTotal = 0;
    for (const item of items) {
      const state = item.checks[member.id];
      if (!state || state === "na") continue;
      memberTotal += 1;
      if (state === "checked") memberDone += 1;
    }
    done += memberDone;
    total += memberTotal;
    return {
      member,
      done: memberDone,
      total: memberTotal,
      pct: memberTotal === 0 ? 0 : Math.round((memberDone / memberTotal) * 100),
    };
  });
  const overall = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          체크리스트 진행률
        </CardTitle>
        <Link
          href="/checklist"
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          열기
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-3xl font-bold tabular-nums tracking-tight">
              {overall}%
            </span>
            <span className="text-xs text-muted-foreground">
              {done}/{total} 항목 완료
            </span>
          </div>
          <Progress value={overall} aria-label="전체 체크리스트 진행률" />
        </div>

        <div className="space-y-3">
          {perMember.map(({ member, done: fd, total: ft, pct }) => (
            <div key={member.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: memberDotColor(member.hue) }}
                    aria-hidden
                  />
                  {member.name}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {fd}/{ft} · {pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: memberDotColor(member.hue) }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
