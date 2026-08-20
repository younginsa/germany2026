/**
 * 여행비교 — 2026년 12월 겨울 여행 시나리오 데이터.
 * 두 가족 기준: 어른 4 + 아이 3명(3·5·7세).
 * 비용은 성수기(12월 중순~말) 추정치이며 "가족당 = 두 가족 합계 ÷ 2"입니다.
 */

export interface TripOptionLink {
  label: string;
  url: string;
}

export interface TripOption {
  id: string;
  title: string;
  emoji: string;
  badge: string;
  /** 한 줄 컨셉 */
  subtitle: string;
  image: string;
  imageAlt: string;
  period: string;
  costPerFamily: string;
  costGroup: string;
  costNote: string;
  flight: string;
  weather: string;
  /** 아이 친화도 1~5 (3·5·7세 기준) */
  kidScore: number;
  kidNote: string;
  highlights: string[];
  pros: string[];
  cons: string[];
  links: TripOptionLink[];
}

const naverBlogSearch = (query: string) =>
  `https://search.naver.com/search.naver?ssc=tab.blog.all&query=${encodeURIComponent(query)}`;

export const tripOptions: TripOption[] = [
  {
    id: "germany",
    title: "독일",
    emoji: "🎄",
    badge: "현재 계획",
    subtitle: "로맨틱 가도 렌터카 일주 + 크리스마스 마켓 본고장",
    image:
      "https://images.unsplash.com/photo-1544212415-85fec3f52087?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2VybWFuJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
    imageAlt: "독일 크리스마스 마켓의 불빛과 상점들",
    period: "12/18 – 12/27 · 9박 10일",
    costPerFamily: "약 1,000만원",
    costGroup: "두 가족 합계 약 2,000만원",
    costNote:
      "직항 왕복(성인 ~180만·소아 ~140만), 트리플룸 2개 × 9박, 9인승 렌터카, 식비·입장료 포함 추정",
    flight: "직항 13시간 30분 + 시차 8시간",
    weather: "-1~4°C · 눈/비, 16시면 해가 짐",
    kidScore: 3,
    kidNote:
      "마켓·성 구경은 평생 기억에 남을 경험. 다만 혹한과 800km+ 이동이 3세에게는 체력 부담",
    highlights: [
      "뢰머베르크·뉘른베르크 크리스마스 마켓",
      "노이슈반슈타인 성 (겨울 설경)",
      "로텐부르크 중세 마을",
    ],
    pros: [
      "크리스마스 시즌 감성의 정점 — 대체 불가",
      "일정·숙소 계획이 이미 완료된 상태",
      "7세에게는 특히 인상 깊은 문화 경험",
    ],
    cons: [
      "5개 옵션 중 비용 최고",
      "장거리 비행 + 시차 적응 (3세 리스크)",
      "추위·짧은 해 탓에 하루 활동 시간 제한",
    ],
    links: [
      {
        label: "12월 독일 여행일지 (Substack)",
        url: "https://williamjung0130.substack.com/p/128",
      },
      {
        label: "뉘른베르크 여행기 모음 (브런치)",
        url: "https://brunch.co.kr/keyword/%EB%89%98%EB%A5%B8%EB%B2%A0%EB%A5%B4%ED%81%AC",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("독일 크리스마스마켓 아이랑 가족여행"),
      },
    ],
  },
  {
    id: "disney-cruise",
    title: "싱가포르 + 디즈니 크루즈",
    emoji: "🚢",
    badge: "아이 만족 1위",
    subtitle: "디즈니 어드벤처 3박 크루즈 + 싱가포르 시티 3박",
    image:
      "https://images.unsplash.com/photo-1707342617132-582a6bda20ff?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlzbmV5JTIwY3J1aXNlJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "디즈니 크루즈 선박",
    period: "6박 7일 (예: 12/19 – 12/25)",
    costPerFamily: "약 850만원",
    costGroup: "두 가족 합계 약 1,700만원",
    costNote:
      "직항 왕복(인당 75~90만), 크루즈 오션뷰 2객실 × 3박(식사·공연 포함), 시내 호텔 3박 포함 추정",
    flight: "직항 6시간 30분 · 시차 1시간",
    weather: "27~31°C · 덥고 습함, 스콜성 소나기",
    kidScore: 5,
    kidNote:
      "3·5·7세 모두 연령별 키즈클럽 이용 가능 + 캐릭터 그리팅 — 이 연령대에 사실상 최적",
    highlights: [
      "디즈니·마블 쇼, 워터슬라이드, 캐릭터 그리팅",
      "가든스 바이 더 베이 · 마리나베이 야경",
      "싱가포르 동물원 / 유니버설 스튜디오 옵션",
    ],
    pros: [
      "크루즈는 올인클루시브 — 식사·공연·키즈클럽 포함",
      "짐 풀고 이동 없는 리조트식 여행 (아이 체력 부담 최소)",
      "부모도 쉬는 여행 — 키즈클럽 동안 자유시간",
    ],
    cons: [
      "12월 성수기 크루즈 요금 할증 — 조기 예약 필수",
      "배멀미 가능성 (잔잔한 항로이긴 함)",
      "싱가포르 시내 물가 높음",
    ],
    links: [
      {
        label: "디즈니 크루즈 가격 총정리 (KKday)",
        url: "https://www.kkday.com/ko/blog/35492/asia-singapore-disneycruise",
      },
      {
        label: "실탑승 후기 (마일모아)",
        url: "https://www.milemoa.com/bbs/board/12363099",
      },
      {
        label: "3박4일 상품 (마이리얼트립)",
        url: "https://experiences.myrealtrip.com/products/4254405",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("디즈니 어드벤처 크루즈 싱가포르 아이랑 후기"),
      },
    ],
  },
  {
    id: "hongkong",
    title: "홍콩",
    emoji: "🌃",
    badge: "시티+테마파크",
    subtitle: "디즈니랜드 + 크리스마스 일루미네이션 시티 트립",
    image:
      "https://images.unsplash.com/photo-1619930763537-1b6f30ebc2da?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9uZyUyMGtvbmclMjBkaXNuZXlsYW5kfGVufDB8fDB8fHww",
    imageAlt: "홍콩 디즈니랜드의 성",
    period: "4박 5일",
    costPerFamily: "약 450만원",
    costGroup: "두 가족 합계 약 900만원",
    costNote:
      "직항 왕복(인당 50~60만), 시내 패밀리룸 2룸 × 4박, 디즈니랜드 1일권 + 오션파크, 식비·교통 포함 추정 (12월 성수기 할증 반영)",
    flight: "직항 3시간 45분 · 시차 1시간",
    weather: "15~22°C · 연중 최고 시즌 — 맑고 건조",
    kidScore: 4,
    kidNote:
      "디즈니랜드는 영유아용 어트랙션이 많고 도시가 컴팩트 — 첫 해외 가족여행지로 자주 추천되는 곳",
    highlights: [
      "홍콩 디즈니랜드 (겨울왕국 구역 · 라이온킹 공연)",
      "오션파크 — 판다 · 아쿠아리움 · 케이블카",
      "피크트램 · 스타페리 + 시내 크리스마스 일루미네이션",
    ],
    pros: [
      "12월이 홍콩 날씨 1년 중 최고 — 맑고 건조",
      "도시 전체 크리스마스 장식 — 독일 감성 일부 대체",
      "비행 짧고 동선 컴팩트 — 유모차 이동 수월",
    ],
    cons: [
      "크리스마스는 디즈니 최성수기 — 호텔·티켓 할증 + 인파",
      "호텔 객실이 좁은 편 — 패밀리룸 확보가 관건",
      "물가 높음 (디즈니 내 생수 한 병 4천원)",
    ],
    links: [
      {
        label: "디즈니랜드 아이와 후기 (티스토리)",
        url: "https://on-ella.com/entry/%ED%99%8D%EC%BD%A9-%EB%94%94%EC%A6%88%EB%8B%88%EB%9E%9C%EB%93%9C-%EC%95%84%EC%9D%B4%EC%99%80-%ED%95%A8%EA%BB%98%ED%95%9C-%EC%97%AC%ED%96%89-%ED%9B%84%EA%B8%B0-feat-%EC%96%B4%ED%8A%B8%EB%9E%99%EC%85%98-%EB%B0%8F-%EA%B3%B5%EC%97%B0-%EC%B6%94%EC%B2%9C",
      },
      {
        label: "아기랑 홍콩 디즈니 가이드 (육아크루)",
        url: "https://www.yugacrew.com/crewletter/baby-overseas-hongkong",
      },
      {
        label: "디즈니랜드 꿀팁 총정리 (트립닷컴)",
        url: "https://kr.trip.com/blog/all-about-hongkong-disneyland-and-essential-tips/",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("홍콩 12월 아이랑 가족여행 후기"),
      },
    ],
  },
  {
    id: "okinawa",
    title: "오키나와",
    emoji: "🐋",
    badge: "최단 비행",
    subtitle: "츄라우미 수족관 + 온수풀 리조트 드라이브",
    image:
      "https://images.unsplash.com/photo-1645610115316-dc38e31a1e9b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2tpbmF3YXxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "오키나와의 바다와 해안",
    period: "4박 5일",
    costPerFamily: "약 350만원",
    costGroup: "두 가족 합계 약 700만원",
    costNote:
      "직항 왕복(인당 35~45만), 리조트 2룸 × 4박, 렌터카 2대(카시트 무료대여), 식비 포함 추정",
    flight: "직항 2시간 15분 · 시차 없음",
    weather: "15~21°C · 봄 날씨, 수영은 실내 온수풀 위주",
    kidScore: 4,
    kidNote:
      "비행 최단 — 3세도 부담 없음. 수족관·동물원·좌식 식당 등 아이 배려 문화가 기본",
    highlights: [
      "츄라우미 수족관 (고래상어)",
      "아메리칸 빌리지 · 만자모",
      "12월 하순부터 고래 관찰 투어 시작",
    ],
    pros: [
      "이동 부담 최소 — 아이 컨디션 관리 가장 쉬움",
      "오프시즌이라 관광지 한산 + 숙소 저렴",
      "렌터카 여행 쉬움 (좌측통행 주의)",
    ],
    cons: [
      "바다 수영은 사실상 불가 (웻슈트 필요)",
      "'따뜻한 휴양지' 기대에는 애매한 기온",
      "겨울엔 야외풀 닫는 숙소 많음 — 온수풀 확인 필수",
    ],
    links: [
      {
        label: "아이와 4박5일 코스 (트립스토어)",
        url: "https://www.tripstore.kr/blog/%EC%98%A4%ED%82%A4%EB%82%98%EC%99%80-%EC%97%AC%ED%96%89-%EC%95%84%EC%9D%B4%EC%99%80-%EA%B0%80%EC%A1%B1-%EC%BD%94%EC%8A%A4",
      },
      {
        label: "오키나와 겨울 여행 가이드 (그린블루)",
        url: "https://greenblue-okinawa.com/%EC%98%A4%ED%82%A4%EB%82%98%EC%99%80-%EA%B2%A8%EC%9A%B8-%EC%97%AC%ED%96%89/",
      },
      {
        label: "겨울 오키나와 총정리 (티스토리류 블로그)",
        url: "https://likejp.com/4210",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("오키나와 12월 아이랑 가족여행 후기"),
      },
    ],
  },
  {
    id: "cebu",
    title: "세부 · 막탄",
    emoji: "🏝️",
    badge: "겨울 속 여름",
    subtitle: "건기 시작 — 물놀이 특화 리조트 올인원",
    image:
      "https://images.unsplash.com/photo-1662120008178-2b0d3f7b7096?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VidSUyMHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "세부 막탄의 리조트 수영장",
    period: "5박 6일",
    costPerFamily: "약 450만원",
    costGroup: "두 가족 합계 약 900만원",
    costNote:
      "직항 왕복(인당 60~70만), 워터파크 리조트 2룸 × 5박, 식비·액티비티 포함 추정",
    flight: "직항 4시간 30분 · 시차 1시간",
    weather: "26~30°C · 건기 시작, 물놀이 최적",
    kidScore: 5,
    kidNote:
      "제이파크(뽀로로룸)·샹그릴라 등 키즈 특화 리조트 다수 — 5세 이하 무료 숙박 흔함",
    highlights: [
      "리조트 내 워터파크 (제이파크·솔레아)",
      "아일랜드 호핑 (7세 추천)",
      "세부 오션파크 아쿠아리움",
    ],
    pros: [
      "5개 옵션 중 12월 날씨가 가장 확실한 '여름'",
      "리조트 안에서 모든 것 해결 — 이동 최소",
      "리조트 대비 가성비 좋음 (괌·하와이 대비 절반)",
    ],
    cons: [
      "리조트 밖 위생·교통 인프라는 아쉬움",
      "직항이 밤 시간대 위주 — 첫날 아이 컨디션 주의",
      "액티비티 대부분 유료 추가",
    ],
    links: [
      {
        label: "아이랑 세부 호텔 베스트 5 (호텔스닷컴)",
        url: "https://kr.hotels.com/go/philippines/blog-cebu-with-kids-hotels-best-5",
      },
      {
        label: "샹그릴라 막탄 아이랑 후기 (데이오프)",
        url: "https://dayoff.co.kr/whatsinmytrip/%EC%83%B9%EA%B7%B8%EB%A6%B4%EB%9D%BC-%EB%A7%89%ED%83%84-%EC%84%B8%EB%B6%80-%EC%95%84%EC%9D%B4%EB%9E%91-%EA%B0%80%EA%B8%B0-%EC%A2%8B%EC%9D%80-5%EC%84%B1%EA%B8%89-%EB%A6%AC%EC%A1%B0%ED%8A%B8/",
      },
      {
        label: "솔레아 리조트 예약기 (티스토리)",
        url: "https://oloworldtravel.com/entry/%EC%95%84%EC%9D%B4%EB%9E%91-%EC%84%B8%EB%B6%80-%EC%86%94%EB%A0%88%EC%95%84-%EB%A6%AC%EC%A1%B0%ED%8A%B8-%EC%98%88%EC%95%BD",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("세부 막탄 12월 아이랑 리조트 후기"),
      },
    ],
  },
];

/** 비용·인원 가정 문구 — 페이지 하단 안내에 사용 */
export const COMPARE_ASSUMPTIONS =
  "비용은 2026년 12월 성수기 기준 추정치입니다 (어른 4 + 아이 3·5·7세 두 가족 기준, 가족당 = 전체 ÷ 2). 실제 가격은 예약 시점·객실 등급에 따라 크게 달라질 수 있어요.";
