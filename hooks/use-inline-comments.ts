"use client";

/**
 * 인라인 댓글 시스템의 공유 상태.
 *
 * · 일차 카드 펼침 상태 (댓글 포커스 시 자동 펼침을 위해 공유)
 * · 활성/플래시 댓글 하이라이트
 * · 하단 댓글 패널 (일차 단위 포커스)
 * · 드래그 선택 → 댓글 작성 드래프트
 */

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Comment } from "@/lib/types";

/** 텍스트 드래그 직후의 댓글 작성 드래프트 */
export interface DraftSelection {
  dayId: string;
  fieldKey: string;
  selectedText: string;
  startOffset: number;
  endOffset: number;
  /** 플로팅 "댓글 추가" 버튼 위치 (viewport 기준, 클램프 완료) */
  toolbar: { top: number; left: number };
  /** 선택 영역 rect — 작성 팝오버 위치 계산용 */
  anchorRect: { top: number; bottom: number; left: number; width: number };
  /** true면 "댓글 추가" 버튼 단계를 건너뛰고 바로 작성 팝오버 열기 (행별 댓글 버튼용) */
  autoCompose?: boolean;
}

interface FocusOptions {
  /** 하단 패널을 해당 일차로 엽니다 */
  openPanel?: boolean;
  /** 하이라이트로 스크롤 + 플래시 */
  scroll?: boolean;
}

interface InlineCommentsContextValue {
  /* 일차 카드 펼침 */
  expandedDays: Record<string, boolean>;
  isDayExpanded: (dayId: string) => boolean;
  toggleDay: (dayId: string) => void;
  expandDay: (dayId: string) => void;

  /* 해결된 댓글 표시 여부 */
  showResolved: boolean;
  setShowResolved: (v: boolean) => void;

  /* 하이라이트 상태 */
  activeCommentId: string | null;
  flashCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;

  /* 하단 패널 */
  panelDayId: string | null;
  openPanel: (dayId: string, commentId?: string) => void;
  closePanel: () => void;

  /* 댓글 포커스 (패널/하이라이트/알림 링크 공용) */
  focusComment: (comment: Comment, opts?: FocusOptions) => void;

  /* 선택 드래프트 */
  draft: DraftSelection | null;
  startDraft: (draft: DraftSelection) => void;
  clearDraft: () => void;
}

const InlineCommentsContext = createContext<InlineCommentsContextValue | null>(null);

export function InlineCommentsProvider({ children }: { children: ReactNode }) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [showResolved, setShowResolved] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [flashCommentId, setFlashCommentId] = useState<string | null>(null);
  const [panelDayId, setPanelDayId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftSelection | null>(null);
  const flashTimer = useRef<number | null>(null);

  const isDayExpanded = useCallback(
    (dayId: string) => Boolean(expandedDays[dayId]),
    [expandedDays]
  );

  const toggleDay = useCallback((dayId: string) => {
    setExpandedDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  }, []);

  const expandDay = useCallback((dayId: string) => {
    setExpandedDays((prev) => (prev[dayId] ? prev : { ...prev, [dayId]: true }));
  }, []);

  /** 하이라이트를 ~2초간 플래시 */
  const flashComment = useCallback((id: string) => {
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    setFlashCommentId(id);
    flashTimer.current = window.setTimeout(() => {
      setFlashCommentId((current) => (current === id ? null : current));
      flashTimer.current = null;
    }, 2000);
  }, []);

  /**
   * 하이라이트 <mark>로 스크롤 — 카드 펼침 애니메이션 중에는 아직
   * DOM에 없을 수 있으므로 재시도합니다.
   */
  const scrollToHighlight = useCallback((commentId: string) => {
    let tries = 0;
    const attempt = () => {
      const el = document.querySelector<HTMLElement>(
        `mark[data-comment-id="${commentId}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      tries += 1;
      if (tries < 12) window.setTimeout(attempt, 150);
    };
    window.setTimeout(attempt, 200);
  }, []);

  const openPanel = useCallback((dayId: string, commentId?: string) => {
    setPanelDayId(dayId);
    if (commentId) setActiveCommentId(commentId);
  }, []);

  const closePanel = useCallback(() => {
    setPanelDayId(null);
    setActiveCommentId(null);
  }, []);

  const focusComment = useCallback(
    (comment: Comment, opts?: FocusOptions) => {
      expandDay(comment.anchor.targetId);
      setActiveCommentId(comment.id);
      if (opts?.openPanel) setPanelDayId(comment.anchor.targetId);
      if (opts?.scroll) {
        flashComment(comment.id);
        scrollToHighlight(comment.id);
      }
    },
    [expandDay, flashComment, scrollToHighlight]
  );

  const startDraft = useCallback((next: DraftSelection) => setDraft(next), []);
  const clearDraft = useCallback(() => setDraft(null), []);

  const value = useMemo<InlineCommentsContextValue>(
    () => ({
      expandedDays,
      isDayExpanded,
      toggleDay,
      expandDay,
      showResolved,
      setShowResolved,
      activeCommentId,
      flashCommentId,
      setActiveCommentId,
      panelDayId,
      openPanel,
      closePanel,
      focusComment,
      draft,
      startDraft,
      clearDraft,
    }),
    [
      expandedDays,
      isDayExpanded,
      toggleDay,
      expandDay,
      showResolved,
      activeCommentId,
      flashCommentId,
      panelDayId,
      openPanel,
      closePanel,
      focusComment,
      draft,
      startDraft,
      clearDraft,
    ]
  );

  return createElement(InlineCommentsContext.Provider, { value }, children);
}

export function useInlineComments(): InlineCommentsContextValue {
  const ctx = useContext(InlineCommentsContext);
  if (!ctx) {
    throw new Error("useInlineComments는 InlineCommentsProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
