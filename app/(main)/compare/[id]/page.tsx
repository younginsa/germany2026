"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Baby,
  CalendarRange,
  ExternalLink,
  Lightbulb,
  Plane,
  ThermometerSun,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KidScore } from "@/components/compare/kid-score";
import { tripOptions } from "@/lib/data/trip-options";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const option = tripOptions.find((o) => o.id === id);

  if (!option) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">여행 옵션을 찾을 수 없어요.</p>
        <Link href="/compare" className="text-sm text-primary underline-offset-2 hover:underline">
          여행비교로 돌아가기
        </Link>
      </div>
    );
  }

  const { detail } = option;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      {/* 뒤로가기 */}
      <motion.div {...fadeUp} transition={{ duration: 0.3 }}>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          여행비교로 돌아가기
        </Link>
      </motion.div>

      {/* 히어로 */}
      <motion.header {...fadeUp} transition={{ duration: 0.4 }} className="space-y-4">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-80">
          <Image
            src={option.image}
            alt={option.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <span className="absolute left-4 top-4">
            <Badge variant="accent" className="bg-card/90 backdrop-blur">
              {option.badge}
            </Badge>
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {option.emoji} {option.title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{option.subtitle}</p>
        </div>
      </motion.header>

      {/* 퀵 팩트 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card className="grid grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-4">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarRange className="h-3.5 w-3.5" aria-hidden />
              기간
            </p>
            <p className="font-medium">{option.period}</p>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Plane className="h-3.5 w-3.5" aria-hidden />
              비행
            </p>
            <p className="font-medium">{option.flight}</p>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ThermometerSun className="h-3.5 w-3.5" aria-hidden />
              12월 날씨
            </p>
            <p className="font-medium">{option.weather}</p>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" aria-hidden />
              가족당 예상
            </p>
            <p className="font-bold tabular-nums">{option.costPerFamily}</p>
            <KidScore score={option.kidScore} />
          </div>
        </Card>
      </motion.div>

      {/* 도입부 */}
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-[15px] leading-relaxed"
      >
        {detail.intro}
      </motion.p>

      {/* 일정 흐름 */}
      <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }} className="space-y-5">
        <h2 className="text-lg font-semibold tracking-tight">여행의 흐름</h2>
        {detail.flow.map((section) => (
          <div key={section.heading} className="space-y-1.5">
            <h3 className="text-sm font-semibold text-primary">{section.heading}</h3>
            <p className="text-sm leading-relaxed text-foreground/90">{section.body}</p>
          </div>
        ))}
      </motion.section>

      {/* 갤러리 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {detail.gallery.map((img) => (
          <figure key={img.src} className="space-y-1.5">
            <div className="relative h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
              />
            </div>
            <figcaption className="text-xs text-muted-foreground">{img.caption}</figcaption>
          </figure>
        ))}
      </motion.div>

      {/* 아이들에겐 */}
      <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="space-y-2 border-l-4 border-l-primary p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Baby className="h-4 w-4 text-primary" aria-hidden />
            3·5·7세 아이들에겐
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">{detail.kids}</p>
        </Card>
      </motion.section>

      {/* 팁 */}
      <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.3 }} className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Lightbulb className="h-4.5 w-4.5 text-amber-500" aria-hidden />
          알아두면 좋은 팁
        </h2>
        <ul className="space-y-2">
          {detail.tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-primary" aria-hidden>
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* 장점 / 단점 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Card className="space-y-2.5 p-5">
          <h2 className="text-sm font-semibold text-success">좋은 점</h2>
          <ul className="space-y-1.5">
            {option.pros.map((p) => (
              <li key={p} className="flex gap-1.5 text-sm leading-relaxed">
                <span className="text-success" aria-hidden>
                  +
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-2.5 p-5">
          <h2 className="text-sm font-semibold text-destructive">고민할 점</h2>
          <ul className="space-y-1.5">
            {option.cons.map((c) => (
              <li key={c} className="flex gap-1.5 text-sm leading-relaxed">
                <span className="text-destructive" aria-hidden>
                  −
                </span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* 참고 링크 */}
      <motion.section {...fadeUp} transition={{ duration: 0.4, delay: 0.4 }} className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">더 읽어보기</h2>
        <ul className="space-y-2">
          {option.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 text-sm text-primary underline-offset-2 hover:underline"
              >
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* 하단 내비게이션 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="border-t pt-6"
      >
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          다른 옵션과 비교하기
        </Link>
      </motion.div>
    </article>
  );
}
