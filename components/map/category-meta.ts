import type { LucideIcon } from "lucide-react";
import {
  Car,
  Castle,
  Hotel,
  MapPin,
  Plane,
  SquareParking,
  TreePine,
  UtensilsCrossed,
} from "lucide-react";
import type { PlaceCategory } from "@/lib/types";
import { PLACE_CATEGORY_LABEL } from "@/lib/types";

/** 카테고리별 아이콘 · 마커/칩 색상 메타 */
export interface CategoryMeta {
  icon: LucideIcon;
  label: string;
  /** 진한 포인트 색 (마커 핀, 칩 활성 배경) */
  color: string;
  /** 어두운 배경 위에서도 읽히는 텍스트용 색 */
  fg: string;
}

export const CATEGORY_META: Record<PlaceCategory, CategoryMeta> = {
  hotel: { icon: Hotel, label: PLACE_CATEGORY_LABEL.hotel, color: "#6366f1", fg: "#eef2ff" },
  restaurant: { icon: UtensilsCrossed, label: PLACE_CATEGORY_LABEL.restaurant, color: "#f97316", fg: "#fff7ed" },
  christmas_market: { icon: TreePine, label: PLACE_CATEGORY_LABEL.christmas_market, color: "#dc2626", fg: "#fef2f2" },
  parking: { icon: SquareParking, label: PLACE_CATEGORY_LABEL.parking, color: "#2563eb", fg: "#eff6ff" },
  rental_car: { icon: Car, label: PLACE_CATEGORY_LABEL.rental_car, color: "#0d9488", fg: "#f0fdfa" },
  airport: { icon: Plane, label: PLACE_CATEGORY_LABEL.airport, color: "#0ea5e9", fg: "#f0f9ff" },
  attraction: { icon: Castle, label: PLACE_CATEGORY_LABEL.attraction, color: "#9333ea", fg: "#faf5ff" },
  custom: { icon: MapPin, label: PLACE_CATEGORY_LABEL.custom, color: "#64748b", fg: "#f8fafc" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_META) as PlaceCategory[];

/** hex + 알파(0~1) → rgba 스타일 문자열 */
export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
