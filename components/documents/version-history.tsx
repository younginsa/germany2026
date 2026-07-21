"use client";

import { History } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfileById } from "@/hooks/use-app-data";
import { formatBytes, initialsOf, relativeTimeKo } from "@/lib/utils";
import type { TripDocument } from "@/lib/types";

interface VersionHistoryProps {
  doc: TripDocument;
}

/** 버전 기록 — 최신 버전이 위로 오도록 정렬해 표시 */
export function VersionHistory({ doc }: VersionHistoryProps) {
  const profileById = useProfileById();

  const versions = doc.versions
    .map((v, i) => ({ ...v, n: i + 1 }))
    .reverse();

  return (
    <section aria-label="버전 기록">
      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        <History className="h-4 w-4 text-muted-foreground" />
        버전 기록
        <span className="text-xs font-normal text-muted-foreground">
          ({versions.length})
        </span>
      </h4>

      <ol className="space-y-1.5">
        {versions.map((v, idx) => {
          const uploader = profileById(v.uploadedBy);
          const isLatest = idx === 0;

          return (
            <li
              key={v.id}
              className="flex items-center gap-3 rounded-xl border bg-muted/30 px-3 py-2"
            >
              <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[11px] font-semibold text-secondary-foreground">
                v{v.n}
              </span>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5">
                  <span className="truncate font-mono text-xs" title={v.fileName}>
                    {v.fileName}
                  </span>
                  {isLatest && (
                    <Badge variant="success" className="px-1.5 py-0 text-[10px]">
                      최신
                    </Badge>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatBytes(v.fileSize)} · {uploader?.name ?? "알 수 없음"} ·{" "}
                  {relativeTimeKo(v.uploadedAt)}
                </p>
              </div>

              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback hue={uploader?.hue} className="text-[10px]">
                  {uploader ? initialsOf(uploader.name) : "?"}
                </AvatarFallback>
              </Avatar>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
