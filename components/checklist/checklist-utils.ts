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

/** 새 멤버 생성 시 배정하는 hue 팔레트 */
export const MEMBER_HUE_PALETTE = [275, 155, 30, 200, 330, 90, 250] as const;

/** 멤버 컬러 도트 색상 */
export function memberDotColor(hue?: number): string {
  return `oklch(0.62 0.15 ${hue ?? 275})`;
}

export type ChecklistFilter = "all" | "todo" | "done" | "na";

export const FILTER_OPTIONS: { key: ChecklistFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "todo", label: "미완료" },
  { key: "done", label: "완료" },
  { key: "na", label: "N/A" },
];

/** 항목의 멤버별 셀 상태 배열 (누락된 키는 empty 취급) */
export function cellStates(item: ChecklistItem, memberIds: string[]): CheckState[] {
  return memberIds.map((mid) => item.checks[mid] ?? "empty");
}

/** 행이 필터에 매칭되는지 — 어느 한 멤버 셀이라도 해당 상태면 매칭 */
export function matchesFilter(
  item: ChecklistItem,
  memberIds: string[],
  filter: ChecklistFilter
): boolean {
  if (filter === "all") return true;
  const states = cellStates(item, memberIds);
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
export function computeStats(items: ChecklistItem[], memberIds: string[]): ChecklistStats {
  let checked = 0;
  let total = 0;
  for (const item of items) {
    for (const s of cellStates(item, memberIds)) {
      if (s === "na") continue;
      total += 1;
      if (s === "checked") checked += 1;
    }
  }
  return { checked, total, percent: total === 0 ? 0 : Math.round((checked / total) * 100) };
}
