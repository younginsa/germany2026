"use client";

/**
 * SelectionToolbar — 텍스트 드래그 시 나타나는 플로팅 "댓글 추가" 버튼과
 * 댓글 작성 팝오버. 페이지에 한 번만 마운트합니다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import {
  newId,
  pushNotification,
  tripStore,
  useCurrentUser,
  useItineraryDays,
  useProfiles,
} from "@/hooks/use-app-data";
import { useInlineComments } from "@/hooks/use-inline-comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment, Profile } from "@/lib/types";

/** 본문에서 @이름 멘션을 프로필 id 배열로 파싱 */
export function parseMentions(body: string, profiles: Profile[]): string[] {
  return profiles.filter((p) => body.includes(`@${p.name}`)).map((p) => p.id);
}

const COMPOSER_EST_HEIGHT = 230;

export function SelectionToolbar() {
  const { draft, clearDraft, openPanel } = useInlineComments();
  const me = useCurrentUser();
  const profiles = useProfiles();
  const days = useItineraryDays();

  const [mode, setMode] = useState<"button" | "composer">("button");
  const [composerPos, setComposerPos] = useState({ top: 0, left: 0, width: 320 });
  const [body, setBody] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  // 새 드래프트마다 상태 초기화
  useEffect(() => {
    setMode("button");
    setBody("");
  }, [draft]);

  // 바깥 클릭 / Escape → 드래프트 취소
  useEffect(() => {
    if (!draft) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      clearDraft();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearDraft();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [draft, clearDraft]);

  const openComposer = useCallback(() => {
    if (!draft) return;
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.min(
      Math.max(draft.anchorRect.left, 12),
      window.innerWidth - width - 12
    );
    let top = draft.anchorRect.bottom + 10;
    if (top + COMPOSER_EST_HEIGHT > window.innerHeight - 12) {
      top = Math.max(12, draft.anchorRect.top - COMPOSER_EST_HEIGHT - 10);
    }
    setComposerPos({ top, left, width });
    setMode("composer");
  }, [draft]);

  const submit = useCallback(() => {
    const trimmed = body.trim();
    if (!trimmed || !draft) return;

    const day = days.find((d) => d.id === draft.dayId);
    const mentions = parseMentions(trimmed, profiles);
    const commentId = newId("c");
    const comment: Comment = {
      id: commentId,
      tripId: tripStore.getSnapshot().trip.id,
      anchor: {
        targetType: "itinerary",
        targetId: draft.dayId,
        fieldKey: draft.fieldKey,
        selectedText: draft.selectedText,
        startOffset: draft.startOffset,
        endOffset: draft.endOffset,
      },
      authorId: me.id,
      body: trimmed,
      createdAt: new Date().toISOString(),
      resolved: false,
      mentions,
      replies: [],
    };
    tripStore.upsertRow("comments", comment);
    pushNotification({
      type: "comment",
      actorId: me.id,
      message: `${me.name}님이 ${day ? `${day.dayNumber}일차` : ""} 일정에 댓글을 남겼습니다`,
      href: `/itinerary?day=${draft.dayId}&comment=${commentId}`,
    });

    window.getSelection()?.removeAllRanges();
    clearDraft();
    openPanel(draft.dayId, commentId);
  }, [body, draft, days, profiles, me.id, me.name, clearDraft, openPanel]);

  return (
    <div ref={rootRef}>
      <AnimatePresence>
        {draft && mode === "button" && (
          <motion.div
            key="add-button"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-[70]"
            style={{ top: draft.toolbar.top, left: draft.toolbar.left }}
          >
            <button
              type="button"
              onClick={openComposer}
              className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-xs font-semibold text-background shadow-[var(--shadow-lifted)] transition-transform active:scale-95"
            >
              <MessageSquarePlus className="size-3.5" />
              댓글 추가
            </button>
          </motion.div>
        )}

        {draft && mode === "composer" && (
          <motion.div
            key="composer"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass fixed z-[70] rounded-2xl p-3 shadow-[var(--shadow-lifted)]"
            style={{ top: composerPos.top, left: composerPos.left, width: composerPos.width }}
          >
            <blockquote className="mb-2 truncate border-l-2 border-[var(--highlight-active)] pl-2 text-xs text-muted-foreground">
              “{draft.selectedText}”
            </blockquote>
            <Textarea
              autoFocus
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="댓글을 입력하세요… (@이름 으로 멘션)"
              className="min-h-[76px] resize-none bg-card/80 text-sm"
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={clearDraft}>
                취소
              </Button>
              <Button size="sm" onClick={submit} disabled={!body.trim()}>
                등록
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
