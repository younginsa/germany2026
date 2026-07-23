"use client";

/**
 * CommentPanel — 포커스된 일차의 모든 인라인 댓글을 보여주는
 * 중앙 모달. 페이지 스크롤 위치를 유지한 채 열립니다.
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CornerDownRight,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  newId,
  pushNotification,
  tripStore,
  useComments,
  useCurrentUser,
  useItineraryDays,
  useProfileById,
  useProfiles,
} from "@/hooks/use-app-data";
import { useInlineComments } from "@/hooks/use-inline-comments";
import { EmojiIcon } from "@/components/ui/emoji-icon";
import { parseMentions } from "@/components/itinerary/selection-toolbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";
import type { Comment, Profile } from "@/lib/types";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 본문 속 @이름 멘션을 primary 색으로 렌더링 */
function BodyWithMentions({ body, profiles }: { body: string; profiles: Profile[] }) {
  const nodes = useMemo<ReactNode[]>(() => {
    const names = profiles
      .map((p) => p.name)
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp);
    if (names.length === 0) return [body];
    const re = new RegExp(`@(?:${names.join("|")})`, "g");
    const parts: ReactNode[] = [];
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(body)) !== null) {
      if (match.index > last) parts.push(body.slice(last, match.index));
      parts.push(
        <span key={`m-${match.index}`} className="font-semibold text-primary">
          {match[0]}
        </span>
      );
      last = match.index + match[0].length;
    }
    if (last < body.length) parts.push(body.slice(last));
    return parts;
  }, [body, profiles]);

  return <p className="whitespace-pre-wrap text-sm leading-relaxed">{nodes}</p>;
}

function AuthorAvatar({ authorId, className }: { authorId: string; className?: string }) {
  const profileById = useProfileById();
  const profile = profileById(authorId);
  const hue = profile?.hue;
  return (
    <Avatar className={cn("h-7 w-7", className)}>
      <AvatarFallback hue={hue} className="text-[10px]">
        {profile ? initialsOf(profile.name) : "?"}
      </AvatarFallback>
    </Avatar>
  );
}

function CommentItem({ comment, dayNumber }: { comment: Comment; dayNumber: number }) {
  const me = useCurrentUser();
  const profiles = useProfiles();
  const profileById = useProfileById();
  const { activeCommentId } = useInlineComments();

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  const author = profileById(comment.authorId);
  const isActive = activeCommentId === comment.id;

  const toggleResolved = useCallback(() => {
    tripStore.upsertRow("comments", {
      ...comment,
      resolved: !comment.resolved,
      resolvedBy: comment.resolved ? undefined : me.id,
    });
  }, [comment, me.id]);

  const deleteComment = useCallback(() => {
    tripStore.deleteRow("comments", comment.id);
  }, [comment.id]);

  const submitReply = useCallback(() => {
    const trimmed = replyBody.trim();
    if (!trimmed) return;
    const mentions = parseMentions(trimmed, profiles);
    tripStore.upsertRow("comments", {
      ...comment,
      replies: [
        ...comment.replies,
        {
          id: newId("cr"),
          authorId: me.id,
          body: trimmed,
          createdAt: new Date().toISOString(),
          mentions,
        },
      ],
    });
    pushNotification({
      type: mentions.length > 0 ? "mention" : "comment",
      actorId: me.id,
      message: `${me.name}님이 ${dayNumber}일차 댓글에 답글을 남겼습니다`,
      href: `/itinerary?day=${comment.anchor.targetId}&comment=${comment.id}`,
    });
    setReplyBody("");
    setReplyOpen(false);
  }, [replyBody, profiles, comment, me.id, me.name, dayNumber]);

  return (
    <article
      data-panel-comment-id={comment.id}
      className={cn(
        "rounded-xl border bg-card/70 p-3 transition-shadow",
        isActive && "ring-2 ring-ring/40",
        comment.resolved && "opacity-70"
      )}
    >
      {/* 헤더: 아바타 · 이름 · 시간 · 상태 · 메뉴 */}
      <div className="flex items-center gap-2">
        <AuthorAvatar authorId={comment.authorId} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold">{author?.name ?? "알 수 없음"}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {relativeTimeKo(comment.createdAt)}
            </span>
            {comment.resolved && (
              <Badge variant="success" className="shrink-0 px-1.5 py-0 text-[10px]">
                <Check />
                해결됨
              </Badge>
            )}
          </div>
        </div>
        {comment.authorId === me.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="댓글 메뉴">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={deleteComment}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* 인용 + 본문 */}
      <div className="mt-2">
        <blockquote className="mb-1.5 line-clamp-2 border-l-2 border-[var(--highlight-active)] pl-2 text-xs text-muted-foreground">
          “{comment.anchor.selectedText}”
        </blockquote>
        <BodyWithMentions body={comment.body} profiles={profiles} />
      </div>

      {/* 답글 목록 */}
      {comment.replies.length > 0 && (
        <div className="mt-2.5 space-y-2 border-l pl-3 sm:ml-9 sm:pl-3">
          {comment.replies.map((reply) => {
            const replyAuthor = profileById(reply.authorId);
            return (
              <div key={reply.id} className="flex items-start gap-2">
                <AuthorAvatar authorId={reply.authorId} className="h-5 w-5 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">{replyAuthor?.name ?? "알 수 없음"}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {relativeTimeKo(reply.createdAt)}
                    </span>
                  </div>
                  <BodyWithMentions body={reply.body} profiles={profiles} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 푸터: 답글 · 해결 토글 */}
      <div className="mt-2 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-muted-foreground"
          onClick={() => setReplyOpen((v) => !v)}
        >
          <CornerDownRight className="size-3.5" />
          답글
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 gap-1 px-2 text-xs",
            comment.resolved ? "text-muted-foreground" : "text-success"
          )}
          onClick={toggleResolved}
        >
          {comment.resolved ? (
            <>
              <RotateCcw className="size-3.5" />
              해결 취소
            </>
          ) : (
            <>
              <Check className="size-3.5" />
              해결
            </>
          )}
        </Button>
      </div>

      {/* 답글 작성 */}
      <AnimatePresence initial={false}>
        {replyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 flex items-end gap-2">
              <Textarea
                autoFocus
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    submitReply();
                  }
                }}
                placeholder="답글을 입력하세요… (@이름 으로 멘션)"
                className="min-h-[44px] flex-1 resize-none text-sm"
              />
              <Button size="sm" onClick={submitReply} disabled={!replyBody.trim()}>
                답글
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function CommentPanel() {
  const { panelDayId, closePanel, showResolved, activeCommentId } = useInlineComments();
  const days = useItineraryDays();
  const allComments = useComments();

  const day = days.find((d) => d.id === panelDayId);

  const dayComments = useMemo(() => {
    if (!panelDayId) return [];
    return allComments
      .filter(
        (c) =>
          c.anchor.targetType === "itinerary" &&
          c.anchor.targetId === panelDayId &&
          (showResolved || !c.resolved)
      )
      .sort(
        (a, b) =>
          Number(a.resolved) - Number(b.resolved) || a.createdAt.localeCompare(b.createdAt)
      );
  }, [allComments, panelDayId, showResolved]);

  // 패널이 열리거나 포커스가 바뀌면 해당 댓글 항목으로 스크롤
  useEffect(() => {
    if (!panelDayId || !activeCommentId) return;
    const timer = window.setTimeout(() => {
      document
        .querySelector(`[data-panel-comment-id="${activeCommentId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [panelDayId, activeCommentId]);

  return (
    <Dialog open={Boolean(day)} onOpenChange={(open) => !open && closePanel()}>
      <DialogContent
        className="max-w-lg gap-0 p-0"
        aria-label={day ? `${day.dayNumber}일차 댓글` : "댓글"}
      >
        {day && (
          <>
            {/* 헤더 */}
            <div className="flex items-center gap-2 border-b px-5 py-3.5 pr-12">
              <DialogTitle className="text-sm font-semibold">댓글</DialogTitle>
              <Badge variant="secondary" className="px-2 py-0 text-[11px]">
                {dayComments.length}
              </Badge>
              <Badge variant="accent" className="ml-1 px-2 py-0 text-[11px]">
                D{day.dayNumber} · <EmojiIcon emoji={day.cityEmoji} className="h-3 w-3" />{" "}
                {day.city}
              </Badge>
            </div>

            {/* 댓글 목록 */}
            <div className="max-h-[60vh] space-y-2.5 overflow-y-auto px-5 py-4">
              {dayComments.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  아직 댓글이 없어요. 일정 텍스트를 드래그해 첫 댓글을 남겨보세요!
                </p>
              ) : (
                dayComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} dayNumber={day.dayNumber} />
                ))
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
