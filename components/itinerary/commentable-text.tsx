"use client";

/**
 * CommentableText — 일정 텍스트 한 필드를 렌더링하며
 *
 * 1. 이 필드에 앵커된 댓글 구간을 <mark class="comment-highlight">로 표시
 * 2. 드래그 선택 시 플로팅 "댓글 추가" 드래프트를 시작
 *
 * 앵커 오프셋이 어긋난 경우(텍스트 수정 등)에는 selectedText로
 * 재탐색하고, 그래도 없으면 하이라이트만 생략합니다(댓글 자체는
 * 패널에 계속 표시됨).
 */

import { useCallback, useMemo, useRef } from "react";
import { useComments } from "@/hooks/use-app-data";
import { useInlineComments } from "@/hooks/use-inline-comments";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface CommentableTextProps {
  dayId: string;
  fieldKey: string;
  text: string;
  className?: string;
}

interface PlacedAnchor {
  comment: Comment;
  start: number;
  end: number;
}

type Segment =
  | { kind: "plain"; text: string; key: string }
  | { kind: "highlight"; text: string; comment: Comment; key: string };

const TOOLBAR_WIDTH = 108;

export function CommentableText({ dayId, fieldKey, text, className }: CommentableTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const allComments = useComments();
  const {
    showResolved,
    activeCommentId,
    flashCommentId,
    focusComment,
    startDraft,
  } = useInlineComments();

  const fieldComments = useMemo(
    () =>
      allComments.filter(
        (c) =>
          c.anchor.targetType === "itinerary" &&
          c.anchor.targetId === dayId &&
          c.anchor.fieldKey === fieldKey &&
          (showResolved || !c.resolved)
      ),
    [allComments, dayId, fieldKey, showResolved]
  );

  const segments = useMemo<Segment[]>(() => {
    const placed: PlacedAnchor[] = [];
    for (const comment of fieldComments) {
      const { startOffset, endOffset, selectedText } = comment.anchor;
      let start = startOffset;
      let end = endOffset;
      // 오프셋 검증 — 어긋나면 selectedText로 재탐색, 실패 시 생략
      if (text.slice(start, end) !== selectedText) {
        const idx = selectedText ? text.indexOf(selectedText) : -1;
        if (idx === -1) continue;
        start = idx;
        end = idx + selectedText.length;
      }
      if (start < 0 || end <= start || end > text.length) continue;
      placed.push({ comment, start, end });
    }
    placed.sort((a, b) => a.start - b.start || a.end - b.end);

    // 겹치는 앵커는 앞선 것이 우선
    const result: Segment[] = [];
    let cursor = 0;
    for (const p of placed) {
      if (p.start < cursor) continue;
      if (p.start > cursor) {
        result.push({ kind: "plain", text: text.slice(cursor, p.start), key: `t-${cursor}` });
      }
      result.push({
        kind: "highlight",
        text: text.slice(p.start, p.end),
        comment: p.comment,
        key: `h-${p.comment.id}`,
      });
      cursor = p.end;
    }
    if (cursor < text.length) {
      result.push({ kind: "plain", text: text.slice(cursor), key: `t-${cursor}` });
    }
    return result;
  }, [fieldComments, text]);

  /** 드래그 선택 → 드래프트 시작 (mouseup/touchend 공용) */
  const handleSelection = useCallback(() => {
    // 브라우저가 selection을 확정할 시간을 준 뒤 읽음 (터치 대응)
    window.setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      if (
        !container.contains(range.startContainer) ||
        !container.contains(range.endContainer)
      ) {
        return;
      }

      // 컨테이너 시작 ~ 선택 시작까지의 텍스트 길이 = startOffset
      const prefix = document.createRange();
      prefix.selectNodeContents(container);
      prefix.setEnd(range.startContainer, range.startOffset);
      const start = prefix.toString().length;
      const selectedText = range.toString();
      const end = start + selectedText.length;

      if (!selectedText.trim() || end <= start) return;
      if (end > text.length || text.slice(start, end) !== selectedText) return;

      const rect = range.getBoundingClientRect();
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
  }, [dayId, fieldKey, text, startDraft]);

  return (
    <span
      ref={containerRef}
      className={cn("whitespace-pre-wrap", className)}
      onMouseUp={handleSelection}
      onTouchEnd={handleSelection}
    >
      {segments.map((seg) =>
        seg.kind === "plain" ? (
          <span key={seg.key}>{seg.text}</span>
        ) : (
          <mark
            key={seg.key}
            className="comment-highlight"
            data-comment-id={seg.comment.id}
            data-active={activeCommentId === seg.comment.id ? "true" : undefined}
            data-flash={flashCommentId === seg.comment.id ? "true" : undefined}
            data-resolved={seg.comment.resolved ? "true" : undefined}
            role="button"
            tabIndex={0}
            aria-label={`댓글 보기: ${seg.text}`}
            onClick={(e) => {
              e.stopPropagation();
              focusComment(seg.comment, { openPanel: true });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                focusComment(seg.comment, { openPanel: true });
              }
            }}
          >
            {seg.text}
          </mark>
        )
      )}
    </span>
  );
}
