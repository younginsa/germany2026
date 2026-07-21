"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowUpDown,
  Check,
  FolderOpen,
  Plus,
  Search,
  SearchX,
  Upload,
} from "lucide-react";
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
import { DocumentCard } from "@/components/documents/document-card";
import { PreviewDialog } from "@/components/documents/preview-dialog";
import { UploadDialog } from "@/components/documents/upload-dialog";
import { tripStore, useCurrentUser, useDocuments } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_CATEGORY_LABEL,
  type DocumentCategory,
  type TripDocument,
} from "@/lib/types";
import { CATEGORY_ICON } from "@/components/documents/category-icon";

const SORT_LABEL = {
  latest: "최신순",
  name: "이름순",
  size: "크기순",
} as const;
type SortKey = keyof typeof SORT_LABEL;

type CategoryFilter = DocumentCategory | "all";

export default function DocumentsPage() {
  const documents = useDocuments();
  const me = useCurrentUser();

  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>("all");
  const [sort, setSort] = React.useState<SortKey>("latest");

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [versionTargetId, setVersionTargetId] = React.useState<string | null>(null);
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const [renameTargetId, setRenameTargetId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  const byId = React.useCallback(
    (id: string | null): TripDocument | null =>
      id ? (documents.find((d) => d.id === id) ?? null) : null,
    [documents]
  );

  const previewDoc = byId(previewId);
  const versionTarget = byId(versionTargetId);
  const renameTarget = byId(renameTargetId);
  const deleteTarget = byId(deleteTargetId);

  /* ─── 필터/정렬 ─── */
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = documents.filter((d) => {
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q)
      );
    });
    switch (sort) {
      case "name":
        return [...list].sort((a, b) => a.title.localeCompare(b.title, "ko"));
      case "size":
        return [...list].sort((a, b) => b.fileSize - a.fileSize);
      default:
        return list; // useDocuments 가 이미 최신순
    }
  }, [documents, search, categoryFilter, sort]);

  /* ─── 액션 ─── */
  const handleDownload = React.useCallback((doc: TripDocument) => {
    if (!doc.url) {
      toast.error("저장된 파일이 없어 다운로드할 수 없습니다 (데모 데이터)");
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

  const openRename = (doc: TripDocument) => {
    setRenameTargetId(doc.id);
    setRenameValue(doc.title);
  };

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

  const categories = Object.entries(DOCUMENT_CATEGORY_LABEL) as [
    DocumentCategory,
    string,
  ][];

  const hasAnyDocs = documents.length > 0;

  return (
    <div className="space-y-6">
      {/* ─── 헤더 ─── */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">문서</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            여행 서류를 한곳에서 관리하세요
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload /> 문서 업로드
        </Button>
      </motion.header>

      {/* ─── 검색 + 정렬 ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: [0.21, 1.02, 0.73, 1] }}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="문서 검색…"
            className="pl-9"
            aria-label="문서 검색"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ArrowUpDown /> {SORT_LABEL[sort]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <DropdownMenuItem key={key} onSelect={() => setSort(key)}>
                <span className="flex-1">{SORT_LABEL[key]}</span>
                {sort === key && <Check className="text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* ─── 카테고리 필터 칩 ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.21, 1.02, 0.73, 1] }}
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="카테고리 필터"
      >
        <FilterChip
          active={categoryFilter === "all"}
          onClick={() => setCategoryFilter("all")}
          count={documents.length}
        >
          전체
        </FilterChip>
        {categories.map(([key, label]) => {
          const count = documents.filter((d) => d.category === key).length;
          const Icon = CATEGORY_ICON[key];
          return (
            <FilterChip
              key={key}
              active={categoryFilter === key}
              onClick={() => setCategoryFilter(key)}
              count={count}
            >
              <Icon className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden /> {label}
            </FilterChip>
          );
        })}
      </motion.div>

      {/* ─── 문서 그리드 / 빈 상태 ─── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((doc, index) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                index={index}
                canDelete={doc.uploadedBy === me.id}
                onPreview={() => setPreviewId(doc.id)}
                onDownload={() => handleDownload(doc)}
                onNewVersion={() => setVersionTargetId(doc.id)}
                onRename={() => openRename(doc)}
                onDelete={() => setDeleteTargetId(doc.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            {hasAnyDocs ? (
              <SearchX className="h-8 w-8 text-accent-foreground" strokeWidth={1.5} />
            ) : (
              <FolderOpen
                className="h-8 w-8 text-accent-foreground"
                strokeWidth={1.5}
              />
            )}
          </span>
          <div>
            <p className="font-semibold">
              {hasAnyDocs
                ? "조건에 맞는 문서가 없어요"
                : "아직 업로드된 문서가 없어요"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasAnyDocs
                ? "다른 검색어나 카테고리를 시도해 보세요"
                : "항공권, 예약 확인서 등 여행 서류를 업로드해 함께 관리해 보세요"}
            </p>
          </div>
          {hasAnyDocs ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
              }}
            >
              필터 초기화
            </Button>
          ) : (
            <Button onClick={() => setUploadOpen(true)}>
              <Plus /> 첫 문서 업로드
            </Button>
          )}
        </motion.div>
      )}

      {/* ─── 다이얼로그 ─── */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} mode="new" />

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

      {/* 이름 변경 */}
      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRenameTargetId(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>이름 변경</DialogTitle>
            <DialogDescription>문서의 표시 제목을 변경합니다.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSave();
            }}
            placeholder="문서 제목"
            aria-label="문서 제목"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTargetId(null)}>
              취소
            </Button>
            <Button onClick={handleRenameSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>문서 삭제</DialogTitle>
            <DialogDescription>
              ‘{deleteTarget?.title}’ 문서를 삭제할까요? 모든 버전 기록이 함께
              삭제되며, 이 작업은 되돌릴 수 없습니다.
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

/* ─── 카테고리 필터 칩 ─── */
function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-[0.97]",
        active
          ? "border-transparent bg-primary text-primary-foreground shadow-sm"
          : "bg-card text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
      <span
        className={cn(
          "rounded-full px-1.5 text-[11px] tabular-nums",
          active
            ? "bg-primary-foreground/20"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}
