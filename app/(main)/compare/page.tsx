"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Baby, CalendarRange, ExternalLink, Plane, ThermometerSun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KidScore } from "@/components/compare/kid-score";
import {
  tripOptions,
  outdoormomCards,
  COMPARE_ASSUMPTIONS,
  type ConceptCard,
  type TripOption,
} from "@/lib/data/trip-options";
import { cn } from "@/lib/utils";

const winterOptions = tripOptions.filter((o) => (o.group ?? "winter") === "winter");
const trailOptions = tripOptions.filter((o) => o.group === "trail");

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/** 옵션 소개 카드 — 사진으로 여행의 그림을 그려주는 영역, 클릭 시 세부 페이지로 */
function OptionCard({ option, index }: { option: TripOption; index: number }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="flex"
    >
      <Link href={`/compare/${option.id}`} className="group flex w-full">
        <Card className="flex w-full flex-col overflow-hidden transition-shadow group-hover:shadow-[var(--shadow-lifted)]">
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={option.image}
              alt={option.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
            <div className="flex items-end justify-between pt-1">
              <p className="text-lg font-bold tabular-nums tracking-tight text-foreground">
                {option.costPerFamily}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {option.costUnit ?? (option.group === "trail" ? "1인" : "가족")}
                </span>
              </p>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
                자세히
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

/** 컨셉 자리표시 카드 — 스팟 확정 전, 리서치 보드로 연결 */
function ConceptCardView({ card, index }: { card: ConceptCard; index: number }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="flex"
    >
      <Link href={card.href} className="group flex w-full">
        <Card className="flex w-full flex-col overflow-hidden border-dashed transition-shadow group-hover:shadow-[var(--shadow-lifted)]">
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={card.image}
              alt={card.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute left-3 top-3">
              <Badge variant="secondary" className="bg-card/90 backdrop-blur">
                {card.badge}
              </Badge>
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="text-base font-semibold tracking-tight">
              {card.emoji} {card.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{card.subtitle}</p>
            <p className="mt-auto pt-2 text-xs leading-relaxed text-muted-foreground">
              {card.hint}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-muted-foreground">장소 미정</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-primary">
                리서치 보드
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

/** 비교표 행 정의 — label + 옵션별 셀 렌더러 */
const ROWS: { label: string; render: (o: TripOption) => React.ReactNode }[] = [
  {
    label: "예상 비용 (인원 기준 표기)",
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
    label: "아이 친화도",
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
          가족들의 다음 여행 — 겨울 시나리오 6개와 걷기·아웃도어 컨셉까지, 옵션별 인원
          기준으로 비교하고 함께 결정해요
        </p>
      </motion.header>

      {/* 겨울 가족여행 시나리오 */}
      <section className="space-y-4">
        <motion.h2 {...fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold tracking-tight">
          ❄️ 겨울 가족여행 시나리오
        </motion.h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {winterOptions.map((option, i) => (
            <OptionCard key={option.id} option={option} index={i} />
          ))}
        </div>
      </section>

      {/* 걷기·트레일 여행 */}
      <section className="space-y-4">
        <motion.h2 {...fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold tracking-tight">
          🥾 걷기 · 트레일 여행 <span className="text-sm font-normal text-muted-foreground">어른 둘 — 나와 친구의 여행, 1인 기준 비용</span>
        </motion.h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trailOptions.map((option, i) => (
            <OptionCard key={option.id} option={option} index={i} />
          ))}
        </div>
      </section>

      {/* 아웃도어맘 · 밴라이프 컨셉 (자리표시) */}
      <section className="space-y-4">
        <motion.h2 {...fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold tracking-tight">
          🚐 아웃도어맘 · 밴라이프 <span className="text-sm font-normal text-muted-foreground">컨셉 리서치 중 — 카드를 누르면 리서치 보드로</span>
        </motion.h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outdoormomCards.map((card, i) => (
            <ConceptCardView key={card.id} card={card} index={i} />
          ))}
        </div>
      </section>

      {/* 비교표 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }} className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">📊 겨울 시나리오 비교표</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            걷기·트레일 카드는 최적 시즌이 달라 표에서 제외 — 각 카드의 세부 페이지에서
            확인하세요.
          </p>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1300px] border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="sticky left-0 z-10 w-36 min-w-36 bg-secondary/50 p-3 text-left align-bottom font-medium text-muted-foreground backdrop-blur">
                    항목
                  </th>
                  {winterOptions.map((o) => (
                    <th key={o.id} className="min-w-44 p-3 text-left align-bottom">
                      <Link href={`/compare/${o.id}`} className="group inline-block">
                        <p className="text-sm font-semibold tracking-tight underline-offset-2 group-hover:underline">
                          {o.emoji} {o.title}
                        </p>
                      </Link>
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
                    {winterOptions.map((o) => (
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
