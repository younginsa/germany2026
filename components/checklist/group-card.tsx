"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { CornerDownLeft, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { newId, tripStore } from "@/hooks/use-app-data";
import type { CheckState, ChecklistGroup, ChecklistItem, Profile } from "@/lib/types";
import {
  computeStats,
  memberDotColor,
  matchesFilter,
  type ChecklistFilter,
} from "./checklist-utils";
import { MatrixRow } from "./matrix-row";

interface GroupCardProps {
  group: ChecklistGroup;
  items: ChecklistItem[]; // 이 그룹의 항목 (order 정렬)
  allItems: ChecklistItem[]; // 전체 체크리스트 항목 (replaceAll 용)
  members: Profile[];
  search: string;
  filter: ChecklistFilter;
}

function emptyChecks(memberIds: string[]): Record<string, CheckState> {
  const checks: Record<string, CheckState> = {};
  for (const fid of memberIds) checks[fid] = "empty";
  return checks;
}

export function GroupCard({ group, items, allItems, members, search, filter }: GroupCardProps) {
  const groupMembers = useMemo(
    () =>
      group.memberIds
        .map((mid) => members.find((m) => m.id === mid))
        .filter((m): m is Profile => Boolean(m)),
    [group.memberIds, members]
  );

  /* ─── 로컬 순서 상태 (드래그 중 스토어와 분리, 드롭 시 커밋) ─── */
  const [orderedIds, setOrderedIds] = useState<string[]>(() => items.map((i) => i.id));
  const orderedIdsRef = useRef(orderedIds);
  orderedIdsRef.current = orderedIds;

  const storeSignature = items.map((i) => i.id).join("|");
  useEffect(() => {
    if (storeSignature !== orderedIdsRef.current.join("|")) {
      setOrderedIds(storeSignature ? storeSignature.split("|") : []);
    }
  }, [storeSignature]);

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  /* ─── 검색/필터 ─── */
  const query = search.trim().toLowerCase();
  const isFiltering = query.length > 0 || filter !== "all";
  const visibleIds = orderedIds.filter((id) => {
    const item = itemById.get(id);
    if (!item) return false;
    if (query && !item.label.toLowerCase().includes(query)) return false;
    return matchesFilter(item, group.memberIds, filter);
  });
  const canReorder = !isFiltering;

  /* ─── 통계 ─── */
  const stats = computeStats(items, group.memberIds);

  /* ─── 그리드 ─── */
  const gridTemplate = `minmax(220px, 1fr) repeat(${groupMembers.length}, 76px) 44px`;
  const minWidth = 220 + groupMembers.length * 76 + 44;

  /* ─── 변경 API ─── */
  const commitOrder = () => {
    const renumbered = orderedIdsRef.current
      .map((id) => itemById.get(id))
      .filter((i): i is ChecklistItem => Boolean(i))
      .map((item, index) => ({ ...item, order: index }));
    const others = allItems.filter((i) => i.groupId !== group.id);
    tripStore.replaceAll("checklistItems", [...others, ...renumbered]);
  };

  const insertAt = (index: number, label: string) => {
    const current = orderedIdsRef.current
      .map((id) => itemById.get(id))
      .filter((i): i is ChecklistItem => Boolean(i));
    const newItem: ChecklistItem = {
      id: newId("ci"),
      groupId: group.id,
      label,
      order: 0,
      checks: emptyChecks(group.memberIds),
    };
    const next = [...current];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, newItem);
    const renumbered = next.map((item, i) => ({ ...item, order: i }));
    const others = allItems.filter((i) => i.groupId !== group.id);
    tripStore.replaceAll("checklistItems", [...others, ...renumbered]);
  };

  const appendItem = (label: string) => {
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order), -1);
    tripStore.upsertRow("checklistItems", {
      id: newId("ci"),
      groupId: group.id,
      label,
      order: maxOrder + 1,
      checks: emptyChecks(group.memberIds),
    });
  };

  const deleteGroup = () => {
    for (const item of items) tripStore.deleteRow("checklistItems", item.id);
    tripStore.deleteRow("checklistGroups", group.id);
  };

  /* ─── 다이얼로그 상태 ─── */
  const [insertTarget, setInsertTarget] = useState<{ index: number } | null>(null);
  const [insertLabel, setInsertLabel] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(group.title);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState("");

  const submitInsert = () => {
    const label = insertLabel.trim();
    if (!label || !insertTarget) return;
    insertAt(insertTarget.index, label);
    setInsertTarget(null);
    setInsertLabel("");
  };

  const submitRename = () => {
    const title = renameValue.trim();
    if (!title) return;
    tripStore.upsertRow("checklistGroups", { ...group, title });
    setRenameOpen(false);
  };

  const submitQuickAdd = () => {
    const label = quickAdd.trim();
    if (!label) return;
    appendItem(label);
    setQuickAdd("");
  };

  return (
    <Card className="overflow-hidden">
      {/* 그룹 헤더 */}
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight">{group.title}</h3>
          <p className="mt-1 text-xs tabular-nums text-muted-foreground">
            {stats.checked}/{stats.total} 완료 · {stats.percent}%
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="그룹 메뉴" className="text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                setRenameValue(group.title);
                setRenameOpen(true);
              }}
            >
              <Pencil />
              이름 바꾸기
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
              그룹 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-5 pb-4">
        <Progress
          value={stats.percent}
          className="h-1.5"
          aria-label={`${group.title} 진행률 ${stats.percent}%`}
        />
      </div>

      {/* 매트릭스 */}
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>
          {/* 헤더 행 */}
          <div
            className="grid items-center border-y bg-card"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="sticky left-0 z-10 bg-card py-2.5 pl-4 pr-3 text-xs font-medium text-muted-foreground">
              항목
            </div>
            {groupMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium"
              >
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: memberDotColor(member.hue) }}
                />
                <span className="truncate">{member.name}</span>
              </div>
            ))}
            <span />
          </div>

          {/* 행 목록 */}
          {visibleIds.length > 0 ? (
            <Reorder.Group
              as="div"
              axis="y"
              values={visibleIds}
              onReorder={(next: string[]) => {
                if (canReorder) setOrderedIds(next);
              }}
            >
              {visibleIds.map((id) => {
                const item = itemById.get(id);
                if (!item) return null;
                const index = orderedIds.indexOf(id);
                return (
                  <MatrixRow
                    key={id}
                    item={item}
                    members={groupMembers}
                    gridTemplate={gridTemplate}
                    canReorder={canReorder}
                    onDragEnd={commitOrder}
                    onInsertAbove={() => {
                      setInsertLabel("");
                      setInsertTarget({ index });
                    }}
                    onInsertBelow={() => {
                      setInsertLabel("");
                      setInsertTarget({ index: index + 1 });
                    }}
                    onDelete={() => tripStore.deleteRow("checklistItems", item.id)}
                  />
                );
              })}
            </Reorder.Group>
          ) : (
            <p className="border-b px-4 py-6 text-center text-sm text-muted-foreground">
              {isFiltering ? "조건에 맞는 항목이 없습니다" : "아직 항목이 없습니다 — 아래에서 추가해 보세요"}
            </p>
          )}
        </div>
      </div>

      {/* 항목 빠른 추가 */}
      <div className="flex items-center gap-2 p-3 pl-4">
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <Input
          value={quickAdd}
          onChange={(e) => setQuickAdd(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) submitQuickAdd();
          }}
          placeholder="항목 추가…"
          aria-label={`${group.title}에 항목 추가`}
          className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1"
        />
        {quickAdd.trim() && (
          <Button variant="secondary" size="sm" onClick={submitQuickAdd} className="shrink-0">
            <CornerDownLeft />
            추가
          </Button>
        )}
      </div>

      {/* 행 삽입 다이얼로그 */}
      <Dialog
        open={insertTarget !== null}
        onOpenChange={(open) => {
          if (!open) setInsertTarget(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>행 추가</DialogTitle>
            <DialogDescription>추가할 항목의 이름을 입력하세요.</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={insertLabel}
            onChange={(e) => setInsertLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) submitInsert();
            }}
            placeholder="예: 상비약 챙기기"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInsertTarget(null)}>
              취소
            </Button>
            <Button onClick={submitInsert} disabled={!insertLabel.trim()}>
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 이름 바꾸기 다이얼로그 */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>그룹 이름 바꾸기</DialogTitle>
            <DialogDescription>새 그룹 이름을 입력하세요.</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) submitRename();
            }}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>
              취소
            </Button>
            <Button onClick={submitRename} disabled={!renameValue.trim()}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 그룹 삭제 확인 다이얼로그 */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>&ldquo;{group.title}&rdquo; 삭제</DialogTitle>
            <DialogDescription>
              그룹과 모든 항목이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={deleteGroup}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
