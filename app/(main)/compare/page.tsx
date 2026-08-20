"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Baby, CalendarRange, ExternalLink, Plane, Star, ThermometerSun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { tripOptions, COMPARE_ASSUMPTIONS, type TripOption } from "@/lib/data/trip-options";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

function KidScore({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`아이 친화도 5점 만점에 ${score}점`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < score ? "fill-amber-400 text-amber-400" : "text-border"
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

/** 옵션 소개 카드 — 사진으로 여행의 그림을 그려주는 영역 */
function OptionCard({ option, index }: { option: TripOption; index: number }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="flex"
    >
      <Card className="flex w-full flex-col overflow-hidden">
        <div className="relative h-40 w-full">
          <Image
            src={option.image}
            alt={option.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover"
          />
          <span className="absolute left-3 top-3">
            <Badge variant="accent" className="bg-card/90 backdrop-blur">
              {option.badge}
            </Badge>
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-base font-semibold tracking-tight">
            {option.emoji} {option.title}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{option.subtitle}</p>
          <div className="mt-auto space-y-1.5 pt-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {option.period}
            </p>
            <p className="flex items-center gap-1.5">
              <ThermometerSun className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {option.weather}
            </p>
          </div>
          <p className="pt-1 text-lg font-bold tabular-nums tracking-tight text-foreground">
            {option.costPerFamily}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ 가족</span>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

/** 비교표 행 정의 — label + 옵션별 셀 렌더러 */
const ROWS: { label: string; render: (o: TripOption) => React.ReactNode }[] = [
  {
    label: "가족당 예상 비용",
    render: (o) => (
      <div>
        <p className="text-base font-bold tabular-nums">{o.costPerFamily}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{o.costGroup}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{o.costNote}</p>
      </div>
    ),
  },
  { label: "추천 기간", render: (o) => o.period },
  {
    label: "비행",
    render: (o) => (
      <span className="inline-flex items-start gap-1.5">
        <Plane className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        {o.flight}
      </span>
    ),
  },
  { label: "12월 날씨", render: (o) => o.weather },
  {
    label: "아이 친화도 (3·5·7세)",
    render: (o) => (
      <div className="space-y-1">
        <KidScore score={o.kidScore} />
        <p className="text-[11px] leading-relaxed text-muted-foreground">{o.kidNote}</p>
      </div>
    ),
  },
  {
    label: "대표 경험",
    render: (o) => (
      <ul className="list-disc space-y-1 pl-4">
        {o.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    ),
  },
  {
    label: "장점",
    render: (o) => (
      <ul className="space-y-1">
        {o.pros.map((p) => (
          <li key={p} className="flex gap-1.5">
            <span className="text-success" aria-hidden>
              +
            </span>
            {p}
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: "단점 · 주의",
    render: (o) => (
      <ul className="space-y-1">
        {o.cons.map((c) => (
          <li key={c} className="flex gap-1.5">
            <span className="text-destructive" aria-hidden>
              −
            </span>
            {c}
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: "참고 링크",
    render: (o) => (
      <ul className="space-y-1.5">
        {o.links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1 text-primary underline-offset-2 hover:underline"
            >
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    ),
  },
];

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <motion.header {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">여행비교</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          2026년 12월, 두 가족(어른 4 · 아이 3·5·7세)의 겨울 여행 — 5가지 시나리오를 비교하고
          함께 결정해요
        </p>
      </motion.header>

      {/* 옵션 카드 — 이미지로 먼저 그림 그리기 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tripOptions.map((option, i) => (
          <OptionCard key={option.id} option={option} index={i} />
        ))}
      </div>

      {/* 비교표 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="sticky left-0 z-10 w-36 min-w-36 bg-secondary/50 p-3 text-left align-bottom font-medium text-muted-foreground backdrop-blur">
                    항목
                  </th>
                  {tripOptions.map((o) => (
                    <th key={o.id} className="min-w-44 p-3 text-left align-bottom">
                      <p className="text-sm font-semibold tracking-tight">
                        {o.emoji} {o.title}
                      </p>
                      <Badge variant="secondary" className="mt-1 font-normal">
                        {o.badge}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.label} className={cn("border-b align-top", ri === 0 && "bg-accent/40")}>
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 w-36 min-w-36 p-3 text-left align-top text-xs font-medium text-muted-foreground backdrop-blur",
                        ri === 0 ? "bg-accent/40" : "bg-card/95"
                      )}
                    >
                      {row.label}
                    </th>
                    {tripOptions.map((o) => (
                      <td key={o.id} className="min-w-44 p-3 leading-relaxed">
                        {row.render(o)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* 가정 안내 */}
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-start gap-2 rounded-xl border border-dashed p-4 text-xs leading-relaxed text-muted-foreground"
      >
        <Baby className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {COMPARE_ASSUMPTIONS}
      </motion.p>
    </div>
  );
}
