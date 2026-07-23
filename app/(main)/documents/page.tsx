"use client";

/** 문서는 자료 탭으로 통합되었습니다 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DocumentsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/materials");
  }, [router]);
  return null;
}
