/** 도메인 타입 — Supabase 스키마(supabase/migrations)와 1:1 매핑됩니다. */

export type ID = string;

export interface Trip {
  id: ID;
  title: string;
  destination: string;
  startDate: string; // ISO date
  endDate: string;
  coverEmoji: string;
  description: string;
}

/** 여행 멤버(동행인) — 로그인 시 자동 생성되거나 설정에서 직접 추가 */
export interface Profile {
  id: ID;
  name: string;
  /** 관계 메모 (예: 친구, 배우자, 동생) — 선택 */
  role?: string;
  age?: number;
  email?: string;
  isOwner?: boolean;
  /** 아바타 색상 hue (0-360) */
  hue?: number;
}

export interface ScheduleItem {
  time: string; // "09:30"
  title: string;
  description?: string;
  placeId?: ID;
  /** 참여 멤버 (비어 있으면 전원 참여로 간주) */
  participantIds?: ID[];
}

export interface ItineraryDay {
  id: ID;
  tripId: ID;
  dayNumber: number;
  date: string; // ISO date
  city: string;
  cityEmoji: string;
  accommodation: string;
  transportation: string;
  schedule: ScheduleItem[];
  restaurants: string[];
  christmasMarket: string;
  parking: string;
  notes: string;
  rentalCarNotes: string;
  winterDrivingNotes: string;
}

/** 인라인 댓글 — 일정 텍스트의 특정 구간에 앵커됩니다. */
export interface CommentAnchor {
  targetType: "itinerary";
  targetId: ID; // itinerary day id
  fieldKey: string; // 예: "notes", "schedule.2", "restaurants.0"
  selectedText: string;
  startOffset: number;
  endOffset: number;
}

export interface CommentReply {
  id: ID;
  authorId: ID;
  body: string;
  createdAt: string;
  mentions: ID[];
}

export interface Comment {
  id: ID;
  tripId: ID;
  anchor: CommentAnchor;
  authorId: ID;
  body: string;
  createdAt: string;
  resolved: boolean;
  resolvedBy?: ID;
  mentions: ID[];
  replies: CommentReply[];
}

export type CheckState = "empty" | "checked" | "na";

export interface ChecklistItem {
  id: ID;
  groupId: ID;
  label: string;
  order: number;
  /** profileId(멤버) -> 상태 */
  checks: Record<ID, CheckState>;
}

export interface ChecklistGroup {
  id: ID;
  tripId: ID;
  title: string;
  order: number;
  /** 이 그룹에 참여하는 멤버(동행인) 컬럼 */
  memberIds: ID[];
}

export type PlaceCategory =
  | "hotel"
  | "restaurant"
  | "christmas_market"
  | "parking"
  | "rental_car"
  | "airport"
  | "attraction"
  | "custom";

export const PLACE_CATEGORY_LABEL: Record<PlaceCategory, string> = {
  hotel: "숙소",
  restaurant: "맛집",
  christmas_market: "크리스마스 마켓",
  parking: "주차장",
  rental_car: "렌터카",
  airport: "공항",
  attraction: "관광지",
  custom: "기타",
};

export interface Place {
  id: ID;
  tripId: ID;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  address?: string;
  memo?: string;
  authorId: ID;
  createdAt: string;
  googlePlaceId?: string;
  dayIds: ID[]; // 연결된 일정 일차
}

export type PostType = "text" | "image" | "location" | "link" | "poll" | "checklist_ref" | "comment_ref";

export interface PollOption {
  id: ID;
  label: string;
  voterIds: ID[];
}

export interface PostComment {
  id: ID;
  authorId: ID;
  body: string;
  createdAt: string;
}

export interface Post {
  id: ID;
  tripId: ID;
  type: PostType;
  title: string;
  body?: string;
  imageUrl?: string;
  linkUrl?: string;
  placeId?: ID;
  pollOptions?: PollOption[];
  refId?: ID; // checklist_ref / comment_ref 대상
  tags: string[];
  authorId: ID;
  createdAt: string;
  likedBy: ID[];
  comments: PostComment[];
}

export type DocumentCategory =
  | "flight"
  | "hotel"
  | "rental_car"
  | "insurance"
  | "passport"
  | "vaccination"
  | "etc";

export const DOCUMENT_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  flight: "항공권",
  hotel: "호텔 예약",
  rental_car: "렌터카 예약",
  insurance: "여행자 보험",
  passport: "여권",
  vaccination: "예방접종",
  etc: "기타",
};

export interface DocumentVersion {
  id: ID;
  fileName: string;
  fileSize: number;
  uploadedBy: ID;
  uploadedAt: string;
  url?: string; // Supabase Storage 경로 또는 데모 object URL
}

export interface TripDocument {
  id: ID;
  tripId: ID;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string; // MIME
  fileSize: number;
  uploadedBy: ID;
  uploadedAt: string;
  url?: string;
  versions: DocumentVersion[];
}

export type NotificationType =
  | "comment"
  | "checklist"
  | "document"
  | "place"
  | "mention"
  | "board";

export interface AppNotification {
  id: ID;
  tripId: ID;
  type: NotificationType;
  actorId: ID;
  message: string;
  href: string;
  createdAt: string;
  readBy: ID[];
}

export interface ActivityLog {
  id: ID;
  tripId: ID;
  actorId: ID;
  action: string;
  createdAt: string;
}

/** 데모 모드에서 localStorage에 저장되는 전체 앱 상태 */
export interface AppData {
  trip: Trip;
  profiles: Profile[];
  itineraryDays: ItineraryDay[];
  comments: Comment[];
  checklistGroups: ChecklistGroup[];
  checklistItems: ChecklistItem[];
  places: Place[];
  posts: Post[];
  documents: TripDocument[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
}

export type EntityKey = keyof Omit<AppData, "trip">;

export type EntityOf = {
  profiles: Profile;
  itineraryDays: ItineraryDay;
  comments: Comment;
  checklistGroups: ChecklistGroup;
  checklistItems: ChecklistItem;
  places: Place;
  posts: Post;
  documents: TripDocument;
  notifications: AppNotification;
  activityLogs: ActivityLog;
};
