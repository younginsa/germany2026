"use client";

/** 보드는 자료 탭으로 통합되었습니다 — 딥링크(?post=) 유지 리다이렉트 */

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Redirector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `/materials?${qs}` : "/materials");
  }, [router, searchParams]);
  return null;
}

export default function BoardRedirect() {
  return (
    <Suspense fallback={null}>
      <Redirector />
    </Suspense>
  );
}
