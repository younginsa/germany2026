"use client";

import { motion } from "framer-motion";
import {
  Download,
  Eye,
  FileUp,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfileById } from "@/hooks/use-app-data";
import { fileKindMeta } from "@/components/documents/file-type";
import { cn, formatBytes, initialsOf, relativeTimeKo } from "@/lib/utils";
import { DOCUMENT_CATEGORY_LABEL, type TripDocument } from "@/lib/types";

interface DocumentCardProps {
  doc: TripDocument;
  index: number;
  canDelete: boolean;
  onPreview: () => void;
  onDownload: () => void;
  onNewVersion: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function DocumentCard({
  doc,
  index,
  canDelete,
  onPreview,
  onDownload,
  onNewVersion,
  onRename,
  onDelete,
}: DocumentCardProps) {
  const profileById = useProfileById();

  const uploader = profileById(doc.uploadedBy);
  const meta = fileKindMeta(doc.fileType, doc.fileName);
  const showThumbnail = meta.kind === "image" && Boolean(doc.url);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.21, 1.02, 0.73, 1],
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]"
    >
      {/* ─── 파일 타입 비주얼 헤더 ─── */}
      <button
        type="button"
        onClick={onPreview}
        aria-label={`${doc.title} 미리보기`}
        className={cn(
          "relative flex h-28 w-full items-center justify-center overflow-hidden focus-visible:outline-none",
          !showThumbnail && meta.headerClass
        )}
      >
        {showThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.url}
            alt={doc.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-110",
              meta.tileClass
            )}
          >
            <meta.Icon className={cn("h-7 w-7", meta.iconClass)} strokeWidth={1.6} />
          </span>
        )}

        {/* 파일 종류 라벨 */}
        <span className="absolute left-3 top-3 rounded-md bg-card/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">
          {meta.label}
        </span>

        {/* 버전 배지 */}
        {doc.versions.length > 1 && (
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 bg-card/80 font-mono text-[10px] backdrop-blur-sm"
          >
            v{doc.versions.length}
          </Badge>
        )}
      </button>

      {/* ─── 액션 메뉴 ─── */}
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="문서 메뉴"
              className="bg-card/80 opacity-0 shadow-sm backdrop-blur-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={onPreview}>
              <Eye /> 미리보기
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onDownload}>
              <Download /> 다운로드
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onNewVersion}>
              <FileUp /> 새 버전 업로드
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onRename}>
              <Pencil /> 이름 변경
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!canDelete}
              onSelect={onDelete}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 /> 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ─── 본문 ─── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="truncate text-left text-sm font-semibold leading-snug hover:underline focus-visible:outline-none"
            title={doc.title}
          >
            {doc.title}
          </button>
          <Badge variant="accent" className="shrink-0">
            {DOCUMENT_CATEGORY_LABEL[doc.category]}
          </Badge>
        </div>

        <p
          className="truncate font-mono text-[11px] text-muted-foreground"
          title={doc.fileName}
        >
          {doc.fileName}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback hue={uploader?.hue} className="text-[10px]">
                {uploader ? initialsOf(uploader.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">
              {uploader?.name ?? "알 수 없음"}
            </span>
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {formatBytes(doc.fileSize)} · {relativeTimeKo(doc.uploadedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
