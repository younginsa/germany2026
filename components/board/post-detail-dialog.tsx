"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PostBody } from "@/components/board/post-body";
import { POST_TYPE_META } from "@/components/board/post-meta";
import {
  newId,
  pushNotification,
  tripStore,
  useCurrentUser,
  usePosts,
  useProfileById,
} from "@/hooks/use-app-data";
import type { Post, PostComment } from "@/lib/types";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";

interface PostDetailDialogProps {
  postId: string | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
}

export function PostDetailDialog({ postId, onClose, onEdit }: PostDetailDialogProps) {
  const posts = usePosts();
  const me = useCurrentUser();
  const profileById = useProfileById();
  const [draft, setDraft] = useState("");

  const post = postId ? posts.find((p) => p.id === postId) ?? null : null;

  const author = post ? profileById(post.authorId) : undefined;
  const liked = post ? post.likedBy.includes(me.id) : false;
  const meta = post ? POST_TYPE_META[post.type] : null;

  const toggleLike = () => {
    if (!post) return;
    tripStore.upsertRow("posts", {
      ...post,
      likedBy: liked ? post.likedBy.filter((id) => id !== me.id) : [...post.likedBy, me.id],
    });
  };

  const submitComment = () => {
    if (!post) return;
    const body = draft.trim();
    if (!body) return;
    const comment: PostComment = {
      id: newId("pc"),
      authorId: me.id,
      body,
      createdAt: new Date().toISOString(),
    };
    tripStore.upsertRow("posts", { ...post, comments: [...post.comments, comment] });
    pushNotification({
      type: "board",
      actorId: me.id,
      message: `${me.name}님이 보드 카드에 댓글을 남겼습니다: ${post.title}`,
      href: `/materials?post=${post.id}`,
    });
    setDraft("");
  };

  const handleDelete = () => {
    if (!post) return;
    if (window.confirm(`"${post.title}" 카드를 삭제할까요? 되돌릴 수 없어요.`)) {
      tripStore.deleteRow("posts", post.id);
      toast.success("카드를 삭제했어요");
      onClose();
    }
  };

  return (
    <Dialog
      open={!!post}
      onOpenChange={(open) => {
        if (!open) {
          setDraft("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[88dvh] gap-0 overflow-hidden p-0 sm:max-w-xl">
        {post && meta && (
          <div className="flex max-h-[88dvh] flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              {post.type === "image" && post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="max-h-96 w-full object-cover"
                />
              )}
              <div className="space-y-4 p-6">
                <DialogHeader className="space-y-2 text-left">
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                    <meta.icon className="size-2.5" />
                    {meta.label}
                  </span>
                  <DialogTitle className="pr-6 text-lg leading-snug">{post.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarFallback hue={author?.hue} className="text-[9px]">
                        {author ? initialsOf(author.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {author?.name ?? "알 수 없음"}
                    </span>
                    <span suppressHydrationWarning>{relativeTimeKo(post.createdAt)}</span>
                  </DialogDescription>
                </DialogHeader>

                <PostBody post={post} detail />

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-0 text-[10px]">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLike}
                    className={cn("gap-1.5", liked && "border-red-200 text-red-500")}
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
                    좋아요 {post.likedBy.length > 0 ? post.likedBy.length : ""}
                  </Button>
                  {post.authorId === me.id && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => onEdit(post)}
                      >
                        <Pencil className="size-3.5" />
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-destructive hover:text-destructive"
                        onClick={handleDelete}
                      >
                        <Trash2 className="size-3.5" />
                        삭제
                      </Button>
                    </>
                  )}
                </div>

                <Separator />

                {/* 댓글 스레드 */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">댓글 {post.comments.length}</p>
                  {post.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      아직 댓글이 없어요. 첫 댓글을 남겨보세요!
                    </p>
                  )}
                  {post.comments.map((comment) => {
                    const cAuthor = profileById(comment.authorId);
                    return (
                      <div key={comment.id} className="flex gap-2.5">
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback hue={cAuthor?.hue} className="text-[10px]">
                            {cAuthor ? initialsOf(cAuthor.name) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 rounded-xl bg-muted/60 px-3 py-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-semibold">
                              {cAuthor?.name ?? "알 수 없음"}
                            </span>
                            <span
                              className="text-[11px] text-muted-foreground"
                              suppressHydrationWarning
                            >
                              {relativeTimeKo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/90">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 댓글 작성 */}
            <div className="border-t bg-card p-4">
              <div className="flex items-end gap-2">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback
                    hue={me.hue}
                    className="text-[10px]"
                  >
                    {initialsOf(me.name)}
                  </AvatarFallback>
                </Avatar>
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      submitComment();
                    }
                  }}
                  placeholder="댓글을 입력하세요…"
                  rows={1}
                  className="min-h-9 flex-1 resize-none"
                />
                <Button size="sm" onClick={submitComment} disabled={!draft.trim()}>
                  <Send className="size-3.5" />
                  등록
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
