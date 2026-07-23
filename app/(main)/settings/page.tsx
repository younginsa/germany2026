"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Database,
  Download,
  Globe,
  Map as MapIcon,
  Palette,
  RotateCcw,
  Upload,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useAppData,
  newId,
  useCurrentUser,
  useProfiles,
  useTrip,
  tripStore,
} from "@/hooks/use-app-data";
import { MEMBER_HUE_PALETTE as HUE_PALETTE } from "@/components/checklist/checklist-utils";
import { isGoogleMapsConfigured, isSupabaseConfigured } from "@/lib/supabase/config";
import { initialsOf } from "@/lib/utils";
import type { AppData } from "@/lib/types";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const trip = useTrip();
  const profiles = useProfiles();
  const me = useCurrentUser();
  const data = useAppData();

  const [companionName, setCompanionName] = useState("");
  const [companionEmail, setCompanionEmail] = useState("");
  const [title, setTitle] = useState(trip.title);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [description, setDescription] = useState(trip.description);
  const [resetOpen, setResetOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  function saveTrip() {
    tripStore.setTrip({
      ...trip,
      title: title.trim() || trip.title,
      destination: destination.trim(),
      startDate,
      endDate,
      description,
    });
    toast.success("여행 정보가 저장되었습니다");
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `germany2026-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("데이터를 내보냈습니다");
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData;
        if (!parsed.trip || !Array.isArray(parsed.itineraryDays)) {
          throw new Error("invalid");
        }
        tripStore.importAll(parsed);
        toast.success("데이터를 가져왔습니다");
      } catch {
        toast.error("올바르지 않은 백업 파일입니다");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function resetData() {
    tripStore.resetToSeed();
    setResetOpen(false);
    toast.success("데모 데이터로 초기화되었습니다");
  }

  function addCompanion(e: React.FormEvent) {
    e.preventDefault();
    const name = companionName.trim();
    if (!name) return;
    const usedHues = new Set(profiles.map((p) => p.hue));
    const hue = HUE_PALETTE.find((h) => !usedHues.has(h)) ?? HUE_PALETTE[profiles.length % HUE_PALETTE.length];
    tripStore.upsertRow("profiles", {
      id: newId("p"),
      name,
      email: companionEmail.trim() || undefined,
      hue,
    });
    setCompanionName("");
    setCompanionEmail("");
    toast.success(`${name}님을 동행인에 추가했습니다`);
  }

  function removeCompanion(id: string) {
    tripStore.deleteRow("profiles", id);
    toast.success("동행인을 삭제했습니다");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          여행 정보와 워크스페이스 환경을 관리하세요
        </p>
      </motion.div>

      {/* 여행 설정 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              여행 정보
            </CardTitle>
            <CardDescription>대시보드와 일정에 표시되는 기본 정보입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trip-title">여행 이름</Label>
                <Input id="trip-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-dest">목적지</Label>
                <Input
                  id="trip-dest"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-start">출발일</Label>
                <Input
                  id="trip-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-end">귀국일</Label>
                <Input
                  id="trip-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-desc">소개</Label>
              <Textarea
                id="trip-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={saveTrip}>저장</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 동행인 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              동행인
            </CardTitle>
            <CardDescription>
              로그인한 사람은 자동으로 추가됩니다. 이메일을 함께 적어두면 그 사람이 나중에
              로그인할 때 같은 프로필로 연결됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {profiles.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback hue={p.hue}>{initialsOf(p.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{p.email ?? ""}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    {p.isOwner && (
                      <Badge variant="warning">
                        <Crown className="h-3 w-3" />
                        소유자
                      </Badge>
                    )}
                    {p.id === me.id && <Badge variant="accent">나</Badge>}
                    {p.id !== me.id && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${p.name} 삭제`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeCompanion(p.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </span>
                </li>
              ))}
              {profiles.length === 0 && (
                <li className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  아직 동행인이 없어요
                </li>
              )}
            </ul>
            <form onSubmit={addCompanion} className="flex flex-wrap gap-2">
              <Input
                value={companionName}
                onChange={(e) => setCompanionName(e.target.value)}
                placeholder="이름 (예: 지수)"
                className="w-40 flex-1"
              />
              <Input
                type="email"
                value={companionEmail}
                onChange={(e) => setCompanionEmail(e.target.value)}
                placeholder="이메일 (선택)"
                className="w-44 flex-1"
              />
              <Button type="submit" variant="outline" disabled={!companionName.trim()}>
                <UserRoundPlus className="h-4 w-4" />
                추가
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* 테마 & 언어 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              화면 설정
            </CardTitle>
            <CardDescription>언어를 설정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>언어</Label>
              <Select value="ko" disabled>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ko">한국어</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                추가 언어는 준비 중입니다
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 연결 상태 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              연결 상태
            </CardTitle>
            <CardDescription>
              환경변수를 설정하면 실시간 동기화와 지도가 활성화됩니다 (.env.example 참고)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Supabase</p>
                  <p className="text-xs text-muted-foreground">
                    인증 · 실시간 동기화 · 파일 저장소
                  </p>
                </div>
              </div>
              {isSupabaseConfigured ? (
                <Badge variant="success">연결됨</Badge>
              ) : (
                <Badge variant="secondary">데모 모드</Badge>
              )}
            </div>
            <div className="flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <MapIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Google Maps</p>
                  <p className="text-xs text-muted-foreground">지도 · 장소 검색</p>
                </div>
              </div>
              {isGoogleMapsConfigured ? (
                <Badge variant="success">연결됨</Badge>
              ) : (
                <Badge variant="secondary">미설정</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 데이터 관리 */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              데이터 관리
            </CardTitle>
            <CardDescription>여행 데이터를 백업하거나 복원합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4" />
                JSON 내보내기
              </Button>
              <Button variant="outline" onClick={() => importRef.current?.click()}>
                <Upload className="h-4 w-4" />
                JSON 가져오기
              </Button>
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={importData}
              />
              <Separator orientation="vertical" className="mx-1 hidden h-9 sm:block" />
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setResetOpen(true)}
              >
                <RotateCcw className="h-4 w-4" />
                데모 데이터로 초기화
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>데이터를 초기화할까요?</DialogTitle>
            <DialogDescription>
              모든 변경사항이 사라지고 처음의 데모 데이터로 되돌아갑니다. 이 작업은 되돌릴
              수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={resetData}>
              초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
