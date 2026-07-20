"use client";

import { useRouter } from "next/navigation";
import { LogOut, UserRound, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCurrentUser,
  useProfiles,
  useFamilyById,
  useIsDemo,
  tripStore,
} from "@/hooks/use-app-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { initialsOf } from "@/lib/utils";

export function UserMenu() {
  const router = useRouter();
  const me = useCurrentUser();
  const profiles = useProfiles();
  const familyById = useFamilyById();
  const isDemo = useIsDemo();
  const myFamily = familyById(me.familyId);

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
            <AvatarFallback hue={myFamily?.hue}>{initialsOf(me.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm">{me.name}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {myFamily?.name} · {me.role}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        {isDemo && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
              <Users className="h-3 w-3" />
              사용자 전환 (데모)
            </DropdownMenuLabel>
            {profiles
              .filter((p) => p.role !== "아이" && p.id !== me.id)
              .map((p) => {
                const fam = familyById(p.familyId);
                return (
                  <DropdownMenuItem key={p.id} onClick={() => tripStore.setCurrentUser(p.id)}>
                    <Avatar className="h-5 w-5">
                      <AvatarFallback hue={fam?.hue} className="text-[9px]">
                        {initialsOf(p.name)}
                      </AvatarFallback>
                    </Avatar>
                    {p.name}
                    <span className="ml-auto text-xs text-muted-foreground">{fam?.name}</span>
                  </DropdownMenuItem>
                );
              })}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
