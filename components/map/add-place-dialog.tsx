"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import type { ItineraryDay, Place, PlaceCategory } from "@/lib/types";
import { PLACE_CATEGORY_LABEL } from "@/lib/types";
import { isGoogleMapsConfigured } from "@/lib/supabase/config";
import {
  newId,
  pushNotification,
  tripStore,
  useCurrentUser,
} from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_CATEGORIES, CATEGORY_META, withAlpha } from "./category-meta";

interface PrefillCoords {
  lat: number;
  lng: number;
}

interface AddPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 지도 클릭으로 열린 경우 좌표 프리필 */
  prefill: PrefillCoords | null;
  days: ItineraryDay[];
  /** 저장 후 새 장소 id 전달 (선택/이동용) */
  onSaved: (placeId: string) => void;
}

interface PickedPlace {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  googlePlaceId?: string;
}

/* ─── Google Places 검색 박스 (places 라이브러리 로드 실패 시 자동 숨김) ─── */

function PlacesSearchBox({ onPick }: { onPick: (p: PickedPlace) => void }) {
  const placesLib = useMapsLibrary("places");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const detailsRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!placesLib) return;
    try {
      autocompleteRef.current = new placesLib.AutocompleteService();
      detailsRef.current = new placesLib.PlacesService(document.createElement("div"));
      setReady(true);
    } catch {
      setFailed(true);
    }
  }, [placesLib]);

  // 디바운스 검색
  useEffect(() => {
    if (!ready || !autocompleteRef.current) return;
    const q = query.trim();
    if (q.length < 2) {
      setPredictions([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      autocompleteRef.current
        ?.getPlacePredictions({ input: q }, (results, status) => {
          setSearching(false);
          if ((status as string) === "OK" && results) setPredictions(results.slice(0, 5));
          else setPredictions([]);
        })
        ?.catch?.(() => {
          setSearching(false);
          setFailed(true);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, ready]);

  const pick = (prediction: google.maps.places.AutocompletePrediction) => {
    const svc = detailsRef.current;
    if (!svc) return;
    svc.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["name", "geometry", "formatted_address", "place_id"],
      },
      (detail, status) => {
        if ((status as string) !== "OK" || !detail?.geometry?.location) {
          toast.error("장소 정보를 불러오지 못했어요");
          return;
        }
        onPick({
          name: detail.name ?? prediction.structured_formatting.main_text,
          lat: detail.geometry.location.lat(),
          lng: detail.geometry.location.lng(),
          address: detail.formatted_address ?? undefined,
          googlePlaceId: detail.place_id ?? prediction.place_id,
        });
        setQuery("");
        setPredictions([]);
      }
    );
  };

  if (failed || !placesLib) return null;

  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <Label className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Search className="h-3.5 w-3.5" aria-hidden />
        Google 장소 검색
      </Label>
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="장소 이름으로 검색 (예: Marienplatz)"
          className="bg-card"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      {predictions.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-lg border bg-card shadow-sm">
          {predictions.map((p) => (
            <li key={p.place_id}>
              <button
                type="button"
                onClick={() => pick(p)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {p.structured_formatting.main_text}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {p.structured_formatting.secondary_text}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1.5 text-[11px] text-muted-foreground/70">
        검색 결과를 선택하면 이름·좌표·주소가 자동으로 입력됩니다
      </p>
    </div>
  );
}

/* ─── 새 장소 추가 다이얼로그 ─── */

export function AddPlaceDialog({ open, onOpenChange, prefill, days, onSaved }: AddPlaceDialogProps) {
  const me = useCurrentUser();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("attraction");
  const [latStr, setLatStr] = useState("");
  const [lngStr, setLngStr] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [dayIds, setDayIds] = useState<string[]>([]);
  const [googlePlaceId, setGooglePlaceId] = useState<string | undefined>(undefined);

  // 열릴 때마다 폼 리셋 (+ 지도 클릭 좌표 프리필)
  useEffect(() => {
    if (!open) return;
    setName("");
    setCategory("attraction");
    setLatStr(prefill ? String(prefill.lat) : "");
    setLngStr(prefill ? String(prefill.lng) : "");
    setAddress("");
    setMemo("");
    setDayIds([]);
    setGooglePlaceId(undefined);
  }, [open, prefill]);

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const coordsValid =
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const canSave = name.trim().length > 0 && coordsValid;

  const sortedDays = useMemo(() => [...days].sort((a, b) => a.dayNumber - b.dayNumber), [days]);

  const toggleDay = (id: string) => {
    setDayIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const applyPicked = (p: PickedPlace) => {
    setName(p.name);
    setLatStr(String(Number(p.lat.toFixed(6))));
    setLngStr(String(Number(p.lng.toFixed(6))));
    if (p.address) setAddress(p.address);
    setGooglePlaceId(p.googlePlaceId);
  };

  const handleSave = () => {
    if (!canSave || !me) return;
    const id = newId("pl");
    const place: Place = {
      id,
      tripId: tripStore.getSnapshot().trip.id,
      name: name.trim(),
      category,
      lat,
      lng,
      address: address.trim() || undefined,
      memo: memo.trim() || undefined,
      authorId: me.id,
      createdAt: new Date().toISOString(),
      googlePlaceId,
      dayIds,
    };
    tripStore.upsertRow("places", place);
    pushNotification({
      type: "place",
      actorId: me.id,
      message: `${me.name}님이 새 장소를 추가했습니다: ${place.name}`,
      href: `/map?place=${id}`,
    });
    toast.success("장소가 추가되었습니다", { description: place.name });
    onOpenChange(false);
    onSaved(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새 장소 추가</DialogTitle>
          <DialogDescription>
            여행 지도에 함께 볼 장소를 추가합니다. 일정 일차와 연결할 수도 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isGoogleMapsConfigured && <PlacesSearchBox onPick={applyPicked} />}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="place-name">장소 이름</Label>
            <Input
              id="place-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 마리엔 광장"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>카테고리</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as PlaceCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_META[cat].icon;
                  return (
                    <SelectItem key={cat} value={cat}>
                      <Icon
                        className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]"
                        style={{ color: CATEGORY_META[cat].color }}
                        aria-hidden
                      />
                      {PLACE_CATEGORY_LABEL[cat]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="place-lat">위도</Label>
              <Input
                id="place-lat"
                type="number"
                step="any"
                inputMode="decimal"
                value={latStr}
                onChange={(e) => setLatStr(e.target.value)}
                placeholder="49.2000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="place-lng">경도</Label>
              <Input
                id="place-lng"
                type="number"
                step="any"
                inputMode="decimal"
                value={lngStr}
                onChange={(e) => setLngStr(e.target.value)}
                placeholder="10.2000"
              />
            </div>
            <p className="col-span-2 -mt-1 text-[11px] text-muted-foreground/70">
              {isGoogleMapsConfigured
                ? "지도를 클릭하면 자동 입력됩니다"
                : "좌표를 직접 입력해주세요 (예: 48.1374, 11.5755)"}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="place-address">주소 (선택)</Label>
            <Input
              id="place-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: Marienplatz 1, München"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="place-memo">메모 (선택)</Label>
            <Textarea
              id="place-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예약 정보, 팁 등을 남겨보세요"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>연결할 일정 일차 (선택)</Label>
            <div className="flex flex-wrap gap-1.5">
              {sortedDays.map((d) => {
                const active = dayIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    aria-pressed={active}
                    title={`${d.dayNumber}일차 · ${d.city}`}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    D{d.dayNumber}
                    <span className="ml-1 font-normal opacity-70">{d.city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            <MapPin />
            장소 추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
