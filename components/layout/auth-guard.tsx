"use client";

/**
 * AuthGuard — Supabase 모드에서 로그인하지 않은 사용자를 /login으로 보냅니다.
 * 데모 모드(환경변수 없음)에서는 아무 것도 하지 않습니다.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // 데모 모드는 즉시 통과. Supabase 모드는 세션 확인 후 통과.
  const [ready, setReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = getSupabaseBrowserClient();
    if (!sb) {
      setReady(true);
      return;
    }
    let active = true;
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        setReady(true);
      } else {
        router.replace("/login");
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
