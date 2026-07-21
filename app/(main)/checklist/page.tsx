"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChecklistGroups, useChecklistItems, useProfiles } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/checklist/empty-state";
import { GroupCard } from "@/components/checklist/group-card";
import { SummaryCard } from "@/components/checklist/summary-card";
import { ChecklistWizard } from "@/components/checklist/wizard";
import { FILTER_OPTIONS, type ChecklistFilter } from "@/components/checklist/checklist-utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 1.02, 0.73, 1] },
  },
};

export default function ChecklistPage() {
  const groups = useChecklistGroups();
  const items = useChecklistItems();
  const members = useProfiles();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ChecklistFilter>("all");

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 페이지 헤더 */}
      <motion.header
        variants={fadeUp}
        className="flex flex-wrap items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">체크리스트</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            함께 가는 사람들과 나란히 준비 상황을 체크해요
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus />새 그룹
        </Button>
      </motion.header>

      {groups.length === 0 ? (
        <motion.div variants={fadeUp}>
          <EmptyState onCreate={() => setWizardOpen(true)} />
        </motion.div>
      ) : (
        <>
          {/* 검색 + 필터 칩 */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="항목 검색…"
                aria-label="항목 검색"
                className="pl-9"
              />
            </div>
            <div role="group" aria-label="상태 필터" className="flex items-center gap-1.5">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFilter(option.key)}
                  aria-pressed={filter === option.key}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    filter === option.key
                      ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 전체 진행률 요약 */}
          <motion.div variants={fadeUp}>
            <SummaryCard groups={groups} items={items} members={members} />
          </motion.div>

          {/* 그룹별 매트릭스 */}
          {groups.map((group) => (
            <motion.section key={group.id} variants={fadeUp}>
              <GroupCard
                group={group}
                items={items.filter((i) => i.groupId === group.id)}
                allItems={items}
                members={members}
                search={search}
                filter={filter}
              />
            </motion.section>
          ))}
        </>
      )}

      <ChecklistWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </motion.div>
  );
}
