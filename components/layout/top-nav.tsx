"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckSquare,
  FolderOpen,
  Home,
  TreePine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "@/components/layout/notification-center";
import { GlobalSearch } from "@/components/layout/global-search";
import { UserMenu } from "@/components/layout/user-menu";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/itinerary", label: "일정", icon: CalendarDays },
  { href: "/checklist", label: "체크리스트", icon: CheckSquare },
  { href: "/materials", label: "자료", icon: FolderOpen },
] as const;

export function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/itinerary" && pathname.startsWith("/map"));

  return (
    <header className="glass sticky top-0 z-40 border-b border-t-0 border-x-0">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        {/* 로고 */}
        <Link href="/" className="mr-1 flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TreePine className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <span className="text-sm font-bold tracking-tight">독일 2026</span>
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden flex-1 items-center gap-0.5 lg:flex" aria-label="주 메뉴">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
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

        {/* 모바일: 내비게이션은 하단 탭 바 사용 */}
        <div className="flex-1 lg:hidden" />

        {/* 우측 액션 */}
        <div className="flex items-center gap-1">
          <GlobalSearch />
          <NotificationCenter />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
