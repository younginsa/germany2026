"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Snowflake, Sparkles, TreePine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { seedData } from "@/lib/data/seed";
import { tripStore } from "@/lib/data/store";
import { initialsOf } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.82-.07-1.6-.21-2.36H12v4.46h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.73Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.61l4 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#191600"
        d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.87 5.31 4.68 6.72-.2.72-.74 2.66-.85 3.07-.13.51.19.5.4.37.16-.11 2.6-1.77 3.66-2.49.69.1 1.4.15 2.11.15 5.52 0 10-3.58 10-8s-4.48-8-10-8Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 상태면 홈으로 (매직 링크 콜백 후 재방문 등)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.replace("/");
    });
  }, [router]);

  async function signInWithProvider(provider: "google" | "kakao") {
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    setLoading(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    // 성공 시 브라우저가 제공자 페이지로 리다이렉트됩니다.
    if (error) {
      setLoading(false);
      toast.error("로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabaseBrowserClient();
    if (!sb) return;
    setLoading(true);
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      toast.error("메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      setSent(true);
    }
  }

  function enterAsDemo(profileId: string) {
    tripStore.setCurrentUser(profileId);
    router.push("/");
  }

  const adults = seedData.profiles.filter((p) => p.role !== "아이");

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      {/* 배경 장식 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 1.02, 0.73, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <TreePine className="h-7 w-7 text-primary" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">독일 크리스마스 마켓 여행</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            두 가족이 함께 만드는 여행 워크스페이스
          </p>
        </div>

        <Card className="glass">
          <CardContent className="p-6">
            {isSupabaseConfigured ? (
              sent ? (
                <div className="py-6 text-center">
                  <Mail className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <p className="font-medium">메일함을 확인해주세요</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{email}</span> 주소로
                    <br />
                    로그인 링크를 보냈습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => signInWithProvider("google")}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border bg-card px-4 py-3 text-sm font-medium shadow-[var(--shadow-soft)] transition-all hover:bg-secondary/50 active:scale-[0.99] disabled:opacity-60"
                  >
                    <GoogleIcon className="h-5 w-5" />
                    Google로 로그인
                  </button>
                  <button
                    type="button"
                    onClick={() => signInWithProvider("kakao")}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-[#191600] shadow-[var(--shadow-soft)] transition-all hover:brightness-95 active:scale-[0.99] disabled:opacity-60"
                    style={{ backgroundColor: "#FEE500" }}
                  >
                    <KakaoIcon className="h-5 w-5" />
                    카카오로 로그인
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">또는 이메일</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <form onSubmit={sendMagicLink} className="space-y-2">
                    <Label htmlFor="email" className="sr-only">
                      이메일
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "전송 중…" : "매직 링크 받기"}
                    </Button>
                  </form>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-xs text-accent-foreground">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  데모 모드 — 프로필을 선택해 바로 시작하세요. Supabase 연결 시 이메일
                  로그인으로 전환됩니다.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {adults.map((p) => {
                    const family = seedData.families.find((f) => f.id === p.familyId);
                    return (
                      <button
                        key={p.id}
                        onClick={() => enterAsDemo(p.id)}
                        className="group flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)] active:scale-[0.98]"
                      >
                        <Avatar>
                          <AvatarFallback hue={family?.hue}>{initialsOf(p.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {family?.name} · {p.role}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Snowflake className="h-3 w-3" />
          2026년 12월 18일 – 12월 27일 · 프랑크푸르트에서 뮌헨까지
        </p>
      </motion.div>
    </main>
  );
}
