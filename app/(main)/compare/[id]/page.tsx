"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Baby,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Footprints,
  Table2,
  Lightbulb,
  PartyPopper,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { KidScore } from "@/components/compare/kid-score";
import {
  tripOptions,
  type TripBookingGuide,
  type TripEvent,
  type TripGalleryImage,
  type TripMiniTable,
} from "@/lib/data/trip-options";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/** 가로 스크롤 사진 스트립 — 클릭하면 라이트박스로 확대 */
function PhotoStrip({
  photos,
  label,
  onOpen,
}: {
  photos: TripGalleryImage[];
  label: string;
  onOpen: (index: number) => void;
}) {
  return (
    <div
      className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      role="list"
      aria-label={label}
    >
      {photos.map((img, i) => (
        <button
          key={img.src}
          type="button"
          role="listitem"
          onClick={() => onOpen(i)}
          aria-label={`${img.caption} 크게 보기`}
          className="group relative h-28 w-44 shrink-0 snap-start overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="176px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}

/** 가이드 섹션 — 예약 가이드·문화 가이드 등 steps+links 형태 공용 렌더러 */
function GuideSection({
  guide,
  icon,
  onOpenPhoto,
}: {
  guide: TripBookingGuide;
  icon: React.ReactNode;
  onOpenPhoto?: (photos: TripGalleryImage[], index: number) => void;
}) {
  return (
    <Section delay={0.24}>
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        {icon}
        {guide.title}
      </h2>
      {guide.intro && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{guide.intro}</p>
      )}
      <div className="mt-4 space-y-5">
        {guide.steps.map((step) => (
          <div key={step.heading} className="space-y-1.5">
            <h3 className="text-sm font-semibold text-primary">{step.heading}</h3>
            <p className="text-sm leading-relaxed text-foreground/90">{step.body}</p>
          </div>
        ))}
      </div>
      {guide.photos && guide.photos.length > 0 && onOpenPhoto && (
        <PhotoStrip
          photos={guide.photos}
          label={`${guide.title} 사진`}
          onOpen={(i) => onOpenPhoto(guide.photos!, i)}
        />
      )}
      <ul className="mt-5 grid gap-x-16 gap-y-2.5 sm:grid-cols-2">
        {guide.links.map((l) => (
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
      {guide.note && (
        <p className="mt-4 border-l-2 border-amber-400/70 pl-3 text-sm leading-relaxed">
          {guide.note}
        </p>
      )}
    </Section>
  );
}

/** 미니 비교표 본문 — Section 래퍼 없이 제목+표+노트+사진을 렌더링 (일반 자리·여행흐름 아래 공용) */
function MiniTableBlock({
  table,
  onOpenPhoto,
}: {
  table: TripMiniTable;
  onOpenPhoto: (photos: TripGalleryImage[], index: number) => void;
}) {
  return (
    <>
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <Table2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        {table.title}
      </h2>
      {table.intro && <p className="mt-2 text-sm text-muted-foreground">{table.intro}</p>}
      <div className={cn("mt-4 rounded-xl border", !table.compact && "overflow-x-auto")}>
        <table
          className={cn(
            "w-full border-collapse text-[13px]",
            !table.compact && "min-w-[760px]"
          )}
        >
          <thead>
            <tr className="border-b bg-secondary/50">
              <th
                className={cn(
                  "p-3",
                  table.compact
                    ? "w-20"
                    : "sticky left-0 z-10 w-32 min-w-32 bg-secondary/50 backdrop-blur"
                )}
              />
              {table.columns.map((column) => (
                <th
                  key={column}
                  className={cn(
                    "p-3 text-left align-bottom text-sm font-semibold tracking-tight",
                    table.compact ? "break-words px-2" : "min-w-48"
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.label} className="border-b align-top last:border-b-0">
                <th
                  scope="row"
                  className={cn(
                    "bg-card/95 p-3 text-left align-top text-xs font-medium text-muted-foreground",
                    table.compact
                      ? "w-20 break-words px-2"
                      : "sticky left-0 z-10 w-32 min-w-32 backdrop-blur"
                  )}
                >
                  {row.label}
                </th>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "p-3 leading-relaxed",
                      table.compact ? "break-words px-2" : "min-w-48"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{table.note}</p>
      )}
      {table.photos && table.photos.length > 0 && (
        <PhotoStrip
          photos={table.photos}
          label={`${table.title} 출처 스크린샷`}
          onOpen={(i) => onOpenPhoto(table.photos!, i)}
        />
      )}
    </>
  );
}

/** 구분선으로 나뉘는 본문 섹션 (airbnb 스타일) */
function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.4, delay }}
      className="border-t py-7 first:border-t-0 first:pt-0"
    >
      {children}
    </motion.section>
  );
}

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const option = tripOptions.find((o) => o.id === id);
  // 사진 라이트박스 — 어떤 사진 묶음이든 열 수 있고, 모달 안에서 좌우 이동 가능
  const [lightboxState, setLightboxState] = useState<{
    photos: TripGalleryImage[];
    index: number;
  } | null>(null);
  const photos = lightboxState?.photos ?? [];
  const lightbox = lightboxState ? lightboxState.photos[lightboxState.index] : null;
  const openLightbox = (photos: TripGalleryImage[], index: number) =>
    setLightboxState({ photos, index });
  const stepLightbox = (dir: 1 | -1) => {
    setLightboxState((prev) =>
      prev
        ? { ...prev, index: (prev.index + dir + prev.photos.length) % prev.photos.length }
        : prev
    );
  };

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
  // 트레일 그룹은 성인 2인(나+친구) 기준 — 라벨이 달라져요
  const isTrail = option.group === "trail";

  // 이벤트를 소구역(section)별로 묶어요 — 순서 유지
  const eventGroups = (detail.events ?? []).reduce<
    { section?: string; items: TripEvent[] }[]
  >((acc, ev) => {
    const last = acc[acc.length - 1];
    if (last && last.section === ev.section) last.items.push(ev);
    else acc.push({ section: ev.section, items: [ev] });
    return acc;
  }, []);

  const noticeBody = detail.notice ? (
    <>
      <ul className="mt-4 space-y-3">
        {detail.notice.items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 border-l-2 border-amber-400/70 pl-3 text-sm leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>
      {detail.notice.footnote && (
        <p className="mt-3 text-xs text-muted-foreground">{detail.notice.footnote}</p>
      )}
    </>
  ) : null;

  const introSection = (
    <Section delay={0.08}>
      <p className="text-[15px] leading-relaxed">{detail.intro}</p>
    </Section>
  );

  // 여행의 흐름 바로 아래 붙는 비교표들 (afterFlow)
  const afterFlowTableSections = detail.tables
    ?.filter((table) => table.afterFlow)
    .map((table) => (
      <Section key={table.title} delay={0.1}>
        <MiniTableBlock table={table} onOpenPhoto={openLightbox} />
      </Section>
    ));

  const flowSection = (
    <Section delay={detail.flowFirst ? 0.08 : 0.15}>
      <h2 className="text-base font-semibold tracking-tight">여행의 흐름</h2>
      <div className="mt-4 space-y-5">
        {detail.flow.map((section) => (
          <div key={section.heading} className="space-y-1.5">
            <h3 className="text-sm font-semibold text-primary">{section.heading}</h3>
            <p className="text-sm leading-relaxed text-foreground/90">{section.body}</p>
          </div>
        ))}
      </div>
      {detail.flowFirst && detail.notice && (
        <div className="mt-7 border-t pt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            {detail.notice.title}
          </h3>
          {noticeBody}
        </div>
      )}
    </Section>
  );

  return (
    <article className="mx-auto max-w-3xl">
      {/* 뒤로가기 */}
      <motion.div {...fadeUp} transition={{ duration: 0.3 }} className="mb-5">
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          여행비교로 돌아가기
        </Link>
      </motion.div>

      {/* 히어로 */}
      <motion.header {...fadeUp} transition={{ duration: 0.4 }} className="space-y-5 pb-7">
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

      {/* 퀵 팩트 — 2/4컬럼, 박스 없이 구분선만 */}
      <Section delay={0.05}>
        <dl className="grid grid-cols-2 gap-x-12 gap-y-5 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">기간</dt>
            <dd className="mt-1 text-sm font-medium leading-snug">{option.period}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">비행</dt>
            <dd className="mt-1 text-sm font-medium leading-snug">{option.flight}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">날씨 · 시즌</dt>
            <dd className="mt-1 text-sm font-medium leading-snug">{option.weather}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {`${option.costUnit ?? (isTrail ? "1인" : "가족당")} 예상 · ${
                isTrail ? "체력 난이도" : "아이 친화도"
              }`}
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums">{option.costPerFamily}</dd>
            <dd className="mt-1">
              <KidScore score={option.kidScore} />
            </dd>
          </div>
        </dl>
      </Section>

      {/* 도입부 자리 — flowFirst면 여행의 흐름이 먼저 와요 (흐름 뒤엔 afterFlow 표) */}
      {detail.flowFirst ? (
        <>
          {flowSection}
          {afterFlowTableSections}
        </>
      ) : (
        introSection
      )}

      {/* 현지 휴무·주의 정보 — flowFirst면 여행의 흐름 안에 포함 */}
      {!detail.flowFirst && detail.notice && (
        <Section delay={0.1}>
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            {detail.notice.title}
          </h2>
          {noticeBody}
        </Section>
      )}

      {/* 12월 시즌 이벤트 — 2컬럼 */}
      {detail.events && detail.events.length > 0 && (
        <Section delay={0.12}>
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <PartyPopper className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            12월 시즌 이벤트
          </h2>
          {eventGroups.map((group) => (
            <div key={group.section ?? "all"} className="mt-5 first:mt-4">
              {group.section && (
                <h3 className="text-sm font-semibold tracking-tight">
                  {group.section}
                </h3>
              )}
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {group.items.map((event) => (
                  <div
                    key={event.name}
                    className="space-y-1 rounded-xl border border-border/70 p-4"
                  >
                    <h4 className="text-sm font-semibold leading-snug">{event.name}</h4>
                    <p className="text-xs text-muted-foreground">{event.period}</p>
                    <p className="text-sm leading-relaxed text-foreground/90">{event.body}</p>
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
                      >
                        자세히 보기
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {group.section && detail.eventSectionPhotos?.[group.section] && (
                <PhotoStrip
                  photos={detail.eventSectionPhotos[group.section]}
                  label={`${group.section} 사진`}
                  onOpen={(i) =>
                    openLightbox(detail.eventSectionPhotos![group.section!], i)
                  }
                />
              )}
            </div>
          ))}

          {/* 이벤트 사진 캐러셀 — 클릭하면 크게 보기 */}
          {detail.eventPhotos && detail.eventPhotos.length > 0 && (
            <PhotoStrip
              photos={detail.eventPhotos}
              label="시즌 이벤트 사진"
              onOpen={(i) => openLightbox(detail.eventPhotos!, i)}
            />
          )}
        </Section>
      )}

      {/* 미니 비교표 — 이동수단·일정 배분 등 (afterFlow 표는 여행의 흐름 아래에서 렌더링) */}
      {detail.tables
        ?.filter((table) => !table.afterFlow)
        .map((table) => (
          <Section key={table.title} delay={0.13}>
            <MiniTableBlock table={table} onOpenPhoto={openLightbox} />
          </Section>
        ))}

      {/* 여행의 흐름 자리 — flowFirst면 도입부가 이리로 내려와요 */}
      {detail.flowFirst ? (
        introSection
      ) : (
        <>
          {flowSection}
          {afterFlowTableSections}
        </>
      )}

      {/* 갤러리 — 2컬럼 썸네일 */}
      <Section delay={0.18}>
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </Section>

      {/* 아이들에겐 */}
      <Section delay={0.2}>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          {isTrail ? (
            <Footprints className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          ) : (
            <Baby className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          )}
          {isTrail ? "우리 둘에게" : "아이들에겐"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{detail.kids}</p>
      </Section>

      {/* 팁 — 2컬럼 */}
      <Section delay={0.22}>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          알아두면 좋은 팁
        </h2>
        <ul className="mt-4 grid gap-x-16 gap-y-2.5 sm:grid-cols-2">
          {detail.tips.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-primary" aria-hidden>
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </Section>

      {/* 예약 가이드 — 절차 + 예약 채널 링크 */}
      {detail.booking && (
        <GuideSection
          guide={detail.booking}
          icon={<Ticket className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
          onOpenPhoto={openLightbox}
        />
      )}

      {/* 추가 가이드 — 문꾸미기 등 문화·준비 가이드 */}
      {detail.guides?.map((guide) => (
        <GuideSection
          key={guide.title}
          guide={guide}
          icon={<Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
          onOpenPhoto={openLightbox}
        />
      ))}

      {/* 장점 / 단점 — 2컬럼, 박스 없이 */}
      <Section delay={0.25}>
        <div className="grid gap-x-16 gap-y-6 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-success">좋은 점</h2>
            <ul className="mt-3 space-y-2">
              {option.pros.map((p) => (
                <li key={p} className="flex gap-1.5 text-sm leading-relaxed">
                  <span className="text-success" aria-hidden>
                    +
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-destructive">고민할 점</h2>
            <ul className="mt-3 space-y-2">
              {option.cons.map((c) => (
                <li key={c} className="flex gap-1.5 text-sm leading-relaxed">
                  <span className="text-destructive" aria-hidden>
                    −
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 참고 링크 — 2컬럼 */}
      <Section delay={0.28}>
        <h2 className="text-base font-semibold tracking-tight">더 읽어보기</h2>
        <ul className="mt-4 grid gap-x-16 gap-y-2.5 sm:grid-cols-2">
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
      </Section>

      {/* 하단 내비게이션 */}
      <Section delay={0.3}>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          다른 옵션과 비교하기
        </Link>
      </Section>

      {/* 사진 확대 모달 — 좌우 버튼·방향키로 넘기기 */}
      <Dialog
        open={lightbox !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxState(null);
        }}
      >
        <DialogContent
          className="max-w-3xl p-3"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") stepLightbox(1);
            if (e.key === "ArrowLeft") stepLightbox(-1);
          }}
        >
          {lightbox && (
            <figure className="space-y-2">
              <DialogTitle className="sr-only">{lightbox.caption}</DialogTitle>
              <div className="relative h-[55vh] w-full overflow-hidden rounded-lg bg-secondary/40">
                <Image
                  key={lightbox.src}
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  sizes="768px"
                  className="object-contain"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepLightbox(-1)}
                      aria-label="이전 사진"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/85 p-2 shadow-md backdrop-blur transition-colors hover:bg-card"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLightbox(1)}
                      aria-label="다음 사진"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/85 p-2 shadow-md backdrop-blur transition-colors hover:bg-card"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                  </>
                )}
              </div>
              <figcaption className="text-center text-xs text-muted-foreground">
                {lightbox.caption}
                {photos.length > 1 && (
                  <span className="ml-2 tabular-nums opacity-70">
                    {(lightboxState?.index ?? 0) + 1} / {photos.length}
                  </span>
                )}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}
