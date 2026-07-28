"use client";

/**
 * DayEditDialog — 일차의 "내용"을 편집합니다 (도시·숙소·시간별 일정·메모 등).
 * 날짜와 순서(DAY 번호)는 일정 구성 다이얼로그에서 일괄 관리하므로
 * 여기서는 수정할 수 없습니다.
 * 시간별 일정의 placeId·participantIds 등 부가 정보는 편집 중 보존됩니다.
 */

import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { tripStore } from "@/hooks/use-app-data";
import { formatDateKo } from "@/lib/utils";
import type { ItineraryDay, ScheduleItem } from "@/lib/types";

interface DayEditDialogProps {
  /** 편집할 일차 (null이면 닫힘) */
  day: ItineraryDay | null;
  onClose: () => void;
}

/** 폼 상태 — 문자열 기반 (schedule은 원본 항목을 보존하며 편집) */
interface FormState {
  city: string;
  cityEmoji: string;
  accommodation: string;
  transportation: string;
  schedule: ScheduleItem[];
  restaurants: string[];
  christmasMarket: string;
  parking: string;
  notes: string;
  rentalCarNotes: string;
  winterDrivingNotes: string;
}

function toForm(day: ItineraryDay): FormState {
  return {
    city: day.city,
    cityEmoji: day.cityEmoji,
    accommodation: day.accommodation === "-" ? "" : day.accommodation,
    transportation: day.transportation,
    schedule: day.schedule.map((s) => ({ ...s })),
    restaurants: [...day.restaurants],
    christmasMarket: day.christmasMarket,
    parking: day.parking,
    notes: day.notes,
    rentalCarNotes: day.rentalCarNotes,
    winterDrivingNotes: day.winterDrivingNotes,
  };
}

export function DayEditDialog({ day, onClose }: DayEditDialogProps) {
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    setForm(day ? toForm(day) : null);
  }, [day]);

  if (!day || !form) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  /* ─── 시간별 일정 편집 ─── */
  const updateItem = (i: number, patch: Partial<ScheduleItem>) =>
    setForm((f) =>
      f ? { ...f, schedule: f.schedule.map((s, j) => (j === i ? { ...s, ...patch } : s)) } : f
    );
  const addItem = () =>
    setForm((f) => (f ? { ...f, schedule: [...f.schedule, { time: "", title: "" }] } : f));
  const removeItem = (i: number) =>
    setForm((f) => (f ? { ...f, schedule: f.schedule.filter((_, j) => j !== i) } : f));

  /* ─── 맛집 편집 ─── */
  const updateRestaurant = (i: number, value: string) =>
    setForm((f) => (f ? { ...f, restaurants: f.restaurants.map((r, j) => (j === i ? value : r)) } : f));
  const addRestaurant = () =>
    setForm((f) => (f ? { ...f, restaurants: [...f.restaurants, ""] } : f));
  const removeRestaurant = (i: number) =>
    setForm((f) => (f ? { ...f, restaurants: f.restaurants.filter((_, j) => j !== i) } : f));

  const save = () => {
    // 빈 일정/맛집 정리, 시간순 정렬
    const schedule = form.schedule
      .filter((s) => s.title.trim() || s.time.trim())
      .map((s) => ({ ...s, time: s.time.trim(), title: s.title.trim() }))
      .sort((a, b) => a.time.localeCompare(b.time));
    const restaurants = form.restaurants.map((r) => r.trim()).filter(Boolean);

    const updated: ItineraryDay = {
      ...day,
      city: form.city.trim() || day.city,
      cityEmoji: form.cityEmoji.trim() || day.cityEmoji,
      accommodation: form.accommodation.trim() || "-",
      transportation: form.transportation.trim(),
      schedule,
      restaurants,
      christmasMarket: form.christmasMarket.trim(),
      parking: form.parking.trim(),
      notes: form.notes.trim(),
      rentalCarNotes: form.rentalCarNotes.trim(),
      winterDrivingNotes: form.winterDrivingNotes.trim(),
    };
    tripStore.upsertRow("itineraryDays", updated);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>DAY {day.dayNumber} 편집</DialogTitle>
          <DialogDescription>
            {formatDateKo(day.date, { weekday: true })} — 날짜·순서는 ‘일정 구성’에서
            관리합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 도시 · 아이콘 */}
          <div className="grid grid-cols-[1fr_110px] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-city">도시</Label>
              <Input
                id="edit-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="도시 이름"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-emoji">아이콘 이모지</Label>
              <Input
                id="edit-emoji"
                value={form.cityEmoji}
                onChange={(e) => set("cityEmoji", e.target.value)}
                placeholder="🏰"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-accom">숙소</Label>
            <Input
              id="edit-accom"
              value={form.accommodation}
              onChange={(e) => set("accommodation", e.target.value)}
              placeholder="숙소 (비우면 표시 안 됨)"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-transport">이동</Label>
            <Textarea
              id="edit-transport"
              rows={2}
              value={form.transportation}
              onChange={(e) => set("transportation", e.target.value)}
              placeholder="이동 수단·경로"
            />
          </div>

          {/* 시간별 일정 */}
          <div className="space-y-2">
            <Label>시간별 일정</Label>
            <div className="space-y-2">
              {form.schedule.map((item, i) => (
                <div key={i} className="rounded-xl border bg-card/50 p-2.5">
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 shrink-0 text-muted-foreground/40" aria-hidden />
                    <Input
                      value={item.time}
                      onChange={(e) => updateItem(i, { time: e.target.value })}
                      placeholder="09:30"
                      className="h-9 w-20 shrink-0 tabular-nums"
                    />
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(i, { title: e.target.value })}
                      placeholder="일정 제목"
                      className="h-9 flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="일정 삭제"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(i)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.description ?? ""}
                    onChange={(e) => updateItem(i, { description: e.target.value || undefined })}
                    placeholder="설명 (선택)"
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
              <Plus className="size-4" />일정 추가
            </Button>
          </div>

          {/* 맛집 */}
          <div className="space-y-2">
            <Label>맛집</Label>
            {form.restaurants.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={r}
                  onChange={(e) => updateRestaurant(i, e.target.value)}
                  placeholder="맛집 이름·메모"
                  className="h-9 flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="맛집 삭제"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRestaurant(i)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={addRestaurant}>
              <Plus className="size-4" />맛집 추가
            </Button>
          </div>

          {/* 기타 텍스트 필드 */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-market">크리스마스 마켓</Label>
            <Textarea
              id="edit-market"
              rows={2}
              value={form.christmasMarket}
              onChange={(e) => set("christmasMarket", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-parking">주차</Label>
            <Input
              id="edit-parking"
              value={form.parking}
              onChange={(e) => set("parking", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">메모</Label>
            <Textarea
              id="edit-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-rental">렌터카 메모</Label>
            <Textarea
              id="edit-rental"
              rows={2}
              value={form.rentalCarNotes}
              onChange={(e) => set("rentalCarNotes", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-winter">겨울 운전 참고</Label>
            <Textarea
              id="edit-winter"
              rows={2}
              value={form.winterDrivingNotes}
              onChange={(e) => set("winterDrivingNotes", e.target.value)}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={save}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
