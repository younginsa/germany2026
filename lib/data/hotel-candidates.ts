/**
 * 지도 › 🏨 호텔 비교 — 12/23·12/28 앞뒤 1박 후보 호텔 (어른 2 + 아이 2, 만 6·2세).
 * 저장된 장소(localStorage)와 분리된 고정 데이터라 모든 기기에서 똑같이 보여요.
 * 평점은 트립어드바이저(2026-10 조회). 가격은 날짜 지정 실견적이 아니라
 * 최근 요금 + 연말 할증(20~40%)을 더한 4인 한 방 기준 추정치(세금·봉사료 포함)예요.
 */

export interface HotelCandidate {
  id: string;
  name: string;
  /** 영문 이름 — 구글 호텔 검색용 */
  nameEn: string;
  lat: number;
  lng: number;
  area: string;
  /** 트립어드바이저 평점 (5점 만점) */
  rating: number;
  reviews: number;
  /** 목록 카드 한 줄 요약 */
  summary: string;
  badge?: string;
  /** 4인 1박 (세금 포함 추정) */
  price: string;
  /** 4인 객실 구성 */
  room: string;
  /** true면 4인 한 방 투숙을 호텔에 확인해야 해요 (예약 사이트·공식 표기가 엇갈림) */
  confirmOccupancy?: boolean;
  /** 대안 구성·가격 (선택) */
  priceAlt?: string;
  /** 택시 추정 시간 */
  taxi: { cruise: string; airport: string };
  kids: string;
  caution: string;
  membership: string;
  links: {
    official: string;
    agoda?: string;
    hotels?: string;
    booking?: string;
    trip?: string;
  };
}

export interface MapAnchor {
  id: "cruise" | "airport" | "city";
  name: string;
  /** 핀 아래 짧은 라벨 */
  short: string;
  emoji: string;
  lat: number;
  lng: number;
  memo: string;
}

/** 거리 비교 기준점 — 크루즈 터미널 · 공항 · 시내 */
export const MAP_ANCHORS: MapAnchor[] = [
  {
    id: "cruise",
    name: "마리나베이 크루즈 센터",
    short: "크루즈",
    emoji: "🚢",
    lat: 1.2647,
    lng: 103.863,
    memo: "12/24 승선 · 12/28 하선",
  },
  {
    id: "airport",
    name: "창이공항 (SIN)",
    short: "공항",
    emoji: "✈️",
    lat: 1.3644,
    lng: 103.9915,
    memo: "12/23 20:25 도착 · 12/29 22:30 출발",
  },
  {
    id: "city",
    name: "가든스 바이 더 베이 (원더랜드)",
    short: "시내",
    emoji: "🎄",
    lat: 1.2816,
    lng: 103.8636,
    memo: "12/28 저녁 원더랜드 · 스펙트라 분수쇼",
  },
];

/** 후보 호텔 — 평점 높은 순 (같은 점수면 리뷰 많은 순) */
export const HOTEL_CANDIDATES: HotelCandidate[] = [
  {
    id: "fullerton-bay",
    name: "풀러튼 베이 호텔",
    nameEn: "The Fullerton Bay Hotel Singapore",
    lat: 1.2834,
    lng: 103.8533,
    area: "마리나베이 워터프런트",
    rating: 4.8,
    reviews: 6655,
    summary: "싱가포르 1위 · 조용한 소규모 럭셔리 — 아이 시설 정보는 적어요",
    price: "95~137만원",
    room: "디럭스·프리미어(45~50㎡, 킹) + 엑스트라베드(6세) + 아기침대(2세)",
    confirmOccupancy: true,
    priceAlt: "테마 스위트(78㎡, 4인) 189~273만원",
    taxi: { cruise: "~10분", airport: "~25분" },
    kids: "아기침대 무료 · 커넥팅룸 있음 · 공식 'Family Funtastic' 패키지(어른 2 + 아이 1 조식 · 엑스트라베드 1개) · 아이에게 친절하다는 후기",
    caution: "공식 최대 인원 표기가 없어 4인 가능 여부를 호텔에 확인 · Family Funtastic은 환불 불가에 블랙아웃 날짜 있음",
    membership: "I Prefer 무료 가입 — 첫 예약 10% 할인 · 공식 예약 시 S$60 다이닝 크레딧",
    links: {
      official: "https://www.fullertonhotels.com/fullerton-bay-hotel-singapore/rooms-and-suites",
      agoda: "https://www.agoda.com/ko-kr/the-fullerton-bay-hotel/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho355654/",
      booking: "https://www.booking.com/hotel/sg/the-fullerton-bay-singapore.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-996309/the-fullerton-bay-hotel-singapore/",
    },
  },
  {
    id: "marina-bay-sands",
    name: "마리나베이 샌즈",
    nameEn: "Marina Bay Sands Singapore",
    lat: 1.2834,
    lng: 103.8607,
    area: "마리나베이 · 가든스 도보",
    rating: 4.8,
    reviews: 2725,
    summary: "상징성 끝판왕 · 인피니티풀 — 4인은 패밀리 스위트만 가능해요",
    price: "214~327만원",
    room: "샌즈 패밀리 스위트 (85㎡, 킹 + 아이 2층 침대, 최대 4인) — 조식·아트사이언스 뮤지엄 포함",
    priceAlt: "일반 객실 2개 — 비슷한 가격대",
    taxi: { cruise: "~5분 (최근접)", airport: "~20분" },
    kids: "인피니티풀(투숙객 전용, 아이 동반 가능) · 가든스·원더랜드·스펙트라 도보 · 패밀리 스위트는 아이 전용 2층 침대",
    caution: "디럭스·프리미어는 아이 포함 최대 3명 — 4인이면 스위트나 2실 · 'Family Explorers' 패키지는 2박 이상이라 해당 없음",
    membership: "Sands LifeStyle 무료 — 기본 등급은 객실 할인 없이 리조트 달러 적립만",
    links: {
      official: "https://www.marinabaysands.com/hotel/rooms-suites/sands-family-suite.html",
      agoda: "https://www.agoda.com/ko-kr/marina-bay-sands/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho339486/",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-687592/marina-bay-sands-singapore/",
    },
  },
  {
    id: "mandarin-oriental",
    name: "만다린 오리엔탈",
    nameEn: "Mandarin Oriental Singapore",
    lat: 1.2903,
    lng: 103.8578,
    area: "마리나베이 · 마리나 스퀘어",
    rating: 4.8,
    reviews: 1049,
    summary: "아이 둘이면 최고 — 미끄럼틀 달린 2층 침대 패밀리 테마 스위트",
    price: "164~252만원",
    room: "패밀리 테마 스위트 (82㎡, 테마 2층 침대, 최대 4인)",
    priceAlt: "디럭스(33㎡) + 아기침대 68~100만원 — 호텔이 허용할 때",
    taxi: { cruise: "~10분", airport: "~20분" },
    kids: "유아풀·키즈 프로그램 · 12세 미만 embu 뷔페 무료 · 아기침대 무료(0~2세) · 2026년 리노베이션 후 가족 후기 호평",
    caution: "라운지는 어린아이 입장 불가 · 리뷰 수가 적은 편(1,049) · 스위트 요금이 비공개라 추정 신뢰도 낮음",
    membership: "Fans of M.O. 무료 — 공식 플렉시블 요금 예약 시 조식·레이트 체크아웃 등 혜택 2개 선택",
    links: {
      official: "https://www.mandarinoriental.com/en/singapore/marina-bay/stay/family-theme-suite",
      agoda: "https://www.agoda.com/ko-kr/mandarin-oriental-singapore/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho213384/",
      booking: "https://www.booking.com/hotel/sg/hotel-mandarin-oriental.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-1308129/mandarin-oriental-singapore/",
    },
  },
  {
    id: "dusit-thani-laguna",
    name: "두짓타니 라구나",
    nameEn: "Dusit Thani Laguna Singapore",
    lat: 1.323975,
    lng: 103.963321,
    area: "창이공항 옆 · 탐피네스 골프 리조트",
    rating: 4.7,
    reviews: 1379,
    summary: "4인 패키지 · 가성비 최고 — 대신 시내에서 멀어요 (12/23 도착일용)",
    price: "48~69만원",
    room: "'Stay & Family Fun' 패키지 — 디럭스 라구나(36㎡) + 엑스트라베드, 어른 2 + 아이 2 전용",
    taxi: { cruise: "~25~30분", airport: "~10~15분" },
    kids: "수영장 3개(유아풀 포함) · 패키지에 아이 조식·키즈 무료 식사 · 주얼 창이·샌즈 엑스포 셔틀 · 11세 이하 기존 침대 무료",
    caution: "시내 관광엔 멀어요(MRT 타나메라역 약 2km) · 수영장 08~20시라 밤 도착일엔 못 써요 · 커넥팅룸 수량 적음",
    membership: "Dusit Gold 무료 — 객실 15% 추가 할인 + 공식 예약 1박 S$15 크레딧",
    links: {
      official: "https://www.dusit.com/dusitthani-laguna-singapore/specialoffers/stay-family-fun/",
      agoda: "https://www.agoda.com/ko-kr/dusit-thani-laguna-singapore/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho1368157088/",
      booking: "https://www.booking.com/hotel/sg/dusit-thani-laguna-singapore.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-56369386/dusit-thani-laguna-singapore/",
    },
  },
  {
    id: "pan-pacific",
    name: "팬퍼시픽",
    nameEn: "Pan Pacific Singapore",
    lat: 1.2914,
    lng: 103.8586,
    area: "마리나베이 · 마리나 스퀘어",
    rating: 4.6,
    reviews: 17062,
    summary: "리뷰 최다 · 키즈클럽과 얕은 풀 — 4인은 커넥팅이나 스위트",
    price: "126~189만원",
    room: "디럭스 투베드룸(커넥팅 2실, 76㎡) 또는 어반 정글 스위트(79㎡, 아이 2층 침대 방 · 클럽 라운지)",
    priceAlt: "디럭스(38㎡) + 아기침대 63~94만원 — 호텔이 허용할 때",
    taxi: { cruise: "~10분", airport: "~20분" },
    kids: "키즈클럽 볼풀·소프트 플레이 · 넓고 얕은 수영장 · 마리나 스퀘어 몰 연결",
    caution: "디럭스 공식 정원은 어른 2 + 아이 1 — 아기침대 추가 가능 여부 호텔 확인",
    membership: "GHA DISCOVERY 무료 — 회원가 10%+ 할인, 4~7% 적립",
    links: {
      official: "https://www.panpacific.com/en/hotels-and-resorts/pp-marina/rooms.html",
      agoda: "https://www.agoda.com/ko-kr/pan-pacific-singapore/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho126334/",
      booking: "https://www.booking.com/hotel/sg/panpacificsingapore.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-932167/pan-pacific-singapore/",
    },
  },
  {
    id: "ritz-carlton-millenia",
    name: "리츠칼튼 밀레니아",
    nameEn: "The Ritz-Carlton Millenia Singapore",
    lat: 1.2911,
    lng: 103.8602,
    area: "마리나베이 · 밀레니아 워크",
    rating: 4.6,
    reviews: 7103,
    summary: "넓은 객실(51㎡) · 가족 후기 좋아요 — 디럭스에 4인 가능",
    price: "79~105만원",
    room: "디럭스 (51㎡, 킹 또는 트윈) — 어른 2 + 12세 미만 아이 2",
    confirmOccupancy: true,
    taxi: { cruise: "~10분", airport: "~20분" },
    kids: "2026년 7월 가족 후기 '가족과 묵기 완벽한 호텔' · 아이 인형 선물 후기 · 마리나베이 쪽 방은 레이저쇼 뷰",
    caution: "예약 사이트는 '최대 3인' 표기 — 호텔에 4인 확인 · 엑스트라베드 요금 규정이 출처마다 달라요",
    membership: "메리어트 본보이 미참여 호텔 — 포인트·등급 혜택 없음 (메리어트닷컴 예약은 가능)",
    links: {
      official: "https://www.ritzcarlton.com/en/hotels/sinrz-the-ritz-carlton-millenia-singapore/rooms/",
      agoda: "https://www.agoda.com/ko-kr/the-ritz-carlton-millenia-singapore/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho121538/",
      booking: "https://www.booking.com/hotel/sg/the-ritz-carlton-millenia-singapore.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-962739/the-ritz-carlton-millenia-singapore/",
    },
  },
  {
    id: "fairmont",
    name: "페어몬트",
    nameEn: "Fairmont Singapore",
    lat: 1.2942,
    lng: 103.8535,
    area: "시티홀 · 래플스 시티 직결",
    rating: 4.5,
    reviews: 10646,
    summary: "4인 가성비 2위 — 더블 2개 객실, 스위소텔과 몰·풀 공유",
    price: "47~74만원",
    room: "페어몬트 룸 더블 2개 (45㎡, 발코니, 최대 4인)",
    taxi: { cruise: "~10분", airport: "~25분" },
    kids: "12세 이하 부모와 같은 방 무료 · 아기침대 무료 · 6세 미만 조식 무료",
    caution: "'페어몬트 골드 더블 2개'는 최대 3인이라 일반 룸으로 · 간이침대를 보장받으려면 S$120++",
    membership: "아코르 ALL 회원가 (스위소텔과 같은 프로그램)",
    links: {
      official: "https://www.fairmont.com/en/hotels/singapore/fairmont-singapore/rooms/d2c.room.html",
      agoda: "https://www.agoda.com/ko-kr/fairmont-singapore/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho105367/",
      booking: "https://www.booking.com/hotel/sg/fairmont-singapore.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-998431/fairmont-singapore/",
    },
  },
  {
    id: "conrad-marina-bay",
    name: "콘래드 마리나베이",
    nameEn: "Conrad Singapore Marina Bay",
    lat: 1.2935,
    lng: 103.8589,
    area: "마리나베이 · 선텍시티 몰 연결",
    rating: 4.5,
    reviews: 6368,
    summary: "킹 패밀리룸 · 체크인 때 아이 선물 — 선텍 몰 연결",
    price: "68~95만원",
    room: "킹 패밀리룸 (40㎡, 슈퍼킹 + 간이침대, 어른 2 + 12세 미만 아이 2)",
    confirmOccupancy: true,
    priceAlt: "디럭스 + 아기침대 47~68만원 — 호텔이 허용할 때",
    taxi: { cruise: "~10분", airport: "~20분" },
    kids: "체크인 때 아이들에게 테디베어·러버덕 · 6세 이하 조식 무료(힐튼 기준) · 패밀리 커넥팅룸·투베드 스위트도 있어요",
    caution: "힐튼 공식 페이지엔 패밀리룸 '최대 3인' 표기 — 4인 확인 필요 · 방음이 아쉽다는 후기",
    membership: "힐튼 아너스 회원가",
    links: {
      official: "https://www.hilton.com/en/hotels/sincici-conrad-singapore-marina-bay/rooms/",
      agoda: "https://www.agoda.com/ko-kr/conrad-centennial-singapore/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho136496/",
      booking: "https://www.booking.com/hotel/sg/conrad-singapore-marina-bay.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-965250/conrad-singapore-marina-bay/",
    },
  },
  {
    id: "parkroyal-collection",
    name: "파크로얄 컬렉션 마리나베이",
    nameEn: "PARKROYAL COLLECTION Marina Bay Singapore",
    lat: 1.2916,
    lng: 103.8573,
    area: "마리나베이 · 마리나 스퀘어",
    rating: 4.4,
    reviews: 12081,
    summary: "가족룸·키즈 놀이방 — 방 2개 연결이라 넉넉해요",
    price: "95~126만원",
    room: "패밀리룸 (킹룸 + 트윈룸 커넥팅, 63~66㎡, 욕실 2개) — 노움 테마형은 2층 침대·4인 조식 포함",
    priceAlt: "어반 디럭스 + 아기침대 43~50만원~ — 호텔이 허용할 때 (공식 정원 어른 2 + 아이 1)",
    taxi: { cruise: "~10분", airport: "~20분" },
    kids: "키즈 놀이방(미끄럼틀·볼풀·트램펄린) · 유아풀 · 패밀리 패키지 텐트·장난감",
    caution: "호텔 안 노래방·클럽 소음이 새벽까지 들렸다는 후기 · 샤워부스가 좁아요",
    membership: "팬퍼시픽 DISCOVERY 회원가 15% 할인 (S$960 → S$816)",
    links: {
      official: "https://www.panpacific.com/en/hotels-and-resorts/pr-collection-marina-bay/rooms/family-room.html",
      agoda: "https://www.agoda.com/ko-kr/marina-mandarin-singapore-hotel/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho144875/",
      booking: "https://www.booking.com/hotel/sg/marinamandarin.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-995082/parkroyal-collection-marina-bay-singapore/",
    },
  },
  {
    id: "swissotel-stamford",
    name: "스위소텔 더 스탬포드",
    nameEn: "Swissotel The Stamford",
    lat: 1.2931,
    lng: 103.8535,
    area: "시티홀 · 래플스 시티 직결",
    rating: 4.3,
    reviews: 12887,
    badge: "현재 1순위",
    summary: "4인 가성비 1위 · 시티홀 MRT·몰 직결 — 시설은 오래된 편",
    price: "42~63만원",
    room: "프리미어 더블 2개 (40㎡, 발코니, 최대 4인) — 아코르·호텔 공식으로 예약",
    taxi: { cruise: "~10분", airport: "~25분" },
    kids: "젖병소독기·아기욕조·침대가드·아기침대 대여 · 12세 이하 기존 침대 무료 · 5세 이하 조식 무료 · 발코니에서 디즈니 어드벤처가 보인다는 후기",
    caution: "시설 노후·조식 평범 후기 · 아고다는 '아이 무료 아님' 표기 — 아코르·공식 예약 권장",
    membership: "아코르 ALL 회원가 (페어몬트와 같은 프로그램)",
    links: {
      official: "https://all.accor.com/hotel/A5D3/index.en.shtml",
      agoda: "https://www.agoda.com/ko-kr/swissotel-the-stamford-hotel/hotel/singapore-sg.html",
      hotels: "https://kr.hotels.com/ho105303/",
      booking: "https://www.booking.com/hotel/sg/swissotelsingapore.ko.html",
      trip: "https://kr.trip.com/hotels/singapore-hotel-detail-998612/swissotel-the-stamford/",
    },
  },
];

/** 예약 사이트가 아닌 공통 채널 — 목록 하단 */
export const HOTEL_EXTRA_CHANNELS: { label: string; url: string }[] = [
  { label: "마이리얼트립 — 부킹닷컴 경유 최대 8% 캐시백", url: "https://www.myrealtrip.com/themes/251/offers" },
  { label: "익스피디아 코리아 — 비자카드 8% 할인", url: "https://www.expedia.co.kr/lp/b/visakr" },
  { label: "NOL 인터파크 투어 — 해외 숙소", url: "https://nol.interpark.com/tour" },
  { label: "카약 — 날짜별 가격 추이", url: "https://www.kayak.sg" },
  { label: "구글 호텔 — 전체 가격 비교", url: "https://www.google.com/travel/hotels" },
];

export const STAY_DATES = [
  { checkIn: "2026-12-23", checkOut: "2026-12-24", label: "12/23 도착" },
  { checkIn: "2026-12-28", checkOut: "2026-12-29", label: "12/28 하선" },
] as const;

function withParams(base: string, params: [string, string][]): string {
  const url = new URL(base);
  for (const [k, v] of params) url.searchParams.append(k, v);
  return url.toString();
}

/** 날짜·인원(어른 2 + 아이 6·2세)을 채운 예약 링크 */
export function hotelBookingLinks(
  hotel: HotelCandidate,
  checkIn: string,
  checkOut: string
): { label: string; url: string }[] {
  const { links } = hotel;
  const out: { label: string; url: string }[] = [{ label: "공식", url: links.official }];
  if (links.agoda)
    out.push({
      label: "아고다",
      url: withParams(links.agoda, [
        ["checkIn", checkIn],
        ["los", "1"],
        ["rooms", "1"],
        ["adults", "2"],
        ["children", "2"],
        ["childAges", "6,2"],
      ]),
    });
  if (links.hotels)
    out.push({
      label: "호텔스닷컴",
      url: withParams(links.hotels, [
        ["chkin", checkIn],
        ["chkout", checkOut],
        ["rm1", "a2:c6:c2"],
      ]),
    });
  out.push({
    label: "부킹닷컴",
    url: withParams(
      links.booking ?? "https://www.booking.com/searchresults.ko.html",
      [
        ...(links.booking ? [] : ([["ss", hotel.nameEn]] as [string, string][])),
        ["checkin", checkIn],
        ["checkout", checkOut],
        ["group_adults", "2"],
        ["group_children", "2"],
        ["age", "6"],
        ["age", "2"],
        ["no_rooms", "1"],
      ]
    ),
  });
  if (links.trip)
    out.push({
      label: "트립닷컴",
      url: withParams(links.trip, [
        ["checkIn", checkIn],
        ["checkOut", checkOut],
        ["adult", "2"],
        ["children", "2"],
        ["ages", "6,2"],
      ]),
    });
  out.push({
    label: "구글 호텔",
    url: withParams("https://www.google.com/travel/search", [["q", hotel.nameEn]]),
  });
  return out;
}

/** 두 지점 직선거리 (km) */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
