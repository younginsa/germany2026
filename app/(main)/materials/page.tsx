"use client";

/**
 * 자료 — 여행에 필요한 파일과 카드를 한곳에서 관리합니다.
 * 폴더/그룹 구조 없이 하나의 목록으로 보여주며, 기본 동작은 파일 업로드입니다.
 * (기존 카드: 링크·투표·아이디어는 계속 표시·편집 가능)
 */

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FolderOpen, Search, Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { CreatePostDialog } from "@/components/board/create-post-dialog";
import { PostCard } from "@/components/board/post-card";
import { PostDetailDialog } from "@/components/board/post-detail-dialog";
import { DocumentCard } from "@/components/documents/document-card";
import { PreviewDialog } from "@/components/documents/preview-dialog";
import { UploadDialog } from "@/components/documents/upload-dialog";
import {
  tripStore,
  useCurrentUser,
  useDocuments,
  usePosts,
} from "@/hooks/use-app-data";
import type { Post, TripDocument } from "@/lib/types";

function MaterialsPageInner() {
  const me = useCurrentUser();
  const posts = usePosts();
  const documents = useDocuments();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postParam = searchParams.get("post");

  const [search, setSearch] = useState("");

  /* 카드(포스트) 상태 */
  const [detailId, setDetailId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  /* 파일(문서) 상태 */
  const [uploadOpen, setUploadOpen] = useState(false);
  const [versionTargetId, setVersionTargetId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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

  /* ─── 검색 적용 후 파일+카드 통합 목록 (최신순) ─── */
  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list: (
      | { kind: "post"; post: Post; at: string }
      | { kind: "doc"; doc: TripDocument; at: string }
    )[] = [];
    for (const post of posts) {
      if (q) {
        const hay = `${post.title} ${post.body ?? ""} ${post.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      list.push({ kind: "post", post, at: post.createdAt });
    }
    for (const doc of documents) {
      if (q && !`${doc.title} ${doc.fileName}`.toLowerCase().includes(q)) continue;
      list.push({ kind: "doc", doc, at: doc.uploadedAt });
    }
    return list.sort((a, b) => b.at.localeCompare(a.at));
  }, [posts, documents, search]);

  const hasAnything = posts.length > 0 || documents.length > 0;

  /* ─── 파일 액션 ─── */
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

  const openEdit = (post: Post) => {
    setEditing(post);
    setComposerOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">자료</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          여행에 필요한 파일과 자료를 한곳에서 모아보세요
        </p>
      </div>

      {/* 검색 + 새 파일 (같은 줄) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="자료 검색…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setUploadOpen(true)} className="shrink-0 gap-1.5">
          <Upload className="size-4" />새 파일
        </Button>
      </div>

      {/* 통합 목록 */}
      {items.length > 0 ? (
        <div className="masonry">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) =>
              item.kind === "post" ? (
                <PostCard
                  key={item.post.id}
                  post={item.post}
                  index={index}
                  onOpen={setDetailId}
                  onEdit={openEdit}
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
      ) : !hasAnything ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <FolderOpen className="h-8 w-8 text-accent-foreground" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-semibold">아직 자료가 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              항공권·예약 서류 같은 파일을 업로드해 함께 관리하세요
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="size-4" />새 파일
          </Button>
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-muted-foreground">
          조건에 맞는 자료가 없어요
        </div>
      )}

      {/* ─── 카드 다이얼로그 (기존 카드 열기/편집) ─── */}
      <PostDetailDialog postId={detailId} onClose={closeDetail} onEdit={openEdit} />
      <CreatePostDialog
        open={composerOpen}
        onOpenChange={(open) => {
          setComposerOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
        defaultGroupId={null}
      />

      {/* ─── 파일 다이얼로그 ─── */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} mode="new" groupId={null} />
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
