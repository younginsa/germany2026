"use client";

import { useEffect, useState } from "react";

/** 클라이언트 뷰포트 높이(px). SSR/최초 렌더에서는 0. */
export function useViewportHeight(): number {
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const measure = () => setVh(window.innerHeight);
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return vh;
}
