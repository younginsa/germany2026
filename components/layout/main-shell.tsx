"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { MapSwitchCta } from "@/components/layout/map-switch-cta";

/**
 * 앱 셸 — 경로에 따라 크롬(상단 내비/플로팅 CTA)을 조정합니다.
 * /map 은 몰입형 전체 화면 지도라 상단 내비바를 숨깁니다.
 */
export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/map")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">{children}</main>
      <MapSwitchCta />
    </div>
  );
}
