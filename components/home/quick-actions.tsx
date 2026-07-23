import Link from "next/link";
import {
  FolderOpen,
  CalendarDays,
  CheckSquare,
  Map,
} from "lucide-react";

const ACTIONS = [
  { href: "/itinerary", label: "일정 보기", desc: "10일 일정표", icon: CalendarDays },
  { href: "/map", label: "지도 열기", desc: "저장한 장소", icon: Map },
  { href: "/checklist", label: "체크리스트", desc: "준비물 점검", icon: CheckSquare },
  { href: "/materials", label: "자료", desc: "아이디어 · 파일 · 투표", icon: FolderOpen },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] active:scale-[0.98]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <action.icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{action.label}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {action.desc}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
