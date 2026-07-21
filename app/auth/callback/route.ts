import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/** Supabase OAuth/매직 링크 콜백 — 코드 교환 후 홈으로 이동 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const response = NextResponse.redirect(`${origin}/`);

  if (code && isSupabaseConfigured) {
    const cookieStore = await cookies();
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // 세션 쿠키를 요청 스토어와 리다이렉트 응답 양쪽에 기록 —
        // 수동 redirect 응답에도 Set-Cookie가 포함되도록 보장합니다.
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] 세션 교환 실패:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
  }

  return response;
}
