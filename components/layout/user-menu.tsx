"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useIsDemo } from "@/hooks/use-app-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { initialsOf } from "@/lib/utils";

export function UserMenu() {
  const router = useRouter();
  const me = useCurrentUser();
  const isDemo = useIsDemo();

  // 데모 모드: 계정 개념이 없으므로 프로필 대신 설정 아이콘만 노출합니다
  if (isDemo) {
    return (
      <Link
        href="/settings"
        aria-label="설정"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Settings className="h-4 w-4" />
      </Link>
    );
  }

  async function logout() {
    const sb = getSupabaseBrowserClient();
    if (sb) await sb.auth.signOut();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="내 계정">
          <Avatar className="h-7 w-7">
            <AvatarFallback hue={me.hue}>{initialsOf(me.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm">{me.name}</p>
              {me.email && (
                <p className="text-xs font-normal text-muted-foreground">{me.email}</p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            설정
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
