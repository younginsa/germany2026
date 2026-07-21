"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Luggage, Plus, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  onCreate: () => void;
}

/** 체크리스트가 하나도 없을 때의 빈 상태 */
export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-6 px-6 py-16 text-center">
      {/* 이모지 일러스트 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative"
        aria-hidden
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-accent shadow-[var(--shadow-soft)]">
          <Luggage className="h-12 w-12 text-accent-foreground" />
        </div>
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-card shadow-[var(--shadow-lifted)]"
        >
          <ClipboardCheck className="h-5 w-5 text-success" />
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="absolute -bottom-2 -left-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-card shadow-[var(--shadow-lifted)]"
        >
          <TreePine className="h-4.5 w-4.5 text-primary" />
        </motion.span>
      </motion.div>

      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight">아직 체크리스트가 없어요</h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          여권, 보험, 짐 싸기까지 — 두 가족이 함께 준비 상황을
          <br className="hidden sm:block" /> 나란히 체크할 수 있는 표를 만들어 보세요.
        </p>
      </div>

      <Button
        size="lg"
        onClick={onCreate}
        className="h-14 rounded-2xl px-8 text-base shadow-[var(--shadow-lifted)] [&_svg]:size-5"
      >
        <Plus strokeWidth={2.5} />새 체크리스트 만들기
      </Button>
    </Card>
  );
}
