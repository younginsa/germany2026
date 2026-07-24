"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, CheckSquare, FolderOpen, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "@/components/layout/notification-center";
import { UserMenu } from "@/components/layout/user-menu";

const NAV_ITEMS = [
  { href: "/itinerary", label: "일정", icon: CalendarDays },
  { href: "/checklist", label: "체크리스트", icon: CheckSquare },
  { href: "/materials", label: "자료", icon: FolderOpen },
] as const;

export function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname.startsWith(href) || (href === "/itinerary" && pathname.startsWith("/map"));

  return (
    <header className="glass sticky top-0 z-40 border-b border-t-0 border-x-0">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-1 px-4 sm:gap-2 sm:px-6">
        {/* 로고 — 클릭 시 홈으로 */}
        <Link href="/" className="mr-0.5 flex shrink-0 items-center gap-2 sm:mr-1" aria-label="홈">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TreePine className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">독일 2026</span>
        </Link>

        {/* 주 내비게이션 — 모바일 포함 항상 표시 */}
        <nav
          className="flex flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="주 메뉴"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 우측 액션 */}
        <div className="flex shrink-0 items-center gap-1">
          <NotificationCenter />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
