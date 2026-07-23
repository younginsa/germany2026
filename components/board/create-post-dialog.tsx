"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Upload, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CREATABLE_TYPES,
  POST_TYPE_META,
  type CreatableType,
} from "@/components/board/post-meta";
import { CATEGORY_META } from "@/components/map/category-meta";
import {
  newId,
  pushNotification,
  tripStore,
  useCurrentUser,
  useIsDemo,
  usePlaces,
  useTrip,
} from "@/hooks/use-app-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PollOption, Post } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null이면 새 카드, 값이 있으면 수정 모드 */
  editing: Post | null;
  /** 새 카드가 소속될 자료 그룹 (null이면 일반) */
  defaultGroupId?: string | null;
}

function emptyOption(): PollOption {
  return { id: newId("po"), label: "", voterIds: [] };
}

export function CreatePostDialog({ open, onOpenChange, editing, defaultGroupId }: CreatePostDialogProps) {
  const me = useCurrentUser();
  const trip = useTrip();
  const places = usePlaces();
  const isDemo = useIsDemo();

  const isRefEdit =
    !!editing && (editing.type === "checklist_ref" || editing.type === "comment_ref");

  const [type, setType] = useState<CreatableType>("text");
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [placeId, setPlaceId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 다이얼로그가 열릴 때 상태 초기화 (수정 모드면 기존 값 채우기)
  useEffect(() => {
    if (!open) return;
    if (editing) {
      if (editing.type !== "checklist_ref" && editing.type !== "comment_ref") {
        setType(editing.type);
      }
      setTitle(editing.title);
      setTagsInput(editing.tags.join(", "));
      setBody(editing.body ?? "");
      setImageUrl(editing.imageUrl ?? "");
      setPlaceId(editing.placeId ?? "");
      setLinkUrl(editing.linkUrl ?? "");
      setPollOptions(
        editing.pollOptions?.length
          ? editing.pollOptions.map((o) => ({ ...o }))
          : [emptyOption(), emptyOption()]
      );
    } else {
      setType("text");
      setTitle("");
      setTagsInput("");
      setBody("");
      setImageUrl("");
      setPlaceId("");
      setLinkUrl("");
      setPollOptions([emptyOption(), emptyOption()]);
    }
    setDragging(false);
    setUploading(false);
  }, [open, editing]);

  const handleFile = async (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있어요");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    if (isSupabaseConfigured) {
      setUploading(true);
      try {
        const sb = getSupabaseBrowserClient();
        if (!sb) throw new Error("no client");
        const path = `board/${newId("img")}.${ext}`;
        const { error } = await sb.storage.from("trip-files").upload(path, file);
        if (error) throw error;
        const { data } = sb.storage.from("trip-files").getPublicUrl(path);
        setImageUrl(data.publicUrl);
        return;
      } catch {
        toast.warning("업로드에 실패해서 임시 이미지로 대체했어요");
        setImageUrl(URL.createObjectURL(file));
      } finally {
        setUploading(false);
      }
    } else {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const addOption = () => setPollOptions((prev) => [...prev, emptyOption()]);
  const removeOption = (id: string) =>
    setPollOptions((prev) => (prev.length > 2 ? prev.filter((o) => o.id !== id) : prev));
  const setOptionLabel = (id: string, label: string) =>
    setPollOptions((prev) => prev.map((o) => (o.id === id ? { ...o, label } : o)));

  const save = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("제목을 입력해주세요");
      return;
    }
    const effectiveType: Post["type"] = isRefEdit ? editing!.type : type;

    if (!isRefEdit) {
      if (effectiveType === "image" && !imageUrl) {
        toast.error("이미지를 업로드해주세요");
        return;
      }
      if (effectiveType === "location" && !placeId) {
        toast.error("장소를 선택해주세요");
        return;
      }
      if (effectiveType === "link" && !/^https?:\/\//.test(linkUrl.trim())) {
        toast.error("http 또는 https로 시작하는 링크를 입력해주세요");
        return;
      }
      if (effectiveType === "poll") {
        const filled = pollOptions.filter((o) => o.label.trim());
        if (filled.length < 2) {
          toast.error("투표 옵션을 2개 이상 입력해주세요");
          return;
        }
      }
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const base: Post = editing
      ? { ...editing }
      : {
          id: newId("post"),
          tripId: trip.id,
          groupId: defaultGroupId ?? undefined,
          type: effectiveType,
          title: "",
          tags: [],
          authorId: me.id,
          createdAt: new Date().toISOString(),
          likedBy: [],
          comments: [],
        };

    const post: Post = {
      ...base,
      type: effectiveType,
      title: trimmedTitle,
      body: body.trim() || undefined,
      tags,
      imageUrl: effectiveType === "image" ? imageUrl : undefined,
      placeId: effectiveType === "location" ? placeId : undefined,
      linkUrl: effectiveType === "link" ? linkUrl.trim() : undefined,
      pollOptions:
        effectiveType === "poll"
          ? pollOptions
              .filter((o) => o.label.trim())
              .map((o) => ({ ...o, label: o.label.trim() }))
          : undefined,
      refId: isRefEdit ? base.refId : undefined,
    };

    tripStore.upsertRow("posts", post);

    if (editing) {
      toast.success("카드를 수정했어요");
    } else {
      pushNotification({
        type: "board",
        actorId: me.id,
        message: `${me.name}님이 새 카드를 올렸습니다: ${post.title}`,
        href: `/materials?post=${post.id}`,
      });
      toast.success("새 카드를 올렸어요");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "카드 수정" : "새 카드"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "카드 내용을 수정해보세요."
              : "아이디어, 장소, 링크, 투표 — 무엇이든 보드에 올려보세요."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 타입 선택 (참조 카드 수정 시에는 숨김) */}
          {!isRefEdit && (
            <div className="flex flex-wrap gap-1.5">
              {CREATABLE_TYPES.map((t) => {
                const meta = POST_TYPE_META[t];
                const Icon = meta.icon;
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                    aria-pressed={active}
                  >
                    <Icon className="size-3.5" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="post-title">제목</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              autoFocus
            />
          </div>

          {/* 타입별 필드 */}
          {!isRefEdit && type === "image" && (
            <div className="space-y-2">
              <Label>이미지</Label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  void handleFile(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground transition-colors",
                  dragging
                    ? "border-primary bg-accent"
                    : "hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    업로드 중…
                  </>
                ) : imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="미리보기"
                      className="max-h-48 w-full rounded-lg object-cover"
                    />
                    <span className="text-xs">다른 이미지를 선택하려면 클릭하세요</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-5" />
                    이미지를 끌어다 놓거나 클릭해서 업로드
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {isDemo && (
                <p className="text-[11px] text-muted-foreground">
                  데모 모드에서는 새로고침 시 이미지가 사라질 수 있습니다.
                </p>
              )}
            </div>
          )}

          {!isRefEdit && type === "location" && (
            <div className="space-y-1.5">
              <Label>장소</Label>
              <Select value={placeId} onValueChange={setPlaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="장소를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {[...places]
                    .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                    .map((place) => {
                      const Icon = CATEGORY_META[place.category].icon;
                      return (
                        <SelectItem key={place.id} value={place.id}>
                          <Icon
                            className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]"
                            style={{ color: CATEGORY_META[place.category].color }}
                            aria-hidden
                          />
                          {place.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isRefEdit && type === "link" && (
            <div className="space-y-1.5">
              <Label htmlFor="post-link">링크</Label>
              <Input
                id="post-link"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://…"
                inputMode="url"
              />
            </div>
          )}

          {!isRefEdit && type === "poll" && (
            <div className="space-y-2">
              <Label>투표 옵션 (최소 2개)</Label>
              {pollOptions.map((option, i) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => setOptionLabel(option.id, e.target.value)}
                    placeholder={`옵션 ${i + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeOption(option.id)}
                    disabled={pollOptions.length <= 2}
                    aria-label="옵션 삭제"
                    className="shrink-0 text-muted-foreground"
                  >
                    <X />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="gap-1">
                <Plus className="size-3.5" />
                옵션 추가
              </Button>
              {editing?.pollOptions?.some((o) => o.voterIds.length > 0) && (
                <p className="text-[11px] text-muted-foreground">
                  기존 옵션의 투표 결과는 유지됩니다.
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="post-body">내용 (선택)</Label>
            <Textarea
              id="post-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="내용 (선택)"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-tags">태그</Label>
            <Input
              id="post-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="태그 (쉼표로 구분)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={save} disabled={uploading}>
            {editing ? "저장" : "올리기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
