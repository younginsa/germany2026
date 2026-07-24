"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

/**
 * 자료 플로팅 버튼 (우측 하단 FAB).
 * 어느 화면에서도 자료(보드+문서)로 빠르게 이동합니다.
 * 이미 /materials 에 있으면 숨깁니다.
 */
export function MaterialsCta() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/materials");

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.45 }}
          className="fixed bottom-6 right-4 z-40 sm:right-6"
        >
          <Link
            href="/materials"
            aria-label="자료"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lifted)] transition-transform hover:scale-105 active:scale-95"
          >
            <FolderOpen className="h-4 w-4" />
            자료
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
