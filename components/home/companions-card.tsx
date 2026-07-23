"use client";

import Link from "next/link";
import { Crown, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser, useProfiles } from "@/hooks/use-app-data";
import { initialsOf } from "@/lib/utils";

/** 동행인 카드 — 여행에 참여 중인 멤버 목록 (없어도 OK) */
export function CompanionsCard() {
  const profiles = useProfiles();
  const me = useCurrentUser();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-primary" />
          동행인
        </CardTitle>
        <span className="text-xs font-medium text-muted-foreground">
          {profiles.length}명
        </span>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {profiles.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback hue={member.hue}>{initialsOf(member.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.name}</p>
              {member.email && (
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              )}
            </div>
            <span className="flex items-center gap-1.5">
              {member.isOwner && (
                <Badge variant="warning">
                  <Crown className="h-3 w-3" />
                </Badge>
              )}
              {member.id === me.id && <Badge variant="accent">나</Badge>}
            </span>
          </div>
        ))}
        <p className="pt-1 text-xs text-muted-foreground">
          <Link href="/settings" className="text-primary hover:underline">
            설정
          </Link>
          에서 동행인을 추가·관리할 수 있어요
        </p>
      </CardContent>
    </Card>
  );
}
