"use client";

/**
 * 자료 — 보드(카드)와 문서(파일)를 그룹으로 묶어 한곳에서 관리합니다.
 * 그룹: "숙소", "맛집 후보", "예약 확정" 같은 주제별 묶음.
 * 그룹이 지정되지 않은 항목은 "일반"에 모입니다.
 */

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  Search,
  StickyNote,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CreatePostDialog } from "@/components/board/create-post-dialog";
import { PostCard } from "@/components/board/post-card";
import { PostDetailDialog } from "@/components/board/post-detail-dialog";
import { DocumentCard } from "@/components/documents/document-card";
import { PreviewDialog } from "@/components/documents/preview-dialog";
import { UploadDialog } from "@/components/documents/upload-dialog";
import {
  newId,
  tripStore,
  useAppData,
  useCurrentUser,
  useDocuments,
  usePosts,
  useTrip,
} from "@/hooks/use-app-data";
import type { BoardGroup, Post, PostType, TripDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | "file" | "link" | "image" | "poll" | "text" | "location";

const TYPE_FILTER_LABEL: Record<TypeFilter, string> = {
  all: "전체",
  file: "파일",
  link: "링크",
  image: "이미지",
  poll: "투표",
  text: "텍스트",
  location: "장소",
};

function postMatchesType(postType: PostType, filter: TypeFilter): boolean {
  if (filter === "all") return true;
  if (filter === "file") return false;
  if (filter === "text") return postType === "text" || postType === "checklist_ref" || postType === "comment_ref";
  return postType === filter;
}

/** 그룹 하나에 속한 카드+파일 (최신순 정렬용 타임스탬프 포함) */
interface GroupItems {
  posts: Post[];
  docs: TripDocument[];
  count: number;
}

function MaterialsPageInner() {
  const trip = useTrip();
  const me = useCurrentUser();
  const posts = usePosts();
  const documents = useDocuments();
  const groups = useAppData().boardGroups;
  const router = useRouter();
  const searchParams = useSearchParams();
  const postParam = searchParams.get("post");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  /* 카드(포스트) 상태 */
  const [detailId, setDetailId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [composerGroupId, setComposerGroupId] = useState<string | null>(null);

  /* 파일(문서) 상태 */
  const [uploadGroupId, setUploadGroupId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [versionTargetId, setVersionTargetId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /* 그룹 상태 */
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupEditing, setGroupEditing] = useState<BoardGroup | null>(null);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDeleteTarget, setGroupDeleteTarget] = useState<BoardGroup | null>(null);

  /* ?post= 딥링크 */
  useEffect(() => {
    if (postParam) setDetailId(postParam);
  }, [postParam]);
  const closeDetail = () => {
    setDetailId(null);
    if (postParam) router.replace("/materials", { scroll: false });
  };

  const byDocId = useCallback(
    (id: string | null): TripDocument | null =>
      id ? (documents.find((d) => d.id === id) ?? null) : null,
    [documents]
  );
  const previewDoc = byDocId(previewId);
  const versionTarget = byDocId(versionTargetId);
  const renameTarget = byDocId(renameTargetId);
  const deleteTarget = byDocId(deleteTargetId);

  /* ─── 그룹별 항목 분류 (검색·타입 필터 적용) ─── */
  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.order - b.order),
    [groups]
  );
  const groupIds = useMemo(() => new Set(sortedGroups.map((g) => g.id)), [sortedGroups]);

  const itemsOf = useMemo(() => {
    const q = search.trim().toLowerCase();
    const map = new Map<string | null, GroupItems>();
    const bucket = (id: string | null): GroupItems => {
      const k = id !== null && groupIds.has(id) ? id : null;
      let b = map.get(k);
      if (!b) {
        b = { posts: [], docs: [], count: 0 };
        map.set(k, b);
      }
      return b;
    };
    for (const post of posts) {
      if (!postMatchesType(post.type, typeFilter)) continue;
      if (q) {
        const hay = `${post.title} ${post.body ?? ""} ${post.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      const b = bucket(post.groupId ?? null);
      b.posts.push(post);
      b.count += 1;
    }
    for (const doc of documents) {
      if (typeFilter !== "all" && typeFilter !== "file") continue;
      if (q && !`${doc.title} ${doc.fileName}`.toLowerCase().includes(q)) continue;
      const b = bucket(doc.groupId ?? null);
      b.docs.push(doc);
      b.count += 1;
    }
    return map;
  }, [posts, documents, groupIds, search, typeFilter]);

  const totalVisible = [...itemsOf.values()].reduce((n, b) => n + b.count, 0);
  const hasAnything = posts.length > 0 || documents.length > 0;

  /* ─── 파일 액션 (문서 페이지에서 이관) ─── */
  const handleDownload = useCallback((doc: TripDocument) => {
    if (!doc.url) {
      toast.error("저장된 파일이 없어 다운로드할 수 없습니다");
      return;
    }
    const a = document.createElement("a");
    a.href = doc.url;
    a.download = doc.fileName;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const handleRenameSave = () => {
    if (!renameTarget) return;
    const next = renameValue.trim();
    if (!next) {
      toast.error("문서 제목을 입력해 주세요");
      return;
    }
    tripStore.upsertRow("documents", { ...renameTarget, title: next });
    toast.success("문서 이름이 변경되었습니다");
    setRenameTargetId(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    tripStore.deleteRow("documents", deleteTarget.id);
    toast.success(`‘${deleteTarget.title}’ 문서가 삭제되었습니다`);
    setDeleteTargetId(null);
  };

  /* ─── 그룹 액션 ─── */
  const openGroupDialog = (group: BoardGroup | null) => {
    setGroupEditing(group);
    setGroupTitle(group?.title ?? "");
    setGroupDialogOpen(true);
  };

  const saveGroup = () => {
    const title = groupTitle.trim();
    if (!title) return;
    if (groupEditing) {
      tripStore.upsertRow("boardGroups", { ...groupEditing, title });
      toast.success("그룹 이름을 변경했어요");
    } else {
      const maxOrder = groups.reduce((m, g) => Math.max(m, g.order), -1);
      tripStore.upsertRow("boardGroups", {
        id: newId("bg"),
        tripId: trip.id,
        title,
        order: maxOrder + 1,
      });
      toast.success(`‘${title}’ 그룹을 만들었어요`);
    }
    setGroupDialogOpen(false);
  };

  const deleteGroup = () => {
    if (!groupDeleteTarget) return;
    // 그룹 안 항목은 일반으로 이동
    for (const post of posts) {
      if (post.groupId === groupDeleteTarget.id) {
        tripStore.upsertRow("posts", { ...post, groupId: undefined });
      }
    }
    for (const doc of documents) {
      if (doc.groupId === groupDeleteTarget.id) {
        tripStore.upsertRow("documents", { ...doc, groupId: undefined });
      }
    }
    tripStore.deleteRow("boardGroups", groupDeleteTarget.id);
    toast.success("그룹을 삭제했어요 (항목은 일반으로 이동)");
    setGroupDeleteTarget(null);
  };

  const openComposer = (groupId: string | null, post: Post | null) => {
    setEditing(post);
    setComposerGroupId(groupId);
    setComposerOpen(true);
  };

  const openUpload = (groupId: string | null) => {
    setUploadGroupId(groupId);
    setUploadOpen(true);
  };

  /* ─── 그룹 섹션 렌더 ─── */
  function GroupSection({ group }: { group: BoardGroup | null }) {
    const items = itemsOf.get(group?.id ?? null);
    const isVirtual = group === null;
    // 필터 중엔 빈 그룹 숨김 · 평소엔 일반(빈)만 숨김
    const filtering = search.trim().length > 0 || typeFilter !== "all";
    if (!items || items.count === 0) {
      if (filtering || isVirtual) return null;
    }

    const ordered = items
      ? [
          ...items.posts.map((p) => ({ kind: "post" as const, post: p, at: p.createdAt })),
          ...items.docs.map((d) => ({ kind: "doc" as const, doc: d, at: d.uploadedAt })),
        ].sort((a, b) => b.at.localeCompare(a.at))
      : [];

    return (
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold">{group?.title ?? "일반"}</h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {items?.count ?? 0}
          </span>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Plus className="size-3.5" />
                추가
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openComposer(group?.id ?? null, null)}>
                <StickyNote className="size-4" />
                카드 (텍스트·링크·사진·투표)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openUpload(group?.id ?? null)}>
                <Paperclip className="size-4" />
                파일 업로드
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {group && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="그룹 메뉴">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openGroupDialog(group)}>
                  <Pencil className="size-4" />
                  이름 변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setGroupDeleteTarget(group)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4" />
                  그룹 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {ordered.length > 0 ? (
          <div className="masonry">
            <AnimatePresence mode="popLayout">
              {ordered.map((item, index) =>
                item.kind === "post" ? (
                  <PostCard
                    key={item.post.id}
                    post={item.post}
                    index={index}
                    onOpen={setDetailId}
                    onEdit={(p) => openComposer(p.groupId ?? null, p)}
                  />
                ) : (
                  <DocumentCard
                    key={item.doc.id}
                    doc={item.doc}
                    index={index}
                    canDelete={item.doc.uploadedBy === me.id}
                    onPreview={() => setPreviewId(item.doc.id)}
                    onDownload={() => handleDownload(item.doc)}
                    onNewVersion={() => setVersionTargetId(item.doc.id)}
                    onRename={() => {
                      setRenameTargetId(item.doc.id);
                      setRenameValue(item.doc.title);
                    }}
                    onDelete={() => setDeleteTargetId(item.doc.id)}
                  />
                )
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-card/50 px-4 py-8 text-center text-sm text-muted-foreground">
            아직 자료가 없어요 — 위의 추가 버튼으로 채워보세요
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">자료</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            아이디어·링크·투표·파일을 그룹으로 모아보세요
          </p>
        </div>
        <Button variant="outline" onClick={() => openGroupDialog(null)} className="gap-1.5">
          <FolderPlus className="size-4" />새 그룹
        </Button>
      </div>

      {/* 검색 + 타입 필터 */}
      <div className="space-y-2.5">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="자료 검색…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(Object.keys(TYPE_FILTER_LABEL) as TypeFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              aria-pressed={typeFilter === key}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                typeFilter === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {TYPE_FILTER_LABEL[key]}
            </button>
          ))}
        </div>
      </div>

      {/* 그룹 섹션들 */}
      <div className="space-y-8">
        {sortedGroups.map((g) => (
          <GroupSection key={g.id} group={g} />
        ))}
        <GroupSection group={null} />
        {!hasAnything && sortedGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
              <FolderOpen className="h-8 w-8 text-accent-foreground" strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-semibold">아직 자료가 없어요</p>
              <p className="mt-1 text-sm text-muted-foreground">
                그룹을 만들어 링크·아이디어·예약 서류를 주제별로 모아보세요
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openGroupDialog(null)}>
                <FolderPlus /> 새 그룹
              </Button>
              <Button onClick={() => openComposer(null, null)}>
                <Plus /> 첫 카드 만들기
              </Button>
            </div>
          </div>
        )}
        {hasAnything && totalVisible === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            조건에 맞는 자료가 없어요
          </div>
        )}
      </div>

      {/* ─── 카드 다이얼로그 ─── */}
      <PostDetailDialog postId={detailId} onClose={closeDetail} onEdit={(post) => openComposer(post.groupId ?? null, post)} />
      <CreatePostDialog
        open={composerOpen}
        onOpenChange={(open) => {
          setComposerOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
        defaultGroupId={composerGroupId}
      />

      {/* ─── 파일 다이얼로그 ─── */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} mode="new" groupId={uploadGroupId} />
      <UploadDialog
        open={versionTarget !== null}
        onOpenChange={(open) => {
          if (!open) setVersionTargetId(null);
        }}
        mode="version"
        targetDocument={versionTarget}
      />
      <PreviewDialog
        doc={previewDoc}
        open={previewDoc !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewId(null);
        }}
        onDownload={handleDownload}
        onNewVersion={(doc) => setVersionTargetId(doc.id)}
      />

      {/* 파일 이름 변경 */}
      <Dialog open={renameTarget !== null} onOpenChange={(open) => !open && setRenameTargetId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>이름 변경</DialogTitle>
            <DialogDescription>문서의 표시 제목을 변경합니다.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRenameSave()}
            placeholder="문서 제목"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTargetId(null)}>
              취소
            </Button>
            <Button onClick={handleRenameSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 파일 삭제 확인 */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>문서 삭제</DialogTitle>
            <DialogDescription>
              ‘{deleteTarget?.title}’ 문서를 삭제할까요? 모든 버전 기록이 함께 삭제되며, 이
              작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTargetId(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 그룹 생성/이름 변경 */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{groupEditing ? "그룹 이름 변경" : "새 그룹"}</DialogTitle>
            <DialogDescription>
              {groupEditing
                ? "그룹의 이름을 변경합니다."
                : "주제별로 카드와 파일을 모을 그룹을 만듭니다. (예: 숙소, 맛집 후보, 예약 확정)"}
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveGroup()}
            placeholder="그룹 이름"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={saveGroup} disabled={!groupTitle.trim()}>
              {groupEditing ? "저장" : "만들기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 그룹 삭제 확인 */}
      <Dialog open={groupDeleteTarget !== null} onOpenChange={(open) => !open && setGroupDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>그룹 삭제</DialogTitle>
            <DialogDescription>
              ‘{groupDeleteTarget?.title}’ 그룹을 삭제할까요? 안에 있던 자료는 삭제되지 않고
              일반으로 이동합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={deleteGroup}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={null}>
      <MaterialsPageInner />
    </Suspense>
  );
}
