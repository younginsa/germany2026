"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Pencil, Trash2, X } from "lucide-react";
import type { ItineraryDay, Place } from "@/lib/types";
import {
  tripStore,
  useCurrentUser,
  useFamilyById,
  useProfileById,
} from "@/hooks/use-app-data";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_META, withAlpha } from "./category-meta";

interface PlaceDetailCardProps {
  place: Place;
  days: ItineraryDay[];
  onClose: () => void;
}

/** 선택된 장소 상세 오버레이 카드 (지도 위 플로팅 / 모바일 하단) */
export function PlaceDetailCard({ place, days, onClose }: PlaceDetailCardProps) {
  const me = useCurrentUser();
  const profileById = useProfileById();
  const familyById = useFamilyById();

  const meta = CATEGORY_META[place.category];
  const author = profileById(place.authorId);
  const family = author ? familyById(author.familyId) : undefined;
  const linkedDays = days
    .filter((d) => place.dayIds.includes(d.id))
    .sort((a, b) => a.dayNumber - b.dayNumber);
  const isMine = place.authorId === me?.id;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [memoOpen, setMemoOpen] = useState(false);
  const [memoDraft, setMemoDraft] = useState(place.memo ?? "");

  // 다른 장소 선택 시 상태 초기화
  useEffect(() => {
    setConfirmDelete(false);
    setMemoDraft(place.memo ?? "");
  }, [place.id, place.memo]);

  const handleDelete = () => {
    tripStore.deleteRow("places", place.id);
    onClose();
  };

  const saveMemo = () => {
    tripStore.upsertRow("places", { ...place, memo: memoDraft.trim() || undefined });
    setMemoOpen(false);
  };

  return (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.21, 1.02, 0.73, 1] }}
      className="glass pointer-events-auto w-full rounded-2xl p-4 shadow-[var(--shadow-lifted)] sm:max-w-sm"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm"
          style={{ backgroundColor: withAlpha(meta.color, 0.16) }}
          aria-hidden
        >
          {meta.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold">{place.name}</h3>
            <span
              className="shrink-0 rounded-full px-2 py-px text-[10px] font-semibold"
              style={{ backgroundColor: withAlpha(meta.color, 0.14), color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          {place.address && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              {place.address}
            </p>
          )}
          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground/70">
            {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="닫기">
          <X />
        </Button>
      </div>

      {place.memo && (
        <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed">{place.memo}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar className="h-6 w-6">
            <AvatarFallback hue={family?.hue} className="text-[10px]">
              {author ? initialsOf(author.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-[11px] text-muted-foreground">
            {author?.name ?? "알 수 없음"} · {relativeTimeKo(place.createdAt)}
          </span>
        </div>
        {linkedDays.length > 0 && (
          <div className="flex shrink-0 gap-1">
            {linkedDays.map((d) => (
              <span
                key={d.id}
                className="rounded-md bg-accent px-1.5 py-px text-[10px] font-semibold text-accent-foreground"
                title={`${d.dayNumber}일차 · ${d.city}`}
              >
                D{d.dayNumber}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t pt-3">
        {linkedDays.length > 0 && (
          <Link
            href={`/itinerary?day=${linkedDays[0].id}`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1")}
          >
            <CalendarDays />
            일정에서 보기
          </Link>
        )}
        <Button variant="outline" size="sm" className={linkedDays.length > 0 ? "" : "flex-1"} onClick={() => setMemoOpen(true)}>
          <Pencil />
          메모 수정
        </Button>
        {isMine &&
          (confirmDelete ? (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 />
              정말 삭제할까요?
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 />
              삭제
            </Button>
          ))}
      </div>

      {/* 메모 수정 다이얼로그 */}
      <Dialog open={memoOpen} onOpenChange={setMemoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>메모 수정</DialogTitle>
            <DialogDescription>{place.name}에 대한 메모를 수정합니다.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={memoDraft}
            onChange={(e) => setMemoDraft(e.target.value)}
            placeholder="메모를 입력하세요…"
            rows={4}
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setMemoOpen(false)}>
              취소
            </Button>
            <Button onClick={saveMemo}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
