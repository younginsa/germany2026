"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostBody } from "@/components/board/post-body";
import { POST_TYPE_META } from "@/components/board/post-meta";
import {
  tripStore,
  useCurrentUser,
  useProfileById,
} from "@/hooks/use-app-data";
import type { Post } from "@/lib/types";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  index: number;
  onOpen: (id: string) => void;
  onEdit: (post: Post) => void;
}

export function PostCard({ post, index, onOpen, onEdit }: PostCardProps) {
  const me = useCurrentUser();
  const profileById = useProfileById();

  const author = profileById(post.authorId);
  const isMine = post.authorId === me.id;
  const liked = post.likedBy.includes(me.id);
  const meta = POST_TYPE_META[post.type];
  const TypeIcon = meta.icon;

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    tripStore.upsertRow("posts", {
      ...post,
      likedBy: liked ? post.likedBy.filter((id) => id !== me.id) : [...post.likedBy, me.id],
    });
  };

  const handleDelete = (e: Event) => {
    e.preventDefault();
    if (window.confirm(`"${post.title}" 카드를 삭제할까요? 되돌릴 수 없어요.`)) {
      tripStore.deleteRow("posts", post.id);
      toast.success("카드를 삭제했어요");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.45),
        duration: 0.45,
        ease: [0.21, 1.02, 0.73, 1],
      }}
      onClick={() => onOpen(post.id)}
      className="group cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lifted)]"
    >
      {post.type === "image" && post.imageUrl && (
        // 데모 모드의 object URL 지원을 위해 plain img 사용
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt={post.title}
          className="max-h-80 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="space-y-3 p-4">
        {/* 헤더: 타입 배지 + 제목 + 내 카드 메뉴 */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
              <TypeIcon className="size-2.5" />
              {meta.label}
            </span>
            <h3 className="text-[15px] font-semibold leading-snug">{post.title}</h3>
          </div>
          {isMine && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="-mr-1 -mt-1 shrink-0 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="카드 메뉴"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onSelect={() => onEdit(post)}>
                  <Pencil className="size-3.5" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <PostBody post={post} />

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-0 text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 푸터: 작성자 · 시간 | 좋아요 · 댓글 */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback hue={author?.hue} className="text-[9px]">
                {author ? initialsOf(author.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-xs font-medium">{author?.name ?? "알 수 없음"}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground" suppressHydrationWarning>
              {relativeTimeKo(post.createdAt)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
            <button
              type="button"
              onClick={toggleLike}
              className={cn(
                "flex items-center gap-1 rounded-full px-1.5 py-1 text-xs tabular-nums transition-colors hover:bg-accent",
                liked && "text-red-500"
              )}
              aria-label={liked ? "좋아요 취소" : "좋아요"}
            >
              <motion.span
                key={liked ? "liked" : "unliked"}
                initial={{ scale: liked ? 1.5 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="inline-flex"
              >
                <Heart className={cn("size-3.5", liked && "fill-red-500")} />
              </motion.span>
              {post.likedBy.length > 0 && post.likedBy.length}
            </button>
            <span className="flex items-center gap-1 px-1.5 py-1 text-xs tabular-nums">
              <MessageCircle className="size-3.5" />
              {post.comments.length > 0 && post.comments.length}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
