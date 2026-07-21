import type { LucideIcon } from "lucide-react";
import {
  Type,
  Image as ImageIcon,
  MapPin,
  Link2,
  BarChart3,
  ListChecks,
  MessageSquareQuote,
} from "lucide-react";
import type { PostType } from "@/lib/types";

/** 사용자가 직접 만들 수 있는 카드 타입 */
export const CREATABLE_TYPES = ["text", "image", "location", "link", "poll"] as const;
export type CreatableType = (typeof CREATABLE_TYPES)[number];

export const POST_TYPE_META: Record<PostType, { label: string; icon: LucideIcon }> = {
  text: { label: "텍스트", icon: Type },
  image: { label: "이미지", icon: ImageIcon },
  location: { label: "장소", icon: MapPin },
  link: { label: "링크", icon: Link2 },
  poll: { label: "투표", icon: BarChart3 },
  checklist_ref: { label: "체크리스트", icon: ListChecks },
  comment_ref: { label: "코멘트", icon: MessageSquareQuote },
};

/** URL에서 도메인만 추출 (실패 시 원본 반환) */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
