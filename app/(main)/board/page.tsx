"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePostDialog } from "@/components/board/create-post-dialog";
import { PostCard } from "@/components/board/post-card";
import { PostDetailDialog } from "@/components/board/post-detail-dialog";
import { usePosts } from "@/hooks/use-app-data";
import type { Post, PostType } from "@/lib/types";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | "text" | "image" | "location" | "link" | "poll" | "ref";

const TYPE_FILTER_LABEL: Record<TypeFilter, string> = {
  all: "전체",
  text: "텍스트",
  image: "이미지",
  location: "장소",
  link: "링크",
  poll: "투표",
  ref: "참조",
};

function matchesType(postType: PostType, filter: TypeFilter): boolean {
  if (filter === "all") return true;
  if (filter === "ref") return postType === "checklist_ref" || postType === "comment_ref";
  return postType === filter;
}

function BoardPageInner() {
  const posts = usePosts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postParam = searchParams.get("post");

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  // ?post= 딥링크 → 상세 다이얼로그 열기
  useEffect(() => {
    if (postParam) setDetailId(postParam);
  }, [postParam]);

  const closeDetail = () => {
    setDetailId(null);
    if (postParam) router.replace("/board", { scroll: false });
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b, "ko"));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (!matchesType(post.type, typeFilter)) return false;
      if (selectedTags.length > 0 && !post.tags.some((t) => selectedTags.includes(t)))
        return false;
      if (q) {
        const haystack = `${post.title} ${post.body ?? ""} ${post.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [posts, search, selectedTags, typeFilter]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const openEditor = (post: Post | null) => {
    setEditing(post);
    setComposerOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">보드</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">아이디어와 영감을 모아보세요</p>
        </div>
        <Button onClick={() => openEditor(null)} className="gap-1.5">
          <Plus className="size-4" />새 카드
        </Button>
      </div>

      {/* 검색 + 타입 필터 */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="카드 검색…"
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(TYPE_FILTER_LABEL) as TypeFilter[]).map((key) => (
              <SelectItem key={key} value={key}>
                {TYPE_FILTER_LABEL[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 태그 칩 필터 */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
                aria-pressed={active}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTags([])}
              className="rounded-full px-3 py-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      )}

      {/* 메이슨리 그리드 */}
      {filtered.length > 0 ? (
        <div className="masonry">
          {filtered.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onOpen={setDetailId}
              onEdit={openEditor}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-muted-foreground">조건에 맞는 카드가 없어요</p>
        </div>
      )}

      <PostDetailDialog
        postId={detailId}
        onClose={closeDetail}
        onEdit={(post) => {
          openEditor(post);
        }}
      />

      <CreatePostDialog
        open={composerOpen}
        onOpenChange={(open) => {
          setComposerOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
      />
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={null}>
      <BoardPageInner />
    </Suspense>
  );
}
