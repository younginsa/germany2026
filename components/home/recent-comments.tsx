"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useComments,
  useProfileById,
} from "@/hooks/use-app-data";
import { initialsOf, relativeTimeKo } from "@/lib/utils";

export function RecentComments() {
  const comments = useComments();
  const profileById = useProfileById();

  const recent = [...comments]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          최근 댓글
        </CardTitle>
        <Link
          href="/itinerary"
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          일정에서 보기
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {recent.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            아직 댓글이 없습니다.
          </p>
        )}
        {recent.map((comment) => {
          const author = profileById(comment.authorId);
          return (
            <Link
              key={comment.id}
              href={`/itinerary?day=${comment.anchor.targetId}&comment=${comment.id}`}
              className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent"
            >
              <Avatar className="mt-0.5">
                <AvatarFallback hue={author?.hue}>
                  {author ? initialsOf(author.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {author?.name ?? "알 수 없음"}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {relativeTimeKo(comment.createdAt)}
                  </span>
                  {comment.resolved && (
                    <Badge variant="success" className="shrink-0">
                      해결됨
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                  {comment.body}
                </p>
                <p className="mt-1 truncate border-l-2 border-highlight-active pl-2 text-xs text-muted-foreground">
                  &ldquo;{comment.anchor.selectedText}&rdquo;
                </p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
