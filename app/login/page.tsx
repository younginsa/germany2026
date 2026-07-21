"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
                <form onSubmit={sendMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "전송 중…" : "매직 링크로 로그인"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    비밀번호 없이 이메일 링크로 안전하게 로그인합니다.
                  </p>
                </form>
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
