"use client";

import { Download, FileUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useProfileById } from "@/hooks/use-app-data";
import { fileKindMeta } from "@/components/documents/file-type";
import { VersionHistory } from "@/components/documents/version-history";
import { cn, formatBytes, relativeTimeKo } from "@/lib/utils";
import { DOCUMENT_CATEGORY_LABEL, type TripDocument } from "@/lib/types";

interface PreviewDialogProps {
  doc: TripDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (doc: TripDocument) => void;
  onNewVersion: (doc: TripDocument) => void;
}

export function PreviewDialog({
  doc,
  open,
  onOpenChange,
  onDownload,
  onNewVersion,
}: PreviewDialogProps) {
  const profileById = useProfileById();

  if (!doc) return null;

  const meta = fileKindMeta(doc.fileType, doc.fileName);
  const uploader = profileById(doc.uploadedBy);
  const canRenderImage = meta.kind === "image" && Boolean(doc.url);
  const canRenderPdf = meta.kind === "pdf" && Boolean(doc.url);

  const metadata: [string, string][] = [
    ["파일명", doc.fileName],
    ["형식", doc.fileType || "알 수 없음"],
    ["크기", formatBytes(doc.fileSize)],
    ["업로더", uploader?.name ?? "알 수 없음"],
    ["업로드 시간", relativeTimeKo(doc.uploadedAt)],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 pr-6">
            <DialogTitle className="truncate">{doc.title}</DialogTitle>
            <Badge variant="accent" className="shrink-0">
              {DOCUMENT_CATEGORY_LABEL[doc.category]}
            </Badge>
          </div>
          <DialogDescription className="truncate font-mono text-xs">
            {doc.fileName}
          </DialogDescription>
        </DialogHeader>

        {/* ─── 미리보기 영역 ─── */}
        {canRenderImage ? (
          <div className="overflow-hidden rounded-xl border bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doc.url}
              alt={doc.title}
              className="mx-auto max-h-[50vh] w-auto max-w-full object-contain"
            />
          </div>
        ) : canRenderPdf ? (
          <iframe
            src={doc.url}
            title={`${doc.title} 미리보기`}
            className="h-[55vh] w-full rounded-xl border bg-white"
          />
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
              meta.headerClass
            )}
          >
            <span
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl ring-1",
                meta.tileClass
              )}
            >
              <meta.Icon className={cn("h-8 w-8", meta.iconClass)} strokeWidth={1.5} />
            </span>
            <p className="text-sm font-semibold">미리보기를 사용할 수 없습니다</p>
            <p className="text-xs text-muted-foreground">
              {doc.url
                ? "이 파일 형식은 브라우저 미리보기를 지원하지 않아요. 다운로드하여 확인해 주세요."
                : "파일이 스토리지에 연결되면 미리보기가 제공됩니다"}
            </p>
          </div>
        )}

        {/* ─── 메타데이터 표 ─── */}
        <dl className="overflow-hidden rounded-xl border">
          {metadata.map(([label, value], i) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-4 px-3.5 py-2 text-sm",
                i % 2 === 1 && "bg-muted/40"
              )}
            >
              <dt className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
                {label}
              </dt>
              <dd
                className={cn(
                  "min-w-0 flex-1 truncate",
                  (label === "파일명" || label === "형식") && "font-mono text-xs"
                )}
                title={value}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <Separator />

        {/* ─── 버전 기록 ─── */}
        <VersionHistory doc={doc} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onNewVersion(doc)}>
            <FileUp /> 새 버전 업로드
          </Button>
          <Button onClick={() => onDownload(doc)}>
            <Download /> 다운로드
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
