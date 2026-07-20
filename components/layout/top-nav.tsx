"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckSquare,
  FileText,
  Home,
  LayoutGrid,
  Map,
  Menu,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationCenter } from "@/components/layout/notification-center";
import { GlobalSearch } from "@/components/layout/global-search";
import { UserMenu } from "@/components/layout/user-menu";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/itinerary", label: "일정", icon: CalendarDays },
  { href: "/map", label: "지도", icon: Map },
  { href: "/checklist", label: "체크리스트", icon: CheckSquare },
  { href: "/board", label: "보드", icon: LayoutGrid },
  { href: "/documents", label: "문서", icon: FileText },
  { href: "/settings", label: "설정", icon: Settings },
] as const;

export function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="glass sticky top-0 z-40 border-b border-t-0 border-x-0">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        {/* 로고 */}
        <Link href="/" className="mr-1 flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-lg">
            🎄
          </span>
          <span className="hidden text-sm font-bold tracking-tight md:block">
            독일 2026
          </span>
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

        {/* 모바일: 햄버거 메뉴 */}
        <div className="flex flex-1 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(isActive(item.href) && "bg-accent font-medium")}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 우측 액션 */}
        <div className="flex items-center gap-1">
          <GlobalSearch />
          <NotificationCenter />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
