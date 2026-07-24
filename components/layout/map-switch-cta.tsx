"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Map } from "lucide-react";

/**
 * 일정 ↔ 지도 플로팅 전환 버튼 (Airbnb 스타일).
 * /itinerary 에서는 "지도 보기", /map 에서는 "일정 보기"를 띄웁니다.
 * 화면 하단 중앙에 표시되며, 우측 하단의 자료 버튼과 겹치지 않습니다.
 */
export function MapSwitchCta() {
  const pathname = usePathname();

  const target = pathname.startsWith("/itinerary")
    ? { href: "/map", label: "지도 보기", icon: Map }
    : pathname.startsWith("/map")
      ? { href: "/itinerary", label: "일정 보기", icon: CalendarDays }
      : null;

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          key={target.href}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.45 }}
          className="fixed bottom-6 left-4 z-40 sm:left-1/2 sm:-translate-x-1/2"
        >
          <Link
            href={target.href}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[var(--shadow-lifted)] transition-transform hover:scale-105 active:scale-95"
          >
            <target.icon className="h-4 w-4" />
            {target.label}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
