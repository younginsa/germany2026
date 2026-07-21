"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  newId,
  pushNotification,
  tripStore,
  useChecklistGroups,
  useCurrentUser,
  useProfiles,
  useTrip,
} from "@/hooks/use-app-data";
import type { CheckState, ChecklistGroup, ChecklistItem, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MEMBER_HUE_PALETTE, memberDotColor } from "./checklist-utils";

const STEPS = [
  { title: "멤버 입력", description: "누가 함께 체크하나요?" },
  { title: "항목 입력", description: "무엇을 준비해야 하나요?" },
] as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -56, opacity: 0 }),
};

interface ChecklistWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** 2단계 체크리스트 생성 마법사 — 멤버(동행인) 컬럼 → 항목 목록 */
export function ChecklistWizard({ open, onOpenChange }: ChecklistWizardProps) {
  const trip = useTrip();
  const me = useCurrentUser();
  const profiles = useProfiles();
  const groups = useChecklistGroups();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [membersText, setMembersText] = useState("");
  const [title, setTitle] = useState("새 체크리스트");
  const [itemsText, setItemsText] = useState("");

  /* 열릴 때마다 초기화 — 기존 멤버 이름을 미리 채움 */
  useEffect(() => {
    if (open) {
      setStep(0);
      setDirection(1);
      setMembersText(tripStore.getSnapshot().profiles.map((p) => p.name).join(", "));
      setTitle("새 체크리스트");
      setItemsText("");
    }
  }, [open]);

  const parsedNames = Array.from(
    new Set(
      membersText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
  const parsedItems = itemsText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const canNext = parsedNames.length > 0;
  const canSubmit = parsedItems.length > 0 && title.trim().length > 0;

  const goNext = () => {
    setDirection(1);
    setStep(1);
  };
  const goBack = () => {
    setDirection(-1);
    setStep(0);
  };

  const submit = () => {
    if (!canSubmit || !canNext) return;

    /* 1) 멤버 이름 → 기존 멤버 매핑 or 새 동행인 생성 */
    const usedHues = new Set(profiles.map((p) => p.hue));
    const memberIds: string[] = [];
    for (const name of parsedNames) {
      const existing = profiles.find((p) => p.name === name);
      if (existing) {
        memberIds.push(existing.id);
        continue;
      }
      const hue =
        MEMBER_HUE_PALETTE.find((h) => !usedHues.has(h)) ??
        MEMBER_HUE_PALETTE[memberIds.length % MEMBER_HUE_PALETTE.length];
      usedHues.add(hue);
      const member: Profile = {
        id: newId("p"),
        name,
        hue,
      };
      tripStore.upsertRow("profiles", member);
      memberIds.push(member.id);
    }

    /* 2) 그룹 생성 (order = max + 1) */
    const maxOrder = groups.reduce((m, g) => Math.max(m, g.order), -1);
    const group: ChecklistGroup = {
      id: newId("cg"),
      tripId: trip.id,
      title: title.trim(),
      order: maxOrder + 1,
      memberIds,
    };
    tripStore.upsertRow("checklistGroups", group);

    /* 3) 항목 생성 — 모든 멤버 셀을 empty로 초기화 */
    parsedItems.forEach((label, index) => {
      const checks: Record<string, CheckState> = {};
      for (const fid of memberIds) checks[fid] = "empty";
      const item: ChecklistItem = {
        id: newId("ci"),
        groupId: group.id,
        label,
        order: index,
        checks,
      };
      tripStore.upsertRow("checklistItems", item);
    });

    pushNotification({
      type: "checklist",
      actorId: me.id,
      message: `${me.name}님이 체크리스트 "${group.title}"을(를) 만들었습니다`,
      href: "/checklist",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            새 체크리스트 만들기
          </DialogTitle>
          <DialogDescription>{STEPS[step].description}</DialogDescription>
        </DialogHeader>

        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i < step
                    ? "bg-success text-white"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 rounded-full transition-colors",
                    step > i ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* 스텝 콘텐츠 — 슬라이드 전환 */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step === 0 ? (
              <motion.div
                key="step-members"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-3"
              >
                <label htmlFor="wizard-members" className="text-sm font-medium">
                  함께 체크할 사람
                </label>
                <Input
                  id="wizard-members"
                  autoFocus
                  value={membersText}
                  onChange={(e) => setMembersText(e.target.value)}
                  placeholder="나, 친구1, 친구2"
                />
                <p className="text-xs text-muted-foreground">쉼표로 구분해 입력하세요</p>

                {parsedNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {parsedNames.map((name, i) => {
                      const existing = profiles.find((p) => p.name === name);
                      const hue =
                        existing?.hue ??
                        MEMBER_HUE_PALETTE[i % MEMBER_HUE_PALETTE.length];
                      return (
                        <span
                          key={name}
                          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium"
                        >
                          <span
                            aria-hidden
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: memberDotColor(hue) }}
                          />
                          {name}
                          {!existing && (
                            <span className="text-[10px] text-primary">새 동행인</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="step-items"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <label htmlFor="wizard-title" className="text-sm font-medium">
                    체크리스트 이름
                  </label>
                  <Input
                    id="wizard-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="새 체크리스트"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="wizard-items" className="text-sm font-medium">
                    항목 입력
                  </label>
                  <Textarea
                    id="wizard-items"
                    autoFocus
                    value={itemsText}
                    onChange={(e) => setItemsText(e.target.value)}
                    placeholder={"여권\n보험\n카시트"}
                    rows={5}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">한 줄에 하나씩 입력하세요</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 하단 내비게이션 */}
        <div className="flex items-center justify-between">
          {step === 0 ? (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              취소
            </Button>
          ) : (
            <Button variant="ghost" onClick={goBack}>
              <ArrowLeft />
              이전
            </Button>
          )}
          {step === 0 ? (
            <Button onClick={goNext} disabled={!canNext}>
              다음
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={submit} disabled={!canSubmit}>
              <Check />
              만들기
              {parsedItems.length > 0 && (
                <span className="tabular-nums opacity-80">({parsedItems.length})</span>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
