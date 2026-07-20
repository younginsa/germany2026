"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  ListChecks,
  MapPin,
  MessageSquareQuote,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PollOptions } from "@/components/board/poll-card";
import { CATEGORY_EMOJI, domainOf } from "@/components/board/post-meta";
import {
  useChecklistGroups,
  useChecklistItems,
  useComments,
  useFamilyById,
  usePlaces,
  useProfileById,
} from "@/hooks/use-app-data";
import type { Post } from "@/lib/types";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";

/**
 * 카드 본문 — 타입별 렌더링. 카드(요약)와 상세 다이얼로그(전체) 공용.
 */
export function PostBody({ post, detail = false }: { post: Post; detail?: boolean }) {
  const places = usePlaces();
  const checklistItems = useChecklistItems();
  const checklistGroups = useChecklistGroups();
  const comments = useComments();
  const profileById = useProfileById();
  const familyById = useFamilyById();

  const bodyText = post.body ? (
    <p
      className={cn(
        "whitespace-pre-wrap text-sm leading-relaxed text-foreground/80",
        !detail && (post.type === "text" ? "line-clamp-6" : "line-clamp-3")
      )}
    >
      {post.body}
    </p>
  ) : null;

  switch (post.type) {
    case "text":
      return bodyText;

    case "image":
      return bodyText;

    case "location": {
      const place = places.find((p) => p.id === post.placeId);
      return (
        <div className="space-y-2.5">
          {bodyText}
          {place ? (
            <div className="rounded-xl border bg-muted/50 p-3">
              <div className="flex items-start gap-2.5">
                <span className="text-xl leading-none">{CATEGORY_EMOJI[place.category]}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{place.name}</p>
                  {place.memo && (
                    <p className={cn("mt-0.5 text-xs text-muted-foreground", !detail && "line-clamp-2")}>
                      {place.memo}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={`/map?place=${place.id}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <MapPin className="size-3" />
                지도에서 보기
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">참조된 장소를 찾을 수 없어요</p>
          )}
        </div>
      );
    }

    case "link":
      return (
        <div className="space-y-2.5">
          {bodyText}
          {post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/link flex items-center gap-2.5 rounded-xl border bg-muted/50 p-3 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                <ExternalLink className="size-3.5 text-primary" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground group-hover/link:text-primary">
                  {domainOf(post.linkUrl)}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{post.linkUrl}</span>
              </span>
              <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
            </a>
          )}
        </div>
      );

    case "poll":
      return (
        <div className="space-y-2.5">
          {bodyText}
          <PollOptions post={post} />
        </div>
      );

    case "checklist_ref": {
      const item = checklistItems.find((i) => i.id === post.refId);
      const group = item ? checklistGroups.find((g) => g.id === item.groupId) : undefined;
      return (
        <div className="space-y-2.5">
          {bodyText}
          {item ? (
            <div className="rounded-xl border bg-muted/50 p-3">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                  <ListChecks className="size-3.5 text-success" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  {group && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{group.title}</p>
                  )}
                </div>
              </div>
              <Link
                href="/checklist"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                체크리스트에서 보기
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">참조된 체크리스트 항목을 찾을 수 없어요</p>
          )}
        </div>
      );
    }

    case "comment_ref": {
      const comment = comments.find((c) => c.id === post.refId);
      const author = comment ? profileById(comment.authorId) : undefined;
      const fam = author ? familyById(author.familyId) : undefined;
      return (
        <div className="space-y-2.5">
          {bodyText}
          {comment ? (
            <div className="rounded-xl border bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="size-3.5 shrink-0 text-primary" />
                <Avatar className="size-5">
                  <AvatarFallback hue={fam?.hue} className="text-[9px]">
                    {author ? initialsOf(author.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{author?.name ?? "알 수 없음"}</span>
                <span className="text-[11px] text-muted-foreground" suppressHydrationWarning>
                  {relativeTimeKo(comment.createdAt)}
                </span>
              </div>
              <blockquote
                className={cn(
                  "mt-2 border-l-2 border-primary/40 pl-3 text-sm italic text-foreground/80",
                  !detail && "line-clamp-3"
                )}
              >
                {comment.body}
              </blockquote>
              <Link
                href={`/itinerary?day=${comment.anchor.targetId}&comment=${comment.id}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                일정에서 보기
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">참조된 코멘트를 찾을 수 없어요</p>
          )}
        </div>
      );
    }
  }
}
