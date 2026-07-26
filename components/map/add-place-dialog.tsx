"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import type { ItineraryDay, Place, PlaceCategory } from "@/lib/types";
import { PLACE_CATEGORY_LABEL } from "@/lib/types";
import { newId, pushNotification, tripStore, useCurrentUser } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_CATEGORIES, CATEGORY_META } from "./category-meta";

/** 지도에서 선택(탭)한 장소 후보 — 저장 전 상태 */
export interface PlaceCandidate {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
  category?: PlaceCategory;
  googlePlaceId?: string;
}

interface AddPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 지도에서 선택한 장소 (좌표·이름·주소 등 프리필) */
  candidate: PlaceCandidate | null;
  days: ItineraryDay[];
  /** 저장 후 새 장소 id 전달 (선택/이동용) */
  onSaved: (placeId: string) => void;
}

/* ─── 장소 저장 시트 (지도에서 선택 → 카테고리·메모·일정 지정) ─── */

export function AddPlaceDialog({ open, onOpenChange, candidate, days, onSaved }: AddPlaceDialogProps) {
  const me = useCurrentUser();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("attraction");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [dayIds, setDayIds] = useState<string[]>([]);

  // 열릴 때마다 선택한 장소로 폼 프리필
  useEffect(() => {
    if (!open) return;
    setName(candidate?.name ?? "");
    setCategory(candidate?.category ?? "attraction");
    setAddress(candidate?.address ?? "");
    setMemo("");
    setDayIds([]);
  }, [open, candidate]);

  const coordsValid =
    !!candidate &&
    Number.isFinite(candidate.lat) &&
    Number.isFinite(candidate.lng) &&
    Math.abs(candidate.lat) <= 90 &&
    Math.abs(candidate.lng) <= 180;
  const canSave = name.trim().length > 0 && coordsValid;

  const sortedDays = useMemo(() => [...days].sort((a, b) => a.dayNumber - b.dayNumber), [days]);

  const toggleDay = (id: string) => {
    setDayIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (!canSave || !me || !candidate) return;
    const id = newId("pl");
    const place: Place = {
      id,
      tripId: tripStore.getSnapshot().trip.id,
      name: name.trim(),
      category,
      lat: candidate.lat,
      lng: candidate.lng,
      address: address.trim() || undefined,
      memo: memo.trim() || undefined,
      authorId: me.id,
      createdAt: new Date().toISOString(),
      googlePlaceId: candidate.googlePlaceId,
      dayIds,
    };
    tripStore.upsertRow("places", place);
    pushNotification({
      type: "place",
      actorId: me.id,
      message: `${me.name}님이 새 장소를 추가했습니다: ${place.name}`,
      href: `/map?place=${id}`,
    });
    toast.success("장소가 저장되었습니다", { description: place.name });
    onOpenChange(false);
    onSaved(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>장소 저장</DialogTitle>
          <DialogDescription>
            지도에서 선택한 장소를 저장합니다. 카테고리·메모·일정을 지정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* 선택한 위치 요약 */}
          <div className="flex items-start gap-2 rounded-xl border bg-muted/40 p-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <p className="min-w-0 text-xs text-muted-foreground">
              {candidate?.address ? (
                <span className="block truncate text-foreground">{candidate.address}</span>
              ) : null}
              <span className="tabular-nums">
                {candidate ? `${candidate.lat.toFixed(5)}, ${candidate.lng.toFixed(5)}` : "선택된 위치 없음"}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="place-name">장소 이름</Label>
            <Input
              id="place-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 마리엔 광장"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>카테고리</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as PlaceCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_META[cat].icon;
                  return (
                    <SelectItem key={cat} value={cat}>
                      <Icon
                        className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]"
                        style={{ color: CATEGORY_META[cat].color }}
                        aria-hidden
                      />
                      {PLACE_CATEGORY_LABEL[cat]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="place-address">주소 (선택)</Label>
            <Input
              id="place-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: Marienplatz 1, München"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="place-memo">메모 (선택)</Label>
            <Textarea
              id="place-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예약 정보, 팁 등을 남겨보세요"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>연결할 일정 일차 (선택)</Label>
            <div className="flex flex-wrap gap-1.5">
              {sortedDays.map((d) => {
                const active = dayIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    aria-pressed={active}
                    title={`${d.dayNumber}일차 · ${d.city}`}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    D{d.dayNumber}
                    <span className="ml-1 font-normal opacity-70">{d.city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            <Star />
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
