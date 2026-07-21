import {
  File,
  FileText,
  Image as ImageIcon,
  Sheet,
  type LucideIcon,
} from "lucide-react";

/** 파일 MIME/확장자 → 시각적 종류 매핑 */
export type FileKind = "pdf" | "image" | "word" | "excel" | "generic";

export interface FileKindMeta {
  kind: FileKind;
  /** 카드 헤더에 표시할 짧은 라벨 */
  label: string;
  Icon: LucideIcon;
  /** 아이콘 색상 */
  iconClass: string;
  /** 카드 헤더 배경 틴트 */
  headerClass: string;
  /** 아이콘 타일 배경 */
  tileClass: string;
}

export function fileKindOf(fileType: string, fileName: string): FileKind {
  const mime = fileType.toLowerCase();
  const ext = fileName.toLowerCase().split(".").pop() ?? "";

  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (mime.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif"].includes(ext))
    return "image";
  if (
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ["doc", "docx"].includes(ext)
  )
    return "word";
  if (
    mime === "application/vnd.ms-excel" ||
    mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ["xls", "xlsx", "csv"].includes(ext)
  )
    return "excel";
  return "generic";
}

const META: Record<FileKind, FileKindMeta> = {
  pdf: {
    kind: "pdf",
    label: "PDF",
    Icon: FileText,
    iconClass: "text-red-500",
    headerClass: "bg-gradient-to-br from-red-500/12 via-red-500/6 to-transparent",
    tileClass: "bg-red-500/10 ring-red-500/20",
  },
  image: {
    kind: "image",
    label: "이미지",
    Icon: ImageIcon,
    iconClass: "text-violet-500",
    headerClass: "bg-gradient-to-br from-violet-500/12 via-violet-500/6 to-transparent",
    tileClass: "bg-violet-500/10 ring-violet-500/20",
  },
  word: {
    kind: "word",
    label: "Word",
    Icon: FileText,
    iconClass: "text-blue-500",
    headerClass: "bg-gradient-to-br from-blue-500/12 via-blue-500/6 to-transparent",
    tileClass: "bg-blue-500/10 ring-blue-500/20",
  },
  excel: {
    kind: "excel",
    label: "Excel",
    Icon: Sheet,
    iconClass: "text-emerald-500",
    headerClass: "bg-gradient-to-br from-emerald-500/12 via-emerald-500/6 to-transparent",
    tileClass: "bg-emerald-500/10 ring-emerald-500/20",
  },
  generic: {
    kind: "generic",
    label: "파일",
    Icon: File,
    iconClass: "text-slate-500",
    headerClass: "bg-gradient-to-br from-slate-500/12 via-slate-500/6 to-transparent",
    tileClass: "bg-slate-500/10 ring-slate-500/20",
  },
};

export function fileKindMeta(fileType: string, fileName: string): FileKindMeta {
  return META[fileKindOf(fileType, fileName)];
}
