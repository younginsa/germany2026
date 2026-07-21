import type { LucideIcon } from "lucide-react";
import { Car, Hotel, IdCard, Paperclip, Plane, ShieldCheck, Syringe } from "lucide-react";
import type { DocumentCategory } from "@/lib/types";

/** 문서 카테고리별 아이콘 */
export const CATEGORY_ICON: Record<DocumentCategory, LucideIcon> = {
  flight: Plane,
  hotel: Hotel,
  rental_car: Car,
  insurance: ShieldCheck,
  passport: IdCard,
  vaccination: Syringe,
  etc: Paperclip,
};
