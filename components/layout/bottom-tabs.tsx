"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, CheckSquare, FolderOpen, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/itinerary", label: "일정", icon: CalendarDays },
  { href: "/checklist", label: "체크리스트", icon: CheckSquare },
  { href: "/materials", label: "자료", icon: FolderOpen },
] as const;

/** 모바일 전용 하단 고정 탭 바 — lg 이상에서는 상단 내비게이션 사용 */
export function BottomTabs() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/itinerary" && pathname.startsWith("/map"));

  return (
    <nav
      aria-label="하단 탭 메뉴"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-lg items-stretch">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-tab-active"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  />
                )}
                <tab.icon className={cn("h-5 w-5", active && "scale-105")} strokeWidth={active ? 2.4 : 2} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
