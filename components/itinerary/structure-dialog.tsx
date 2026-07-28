"use client";

/**
 * StructureDialog — 일정의 뼈대(시작일·날 순서·추가/삭제)를 한곳에서 관리합니다.
 * 날짜는 "시작일 + 순서"로 자동 계산되어 순서 꼬임·중복·빈 날이 생기지 않습니다.
 * 각 날의 세부 내용(시간별 일정 등)은 일차 카드의 '일정 수정'에서 편집합니다.
 */

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newId, tripStore } from "@/hooks/use-app-data";
import type { ItineraryDay, Trip } from "@/lib/types";

interface StructureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** dayNumber 순 정렬된 현재 일정 */
  days: ItineraryDay[];
  trip: Trip;
}

/** 편집 중인 행 — 기존 날은 id로 연결, 새 날은 isNew */
interface Row {
  id: string;
  city: string;
  isNew?: boolean;
}

function addDaysIso(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function fmtShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()} (${weekday})`;
}

export function StructureDialog({ open, onOpenChange, days, trip }: StructureDialogProps) {
  const [startDate, setStartDate] = useState(trip.startDate);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (open) {
      setStartDate(trip.startDate);
      setRows(days.map((d) => ({ id: d.id, city: d.city })));
    }
  }, [open, days, trip.startDate]);

  const move = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const j = i + dir;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const remove = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));

  const add = () =>
    setRows((rs) => [...rs, { id: newId("day"), city: "", isNew: true }]);

  const setCity = (i: number, city: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, city } : r)));

  const save = () => {
    if (rows.length === 0) {
      toast.error("최소 하루는 있어야 해요");
      return;
    }
    const byId = new Map(days.map((d) => [d.id, d]));

    // 목록에서 빠진 날은 삭제
    for (const d of days) {
      if (!rows.some((r) => r.id === d.id)) tripStore.deleteRow("itineraryDays", d.id);
    }

    // 순서대로 번호·날짜 재계산
    rows.forEach((row, i) => {
      const date = addDaysIso(startDate, i);
      const dayNumber = i + 1;
      const existing = byId.get(row.id);
      const city = row.city.trim();
      if (existing) {
        if (existing.dayNumber !== dayNumber || existing.date !== date || existing.city !== city) {
          tripStore.upsertRow("itineraryDays", { ...existing, dayNumber, date, city });
        }
      } else {
        tripStore.upsertRow("itineraryDays", {
          id: row.id,
          tripId: trip.id,
          dayNumber,
          date,
          city,
          cityEmoji: "📍",
          accommodation: "-",
          transportation: "",
          schedule: [],
          restaurants: [],
          christmasMarket: "",
          parking: "",
          notes: "",
          rentalCarNotes: "",
          winterDrivingNotes: "",
        });
      }
    });

    // 여행 기간 동기화 (홈 히어로 · 통계와 일치)
    tripStore.setTrip({
      ...trip,
      startDate,
      endDate: addDaysIso(startDate, rows.length - 1),
    });

    toast.success("일정 구성을 저장했어요");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>일정 구성</DialogTitle>
          <DialogDescription>
            시작일과 순서만 정하면 날짜는 자동으로 이어집니다. 삭제한 날의 세부 일정은
            함께 사라져요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="structure-start">여행 시작일</Label>
            <Input
              id="structure-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>일차 순서</Label>
            <ol className="space-y-1.5">
              {rows.map((row, i) => (
                <li key={row.id} className="flex items-center gap-2 rounded-xl border bg-card/50 p-2">
                  <span className="w-14 shrink-0 text-center">
                    <span className="block text-[10px] font-semibold text-muted-foreground">
                      DAY {i + 1}
                    </span>
                    <span className="block text-[11px] tabular-nums text-muted-foreground">
                      {fmtShort(addDaysIso(startDate, i))}
                    </span>
                  </span>
                  <Input
                    value={row.city}
                    onChange={(e) => setCity(i, e.target.value)}
                    placeholder="도시"
                    className="h-9 flex-1"
                  />
                  <div className="flex shrink-0 items-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="위로"
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="아래로"
                      disabled={i === rows.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`DAY ${i + 1} 삭제`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => remove(i)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
            <Button variant="outline" size="sm" className="w-full" onClick={add}>
              <Plus className="size-4" />날 추가
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={save}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
