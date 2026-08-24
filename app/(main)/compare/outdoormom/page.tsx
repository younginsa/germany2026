"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, ExternalLink, Instagram, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/** 구분선으로 나뉘는 본문 섹션 (상세 페이지와 동일한 airbnb 스타일) */
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

/** 무드보드 — 사용자가 말한 세 장면 */
const MOOD_THEMES = [
  {
    name: "오션뷰 모닝",
    desc: "밴 창문을 열면 바로 바다 — 파도 소리로 눈을 뜨는 아침",
    image:
      "https://images.unsplash.com/photo-1697062549238-fdb431bb973e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtcGVydmFuJTIwb2NlYW58ZW58MHx8MHx8fDA%3D",
    alt: "해안가의 캠퍼밴과 바다",
  },
  {
    name: "포레스트 워크",
    desc: "잎이 가득한 초록 숲길을 아이 손 잡고 천천히",
    image:
      "https://images.unsplash.com/photo-1622208124790-957dcad00105?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9yZXN0JTIwcGF0aCUyMGdyZWVufGVufDB8fDB8fHww",
    alt: "초록으로 가득한 숲길",
  },
  {
    name: "호수와 오리, 자연 속 다이빙",
    desc: "잔잔한 호수에 오리가 떠 있고, 아이들은 물가로 뛰어들고",
    image:
      "https://images.unsplash.com/photo-1581713872605-b9dfbc84eaa4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFrZSUyMG1vcm5pbmclMjBtaXN0fGVufDB8fDB8fHww",
    alt: "아침 안개 낀 잔잔한 호수",
  },
];

/** 참고 계정 리서치 결과 */
const ACCOUNTS = [
  {
    handle: "@ellasveganplate",
    name: "Ella Smyth",
    note: "아일랜드 웩스포드 시골살이 — 텃밭·요리·슬로우리빙. 팔로워 13.8만. '자연 속 일상' 무드의 원형이에요.",
    url: "https://www.instagram.com/ellasveganplate/",
    verified: true,
  },
  {
    handle: "@eileenroseunderwood",
    name: "확인 필요",
    note: "웹 검색으로는 확인 불가 (비공개·소규모·개명 계정 추정) — 인스타 앱에서 직접 확인해 주세요.",
    url: "https://www.instagram.com/eileenroseunderwood/",
    verified: false,
  },
  {
    handle: "@vanfamilies",
    name: "Vanlife with Kids",
    note: "아이 동반 밴라이프 가족들을 모아 보여주는 커뮤니티 계정 — 이 컨셉의 레퍼런스 창고.",
    url: "https://www.instagram.com/vanfamilies/",
    verified: true,
  },
  {
    handle: "@advanture4six",
    name: "Becca & Tyler",
    note: "아이들과 주말마다 밴으로 하이킹·보트·스키 — '주말 전사' 스타일 아웃도어 가족 (5.9만).",
    url: "https://www.instagram.com/advanture4six/",
    verified: true,
  },
  {
    handle: "@vanlifediaries",
    name: "Vanlife Diaries",
    note: "39만 팔로워의 밴라이프 큐레이션 — 전 세계 밴라이퍼를 리그램해서 스타일 탐색에 좋아요.",
    url: "https://www.instagram.com/vanlifediaries/",
    verified: true,
  },
  {
    handle: "Tales of a Mountain Mama",
    name: "아웃도어맘 팀 블로그",
    note: "아이와 아웃도어의 교과서 — 가족 어드벤처 가이드북까지 낸 산악맘 팀.",
    url: "https://talesofamountainmama.com/",
    verified: true,
  },
];

/** 후보 방향 — 자리표시 카드를 실제 스팟으로 바꿀 때의 세 갈래 */
const DIRECTIONS = [
  {
    title: "국내 동해안 — 솔숲 + 바다",
    body: "강릉 연곡 해변 캠핑장(솔숲과 바다가 붙은 사계절 캠핑장), 동해 추암(촛대바위 해돋이), 강릉 사천·고성 아야진까지. 오션뷰 모닝을 국내에서 가장 쉽게 실현하는 방향이에요.",
    tag: "오션뷰 모닝",
    url: "https://kr.trip.com/blog/gangwon-ocean-view-camping-site-glamping/",
    linkLabel: "강원 오션뷰 캠핑장 가이드",
  },
  {
    title: "제주 차박 — 바다 옆 하룻밤",
    body: "'차박 성지' 함덕(무료 야영장 + 편의시설), 일몰 명소 수월봉·신창풍차해안. 렌터카+루프탑이나 캠핑카 대여로 가볍게 시작할 수 있어요.",
    tag: "오션뷰 모닝",
    url: "https://www.skyscanner.co.kr/destinations/advice/jeju-island-camping",
    linkLabel: "제주 차박 스팟 5곳 가이드",
  },
  {
    title: "뉴질랜드 남섬 캠퍼밴 — 호수·숲의 끝판왕",
    body: "크라이스트처치 → 테카포 호수 → 마운트 쿡 → 와나카 → 퀸스타운 루트. 호수 옆에서 자고 일어나는 아침, 숲 산책, 오리와 호수까지 — 이 컨셉의 이상형이에요. 셀프컨테인드 인증 캠퍼밴 규정만 유의.",
    tag: "포레스트 워크 · 호수",
    url: "https://www.newzealand.com/us/motorhomes/",
    linkLabel: "뉴질랜드 관광청 캠퍼밴 가이드",
  },
];

export default function OutdoormomBoardPage() {
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
            src="https://images.unsplash.com/photo-1541269481801-f7bbef6d81bd?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGVydmFuJTIwb2NlYW58ZW58MHx8MHx8fDA%3D"
            alt="바닷가에 세워진 캠퍼밴"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <span className="absolute left-4 top-4">
            <Badge variant="accent" className="bg-card/90 backdrop-blur">
              컨셉 리서치 보드
            </Badge>
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            🚐 아웃도어맘 · 밴라이프
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            #outdoormom #vanlife — 자연에서 눈뜨는 가족여행 컨셉 연구
          </p>
        </div>
      </motion.header>

      {/* 컨셉 소개 */}
      <Section delay={0.05}>
        <p className="text-[15px] leading-relaxed">
          아침에 눈을 뜨면 창문 너머가 바로 바다이고, 오전엔 초록이 가득한 숲길을 걷고,
          오후엔 오리가 떠다니는 호수에 발을 담그는 여행 — 인스타그램의 #outdoormom
          #vanlife 영상들이 보여주는 그 장면들이에요. 호텔·리조트 여행과 반대편에 있는,
          &lsquo;자연에 머무는 것 자체가 목적&rsquo;인 가족여행 컨셉입니다. 아래는 이
          컨셉을 우리 가족(어른 4 + 아이 3·5·7세) 버전으로 만들기 위한 리서치예요.
        </p>
      </Section>

      {/* 무드보드 */}
      <Section delay={0.08}>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          무드보드 — 우리가 원하는 세 장면
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {MOOD_THEMES.map((theme) => (
            <figure key={theme.name} className="space-y-2">
              <div className="relative h-40 w-full overflow-hidden rounded-xl">
                <Image
                  src={theme.image}
                  alt={theme.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <p className="text-sm font-semibold">{theme.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {theme.desc}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* 참고 계정 */}
      <Section delay={0.12}>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Instagram className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          참고 계정 리서치
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          말씀해주신 계정과, 같은 무드의 검증된 계정들이에요.
        </p>
        <div className="mt-4 grid gap-x-16 gap-y-5 sm:grid-cols-2">
          {ACCOUNTS.map((account) => (
            <div key={account.handle} className="space-y-1">
              <p className="text-sm font-semibold leading-snug">
                {account.handle}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  {account.name}
                </span>
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">{account.note}</p>
              <a
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                {account.verified ? "프로필 보기" : "직접 확인해보기"}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* 후보 방향 */}
      <Section delay={0.16}>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Compass className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          후보 방향 — 자리표시 카드를 채울 세 갈래
        </h2>
        <div className="mt-4 space-y-5">
          {DIRECTIONS.map((direction) => (
            <div key={direction.title} className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-primary">{direction.title}</h3>
                <Badge variant="secondary" className="font-normal">
                  {direction.tag}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{direction.body}</p>
              <a
                href={direction.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                {direction.linkLabel}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* 더 읽어보기 */}
      <Section delay={0.2}>
        <h2 className="text-base font-semibold tracking-tight">더 읽어보기</h2>
        <ul className="mt-4 grid gap-x-16 gap-y-2.5 sm:grid-cols-2">
          {[
            {
              label: "베스트 밴라이프 계정 30 (Uproxx, 영문)",
              url: "https://uproxx.com/life/best-vanlife-instagram-accounts/",
            },
            {
              label: "가족 밴라이프 계정 25 (Awkward Traveller, 영문)",
              url: "https://theawkwardtraveller.com/vanlife-accounts-to-follow-on-instagram/",
            },
            {
              label: "뉴질랜드 캠핑카 가족여행기 (브런치)",
              url: "https://brunch.co.kr/@wynn/254",
            },
            {
              label: "네이버 블로그 — 아이랑 차박 후기 검색",
              url: `https://search.naver.com/search.naver?ssc=tab.blog.all&query=${encodeURIComponent(
                "아이랑 차박 캠핑 오션뷰 후기"
              )}`,
            },
          ].map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 text-sm text-primary underline-offset-2 hover:underline"
              >
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* 다음 단계 */}
      <Section delay={0.24}>
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <MapPin className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          다음 단계
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          여행비교의 아웃도어맘 자리표시 카드 3장은 위 후보 방향에서 구체 스팟과 일정,
          비용이 정해지는 대로 다른 카드들과 같은 형식(기간·비용·아이 친화도·상세 페이지)으로
          교체될 예정이에요. 가족 회의에서 방향을 골라주시면 그 방향부터 구체화합니다.
        </p>
      </Section>

      {/* 하단 내비게이션 */}
      <Section delay={0.28}>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          다른 옵션과 비교하기
        </Link>
      </Section>
    </article>
  );
}
