"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from "framer-motion";
import { useViewportHeight } from "@/hooks/use-viewport-height";

export type SheetSnap = "peek" | "half" | "full";

interface MapBottomSheetProps {
  snap: SheetSnap;
  onSnapChange: (snap: SheetSnap) => void;
  /** 고정 헤더 (그래버 아래) — 드래그 핸들 역할도 함 */
  header: React.ReactNode;
  children: React.ReactNode;
}

const PEEK_PX = 128; // 헤더가 보이는 최소 높이
const SPRING = { type: "spring" as const, stiffness: 420, damping: 42 };

/**
 * 모바일 전용 드래그 바텀시트 (peek / half / full 스냅).
 * 그래버·헤더 영역만 드래그되고, 본문 목록은 독립적으로 스크롤됩니다.
 */
export function MapBottomSheet({ snap, onSnapChange, header, children }: MapBottomSheetProps) {
  const vh = useViewportHeight();
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const sheetH = vh ? Math.round(vh * 0.9) : 0;
  const offsets: Record<SheetSnap, number> = {
    full: 0,
    half: sheetH ? Math.round(sheetH * 0.5) : 0,
    peek: sheetH ? sheetH - PEEK_PX : 0,
  };

  // snap(또는 뷰포트) 변경 시 해당 위치로 애니메이션
  useEffect(() => {
    if (!sheetH) return;
    const controls = animate(y, offsets[snap], SPRING);
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap, sheetH]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const projected = y.get() + info.velocity.y * 0.12;
    let best: SheetSnap = "peek";
    let bestDist = Infinity;
    (Object.keys(offsets) as SheetSnap[]).forEach((key) => {
      const d = Math.abs(offsets[key] - projected);
      if (d < bestDist) {
        bestDist = d;
        best = key;
      }
    });
    animate(y, offsets[best], SPRING);
    if (best !== snap) onSnapChange(best);
  }

  if (!sheetH) return null; // 클라이언트 측정 전

  return (
    <motion.div
      style={{ y, height: sheetH }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: offsets.peek }}
      dragElastic={0.05}
      onDragEnd={handleDragEnd}
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border-t bg-card shadow-[0_-8px_30px_rgb(0_0_0/0.12)] lg:hidden"
    >
      {/* 그래버 + 헤더 (드래그 핸들) */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="shrink-0 cursor-grab touch-none select-none px-4 pb-2 pt-2.5 active:cursor-grabbing"
      >
        <div className="mx-auto mb-2.5 h-1.5 w-10 rounded-full bg-muted-foreground/25" aria-hidden />
        {header}
      </div>

      {/* 본문 (독립 스크롤) */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4">{children}</div>
    </motion.div>
  );
}
