import type { CheckState, ChecklistItem } from "@/lib/types";

/** 셀 탭 시 상태 순환: 미완료 → 완료 → N/A → 미완료 */
export const NEXT_STATE: Record<CheckState, CheckState> = {
  empty: "checked",
  checked: "na",
  na: "empty",
};

export const STATE_LABEL: Record<CheckState, string> = {
  empty: "미완료",
  checked: "완료",
  na: "해당 없음",
};

/** 새 가족 생성 시 배정하는 hue 팔레트 */
export const FAMILY_HUE_PALETTE = [275, 155, 30, 200, 330] as const;

/** 가족 컬러 도트 색상 */
export function familyDotColor(hue: number): string {
  return `oklch(0.62 0.15 ${hue})`;
}

export type ChecklistFilter = "all" | "todo" | "done" | "na";

export const FILTER_OPTIONS: { key: ChecklistFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "todo", label: "미완료" },
  { key: "done", label: "완료" },
  { key: "na", label: "N/A" },
];

/** 항목의 가족별 셀 상태 배열 (누락된 키는 empty 취급) */
export function cellStates(item: ChecklistItem, familyIds: string[]): CheckState[] {
  return familyIds.map((fid) => item.checks[fid] ?? "empty");
}

/** 행이 필터에 매칭되는지 — 어느 한 가족 셀이라도 해당 상태면 매칭 */
export function matchesFilter(
  item: ChecklistItem,
  familyIds: string[],
  filter: ChecklistFilter
): boolean {
  if (filter === "all") return true;
  const states = cellStates(item, familyIds);
  if (filter === "todo") return states.some((s) => s === "empty");
  if (filter === "done") return states.some((s) => s === "checked");
  return states.some((s) => s === "na");
}

export interface ChecklistStats {
  checked: number;
  /** N/A 셀 제외 */
  total: number;
  percent: number;
}

/** 완료 통계 — total은 N/A 셀을 제외한 셀 수 */
export function computeStats(items: ChecklistItem[], familyIds: string[]): ChecklistStats {
  let checked = 0;
  let total = 0;
  for (const item of items) {
    for (const s of cellStates(item, familyIds)) {
      if (s === "na") continue;
      total += 1;
      if (s === "checked") checked += 1;
    }
  }
  return { checked, total, percent: total === 0 ? 0 : Math.round((checked / total) * 100) };
}
