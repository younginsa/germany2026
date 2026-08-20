import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** 아이 친화도 별점 (5점 만점) */
export function KidScore({ score }: { score: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`아이 친화도 5점 만점에 ${score}점`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < score ? "fill-amber-400 text-amber-400" : "text-border"
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}
