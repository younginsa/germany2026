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
const TOOLBAR_WIDTH = 108;

export function SelectionToolbar() {
  const { draft, startDraft, clearDraft, openPanel } = useInlineComments();
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

  /**
   * 드래그 선택 감지 (문서 레벨).
   * 선택 영역이 어느 CommentableText와든 겹치면, 그 필드 안쪽으로
   * 범위를 클램프해서 드래프트를 시작합니다 — 라벨이나 여백에서
   * 드래그를 시작/종료해도 동작합니다.
   */
  useEffect(() => {
    const handleSelection = (e: Event) => {
      // 툴바/작성 팝오버 내부에서 뗀 경우는 무시
      if (rootRef.current?.contains(e.target as Node)) return;
      // 브라우저가 selection을 확정할 시간을 준 뒤 읽음 (터치 대응)
      window.setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);

        // 선택 영역과 겹치는 첫 번째 필드(문서 순서 = 선택 시작 지점)
        const fields = document.querySelectorAll<HTMLElement>("[data-commentable-field]");
        let container: HTMLElement | null = null;
        for (const el of fields) {
          if (range.intersectsNode(el)) {
            container = el;
            break;
          }
        }
        if (!container) return;
        const dayId = container.dataset.commentableDay;
        const fieldKey = container.dataset.commentableField;
        if (!dayId || !fieldKey) return;

        // 선택 범위를 필드 안쪽으로 클램프
        const containerRange = document.createRange();
        containerRange.selectNodeContents(container);
        const clamped = range.cloneRange();
        if (clamped.compareBoundaryPoints(Range.START_TO_START, containerRange) < 0) {
          clamped.setStart(containerRange.startContainer, containerRange.startOffset);
        }
        if (clamped.compareBoundaryPoints(Range.END_TO_END, containerRange) > 0) {
          clamped.setEnd(containerRange.endContainer, containerRange.endOffset);
        }

        // 필드 시작 ~ 선택 시작까지의 텍스트 길이 = startOffset
        const prefix = document.createRange();
        prefix.selectNodeContents(container);
        prefix.setEnd(clamped.startContainer, clamped.startOffset);
        const start = prefix.toString().length;
        const selectedText = clamped.toString();
        const end = start + selectedText.length;
        if (!selectedText.trim() || end <= start) return;

        const rect = clamped.getBoundingClientRect();
        const left = Math.min(
          Math.max(rect.left + rect.width / 2 - TOOLBAR_WIDTH / 2, 8),
          window.innerWidth - TOOLBAR_WIDTH - 8
        );
        const top = rect.top - 44 >= 8 ? rect.top - 44 : rect.bottom + 8;

        startDraft({
          dayId,
          fieldKey,
          selectedText,
          startOffset: start,
          endOffset: end,
          toolbar: { top, left },
          anchorRect: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width },
        });
      }, 0);
    };
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [startDraft]);

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
