"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  tripStore,
  useCurrentUser,
  useProfileById,
} from "@/hooks/use-app-data";
import type { Post } from "@/lib/types";
import { cn, initialsOf } from "@/lib/utils";

/**
 * 투표 옵션 바 — 카드/상세 공용.
 * 옵션 클릭 = 내 투표 토글 (사용자당 1표, 같은 옵션 재클릭 시 취소).
 */
export function PollOptions({ post }: { post: Post }) {
  const me = useCurrentUser();
  const profileById = useProfileById();

  const options = post.pollOptions ?? [];
  const totalVotes = options.reduce((sum, o) => sum + o.voterIds.length, 0);

  const vote = (optionId: string) => {
    const next = options.map((o) => {
      const hasMe = o.voterIds.includes(me.id);
      if (o.id === optionId) {
        return {
          ...o,
          voterIds: hasMe ? o.voterIds.filter((v) => v !== me.id) : [...o.voterIds, me.id],
        };
      }
      // 다른 옵션에서는 내 표 제거 (1인 1표)
      return hasMe ? { ...o, voterIds: o.voterIds.filter((v) => v !== me.id) } : o;
    });
    tripStore.upsertRow("posts", { ...post, pollOptions: next });
  };

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const count = option.voterIds.length;
        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        const myVote = option.voterIds.includes(me.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              vote(option.id);
            }}
            className={cn(
              "relative block w-full overflow-hidden rounded-xl border text-left transition-colors",
              myVote
                ? "border-primary/50 ring-1 ring-primary/30"
                : "hover:border-primary/30"
            )}
            aria-pressed={myVote}
          >
            <motion.div
              className={cn(
                "absolute inset-y-0 left-0",
                myVote ? "bg-primary/15" : "bg-accent"
              )}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
            />
            <div className="relative z-10 flex items-center gap-2 px-3 py-2">
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm",
                  myVote ? "font-semibold text-foreground" : "text-foreground/90"
                )}
              >
                {option.label}
              </span>
              {myVote && <Check className="size-3.5 shrink-0 text-primary" />}
              {count > 0 && (
                <span className="flex shrink-0 -space-x-1.5">
                  {option.voterIds.slice(0, 4).map((voterId) => {
                    const p = profileById(voterId);
                    return (
                      <Avatar key={voterId} className="size-4 border border-card">
                        <AvatarFallback hue={p?.hue} className="text-[7px]">
                          {p ? initialsOf(p.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                </span>
              )}
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {count}표 · {pct}%
              </span>
            </div>
          </button>
        );
      })}
      <p className="text-[11px] text-muted-foreground">
        총 {totalVotes}표 · 같은 옵션을 다시 누르면 취소돼요 (다시 투표 가능)
      </p>
    </div>
  );
}
