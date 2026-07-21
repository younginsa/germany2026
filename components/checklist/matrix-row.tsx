"use client";

import { Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowUp, GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tripStore } from "@/hooks/use-app-data";
import type { ChecklistItem, Profile } from "@/lib/types";
import { CheckCell } from "./check-cell";
import { NEXT_STATE } from "./checklist-utils";

interface MatrixRowProps {
  item: ChecklistItem;
  members: Profile[]; // 그룹 memberIds 순서로 정렬된 멤버
  gridTemplate: string;
  canReorder: boolean;
  onDragEnd: () => void;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  onDelete: () => void;
}

/** 체크리스트 매트릭스의 한 행 — 드래그 재정렬 + 셀 상태 순환 + 행 액션 */
export function MatrixRow({
  item,
  members,
  gridTemplate,
  canReorder,
  onDragEnd,
  onInsertAbove,
  onInsertBelow,
  onDelete,
}: MatrixRowProps) {
  const controls = useDragControls();

  const cycle = (memberId: string) => {
    const current = item.checks[memberId] ?? "empty";
    tripStore.upsertRow("checklistItems", {
      ...item,
      checks: { ...item.checks, [memberId]: NEXT_STATE[current] },
    });
  };

  return (
    <Reorder.Item
      as="div"
      value={item.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.01,
        zIndex: 30,
        boxShadow: "0 8px 24px rgb(0 0 0 / 0.14)",
        borderRadius: 12,
      }}
      className="group relative grid items-center border-b bg-card last:border-b-0"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {/* 항목 라벨 — 모바일 가로 스크롤 시 고정 */}
      <div className="sticky left-0 z-10 flex h-11 min-w-0 items-center gap-1 bg-card pl-2 pr-3">
        {canReorder ? (
          <button
            type="button"
            aria-label="드래그하여 순서 변경"
            onPointerDown={(e) => {
              e.preventDefault();
              controls.start(e);
            }}
            className="shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}
        <span className="truncate text-sm" title={item.label}>
          {item.label}
        </span>
      </div>

      {/* 멤버별 상태 셀 */}
      {members.map((member) => (
        <CheckCell
          key={member.id}
          state={item.checks[member.id] ?? "empty"}
          memberName={member.name}
          onCycle={() => cycle(member.id)}
        />
      ))}

      {/* 행 액션 */}
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="행 메뉴"
              className="text-muted-foreground opacity-100 transition-opacity data-[state=open]:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onInsertAbove}>
              <ArrowUp />
              위에 행 추가
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onInsertBelow}>
              <ArrowDown />
              아래에 행 추가
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Reorder.Item>
  );
}
