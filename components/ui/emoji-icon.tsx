import type { LucideIcon } from "lucide-react";
import {
  Beer,
  CandyCane,
  Castle,
  Gift,
  Ham,
  Image as ImageIcon,
  MapPin,
  MountainSnow,
  Plane,
  PlaneTakeoff,
  TrainFront,
  TreePine,
} from "lucide-react";

/**
 * 저장 데이터(cityEmoji · coverEmoji)에 남아 있는 이모지 문자열을
 * lucide 아이콘으로 매핑합니다. 기존 localStorage/Supabase 데이터와의
 * 호환을 위해 데이터 모델은 그대로 두고 렌더링만 아이콘으로 바꿉니다.
 */
const EMOJI_ICONS: Record<string, LucideIcon> = {
  "✈️": Plane,
  "🛫": PlaneTakeoff,
  "🏰": Castle,
  "🎁": Gift,
  "🌭": Ham,
  "🚂": TrainFront,
  "🍺": Beer,
  "🎅": CandyCane,
  "🏔️": MountainSnow,
  "🖼️": ImageIcon,
  "🎄": TreePine,
};

export function emojiIcon(emoji: string): LucideIcon {
  return EMOJI_ICONS[emoji.trim()] ?? MapPin;
}

export function EmojiIcon({ emoji, className }: { emoji: string; className?: string }) {
  const Icon = emojiIcon(emoji);
  return <Icon className={className} aria-hidden />;
}
