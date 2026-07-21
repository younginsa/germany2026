"use client";

/**
 * ProfileLinkDialog — 로그인 직후, 이 계정이 여행의 어떤 멤버인지
 * 한 번만 선택합니다. 기존 프로필을 선택하거나 Google 이름으로
 * 새 프로필을 만들 수 있으며, 선택은 서버(trip_members)에 저장되어
 * 모든 기기에서 유지됩니다.
 */

import { useEffect, useState } from "react";
import { UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  newId,
  tripStore,
  useAuthProfileState,
  useFamilies,
  useProfiles,
} from "@/hooks/use-app-data";
import { initialsOf } from "@/lib/utils";
import type { Profile } from "@/lib/types";

const ROLES = ["아빠", "엄마", "아이"] as const;

export function ProfileLinkDialog() {
  const { needsProfileLink, suggestedName, email } = useAuthProfileState();
  const profiles = useProfiles();
  const families = useFamilies();

  const [name, setName] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("아빠");

  // 다이얼로그가 열릴 때 Google 이름으로 초기화
  useEffect(() => {
    if (needsProfileLink) {
      setName(suggestedName);
      setFamilyId(families[0]?.id ?? "");
    }
  }, [needsProfileLink, suggestedName, families]);

  function claim(profile: Profile) {
    // 이메일을 프로필에 기록해 두면 나중에 알아보기 쉽습니다
    if (email && profile.email !== email) {
      tripStore.upsertRow("profiles", { ...profile, email });
    }
    tripStore.linkProfile(profile.id);
  }

  function createNew() {
    const trimmed = name.trim();
    if (!trimmed || !familyId) return;
    const profile: Profile = {
      id: newId("p"),
      familyId,
      name: trimmed,
      role,
      email: email || undefined,
    };
    tripStore.upsertRow("profiles", profile);
    tripStore.linkProfile(profile.id);
  }

  return (
    <Dialog open={needsProfileLink}>
      <DialogContent className="max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle>누구세요?</DialogTitle>
          <DialogDescription>
            이 계정{email ? ` (${email})` : ""}을 여행 멤버와 연결합니다. 한 번만 선택하면
            모든 기기에서 유지됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {profiles.map((p) => {
            const family = families.find((f) => f.id === p.familyId);
            return (
              <button
                key={p.id}
                onClick={() => claim(p)}
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

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">또는 새 프로필</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="new-profile-name">이름</Label>
            <Input
              id="new-profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>가족</Label>
              <Select value={familyId} onValueChange={setFamilyId}>
                <SelectTrigger>
                  <SelectValue placeholder="가족 선택" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>역할</Label>
              <Select value={role} onValueChange={(v) => setRole(v as (typeof ROLES)[number])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={createNew} disabled={!name.trim() || !familyId}>
            <UserRoundPlus className="h-4 w-4" />
            {name.trim() ? `${name.trim()}(으)로 참여` : "새 프로필로 참여"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
