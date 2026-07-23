"use client";

import * as React from "react";
import { toast } from "sonner";
import { CloudUpload, Loader2, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  newId,
  pushNotification,
  tripStore,
  useCurrentUser,
  useTrip,
} from "@/hooks/use-app-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fileKindMeta } from "@/components/documents/file-type";
import { CATEGORY_ICON } from "@/components/documents/category-icon";
import { cn, formatBytes } from "@/lib/utils";
import {
  DOCUMENT_CATEGORY_LABEL,
  type DocumentCategory,
  type DocumentVersion,
  type TripDocument,
} from "@/lib/types";

const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx";

/** 파일을 스토리지에 저장하고 접근 URL을 돌려줍니다 (실패/데모 시 object URL 폴백). */
async function storeFile(file: File, docId: string): Promise<string | undefined> {
  const sb = getSupabaseBrowserClient();
  if (isSupabaseConfigured && sb) {
    try {
      const path = `documents/${docId}/${file.name}`;
      const { error: uploadError } = await sb.storage
        .from("trip-files")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: signed } = await sb.storage
        .from("trip-files")
        .createSignedUrl(path, 3600 * 24 * 7);
      if (signed?.signedUrl) return signed.signedUrl;

      const { data: pub } = sb.storage.from("trip-files").getPublicUrl(path);
      if (pub.publicUrl) return pub.publicUrl;

      throw new Error("no accessible url");
    } catch {
      toast.error("스토리지 업로드에 실패했어요. 임시 링크로 저장합니다.");
      return URL.createObjectURL(file);
    }
  }
  return URL.createObjectURL(file);
}

function fileNameSansExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "new" 신규 문서 업로드 · "version" 기존 문서의 새 버전 업로드 */
  mode: "new" | "version";
  /** mode === "version" 일 때 대상 문서 */
  targetDocument?: TripDocument | null;
  /** 새 문서가 소속될 자료 그룹 (null이면 일반) */
  groupId?: string | null;
}

export function UploadDialog({
  open,
  onOpenChange,
  mode,
  targetDocument,
  groupId,
}: UploadDialogProps) {
  const me = useCurrentUser();
  const trip = useTrip();

  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<DocumentCategory>("etc");
  const [dragActive, setDragActive] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = React.useCallback(() => {
    setFile(null);
    setTitle("");
    setCategory("etc");
    setDragActive(false);
    setSaving(false);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const pickFile = (picked: File | null) => {
    if (!picked) return;
    setFile(picked);
    if (mode === "new") {
      setTitle((prev) => (prev.trim() ? prev : fileNameSansExt(picked.name)));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    pickFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSave = async () => {
    if (!file || saving) return;
    setSaving(true);
    const now = new Date().toISOString();

    try {
      if (mode === "version" && targetDocument) {
        const url = await storeFile(file, targetDocument.id);
        const version: DocumentVersion = {
          id: newId("dv"),
          fileName: file.name,
          fileSize: file.size,
          uploadedBy: me.id,
          uploadedAt: now,
          url,
        };
        const updated: TripDocument = {
          ...targetDocument,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          uploadedBy: me.id,
          uploadedAt: now,
          url,
          versions: [...targetDocument.versions, version],
        };
        tripStore.upsertRow("documents", updated);
        pushNotification({
          type: "document",
          actorId: me.id,
          message: `${me.name}님이 새 버전을 업로드했습니다: ${targetDocument.title}`,
          href: "/materials",
        });
        toast.success(`새 버전(v${updated.versions.length})이 업로드되었습니다`);
      } else {
        const finalTitle = title.trim() || fileNameSansExt(file.name);
        const id = newId("doc");
        const url = await storeFile(file, id);
        const doc: TripDocument = {
          id,
          tripId: trip.id,
          groupId: groupId ?? undefined,
          title: finalTitle,
          category,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          uploadedBy: me.id,
          uploadedAt: now,
          url,
          versions: [
            {
              id: newId("dv"),
              fileName: file.name,
              fileSize: file.size,
              uploadedBy: me.id,
              uploadedAt: now,
              url,
            },
          ],
        };
        tripStore.upsertRow("documents", doc);
        pushNotification({
          type: "document",
          actorId: me.id,
          message: `${me.name}님이 새 문서를 업로드했습니다: ${finalTitle}`,
          href: "/materials",
        });
        toast.success("문서가 업로드되었습니다");
      }
      handleOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const pickedMeta = file ? fileKindMeta(file.type, file.name) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "version" ? "새 버전 업로드" : "문서 업로드"}
          </DialogTitle>
          <DialogDescription>
            {mode === "version" && targetDocument
              ? `‘${targetDocument.title}’의 새 버전을 업로드합니다. 기존 버전은 기록으로 보관됩니다.`
              : "항공권, 예약 확인서 등 여행 서류를 안전하게 보관하세요."}
          </DialogDescription>
        </DialogHeader>

        {/* ─── 드래그 앤 드롭 영역 ─── */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            dragActive
              ? "border-primary bg-accent"
              : "border-border bg-muted/40 hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <CloudUpload className="h-5 w-5 text-primary" />
          </span>
          <p className="text-sm font-medium">
            파일을 끌어다 놓거나 <span className="text-primary">클릭하여 선택</span>
          </p>
          <p className="text-xs text-muted-foreground">
            PDF · 이미지 · Word · Excel (한 개 파일)
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* ─── 선택된 파일 칩 ─── */}
        {file && pickedMeta && (
          <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
                pickedMeta.tileClass
              )}
            >
              <pickedMeta.Icon
                className={cn("h-4.5 w-4.5", pickedMeta.iconClass)}
                strokeWidth={1.8}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs font-medium">{file.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="선택한 파일 제거"
              onClick={() => setFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ─── 제목 / 카테고리 (신규 업로드 전용) ─── */}
        {mode === "new" && (
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="doc-title">문서 제목</Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 인천-프랑크푸르트 항공권"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>카테고리</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as DocumentCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(DOCUMENT_CATEGORY_LABEL) as [
                      DocumentCategory,
                      string,
                    ][]
                  ).map(([key, label]) => {
                    const Icon = CATEGORY_ICON[key];
                    return (
                      <SelectItem key={key} value={key}>
                        <Icon className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {!isSupabaseConfigured && (
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
            데모 모드: 새로고침 시 파일 링크가 사라질 수 있습니다
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!file || saving}>
            {saving && <Loader2 className="animate-spin" />}
            {mode === "version" ? "버전 업로드" : "업로드"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
