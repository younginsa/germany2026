"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ChecklistGroup, ChecklistItem, Family } from "@/lib/types";
import { cellStates, familyDotColor } from "./checklist-utils";

interface SummaryCardProps {
  groups: ChecklistGroup[];
  items: ChecklistItem[];
  families: Family[];
}

interface FamilyStat {
  family: Family;
  checked: number;
  total: number;
  percent: number;
}

/** 전체 진행률 + 가족별 진행 현황 요약 카드 */
export function SummaryCard({ groups, items, families }: SummaryCardProps) {
  const { overall, familyStats } = useMemo(() => {
    let checked = 0;
    let total = 0;
    const perFamily = new Map<string, { checked: number; total: number }>();

    for (const group of groups) {
      const groupItems = items.filter((i) => i.groupId === group.id);
      for (const item of groupItems) {
        const states = cellStates(item, group.familyIds);
        group.familyIds.forEach((fid, idx) => {
          const s = states[idx];
          if (s === "na") return;
          total += 1;
          const agg = perFamily.get(fid) ?? { checked: 0, total: 0 };
          agg.total += 1;
          if (s === "checked") {
            checked += 1;
            agg.checked += 1;
          }
          perFamily.set(fid, agg);
        });
      }
    }

    const familyStats: FamilyStat[] = [];
    for (const family of families) {
      const agg = perFamily.get(family.id);
      if (!agg) continue;
      familyStats.push({
        family,
        checked: agg.checked,
        total: agg.total,
        percent: agg.total === 0 ? 0 : Math.round((agg.checked / agg.total) * 100),
      });
    }

    return {
      overall: {
        checked,
        total,
        percent: total === 0 ? 0 : Math.round((checked / total) * 100),
      },
      familyStats,
    };
  }, [groups, items, families]);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        {/* 전체 진행률 */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <TrendingUp className="h-4 w-4" aria-hidden />
            전체 진행률
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight">
              {overall.percent}%
            </span>
            <span className="text-sm tabular-nums text-muted-foreground">
              {overall.checked}/{overall.total} 완료
            </span>
          </div>
          <Progress value={overall.percent} className="h-2" aria-label={`전체 진행률 ${overall.percent}%`} />
        </div>

        {/* 가족별 진행 현황 */}
        <div className="grid flex-1 gap-3">
          {familyStats.map((stat) => (
            <div key={stat.family.id} className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: familyDotColor(stat.family.hue) }}
              />
              <span className="w-16 shrink-0 truncate text-sm font-medium">
                {stat.family.name}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: familyDotColor(stat.family.hue) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {stat.checked}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
