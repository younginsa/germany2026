"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppData } from "@/hooks/use-app-data";
import { PLACE_CATEGORY_LABEL } from "@/lib/types";
import { cn, formatDateKo } from "@/lib/utils";

interface SearchResult {
  id: string;
  section: string;
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  href: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const data = useAppData();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hit = (...fields: (string | undefined)[]) =>
      fields.some((f) => f?.toLowerCase().includes(q));
    const out: SearchResult[] = [];

    for (const day of data.itineraryDays) {
      if (
        hit(day.city, day.accommodation, day.notes, day.christmasMarket, day.transportation) ||
        day.schedule.some((s) => hit(s.title, s.description)) ||
        day.restaurants.some((r) => hit(r))
      ) {
        out.push({
          id: `day-${day.id}`,
          section: "일정",
          icon: CalendarDays,
          title: `${day.dayNumber}일차 · ${day.city}`,
          subtitle: formatDateKo(day.date, { weekday: true }),
          href: `/itinerary?day=${day.id}`,
        });
      }
    }
    for (const c of data.comments) {
      if (hit(c.body, c.anchor.selectedText) || c.replies.some((r) => hit(r.body))) {
        out.push({
          id: `comment-${c.id}`,
          section: "댓글",
          icon: MessageCircle,
          title: c.body.slice(0, 60),
          subtitle: `"${c.anchor.selectedText.slice(0, 40)}"`,
          href: `/itinerary?day=${c.anchor.targetId}&comment=${c.id}`,
        });
      }
    }
    for (const item of data.checklistItems) {
      if (hit(item.label)) {
        const group = data.checklistGroups.find((g) => g.id === item.groupId);
        out.push({
          id: `check-${item.id}`,
          section: "체크리스트",
          icon: CheckSquare,
          title: item.label,
          subtitle: group?.title,
          href: "/checklist",
        });
      }
    }
    for (const place of data.places) {
      if (hit(place.name, place.memo, place.address)) {
        out.push({
          id: `place-${place.id}`,
          section: "장소",
          icon: MapPin,
          title: place.name,
          subtitle: PLACE_CATEGORY_LABEL[place.category],
          href: `/map?place=${place.id}`,
        });
      }
    }
    for (const post of data.posts) {
      if (hit(post.title, post.body) || post.tags.some((t) => hit(t))) {
        out.push({
          id: `post-${post.id}`,
          section: "보드",
          icon: LayoutGrid,
          title: post.title,
          subtitle: post.tags.map((t) => `#${t}`).join(" "),
          href: `/board?post=${post.id}`,
        });
      }
    }
    for (const doc of data.documents) {
      if (hit(doc.title, doc.fileName)) {
        out.push({
          id: `doc-${doc.id}`,
          section: "문서",
          icon: FileText,
          title: doc.title,
          subtitle: doc.fileName,
          href: "/documents",
        });
      }
    }
    return out.slice(0, 30);
  }, [query, data]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      map.set(r.section, [...(map.get(r.section) ?? []), r]);
    }
    return [...map.entries()];
  }, [results]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground sm:flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">전체 검색…</span>
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="sm:hidden"
        aria-label="검색"
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] max-w-xl translate-y-0 gap-0 p-0">
          <DialogTitle className="sr-only">전체 검색</DialogTitle>
          <div className="flex items-center gap-2 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="일정, 댓글, 장소, 문서, 보드 검색…"
              className="h-12 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="max-h-[50vh]">
            {query && results.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다
              </p>
            ) : !query ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                여행의 모든 것을 검색하세요 — 일정 · 댓글 · 체크리스트 · 장소 · 보드 · 문서
              </p>
            ) : (
              <div className="p-2">
                {grouped.map(([section, items]) => (
                  <div key={section} className="mb-2">
                    <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {section}
                    </p>
                    {items.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => go(r.href)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent"
                        )}
                      >
                        <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{r.title}</p>
                          {r.subtitle && (
                            <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
