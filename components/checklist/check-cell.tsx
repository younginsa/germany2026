"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import type { CheckState } from "@/lib/types";
import { STATE_LABEL } from "./checklist-utils";

const spring = { type: "spring", stiffness: 560, damping: 30 } as const;

interface CheckCellProps {
  state: CheckState;
  memberName: string;
  onCycle: () => void;
}

/** 매트릭스 셀 — 탭할 때마다 미완료 → 완료 → N/A 순환 */
export function CheckCell({ state, memberName, onCycle }: CheckCellProps) {
  return (
    <button
      type="button"
      onClick={onCycle}
      title={`${memberName} · ${STATE_LABEL[state]} (탭하여 변경)`}
      aria-label={`${memberName} ${STATE_LABEL[state]}`}
      className="group/cell flex h-11 w-full items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "checked" ? (
          <motion.span
            key="checked"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.1 } }}
            transition={spring}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-success text-white shadow-sm"
          >
            <Check className="h-4 w-4" strokeWidth={3.2} />
          </motion.span>
        ) : state === "na" ? (
          <motion.span
            key="na"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.1 } }}
            transition={spring}
            className="rounded-md bg-muted px-1.5 py-1 text-[10px] font-semibold leading-none text-muted-foreground"
          >
            N/A
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.1 } }}
            transition={spring}
            className="h-6 w-6 rounded-md border-2 border-border transition-colors group-hover/cell:border-primary/60"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
