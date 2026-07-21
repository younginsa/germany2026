"use client";

/**
 * CommentableText — 일정 텍스트 한 필드를 렌더링하며
 * 이 필드에 앵커된 댓글 구간을 <mark class="comment-highlight">로 표시합니다.
 *
 * 드래그 선택 감지는 SelectionToolbar의 문서 레벨 리스너가 담당하며,
 * data-commentable-day/field 속성으로 이 필드를 찾습니다.
 *
 * 앵커 오프셋이 어긋난 경우(텍스트 수정 등)에는 selectedText로
 * 재탐색하고, 그래도 없으면 하이라이트만 생략합니다(댓글 자체는
 * 패널에 계속 표시됨).
 */

import { useMemo } from "react";
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

export function CommentableText({ dayId, fieldKey, text, className }: CommentableTextProps) {
  const allComments = useComments();
  const {
    showResolved,
    activeCommentId,
    flashCommentId,
    focusComment,
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

  return (
    <span
      data-commentable-day={dayId}
      data-commentable-field={fieldKey}
      className={cn("whitespace-pre-wrap", className)}
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
