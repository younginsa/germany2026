/**
 * 여행비교 — 2026년 12월 겨울 여행 시나리오 데이터.
 * 두 가족 기준: 어른 4 + 아이 3명(3·5·7세).
 * 비용은 성수기(12월 중순~말) 추정치이며 "가족당 = 두 가족 합계 ÷ 2"입니다.
 */

export interface TripOptionLink {
  label: string;
  url: string;
}

export interface TripFlowSection {
  heading: string;
  body: string;
}

export interface TripGalleryImage {
  src: string;
  alt: string;
  caption: string;
}

/** 현지 휴무·주의 정보 (공휴일 휴업 등 일정에 직접 영향을 주는 정보) */
export interface TripNotice {
  title: string;
  items: string[];
  footnote?: string;
}

/** 12월 시즌 이벤트·행사 */
export interface TripEvent {
  name: string;
  period: string;
  body: string;
  url?: string;
}

/** 예약 가이드 (선택) — 예약 절차 + 공식/에이전시 링크 */
export interface TripBookingGuide {
  title: string;
  intro?: string;
  steps: TripFlowSection[];
  links: TripOptionLink[];
  note?: string;
}

/** 세부 페이지용 블로그 스타일 콘텐츠 */
export interface TripDetail {
  /** 도입부 — 이런 여행이에요 */
  intro: string;
  /** 현지 휴무 등 꼭 알아야 할 정보 (선택) */
  notice?: TripNotice;
  /** 12월 시즌 이벤트 (선택) */
  events?: TripEvent[];
  /** 시즌 이벤트 사진 캐러셀 — 클릭 시 확대 (선택) */
  eventPhotos?: TripGalleryImage[];
  /** 일정 흐름 (3~4개 구간) */
  flow: TripFlowSection[];
  /** 3·5·7세 아이들 관점 */
  kids: string;
  tips: string[];
  /** 예약 방법 안내 (선택) */
  booking?: TripBookingGuide;
  gallery: TripGalleryImage[];
}

export interface TripOption {
  id: string;
  /** 카드 그룹 — 미지정 시 "winter" (겨울 가족여행 시나리오) */
  group?: "winter" | "trail";
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
  detail: TripDetail;
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
      "6개 옵션 중 비용 최고",
      "장거리 비행 + 시차 적응 (3세 리스크)",
      "추위·짧은 해 탓에 하루 활동 시간 제한",
      "12/24 오후~26일 상점·마켓 대부분 휴무 — 여행 후반과 정확히 겹침",
    ],
    links: [
      {
        label: "크리스마스 연휴에 뭐가 열려있나 (The Local·영문)",
        url: "https://www.thelocal.de/20251219/whats-open-and-whats-closed-over-the-christmas-holidays-in-germany",
      },
      {
        label: "크리스마스 시즌 독일 여행 팁 (한인 거주자 뉴스레터)",
        url: "https://maily.so/allculture/posts/x1zg0qe9rqg",
      },
      {
        label: "뉘른베르크 마켓 공식 (킨더바이나흐트 일정)",
        url: "https://www.christkindlesmarkt.de/",
      },
      {
        label: "노이슈반슈타인 운영시간 공식",
        url: "https://www.neuschwanstein.de/englisch/tourist/opening.htm",
      },
      {
        label: "12월 독일 여행일지 (Substack)",
        url: "https://williamjung0130.substack.com/p/128",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("독일 크리스마스마켓 아이랑 가족여행"),
      },
    ],
    detail: {
      intro:
        "프랑크푸르트에서 뮌헨까지, 로맨틱 가도를 렌터카로 달리는 우리의 오리지널 플랜이에요. 어느 마을에 도착하든 광장엔 크리스마스 마켓 불빛이 켜져 있고, 공기에서 글뤼바인과 구운 소시지 냄새가 나요. 아이들 손엔 킨더푼치(따뜻한 어린이 펀치) 한 잔 — 크리스마스의 '본진'을 직접 밟는 여행입니다. 단, 독일의 크리스마스는 '온 나라가 문을 닫는 명절'이라 아래 휴무 정보를 일정에 꼭 반영해야 해요.",
      notice: {
        title: "크리스마스 연휴 휴무 정보 — 우리 일정(12/18–27) 기준",
        items: [
          "12/20(일): 일요일엔 슈퍼마켓 포함 모든 상점이 법적으로 휴무예요. 마켓·박물관·식당은 정상 영업.",
          "프랑크푸르트 뢰머베르크 마켓은 12/22쯤 종료 (2025년: 11/24–12/22) — 도착 직후 3일이 골든타임이에요.",
          "뉘른베르크·뮌헨 마리엔플라츠 마켓은 12/24 14시까지. 대신 뉘른베르크 어린이 마켓(킨더바이나흐트)은 12/30까지 계속 열어요.",
          "12/24: 오후 2~3시에 전 상점이 일제히 셔터를 내려요. 레스토랑도 이날 저녁은 대부분 휴무 — 호텔 크리스마스 디너를 미리 예약하세요.",
          "12/25·26(공휴일): 상점 영업이 법으로 금지 — 마트·백화점 전부 휴무. 주유소·중앙역(REWE 등)·공항 매장만 예외. 식당은 일부 열지만 예약 필수.",
          "노이슈반슈타인 성은 12/24·25 휴관 → 12/26(겨울 10~16시)에 방문. 뮌헨 독일박물관·바이에른 국립박물관도 26일엔 열어요 (BMW 박물관은 26일까지 휴관).",
          "12/27(일) 귀국일도 일요일 휴무 — 기념품·선물 쇼핑의 마지막 기회는 12/24 오전이에요.",
        ],
        footnote:
          "2025년 12월 현지 기준 (The Local·공식 사이트) — 2026년 세부 일정은 출발 전 재확인 필요",
      },
      events: [
        {
          name: "뉘른베르크 킨더바이나흐트 (어린이 마켓)",
          period: "~12/30까지",
          body: "본 마켓이 24일에 끝나도 어린이 구역은 12/30까지 계속 — 미니 관람차·증기 회전목마가 있는 아이들 전용 마켓이에요.",
          url: "https://www.christkindlesmarkt.de/",
        },
        {
          name: "프랑크푸르트 시티 크리스마스 마켓 (콘스타블러바헤)",
          period: "~1/5까지",
          body: "뢰머베르크가 22일에 닫은 뒤에도 열려 있는 마켓 — 연휴 후반의 '마켓 공백'을 메워줘요. 투른&탁시스 팔레 마켓도 12/30까지.",
          url: "https://www.visitfrankfurt.travel/erleben/feste-und-veranstaltungen/frankfurter-weihnachtsmarkt",
        },
        {
          name: "교회 크리스마스 콘서트·미사",
          period: "12/24–26",
          body: "상점이 닫는 연휴 기간의 대안 — 대성당마다 무료·저가 콘서트가 열려요. 25일 '느린 하루'에 잘 어울립니다.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1779832733316-a149a5b489ab?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "프랑크푸르트 뢰머베르크 광장의 회전목마와 크리스마스 트리",
          caption: "뢰머베르크 광장 — 회전목마와 대형 트리",
        },
        {
          src: "https://images.unsplash.com/photo-1765210057627-566c82b7bb2f?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "케테 볼파르트 크리스마스 상점 앞 풍경",
          caption: "케테 볼파르트 — 1년 내내 크리스마스인 상점",
        },
        {
          src: "https://images.unsplash.com/photo-1708888071053-aabbe5af7615?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "눈 내린 로텐부르크 구시가 거리와 탑",
          caption: "겨울의 로텐부르크 구시가",
        },
        {
          src: "https://images.unsplash.com/photo-1484053801020-3a74ca659b03?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "설경 속 노이슈반슈타인 성 전경",
          caption: "눈 덮인 노이슈반슈타인 성",
        },
      ],
      flow: [
        {
          heading: "DAY 1–3 · 프랑크푸르트, 시차와 친해지기",
          body: "도착 후 이틀은 느슨하게. 숙소 앞 뢰머베르크 광장 마켓에서 회전목마 타고, 진저브레드 하트 목에 걸고 사진 찍는 게 전부여도 충분해요. 이 마켓은 12/22쯤 끝나니 초반에 실컷 봐두는 게 포인트. 해가 16시에 지니 점등 직후가 하이라이트.",
        },
        {
          heading: "DAY 4–6 · 로맨틱 가도 — 로텐부르크 & 뉘른베르크",
          body: "중세 성벽이 그대로 남은 로텐부르크에선 1년 내내 크리스마스인 '케테 볼파르트' 상점이 아이들 눈을 홀려요. 뉘른베르크 마켓엔 어린이 전용 구역(킨더바이나흐트)이 따로 있어서 미니 관람차와 증기 회전목마를 탈 수 있어요 — 이 구역은 12/30까지 열어서 연휴 후반에 다시 와도 돼요.",
        },
        {
          heading: "DAY 7–10 · 퓌센의 성, 뮌헨의 마무리",
          body: "노이슈반슈타인 성은 눈 덮인 겨울이 제일 예쁘지만 12/24·25는 휴관 — 방문일을 12/23 또는 12/26으로 잡아요. 오르막은 마차를 타면 3세도 문제 없음. 25일은 온 나라가 쉬는 날이니 호텔 수영장, 교회 콘서트, 눈놀이 같은 '느린 하루'로 비워두는 게 현실적이에요. 26일은 뮌헨 박물관들이 다시 문을 열어요.",
        },
      ],
      kids: "7세는 진짜 성과 기사 이야기에 빠지고, 5세는 회전목마와 진저브레드로 행복하고, 3세는… 솔직히 유모차와 방한이 관건이에요. 하루 야외 활동은 짧고 굵게, 오후엔 숙소에서 쉬는 리듬이 필요해요.",
      tips: [
        "방한 부츠·핫팩·장갑은 한국에서 챙겨가기 (현지 조달 비쌈)",
        "유모차 레인커버 = 방풍커버로 대활약",
        "마켓은 16시 점등 직후 1~2시간이 황금 시간대",
        "렌터카 카시트 2개는 예약 시점에 확정 필수",
        "식료품·기념품은 12/24 오전이 마감 — 이후 귀국까지 상점이 거의 안 열어요",
        "12/24~26 저녁 식사는 호텔 레스토랑 사전 예약이 안전 (기차역 마트는 연휴에도 영업)",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1543783111-ea3c70001cde?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2VybWFuJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
          alt: "크리스마스 마켓의 조명과 노점",
          caption: "점등 직후의 마켓 — 하루 중 가장 예쁜 시간",
        },
        {
          src: "https://images.unsplash.com/photo-1512663251984-863560ec3985?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2VybWFuJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
          alt: "독일 크리스마스 마켓 거리 풍경",
          caption: "마을마다 다른 마켓 — 렌터카 여행의 이유",
        },
      ],
    },
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
        label: "디즈니 크루즈 공식 사이트 (영문)",
        url: "https://disneycruise.disney.go.com/",
      },
      {
        label: "가든스 바이 더 베이 공식",
        url: "https://www.gardensbythebay.com.sg/",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("디즈니 어드벤처 크루즈 싱가포르 아이랑 후기"),
      },
    ],
    detail: {
      intro:
        "마리나베이 크루즈 센터에서 디즈니 어드벤처에 오르는 순간, 여행 준비가 끝나요. 이동도, 식당 검색도, '오늘 뭐 하지'도 없어요. 아이들은 연령별 키즈클럽으로, 어른은 선베드로. 저녁엔 온 가족이 브로드웨이급 공연을 보고, 복도에서 미키를 만나면 그날은 성공한 날이에요. 디즈니 어드벤처는 2025년 12월 싱가포르에서 취항한 아시아 최초의 디즈니 크루즈로, 중간 기항 없이 바다 위에서만 보내는 '크루즈 투 노웨어' 항로예요 — 하선·재승선 절차가 없으니 아이 셋을 데리고도 온전히 쉬는 일정이 됩니다. 배 안은 디즈니·마블·픽사 테마 구역으로 나뉘어 있어서, 3박 내내 '오늘은 어느 동네에서 놀까'를 고르는 재미가 있어요. 유일한 숙제는 예약 타이밍 — 12월 항차는 가장 먼저 매진되는 구간이라, 아래 예약 가이드를 참고해 서두르는 게 좋아요.",
      notice: {
        title: "12월 싱가포르 — 휴무 걱정은 없어요",
        items: [
          "12/25는 공휴일이지만 관광지·몰·레스토랑 모두 정상 영업 — 독일과 정반대예요.",
          "다만 12월 중순~말은 크루즈 최성수기 — 객실 가격이 가장 비싸고 빨리 매진돼요.",
          "크리스마스 원더랜드는 12/25 저녁이 연중 최고 혼잡 — 티켓은 온라인 예매 필수.",
        ],
        footnote: "2025년 12월 현지 기준 — 출발 전 재확인 권장",
      },
      events: [
        {
          name: "크리스마스 원더랜드 (가든스 바이 더 베이)",
          period: "11/29 ~ 1/1 · 매일 저녁",
          body: "싱가포르 최대 연말 축제 — 16m 회전 크리스마스 피라미드, 플라잉 산타, 슈퍼트리 인공눈까지. 12/25에도 열어요.",
          url: "https://www.gardensbythebay.com.sg/en/things-to-do/calendar-of-events/christmas-wonderland-presented-by-tripcom.html",
        },
        {
          name: "오차드로드 크리스마스 라이트업",
          period: "11/8 ~ 1/1 · 무료",
          body: "3.1km 거리 전체가 조명으로 덮여요. 크리스마스 빌리지 2곳(회전목마·게임), 12/24 밤엔 차 없는 거리 파티.",
          url: "https://christmas.orchardroad.org/",
        },
        {
          name: "크루즈 선내 홀리데이 프로그램",
          period: "12월 항차",
          body: "12월 항차는 선내 트리 점등·산타 그리팅 등 홀리데이 테마가 더해져요 — 같은 3박이라도 12월이 가장 '크리스마스'다워요.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1546258609-dca5762d2285?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FyZGVucyUyMGJ5JTIwdGhlJTIwYmF5JTIwY2hyaXN0bWFzfGVufDB8fDB8fHww",
          alt: "가든스 바이 더 베이의 슈퍼트리",
          caption: "가든스 바이 더 베이 슈퍼트리",
        },
        {
          src: "https://images.unsplash.com/photo-1589848014442-5f540ff95bea?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVucyUyMGJ5JTIwdGhlJTIwYmF5JTIwY2hyaXN0bWFzfGVufDB8fDB8fHww",
          alt: "마리나베이 샌즈와 싱가포르 스카이라인",
          caption: "마리나베이 스카이라인",
        },
        {
          src: "https://images.unsplash.com/photo-1640225076272-e6e21da515ff?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FyZGVucyUyMGJ5JTIwdGhlJTIwYmF5JTIwY2hyaXN0bWFzfGVufDB8fDB8fHww",
          alt: "크리스마스 원더랜드의 회전목마와 조명",
          caption: "크리스마스 원더랜드의 회전목마",
        },
        {
          src: "https://images.unsplash.com/photo-1570422849852-adf15f981007?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "밤의 마리나베이 — 싱가포르 플라이어와 마리나베이 샌즈",
          caption: "밤의 마리나베이 — 크루즈 출항 전야의 야경",
        },
        {
          src: "https://images.unsplash.com/photo-1708084026185-7fca3b12ee26?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "주얼 창이의 실내 폭포와 열대 정원",
          caption: "주얼 창이 실내 폭포 — 도착 첫날의 첫 코스",
        },
      ],
      flow: [
        {
          heading: "DAY 1–2 · 싱가포르 워밍업",
          body: "주얼 창이의 실내 폭포로 시작해서, 저녁엔 가든스 바이 더 베이 슈퍼트리 쇼. 12월 싱가포르는 덥지만 어디든 에어컨이 있어서 아이들 컨디션 관리가 쉬워요. 둘째 날 저녁은 크리스마스 원더랜드 — 인공눈이 내리는 슈퍼트리 아래에서 크리스마스 기분을 미리 충전하고 배에 오르는 순서가 좋아요.",
        },
        {
          heading: "DAY 3 · 승선일 — 첫 미션은 앱 예약",
          body: "마리나베이 크루즈 센터에서 체크인은 오전에 일찍 하는 게 유리해요 — 점심부터 선내 뷔페와 수영장을 쓸 수 있으니 반나절을 버는 셈이에요. 승선하자마자 디즈니 크루즈 앱으로 캐릭터 그리팅과 공연을 예약하는 게 첫 미션. 저녁엔 출항과 함께 데크에서 세일어웨이 파티가 열려요.",
        },
        {
          heading: "DAY 3–5 · 선상 생활 — 아이는 클럽으로, 어른은 휴가로",
          body: "낮엔 워터슬라이드와 수영장, 저녁엔 매일 다른 테마 레스토랑을 도는 로테이션 다이닝 — 서버가 같이 이동하며 아이들 취향을 기억해줘요. 아이들이 연령별 키즈클럽에 들어가 있는 동안 어른은 성인 전용 구역에서 진짜 휴가를 보내고, 밤엔 온 가족이 디즈니·마블 쇼를 봐요. 식사·공연·키즈클럽이 전부 요금에 포함 — 배 안에선 지갑 꺼낼 일이 거의 없어요.",
        },
        {
          heading: "DAY 6–7 · 싱가포르 마무리",
          body: "아침에 하선 후 컨디션 보고 싱가포르 동물원(3세 최애) 또는 유니버설 스튜디오 중 택일. 무리하고 싶지 않으면 호텔 수영장과 오차드로드 일루미네이션 산책만으로도 충분해요. 마지막 밤은 마리나베이 야경으로 마무리.",
        },
      ],
      kids: "이 배는 사실상 3·5·7세를 위해 설계됐어요. 연령별 클럽이 나뉘어 있어서 셋 다 각자 레벨에 맞게 놀고, 부모는 몇 시간이나마 '여행 중 휴가'를 얻어요. 캐릭터 그리팅은 가족 단위 촬영이라 대기도 짧은 편. 배가 곧 목적지라 '오늘은 어디 가야 해서 일찍 일어나'가 없다는 것도 아이들에겐 큰 장점 — 낮잠 리듬을 지키면서도 하루가 꽉 차요. 유아 동반 가족을 위한 너서리(영유아 돌봄), 유아풀, 가족 전용 프로그램이 따로 있어서 3세도 소외되지 않아요.",
      tips: [
        "12월은 최성수기 — 예약은 빠를수록 좋고 가격 차이가 큼",
        "디즈니 크루즈 앱 필수 — 승선 즉시 공연·그리팅 예약",
        "오션뷰 4인실 2개가 인사이드보다 만족도 높음 (두 가족은 인접 객실 요청)",
        "뱃멀미약 챙기기 (항로는 잔잔한 편이지만 보험용)",
        "호텔+티켓 패키지·한인 에이전시 OBC(선내 크레딧) 혜택 비교해보기",
        "승선일은 오전 체크인 — 점심부터 선내 시설을 다 쓸 수 있어요",
        "온라인 체크인은 출항 전 미리 — 여권 유효기간 6개월 이상 확인",
        "수영복·래시가드는 캐리온 가방에 — 짐이 객실에 오기 전에 수영장 직행",
      ],
      booking: {
        title: "디즈니 어드벤처 예약, 이렇게 하면 돼요",
        intro:
          "예약 창구는 크게 두 가지 — 디즈니 크루즈 공식 사이트(영문 직접 예약)와 한국 에이전시(한국어 상담·프로모션)예요. 12월 항차는 오픈 직후부터 빠지기 시작하니, 채널 비교보다 날짜 확보가 먼저예요.",
        steps: [
          {
            heading: "1 · 항차 고르기",
            body: "공식 사이트에서 12월 출항 캘린더를 열고 3박/4박 항차 중 일정에 맞는 날짜를 골라요. 크리스마스가 낀 항차(12/19~25 부근)가 가장 먼저 매진되는 구간이에요.",
          },
          {
            heading: "2 · 객실 정하기",
            body: "인사이드 < 오션뷰 < 베란다 순으로 비싸져요. 두 가족이면 4인 오션뷰 2개가 기준점 — 예약 시 '인접 객실(connecting/adjacent)' 요청을 꼭 남기세요. 3세 이하도 인원에 포함되니 객실 정원(4인)을 넘지 않는지 확인.",
          },
          {
            heading: "3 · 채널 선택 & 결제",
            body: "공식 사이트는 예약금(요금의 일부)을 걸고 잔금은 출항 전 마감일까지 — 마감일과 취소 수수료 규정을 예약 화면에서 꼭 확인하세요. 한국 에이전시(마이리얼트립·KKday·클룩 등)는 한국어 상담과 선내 크레딧(OBC)·프로모션이 장점이라 견적을 나란히 비교해보는 걸 추천해요.",
          },
          {
            heading: "4 · 출항 전 준비",
            body: "디즈니 크루즈 앱을 설치하고 온라인 체크인(승선 서류·결제카드 등록·승선 시간 선택)을 미리 끝내요. 키즈클럽 등록도 앱에서 — 공연·캐릭터 그리팅 예약은 승선 후 앱에서 열려요.",
          },
        ],
        links: [
          {
            label: "디즈니 크루즈 공식 예약 (영문)",
            url: "https://disneycruise.disney.go.com/",
          },
          {
            label: "마이리얼트립 — 디즈니 어드벤처 3박4일",
            url: "https://experiences.myrealtrip.com/products/4254405",
          },
          {
            label: "KKday — 디즈니 크루즈 가격 가이드",
            url: "https://www.kkday.com/ko/blog/35492/asia-singapore-disneycruise",
          },
          {
            label: "클룩 — 디즈니 크루즈 검색",
            url: "https://www.klook.com/ko/search/result/?query=%EB%94%94%EC%A6%88%EB%8B%88%20%ED%81%AC%EB%A3%A8%EC%A6%88",
          },
        ],
        note: "가격·취소 규정은 항차와 객실 등급, 예약 시점에 따라 크게 달라져요. 두 가족 7인 구성이면 전화·채팅 상담으로 인접 객실 확보 가능 여부부터 확인하는 게 순서예요.",
      },
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1700597312989-435871dce1fd?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "디즈니 크루즈 풀덱과 선베드",
          caption: "배 전체가 하나의 테마파크",
        },
        {
          src: "https://images.unsplash.com/photo-1509897539248-f507156634e8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlzbmV5JTIwY3J1aXNlJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "크루즈에서 바라본 바다",
          caption: "발코니에서 보는 아침 바다",
        },
      ],
    },
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
        label: "홍콩 디즈니랜드 공식 (한국어)",
        url: "https://www.hongkongdisneyland.com/ko/",
      },
      {
        label: "오션파크 공식",
        url: "https://www.oceanpark.com.hk/en",
      },
      {
        label: "홍콩 관광청 공식 (한국어)",
        url: "https://www.discoverhongkong.com/kr/index.html",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("홍콩 12월 아이랑 가족여행 후기"),
      },
    ],
    detail: {
      intro:
        "12월의 홍콩은 1년 중 가장 쾌적해요 — 맑고 건조한 20도 안팎, 걷기 딱 좋은 날씨. 그리고 이 도시는 크리스마스에 진심이에요. 침사추이 건물들이 통째로 일루미네이션이 되고, 센트럴 동상광장엔 20m 트리와 크리스마스 마을이 서고, 디즈니랜드는 겨울 이벤트로 반짝여요. 독일의 크리스마스 감성을 3시간 45분 비행으로 맛보는 압축판입니다. 이 여행의 진짜 강점은 밀도예요 — 디즈니랜드, 판다가 있는 오션파크, 피크트램, 스타페리, 하버 야경까지 전부 30분 이동권 안에 있어서, 4박 5일 동안 '이동으로 버리는 시간'이 거의 없어요. 아이 셋과 다니면 이 차이가 하루 체력을 좌우해요. 저녁마다 어디서든 야경이 기본으로 깔리니, 낮엔 파크·낮잠, 해 지면 하버로 나가는 리듬만 지키면 실패가 없는 도시예요.",
      notice: {
        title: "12월 홍콩 — 연휴에도 다 열어요 (대신 비싸요)",
        items: [
          "12/25·26은 공휴일이지만 상점·몰·관광지 모두 정상 영업 — 오히려 쇼핑 최성수기예요. 12/26~27엔 하버시티·IFC 박싱데이 세일.",
          "디즈니랜드는 12/25~28·31이 최고가 티켓 구간 + 인파 최고치 — 가능하면 크리스마스 직전 평일에 방문하세요.",
          "은행·관공서만 25·26일 휴무 — 여행자에겐 사실상 영향 없음.",
        ],
        footnote: "2025년 12월 현지 기준 — 출발 전 재확인 권장",
      },
      events: [
        {
          name: "홍콩 윈터페스트 — 센트럴 크리스마스 타운",
          period: "11월 중순 ~ 1/4",
          body: "동상광장에 20m 트리와 크리스마스 마을이 서고, 주변 8개 빌딩 외벽 전체가 라이트쇼 캔버스가 돼요 (19:30~22:30, 30분마다).",
          url: "https://www.discoverhongkong.com/in/what-s-new/events/hong-kong-winterfest.html",
        },
        {
          name: "디즈니랜드 '어 디즈니 크리스마스'",
          period: "11월 중순 ~ 1/4",
          body: "겨울왕국 구역의 크리스마스 데코 + 성 앞 크리스마스 라이브 콘서트. 별도 티켓 없이 일반 입장권에 포함.",
          url: "https://www.nextstophongkong.com/hong-kong-disneyland-christmas-celebration/",
        },
        {
          name: "심포니 오브 라이트",
          period: "매일 20:00 · 무료",
          body: "빅토리아 하버 양안 40여 개 빌딩이 참여하는 레이저·조명 쇼 — 침사추이 해변 산책로나 스타페리 위에서 보면 공짜 특등석이에요.",
          url: "https://www.discoverhongkong.com/kr/explore/attractions/a-symphony-of-lights.html",
        },
        {
          name: "박싱데이 세일",
          period: "12/26~27",
          body: "독일에선 상점이 닫는 날, 홍콩에선 최대 세일이 열려요 — 아이 옷·장난감 쇼핑 타이밍.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1672189276153-bd5af56b86d5?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "홍콩 스카이라인을 배경으로 선 대형 크리스마스 트리",
          caption: "하버 앞 대형 크리스마스 트리",
        },
        {
          src: "https://images.unsplash.com/photo-1767921148120-9990f595979c?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "밤의 센트럴 크리스마스 타운과 빌딩 숲",
          caption: "센트럴 크리스마스 타운 — 윈터페스트의 중심",
        },
        {
          src: "https://images.unsplash.com/photo-1671152493959-9b164c02eaa8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9uZyUyMGtvbmclMjBjaHJpc3RtYXN8ZW58MHx8MHx8fDA%3D",
          alt: "1881 헤리티지의 크리스마스 장식",
          caption: "침사추이 1881 헤리티지의 크리스마스",
        },
        {
          src: "https://images.unsplash.com/photo-1767921148132-96bb784bfce9?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "밤의 시계탑과 크리스마스 트리들",
          caption: "시계탑과 크리스마스 트리 — 밤의 센트럴",
        },
        {
          src: "https://images.unsplash.com/photo-1606447168767-b6f85c6205af?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "빅토리아 하버의 붉은 정크선과 야경",
          caption: "빅토리아 하버 — 정크선과 야경",
        },
      ],
      flow: [
        {
          heading: "DAY 1–2 · 디즈니랜드 (호텔 1박 추천)",
          body: "홍콩 디즈니는 아담해서 오히려 유아 동반에 최적이에요. 겨울왕국 구역 '월드 오브 프로즌'과 라이온킹 공연이 하이라이트 — 프로즌 구역은 오픈 직후가 가장 한산하니 개장 시간에 맞춰 직행하세요. 12월엔 성 앞 크리스마스 콘서트와 겨울 데코가 더해져 파크 전체가 시즌 무드예요. 폐장 불꽃까지 보려면 파크 호텔에서 1박 하는 게 체력적으로 편해요 — 낮잠이 필요한 3세를 데리고 중간에 호텔로 후퇴했다가 저녁에 재입장하는 것도 가능해져요.",
        },
        {
          heading: "DAY 3 · 오션파크",
          body: "판다 보고, 케이블카 타고 산을 넘어 아쿠아리움까지. 파크가 산 위·아래 두 구역으로 나뉘어 있어서 케이블카와 해저터널 열차가 이동 수단이자 어트랙션이에요. 유아 구역 '위스커스 하버'는 3·5세 눈높이에 딱. 케이블카에서 내려다보는 남중국해 풍경은 어른들 몫이에요.",
        },
        {
          heading: "DAY 4 · 피크트램과 하버 야경",
          body: "오전엔 피크트램으로 빅토리아 피크에 올라 도시 전경을 보고, 오후엔 침사추이로 넘어가 해변 산책로와 1881 헤리티지의 크리스마스 장식을 구경해요. 저녁 8시엔 심포니 오브 라이트 — 스타페리를 타고 바다 위에서 보면 10분 남짓한 항해가 그대로 야경 크루즈가 돼요.",
        },
        {
          heading: "DAY 5 · 딤섬 브런치와 마무리",
          body: "마지막 날은 느긋하게 딤섬 브런치 — 아이들도 잘 먹는 하가우·창펀·에그타르트 위주로. 시간이 남으면 미드레벨 에스컬레이터나 트램 한 구간을 타보고, 공항 가는 길에 시티게이트 아울렛에 들러도 좋아요.",
        },
      ],
      kids: "디즈니랜드의 유아용 어트랙션 비중이 높아 3세도 탈 게 많고, 도시가 컴팩트해서 이동이 다 30분 안쪽이에요. 지하철·페리·트램 — 탈것 자체가 아이들에겐 어트랙션이 돼요. 2층 트램과 2층 버스 맨 앞자리는 그 자체로 놀이기구고, 스타페리는 5분 항해에 아이 요금 몇백 원 수준. 식사도 걱정보다 쉬워요 — 딤섬·완탕면·에그타르트처럼 아이 입에 맞는 메뉴가 많고, 몰마다 패밀리 레스토랑과 기저귀 교환대가 갖춰져 있어요.",
      tips: [
        "파크 내 생수가 비싸요 (병당 ~4천원) — 1인 1병 반입 가능",
        "입장 즉시 앱에서 '숲 속의 플레이하우스' 등 공연 예약",
        "디즈니 호텔 직판 '호텔+티켓' 패키지가 15~20% 저렴",
        "옥토퍼스 카드 하나로 모든 교통 해결 (앱으로 아이폰에도 발급 가능)",
        "12월 크리스마스 주간은 최성수기 — 평일 방문 추천",
        "심포니 오브 라이트는 매일 20시 — 저녁 일정을 하버 근처로 잡기",
        "숙소는 침사추이 쪽이 동선 유리 — 야경·페리·MTR이 도보권",
        "낮 20도라도 실내는 에어컨이 강해요 — 아이들 얇은 겉옷 필수",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1587812544970-01fc1c228641?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZyUyMGtvbmclMjBkaXNuZXlsYW5kfGVufDB8fDB8fHww",
          alt: "홍콩 디즈니랜드 풍경",
          caption: "아담해서 오히려 유아 동반에 좋은 파크",
        },
        {
          src: "https://images.unsplash.com/photo-1701410478990-c44c24d9f6a1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9uZyUyMGtvbmclMjBkaXNuZXlsYW5kfGVufDB8fDB8fHww",
          alt: "홍콩 디즈니랜드의 저녁",
          caption: "저녁 점등 후의 파크 — 폐장까지 버틸 가치",
        },
      ],
    },
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
    detail: {
      intro:
        "비행 2시간 15분 — 3세가 낮잠 한 번 자고 일어나면 도착이에요. 12월 오키나와는 패딩 대신 바람막이면 충분한 봄 날씨. 오프시즌이라 어딜 가나 한산하고, 렌터카로 해안도로를 달리며 '우리 페이스'로 도는 여행이에요.",
      notice: {
        title: "12월 오키나와 — 일정만 잘 잡으면 휴무 이슈 없음",
        items: [
          "일본 연말연시 휴무(12/29~1/3)에 걸리지만 않으면 상점·식당 정상 영업 — 12월 중·하순 일정이면 영향 없어요.",
          "12/25 전후도 일본은 크리스마스가 공휴일이 아니라서 모든 곳이 열어요.",
          "겨울엔 야외 수영장을 닫는 숙소가 많음 — 실내 온수풀 여부만 예약 전 확인.",
        ],
        footnote: "2025년 12월 현지 기준 — 출발 전 재확인 권장",
      },
      events: [
        {
          name: "류큐 랜턴 페스티벌 (무라사키무라)",
          period: "12/1 ~ 3/31 · 17:30~22:00",
          body: "5,000여 개의 랜턴과 용 조형물, 프로젝션 맵핑 — 우천에도 진행돼요. 아이들 랜턴 만들기 워크숍도 있어요.",
          url: "https://visitokinawajapan.com/discover/events/ryukyu-lantern-festival/",
        },
        {
          name: "아메리칸 빌리지 일루미네이션",
          period: "연말 내내 · 무료",
          body: "차탄 거리 곳곳에 산타 조형물과 조명 — 저녁 산책 겸 쇼핑 코스로 딱이에요.",
          url: "https://en.japantravel.com/okinawa/mihama-american-village-illumination/70127",
        },
        {
          name: "혹등고래 관찰 시즌 개막",
          period: "12월 하순 ~ 4월",
          body: "케라마 해역으로 혹등고래가 돌아오는 시즌 — 차탄에서 출발하는 투어가 많아요 (겨울 바다라 멀미약 필수).",
          url: "https://en.activityjapan.com/feature/whale_watching_okinawa/",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1614071659313-fd1bb53ce2a9?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "츄라우미 수족관 대수조 앞에 선 사람과 고래상어",
          caption: "츄라우미 수족관 — 고래상어의 대수조",
        },
        {
          src: "https://images.unsplash.com/photo-1648130024551-8e71ba702356?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "아메리칸 빌리지의 관람차와 운하 풍경",
          caption: "아메리칸 빌리지 — 관람차가 있는 거리",
        },
        {
          src: "https://images.unsplash.com/photo-1785733249951-4d7bc8fb8472?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "코우리 대교와 에메랄드빛 바다, 백사장",
          caption: "코우리 대교 — 북부 드라이브의 하이라이트",
        },
        {
          src: "https://images.unsplash.com/photo-1573044010623-6fbaf83044e0?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "만자모 절벽과 푸른 바다 전경",
          caption: "만자모 절벽 전망",
        },
      ],
      flow: [
        {
          heading: "DAY 1–2 · 나하 & 아메리칸 빌리지",
          body: "첫날은 국제거리에서 저녁 먹고 가볍게. 둘째 날은 아메리칸 빌리지 — 관람차와 해변 산책, 알록달록한 거리 자체가 포토존이에요.",
        },
        {
          heading: "DAY 3–4 · 북부 드라이브와 츄라우미",
          body: "이 여행의 하이라이트. 세계 최대급 수조에서 고래상어가 머리 위를 지나가는 츄라우미 수족관은 3·5·7세 모두를 조용하게 만들어요. 오가는 길에 만자모 절벽 전망도 잠깐.",
        },
        {
          heading: "DAY 5 · 온수풀 오전, 오후 귀국",
          body: "마지막 날은 숙소 실내 온수풀에서 물놀이 욕구를 채우고, 공항 가는 길에 오키나와 소바 한 그릇. 짧아서 오히려 아이 컨디션이 안 무너지는 일정이에요.",
        },
      ],
      kids: "일본 특유의 아이 배려가 곳곳에 — 좌식 식당, 아기의자, 어딜 가나 깨끗한 수유실. 12월 하순부터는 고래 관찰 투어도 시작돼서 7세에겐 특별한 경험이 될 수 있어요.",
      tips: [
        "렌터카는 항공권 결제 직후 예약 — 카시트 무료 대여 수량이 한정",
        "온수풀 운영하는 숙소인지 반드시 확인 (겨울엔 야외풀 폐장 많음)",
        "좌측통행 + 내비는 맵코드 입력 방식",
        "12월 하순 고래투어는 사전 예약제",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1647336963732-7446b9da7a6f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2tpbmF3YXxlbnwwfHwwfHx8MA%3D%3D",
          alt: "오키나와 해안 풍경",
          caption: "겨울 바다의 투명도는 여름보다 높아요",
        },
        {
          src: "https://images.unsplash.com/photo-1610971250019-f677bc1300be?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b2tpbmF3YXxlbnwwfHwwfHx8MA%3D%3D",
          alt: "오키나와의 거리",
          caption: "오프시즌의 한산함 — 유모차가 편한 이유",
        },
      ],
    },
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
    detail: {
      intro:
        "12월의 세부는 건기가 막 시작된 28도의 여름 — 여섯 옵션 중 '수영장에서 크리스마스'가 확실하게 보장되는 곳이에요. 필리핀은 세계에서 가장 긴 크리스마스 시즌(9월부터!)을 보내는 나라라, 리조트 밖 도시도 온통 축제 분위기예요. 이 여행의 컨셉은 단순해요: 좋은 리조트 하나 잡고, 아무 데도 안 가기.",
      notice: {
        title: "12월 세부 — 몰이 닫는 날은 없어요, 대신 귀성 인파",
        items: [
          "필리핀 몰이 문 닫는 날은 1년에 성금요일 하루뿐 — 12/25도 정오~저녁 영업해요 (24·25일만 단축).",
          "12월은 해외 필리핀 노동자(OFW) 귀성 시즌 — 국내선·페리가 조기 매진되고 공항이 매우 붐벼요.",
          "크리스마스~신정 주간은 리조트 최성수기 — 예약은 빠를수록 좋아요.",
        ],
        footnote: "2025년 12월 현지 기준 — 출발 전 재확인 권장",
      },
      events: [
        {
          name: "파스코 사 세부 (Pasko sa Cebu)",
          period: "12월 내내",
          body: "도시 전체가 한 달짜리 크리스마스 축제 — 거리 조명, 바자, 문화 공연. 아얄라센터의 대형 트리·라이트쇼가 대표 포토존이에요.",
          url: "https://islandseeker.co/cebu-in-december",
        },
        {
          name: "심방 가비 (새벽 미사)",
          period: "12/16 ~ 24",
          body: "필리핀 고유의 9일 새벽 미사 전통 — 성니뇨 대성당 앞 빙카(쌀케이크)·푸토붐봉 노점 구경만으로도 시즌 분위기 만끽.",
          url: "https://suroy.ph/simbang-gabi-filipino-christmas-tradition/",
        },
        {
          name: "파롤 (별 모양 등불) 만들기",
          period: "12월 내내",
          body: "필리핀 크리스마스의 상징인 별 등불 — 리조트·몰 워크숍에서 아이들과 만들 수 있어요.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1669991504530-f0ad847fe34c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhpbGlwcGluZXMlMjBjaHJpc3RtYXN8ZW58MHx8MHx8fDA%3D",
          alt: "파롤 장식으로 만든 대형 크리스마스 트리",
          caption: "파롤로 만든 대형 트리 — 필리핀식 크리스마스",
        },
        {
          src: "https://images.unsplash.com/photo-1583685133115-90748ccbe274?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "산호초 라군에 떠 있는 방카 보트들의 항공 풍경",
          caption: "아일랜드 호핑 — 하늘에서 본 라군과 방카 보트",
        },
        {
          src: "https://images.unsplash.com/photo-1751814584924-48c8feb87345?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "백사장에 정박한 방카 보트와 파란 하늘",
          caption: "건기의 해변 — 방카 보트와 백사장",
        },
        {
          src: "https://images.unsplash.com/photo-1564425229770-faa6486ce562?fm=jpg&q=60&w=3000&auto=format&fit=crop",
          alt: "섬들 사이 바다에 떠 있는 보트들",
          caption: "섬과 섬 사이 — 호핑 투어의 풍경",
        },
      ],
      flow: [
        {
          heading: "DAY 1 · 밤 도착, 조용한 체크인",
          body: "직항이 대부분 밤에 도착해요. 첫날은 아무 계획 없이 재우는 게 계획. 다음날 아침 커튼을 열면 그때부터 여행 시작이에요.",
        },
        {
          heading: "DAY 2–4 · 리조트 올인",
          body: "제이파크라면 뽀로로 룸과 워터파크, 샹그릴라라면 프라이빗 비치와 키즈클럽. 하루 일과가 '수영장 → 밥 → 수영장'의 무한 반복인데, 아이들에겐 이게 최고의 일정이에요. 어른들은 교대로 마사지.",
        },
        {
          heading: "DAY 5–6 · 하루쯤은 바다로, 그리고 귀국",
          body: "7세가 있으니 하루는 아일랜드 호핑(스노클링)이나 세부 오션파크로. 3세 컨디션이 애매하면 그냥 리조트 하루 더 — 그래도 아무도 아쉬워하지 않는 곳이에요.",
        },
      ],
      kids: "5세 이하 무료 숙박·무료 식사 정책인 리조트가 많아 비용 효율도 좋아요. 워터슬라이드 높이 제한만 미리 확인하면 3·5·7세 모두 각자 놀 거리가 확실합니다.",
      tips: [
        "밤 도착 — 다음날 오전 일정은 비워두기",
        "리조트 밖 이동은 그랩(Grab)이 표준",
        "래시가드·아쿠아슈즈·SPF50+ 필수",
        "액티비티는 리조트 데스크보다 클룩/KKday가 저렴",
        "5세 이하 무료 정책은 리조트마다 다름 — 예약 전 확인",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1608904872226-19d69391c761?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2VidSUyMHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "세부 리조트의 수영장",
          caption: "하루 일과: 수영장 → 밥 → 수영장",
        },
        {
          src: "https://images.unsplash.com/photo-1637851522639-2d54fec9125e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2VidSUyMHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "세부의 바다와 해변",
          caption: "건기의 세부 바다 — 12월이 시작점",
        },
      ],
    },
  },
  {
    id: "australia",
    title: "호주 (시드니+골드코스트)",
    emoji: "🦘",
    badge: "남반구 한여름",
    subtitle: "한여름 크리스마스 — 테마파크 + 동물원 + 비치",
    image:
      "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3lkbmV5JTIwb3BlcmElMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "시드니 오페라하우스와 하버",
    period: "7박 8일 (골드코스트 4박 + 시드니 3박)",
    costPerFamily: "약 950만원",
    costGroup: "두 가족 합계 약 1,900만원",
    costNote:
      "직항 왕복(성인 ~160만·소아 ~120만) + 국내선(인당 ~15만), 아파트형 숙소 2유닛 × 7박, 테마파크·식비 포함 추정",
    flight: "직항 10시간 30분 · 시차 +2시간 (야간비행 — 시차적응 부담 없음)",
    weather: "24~28°C · 한여름 — 자외선 강함",
    kidScore: 4,
    kidNote:
      "테마파크·동물원·비치가 한 동선에. 다만 10시간 비행이 3세에게는 첫 관문 (야간비행으로 재우기 전략)",
    highlights: [
      "골드코스트 무비월드 · 씨월드 · 드림월드",
      "타롱가 동물원 (페리+케이블카) · 와일드라이프 시드니",
      "한여름 크리스마스 — 본다이 비치의 산타",
    ],
    pros: [
      "장거리 중 유일하게 시차적응이 없는 옵션 (+1~2시간)",
      "'여름 크리스마스'라는 대체 불가 경험",
      "주방·세탁기 딸린 아파트형 숙소 — 아이 동반 체류 최적",
    ],
    cons: [
      "12월 = 호주 성수기 — 비용이 독일에 근접",
      "비행 10시간 + 국내선 환승 이동",
      "테마파크·숙소 조기 예약 필수, 더위·자외선 대비",
    ],
    links: [
      {
        label: "아이 동반 골드코스트+시드니 7박8일 (트립스토어)",
        url: "https://www.tripstore.kr/blog/%ED%98%B8%EC%A3%BC-%EC%97%AC%ED%96%89-%EC%BD%94%EC%8A%A4-%EC%B6%94%EC%B2%9C-%EC%95%84%EC%9D%B4-%EB%8F%99%EB%B0%98-%EA%B3%A8%EB%93%9C%EC%BD%94%EC%8A%A4%ED%8A%B8-%EC%8B%9C%EB%93%9C%EB%8B%88-7%EB%B0%958%EC%9D%BC",
      },
      {
        label: "시드니 가족여행 완벽 가이드 (티스토리)",
        url: "https://bulacoconut.com/entry/%EC%8B%9C%EB%93%9C%EB%8B%88-%EA%B0%80%EC%A1%B1%EC%97%AC%ED%96%89-%EC%99%84%EB%B2%BD-%EA%B0%80%EC%9D%B4%EB%93%9C-%EC%95%84%EC%9D%B4%EC%99%80-%ED%95%A8%EA%BB%98%ED%95%98%EB%8A%94-%EC%97%AC%ED%96%89",
      },
      {
        label: "가족여행 패키지 일정 참고 (호주닷컴)",
        url: "https://m.hojoo.kr/product/detail.html?product_no=506&cate_no=1&display_group=4",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("호주 골드코스트 시드니 아이랑 12월 후기"),
      },
    ],
    detail: {
      intro:
        "크리스마스에 반팔을 입는 남반구의 한여름이에요. 본다이 비치엔 서핑하는 산타가 나타나고, 쇼핑몰 캐럴은 에어컨 바람과 함께 흘러요. 비행은 10시간이지만 시차가 1~2시간뿐이라, 밤 비행기에서 재우고 나면 도착 첫날부터 아이들이 쌩쌩한 게 이 옵션의 숨은 무기입니다.",
      notice: {
        title: "12/25 크리스마스 당일 — 호주도 다 쉬어요",
        items: [
          "골드코스트 테마파크(무비월드·씨월드·드림월드)는 12/25 전부 휴장 — 연중 딱 이날과 안작데이(4/25)만 쉬어요. 12/26 박싱데이에 재개장.",
          "12/25는 슈퍼마켓·상점도 대부분 휴무 — 이날은 호주인처럼 비치와 바비큐로 보내는 날이에요.",
          "12/26 박싱데이는 호주 최대 쇼핑 세일 + 시드니-호바트 요트레이스 출발일 — 하버가 축제 분위기.",
        ],
        footnote: "2025년 12월 현지 기준 — 출발 전 재확인 권장",
      },
      events: [
        {
          name: "캐럴스 인 더 도메인 (시드니)",
          period: "12/20경 · 무료",
          body: "왕립식물원 옆 대형 야외 캐럴 콘서트 — 2025년엔 위글스(호주 국민 유아 밴드)가 출연했어요. 돗자리 들고 소풍처럼.",
          url: "https://carolsinthedomain.com/",
        },
        {
          name: "시드니-호바트 요트레이스 출발",
          period: "12/26 박싱데이",
          body: "1945년부터 이어진 전통 — 수십 척의 요트가 하버를 빠져나가는 장관을 페리나 전망 포인트에서 관람할 수 있어요.",
          url: "https://www.captaincook.com.au/whats-on/boxing-day/sydney-to-hobart-cruises/",
        },
        {
          name: "마틴 플레이스 트리 & 여름 크리스마스 조명",
          period: "12월 내내 · 무료",
          body: "시드니 도심 대형 트리와 조명 — 한여름 밤 반팔 차림으로 보는 크리스마스 트리가 이 여행의 상징적 장면이에요.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1607309843659-f4ad95cf3277?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29sZCUyMGNvYXN0JTIwYXVzdHJhbGlhfGVufDB8fDB8fHww",
          alt: "골드코스트 스카이라인과 비치",
          caption: "골드코스트 스카이라인과 비치",
        },
        {
          src: "https://images.unsplash.com/photo-1591701729564-3b5325d5a4bd?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29sZCUyMGNvYXN0JTIwYXVzdHJhbGlhfGVufDB8fDB8fHww",
          alt: "골드코스트의 여름",
          caption: "12월의 골드코스트는 한여름",
        },
        {
          src: "https://images.unsplash.com/photo-1661674753163-0f8bca582509?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29sZCUyMGNvYXN0JTIwYXVzdHJhbGlhfGVufDB8fDB8fHww",
          alt: "서퍼스 파라다이스 해변",
          caption: "서퍼스 파라다이스",
        },
        {
          src: "https://images.unsplash.com/photo-1582761371078-6509f13666b1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z29sZCUyMGNvYXN0JTIwYXVzdHJhbGlhfGVufDB8fDB8fHww",
          alt: "한여름의 해변",
          caption: "한여름의 크리스마스 해변",
        },
      ],
      flow: [
        {
          heading: "DAY 1–4 · 골드코스트, 테마파크의 나날",
          body: "무비월드(5·7세 최애), 씨월드, 그리고 하루는 브로드비치에서 모래놀이. 주방 딸린 아파트 숙소에서 아침 해먹고 나가는 리듬이 아이 셋 가족에겐 호텔보다 훨씬 편해요.",
        },
        {
          heading: "DAY 5–7 · 시드니, 페리와 동물원",
          body: "국내선 1.5시간으로 시드니 이동. 서큘러 키에서 페리 타고 타롱가 동물원 — 케이블카로 올라가 캥거루·코알라를 보며 걸어 내려오면 시드니 하버 전망이 덤이에요. 저녁은 달링하버, 오페라하우스 야경.",
        },
        {
          heading: "DAY 8 · 주간 비행으로 귀국",
          body: "낮 비행이라 아이들은 기내 엔터테인먼트로 버티고, 도착하면 한국 저녁 — 시차 후유증 없이 일상 복귀가 되는 거의 유일한 장거리 노선이에요.",
        },
      ],
      kids: "캥거루와 코알라를 실물로 보는 것만으로 본전을 뽑는 여행이에요. 테마파크 + 동물원 + 비치 조합이라 3·5·7세 취향이 전부 커버되고, 여름 옷만 챙기면 되니 짐도 가벼워요.",
      tips: [
        "12월은 호주 성수기 — 항공·테마파크·숙소 모두 조기 예약",
        "자외선이 한국 여름의 2배 수준 — SPF50+ · 래시가드 · 모자 필수",
        "오팔카드: 일요일 교통비 상한제, 어린이 반값",
        "ETA 전자비자 온 가족 미리 신청",
        "테마파크는 멀티파크 패스가 단품보다 훨씬 저렴",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3lkbmV5JTIwb3BlcmElMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
          alt: "시드니 하버와 오페라하우스",
          caption: "페리에서 보는 시드니 — 교통수단이 곧 관광",
        },
        {
          src: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3lkbmV5JTIwb3BlcmElMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
          alt: "여름의 시드니 풍경",
          caption: "12월의 시드니는 한여름",
        },
      ],
    },
  },

  /* ─── 걷기·트레일 그룹 ─────────────────────────────── */
  {
    id: "santiago",
    group: "trail",
    title: "산티아고 순례길",
    emoji: "🥾",
    badge: "버킷리스트",
    subtitle: "사리아 → 산티아고 120km — 가족 순례 걷기",
    image:
      "https://images.unsplash.com/photo-1641218356058-1a8988a5135b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtaW5vJTIwZGUlMjBzYW50aWFnb3xlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "산티아고 순례길의 들판과 순례자",
    period: "9박 10일 (걷기 7일 + 이동)",
    costPerFamily: "약 650만원",
    costGroup: "두 가족 합계 약 1,300만원",
    costNote:
      "마드리드 왕복 항공(성인 ~140만·소아 ~110만), 기차 이동, 가족실 숙소 9박, 짐 배송 서비스·식비 포함 추정",
    flight: "직항 14시간 30분 (마드리드) · 시차 8시간",
    weather: "최적 5~6월·9월 · 12월은 우천·짧은 해로 비추천",
    kidScore: 2,
    kidNote:
      "완주 증명서가 나오는 최소 구간(100km)이라 마을·카페가 촘촘하지만, 3세는 유모차·캐리어 필수 — '언젠가 함께'용 버킷리스트에 가까워요",
    highlights: [
      "사리아 → 산티아고 마지막 120km (완주 증명서 발급 구간)",
      "노란 화살표와 조개껍데기 따라 걷는 순례자 경험",
      "산티아고 대성당 도착의 감동 + 순례자 미사",
    ],
    pros: [
      "완주 증명서 — 7세에게 평생 남을 성취 경험",
      "마을·카페·숙소가 촘촘해 가족 걷기에 가장 안전한 구간",
      "짐 배송 서비스(구간당 4~8유로)로 맨몸 걷기 가능",
    ],
    cons: [
      "3세 동반 시 하루 10km 이하로 잘라야 — 일정이 2배로 늘어남",
      "장거리 비행 + 시차 8시간",
      "12월 부적합 — 5~6월 또는 9월로 계획해야",
    ],
    links: [
      {
        label: "사리아 100km 완주 가이드 (트립스토어)",
        url: "https://www.tripstore.kr/blog/%EC%82%B0%ED%8B%B0%EC%95%84%EA%B3%A0-%EC%88%9C%EB%A1%80%EA%B8%B8-3%EC%9D%BC-%EC%BD%94%EC%8A%A4-%EC%A7%81%EC%9E%A5%EC%9D%B8-100km-%EC%95%95%EC%B6%95",
      },
      {
        label: "직장인 7일 코스 (브런치)",
        url: "https://brunch.co.kr/@yanatrip/244",
      },
      {
        label: "인솔자 동반 100km 패키지 (내일투어)",
        url: "https://www.naeiltour.co.kr/sub/view.asp?gotp=M&area_detail_cd=OMEE003&good_cd=MEKE12&chk_tm=Y",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("산티아고 순례길 아이랑 가족"),
      },
    ],
    detail: {
      intro:
        "매일 아침 배낭 대신 물병 하나 들고, 노란 화살표를 따라 걷기만 하면 되는 여행이에요. 갈리시아의 초록 들판과 돌담 마을을 지나며 하루 10~15km — 도착한 마을의 알베르게에서 저녁을 먹고, 다음 날 또 걷습니다. 마지막 날 산티아고 대성당 광장에 도착하면, 아이들 이름이 적힌 라틴어 완주 증명서가 기다려요.",
      notice: {
        title: "이 여행은 12월용이 아니에요",
        items: [
          "갈리시아의 12월은 비가 잦고 해가 짧아 아이 동반 걷기에 부적합 — 5~6월 또는 9월 초가 최적이에요.",
          "성수기(5~9월)엔 사리아 구간 숙소가 빨리 차요 — 가족실은 특히 미리 예약 필수.",
          "완주 증명서는 도보 100km 이상 + 순례자 여권에 하루 2개 이상 스탬프가 조건이에요.",
        ],
        footnote: "3·5·7세 기준으론 '지금'보다 아이들이 조금 더 큰 뒤가 현실적 — 장기 버킷리스트 카드예요",
      },
      events: [
        {
          name: "순례자 미사 & 보타푸메이로",
          period: "산티아고 대성당 · 매일",
          body: "도착 순례자를 위한 미사 — 운이 좋으면 대형 향로 '보타푸메이로'가 천장을 가로지르는 장관을 볼 수 있어요.",
        },
        {
          name: "순례자 여권 스탬프 모으기",
          period: "걷는 내내",
          body: "성당·카페·알베르게마다 도장이 달라요. 아이들에겐 이게 포켓몬 스탬프 랠리 — 하루 2개 이상이 완주 인정 조건.",
        },
        {
          name: "100km 표지석 인증",
          period: "사리아 출발 직후",
          body: "산티아고까지 남은 거리가 새겨진 표지석 — 100.000km 표지석 앞이 순례길 대표 포토존이에요.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1551176808-bb328dac763a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FtaW5vJTIwZGUlMjBzYW50aWFnb3xlbnwwfHwwfHx8MA%3D%3D",
          alt: "순례길 위의 조개껍데기 이정표",
          caption: "조개껍데기와 노란 화살표가 길잡이",
        },
        {
          src: "https://images.unsplash.com/photo-1641218356045-fe06f6bf945d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtaW5vJTIwZGUlMjBzYW50aWFnb3xlbnwwfHwwfHx8MA%3D%3D",
          alt: "갈리시아의 순례길 풍경",
          caption: "갈리시아의 초록 들판",
        },
        {
          src: "https://images.unsplash.com/photo-1638704645810-708030b50ce5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtaW5vJTIwZGUlMjBzYW50aWFnb3xlbnwwfHwwfHx8MA%3D%3D",
          alt: "순례길을 걷는 순례자들",
          caption: "하루 10~15km, 우리 페이스로",
        },
      ],
      flow: [
        {
          heading: "DAY 1–2 · 마드리드 in, 기차로 사리아",
          body: "마드리드에서 하루 시차 적응 후 고속열차+버스로 사리아 이동. 순례자 여권을 만들고 첫 스탬프를 찍는 것으로 여행이 시작돼요.",
        },
        {
          heading: "DAY 3–9 · 걷기 7일 — 사리아에서 산티아고까지",
          body: "포르토마린, 팔라스 데 레이, 아르수아… 보통 5일 구간을 아이 페이스에 맞춰 7일로 나눠요. 짐은 아침에 배송 서비스로 다음 숙소에 보내고, 유모차용 우회 도로가 있는 구간을 미리 체크합니다.",
        },
        {
          heading: "DAY 10 · 산티아고 대성당, 그리고 증명서",
          body: "오브라도이로 광장에 도착해 대성당을 올려다보는 순간이 이 여행의 전부예요. 순례자 사무소에서 아이들 이름으로 완주 증명서를 받고, 순례자 미사로 마무리.",
        },
      ],
      kids: "7세는 스탬프 수집과 '오늘 몇 km 걸었는지'에 진심이 되고, 5세는 절반쯤 걷고 절반은 업혀 갈 각오가 필요해요. 3세는 트레킹용 유모차나 캐리어가 사실상 필수 — 그래서 이 카드는 몇 년 뒤를 위한 버킷리스트에 가깝습니다.",
      tips: [
        "짐 배송(Jacotrans 등) 구간당 4~8유로 — 가족 여행의 필수템",
        "숙소는 공립 알베르게보다 가족실 있는 사설·펜션으로",
        "하루 걷기는 오전에 끝내는 설계 (오후는 마을에서 놀기)",
        "아이용 순례자 여권 각자 만들기 — 동기부여 최고",
        "5~6월·9월 초가 최적 시즌, 숙소는 미리 예약",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1635102043380-c2f44f1d8b88?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtaW5vJTIwZGUlMjBzYW50aWFnb3xlbnwwfHwwfHx8MA%3D%3D",
          alt: "산티아고 순례길의 시골길",
          caption: "돌담과 들판 사이로 이어지는 길",
        },
        {
          src: "https://images.unsplash.com/photo-1495423848257-eb597d257305?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbWlubyUyMGRlJTIwc2FudGlhZ298ZW58MHx8MHx8fDA%3D",
          alt: "순례길의 풍경",
          caption: "걷는 만큼만 보이는 풍경들",
        },
      ],
    },
  },
  {
    id: "yosemite-yellowstone",
    group: "trail",
    title: "요세미티 + 옐로스톤",
    emoji: "🏞️",
    badge: "대자연 로드트립",
    subtitle: "미 서부 국립공원 2주 로드트립",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9zZW1pdGV8ZW58MHx8MHx8fDA%3D",
    imageAlt: "요세미티 밸리의 절경",
    period: "13박 14일 (여름 시즌)",
    costPerFamily: "약 1,100만원",
    costGroup: "두 가족 합계 약 2,200만원",
    costNote:
      "SF 왕복 항공(성인 ~130만·소아 ~100만) + 국내선(SFO→보즈먼), SUV 렌터카 2대, 롯지·모텔 13박, 식비·입장료 포함 추정",
    flight: "직항 10시간 30분 (SF) · 시차 -17시간",
    weather: "최적 6~9월 · 12월엔 옐로스톤 도로 폐쇄 (설상차 투어만)",
    kidScore: 3,
    kidNote:
      "간헐천·들소·주니어 레인저는 아이들 최애지만, 하루 3~5시간 드라이브 구간이 3세에게 부담 — 구간 설계가 관건",
    highlights: [
      "요세미티 밸리 — 엘 캐피탄·하프돔·폭포",
      "옐로스톤 올드 페이스풀 간헐천 + 들소 떼",
      "주니어 레인저 프로그램 (국립공원 배지 수집)",
    ],
    pros: [
      "압도적 스케일 — 아이 인생 첫 '대자연' 경험",
      "주니어 레인저·캠프파이어 토크 등 가족 프로그램 풍부",
      "롯지·캠핑·모텔 등 숙소 스타일 선택지 다양",
    ],
    cons: [
      "두 공원 간 1,300km — 국내선 점프 없이는 이동이 여행의 절반",
      "비용 최고 수준 + 공원 내 숙소는 1년 전 예약 경쟁",
      "시차 -17시간 적응과 여름 성수기 인파",
    ],
    links: [
      {
        label: "요세미티 가족여행 후기 (마이리얼트립 커뮤니티)",
        url: "https://www.myrealtrip.com/community/posts/26836",
      },
      {
        label: "요세미티 2박3일 실비용 후기 (마일모아)",
        url: "https://www.milemoa.com/bbs/board/8638910",
      },
      {
        label: "아이와 옐로스톤 가이드 (론리플래닛, 영문)",
        url: "https://www.lonelyplanet.com/articles/yellowstone-national-park-with-kids",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("미서부 국립공원 아이랑 로드트립 후기"),
      },
    ],
    detail: {
      intro:
        "차창 밖으로 엘 캐피탄의 수직 절벽이 나타나는 순간, 어른도 아이도 말을 잃는 여행이에요. 요세미티의 화강암 계곡에서 시작해 비행기로 한 번 점프하면, 이번엔 김이 솟는 간헐천과 도로를 막는 들소 떼의 옐로스톤. 매일 밤 롯지 캠프파이어에서 마시멜로를 굽는, 미국식 대자연 로드트립의 정석입니다.",
      notice: {
        title: "여름 여행이에요 — 예약 전쟁 미리 알기",
        items: [
          "옐로스톤 주요 도로는 11월~4월 폐쇄 (설상차 투어만 가능) — 6~9월 여행으로 계획해야 해요.",
          "요세미티는 여름 성수기 차량 입장 예약제(사전 예약)를 운영해요 — 공원 내 롯지는 1년 전부터 경쟁.",
          "두 공원은 1,300km 떨어져 있어요 — SFO→보즈먼 국내선(2시간)으로 점프하는 게 아이 동반의 정답.",
        ],
        footnote: "미국 국립공원 연간 패스(America the Beautiful, $80)로 두 공원 입장료 해결",
      },
      events: [
        {
          name: "주니어 레인저 프로그램",
          period: "연중 · 무료",
          body: "방문자 센터에서 활동지를 받아 미션을 완수하면 레인저가 배지를 수여해요 — 5·7세가 공원마다 배지를 모으는 재미.",
          url: "https://www.nps.gov/kids/junior-ranger-programs.htm",
        },
        {
          name: "올드 페이스풀 분출",
          period: "약 90분 간격",
          body: "예측 시간에 맞춰 벤치에 앉으면 수십 미터 물기둥이 솟아요 — 방문자 센터와 앱에서 다음 분출 시간을 알려줘요.",
        },
        {
          name: "라마 밸리 와일드라이프 워칭",
          period: "새벽·해질녘",
          body: "'미국의 세렝게티' — 들소 떼는 기본, 운 좋으면 곰과 늑대까지. 차 안에서 쌍안경으로 보는 사파리예요.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9zZW1pdGV8ZW58MHx8MHx8fDA%3D",
          alt: "요세미티의 사슴과 초원",
          caption: "야생동물이 일상인 공원",
        },
        {
          src: "https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8eW9zZW1pdGV8ZW58MHx8MHx8fDA%3D",
          alt: "요세미티 계곡의 풍경",
          caption: "요세미티 밸리의 아침",
        },
        {
          src: "https://images.unsplash.com/photo-1607550295261-851fa60d8ed2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eWVsbG93c3RvbmV8ZW58MHx8MHx8fDA%3D",
          alt: "옐로스톤의 간헐천",
          caption: "옐로스톤의 간헐천 지대",
        },
        {
          src: "https://images.unsplash.com/photo-1529439322271-42931c09bce1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eWVsbG93c3RvbmV8ZW58MHx8MHx8fDA%3D",
          alt: "옐로스톤의 들소",
          caption: "도로를 막는 들소 떼 — 옐로스톤의 러시아워",
        },
      ],
      flow: [
        {
          heading: "DAY 1–5 · 샌프란시스코 & 요세미티",
          body: "SF에서 이틀 시차 적응(케이블카·피어39) 후 요세미티로. 밸리 산책로는 유모차도 OK — 터널뷰, 면사포 폭포, 미러 호수까지 짧은 하이킹 위주로 이틀이면 충분해요.",
        },
        {
          heading: "DAY 6–7 · 국내선 점프, 몬태나로",
          body: "SFO에서 보즈먼까지 2시간 비행 — 1,300km 운전을 건너뛰는 핵심 설계예요. 보즈먼에서 렌터카를 다시 받아 옐로스톤 북쪽 게이트로.",
        },
        {
          heading: "DAY 8–12 · 옐로스톤 & 그랜드티턴",
          body: "올드 페이스풀, 그랜드 프리즈매틱의 무지개 온천, 라마 밸리 들소 떼까지 — 하루 한 구역씩 천천히. 남쪽으로 이어지는 그랜드티턴에서 호수 카누 하루를 보태면 완벽해요.",
        },
        {
          heading: "DAY 13–14 · 귀국",
          body: "보즈먼 → SF 경유 귀국. 시차가 커서 돌아온 뒤 이틀은 일정을 비워두는 게 좋아요.",
        },
      ],
      kids: "간헐천이 솟는 순간의 환호성, 도로를 막은 들소를 차 안에서 구경하는 긴장감, 배지를 받으며 레인저와 하이파이브 — 5·7세에겐 인생 여행이 돼요. 3세는 차량 이동이 관건이라 낮잠 시간과 드라이브 구간을 맞추는 설계가 필요합니다.",
      tips: [
        "국립공원 연간 패스 America the Beautiful ($80) — 두 공원이면 본전",
        "공원 내 롯지는 1년 전, 늦었다면 게이트 타운 모텔로",
        "음식은 곰 보관함(Bear Box) 규정 필수 준수",
        "옐로스톤은 고도 2,400m — 도착 첫날은 가볍게",
        "쌍안경 + 아이용 국립공원 여권(스탬프북) 챙기기",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9zZW1pdGV8ZW58MHx8MHx8fDA%3D",
          alt: "요세미티의 절벽과 계곡",
          caption: "엘 캐피탄 — 차에서 내리는 순간 압도",
        },
        {
          src: "https://images.unsplash.com/photo-1608233695800-34245ba7274f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eWVsbG93c3RvbmV8ZW58MHx8MHx8fDA%3D",
          alt: "옐로스톤의 온천 지대",
          caption: "그랜드 프리즈매틱의 색은 실물이 더해요",
        },
      ],
    },
  },
  {
    id: "jeju-olle",
    group: "trail",
    title: "제주 올레길",
    emoji: "🍊",
    badge: "가성비 힐링",
    subtitle: "올레 7코스 걷기 + 감성 스팟 위크",
    image:
      "https://images.unsplash.com/photo-1612977512598-3b8d6a498bbb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "제주 해안의 풍경",
    period: "3박 4일",
    costPerFamily: "약 100만원",
    costGroup: "두 가족 합계 약 200만원",
    costNote:
      "국내선 왕복(인당 ~10만), 숙소 2룸 × 3박, 렌터카 2대·식비·카페 포함 추정 (연휴 성수기엔 항공 변동)",
    flight: "직항 1시간 10분 · 시차 없음",
    weather: "12월 5~11°C · 바람 강함 — 걷기엔 오히려 선선해서 좋아요",
    kidScore: 5,
    kidNote:
      "비행 1시간 + 한국어 + 병원 인프라 — 아이 셋 데리고 가장 마음 편한 옵션. 코스는 컨디션 따라 자유롭게 자르면 돼요",
    highlights: [
      "올레 7코스 — 올레꾼 선정 최고의 길 (외돌개·돔베낭길)",
      "서건도 '모세의 기적' 바닷길 (간조 체험)",
      "감성 카페 + 느린 우체통 (1년 뒤 도착하는 엽서)",
    ],
    pros: [
      "비용·이동 부담 최소 — 마음먹으면 다음 주에도 가능",
      "구간을 아이 컨디션에 맞춰 자유롭게 조절",
      "겨울에도 충분히 걸을 수 있는 유일한 트레일 옵션",
    ],
    cons: [
      "'해외여행'의 특별함은 없음",
      "12월 제주 바람이 매서움 — 방풍 자켓 필수",
      "연휴 성수기 항공권·렌터카 가격 변동",
    ],
    links: [
      {
        label: "제주올레 공식 — 코스 지도·안내",
        url: "https://www.jejuolle.org/trail",
      },
      {
        label: "올레 7코스 안내 (비짓제주)",
        url: "https://www.visitjeju.net/kr/detail/view?contentsid=CNTS_000000000020299",
      },
      {
        label: "올레꾼이 뽑은 최고의 길 7코스 (브런치)",
        url: "https://brunch.co.kr/@yeohae/125",
      },
      {
        label: "제주 스팟 큐레이션 (@all.about.jeju)",
        url: "https://www.instagram.com/all.about.jeju/",
      },
      {
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("제주 올레길 아이랑 겨울"),
      },
    ],
    detail: {
      intro:
        "아침 비행기를 타면 점심 전에 서귀포 바닷가를 걷고 있는 여행이에요. 올레꾼들이 '최고의 길'로 꼽는 7코스에서 마음에 드는 구간만 골라 걷고, 지치면 범섬이 보이는 오션뷰 카페로. 간조에 맞추면 서건도까지 바닷길이 열리고, 돔베낭길 빨간 우체통에 넣은 엽서는 1년 뒤 우리 집에 도착해요.",
      notice: {
        title: "12월 제주 걷기 — 준비물이 절반",
        items: [
          "제주의 겨울 바람은 체감온도를 뚝 떨어뜨려요 — 방풍 자켓·비니 필수, 대신 걷기엔 땀 안 나는 최적 온도.",
          "서건도 바닷길은 간조에만 열려요 — 물때표(간조 시간)를 미리 확인하고 일정을 맞추세요.",
          "7코스 일부는 바윗길이라 유모차 불가 — 유모차 구간은 칠십리 시공원~외돌개 위주로.",
        ],
        footnote: "코스·날씨 변동은 제주올레 공식 사이트에서 출발 전 확인",
      },
      events: [
        {
          name: "동백꽃 시즌",
          period: "12월 ~ 2월",
          body: "겨울 제주의 주인공 — 카멜리아힐·동백포레스트가 만개해요. 붉은 동백 카펫 위 아이들 사진은 겨울 제주의 상징.",
          url: "https://www.visitjeju.net/kr/detail/view?contentsid=CONT_000000000500349",
        },
        {
          name: "감귤 따기 체험",
          period: "11월 ~ 1월",
          body: "과수원에서 직접 따서 바구니 가득 — 3·5·7세 모두 실패 없는 겨울 제주 필수 코스예요.",
        },
        {
          name: "느린 우체통 엽서 쓰기",
          period: "연중 · 7코스 돔베낭길",
          body: "1년 뒤 도착하는 엽서 — '내년의 우리'에게 아이들 손글씨로 편지를 남겨요.",
        },
      ],
      eventPhotos: [
        {
          src: "https://images.unsplash.com/photo-1701178086825-c1ca5fab2f34?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "제주의 해안 절경",
          caption: "7코스의 해안 절경",
        },
        {
          src: "https://images.unsplash.com/photo-1717947464554-54d935c2155f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "제주 바다와 현무암 해변",
          caption: "현무암과 에메랄드 바다",
        },
        {
          src: "https://images.unsplash.com/photo-1612977423916-8e4bb45b5233?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "제주의 오름과 들판",
          caption: "오름 너머로 지는 해",
        },
      ],
      flow: [
        {
          heading: "DAY 1 · 도착, 서귀포 베이스캠프",
          body: "아침 비행기로 도착해 렌터카 픽업, 서귀포에 짐을 풀어요. 오후엔 가볍게 칠십리 시공원 산책 — 전망대에서 천지연 폭포와 새연교가 한눈에 들어와요.",
        },
        {
          heading: "DAY 2 · 올레 7코스, 우리만큼만 걷기",
          body: "외돌개에서 출발해 수봉로~속골 자연생태길까지 — 전체 17.7km 중 아이 페이스로 4~6km만 골라 걸어요. 범섬 오션뷰 카페에서 쉬고, 돔베낭길 느린 우체통에 엽서 한 장.",
        },
        {
          heading: "DAY 3 · 간조의 서건도 + 감성 스팟 데이",
          body: "물때에 맞춰 서건도 바닷길을 건너는 '모세의 기적' 체험. 오후엔 동백 명소나 감귤 따기 체험 — 겨울 제주에서만 되는 것들로 채워요.",
        },
        {
          heading: "DAY 4 · 오전 마무리, 귀국",
          body: "숙소 근처 해변 산책과 브런치 후 오후 비행기로 — 짧아서 아이 컨디션이 무너질 틈이 없는 일정이에요.",
        },
      ],
      kids: "이 옵션의 진짜 장점은 '실패해도 괜찮다'는 것 — 아이가 아프면 병원이 30분 안에 있고, 날씨가 나쁘면 실내로 바꾸면 되고, 걷기 싫다면 차로 이동하면 돼요. 3·5·7세 모두에게 부담 제로인 유일한 트레일 카드입니다.",
      tips: [
        "물때표(간조 시각) 확인 — 서건도는 간조 전후 1~2시간만",
        "올레 패스포트를 사면 아이들 스탬프 수집 재미 배가",
        "방풍 자켓 + 비니 — 12월 제주 바람 대비 필수",
        "감성 스팟 큐레이션 계정(@all.about.jeju 등)에서 최신 카페 체크",
        "연휴 낀 주말은 항공·렌터카 먼저 확정",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1562680802-9cf8b15f419d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "제주 해안 산책로",
          caption: "바다를 끼고 걷는 올레길",
        },
        {
          src: "https://images.unsplash.com/photo-1616798249081-30877e213b16?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "제주의 겨울 풍경",
          caption: "겨울에도 초록인 섬",
        },
      ],
    },
  },
];

/** 비용·인원 가정 문구 — 페이지 하단 안내에 사용 */
export const COMPARE_ASSUMPTIONS =
  "비용은 2026년 12월 성수기 기준 추정치입니다 (어른 4 + 아이 3·5·7세 두 가족 기준, 가족당 = 전체 ÷ 2). 실제 가격은 예약 시점·객실 등급에 따라 크게 달라질 수 있어요.";

/* ─── 아웃도어맘·밴라이프 컨셉 (자리표시 카드) ─────────────
 * 구체 스팟이 정해지면 tripOptions의 정식 카드로 교체 예정.
 * 세 카드 모두 /compare/outdoormom 리서치 보드로 연결됩니다. */

export interface ConceptCard {
  id: string;
  title: string;
  emoji: string;
  badge: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /** 클릭 시 이동할 경로 */
  href: string;
  /** 후보 방향 힌트 */
  hint: string;
}

export const outdoormomCards: ConceptCard[] = [
  {
    id: "outdoormom-ocean",
    title: "오션뷰 밴캠프",
    emoji: "🌊",
    badge: "컨셉 리서치 중",
    subtitle: "창문 너머가 바로 바다인 아침 — 파도 소리로 기상",
    image:
      "https://images.unsplash.com/photo-1541269481801-f7bbef6d81bd?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGVydmFuJTIwb2NlYW58ZW58MHx8MHx8fDA%3D",
    imageAlt: "바닷가에 세워진 캠퍼밴",
    href: "/compare/outdoormom",
    hint: "후보: 강원 동해안 솔숲 캠핑장 · 제주 함덕 차박",
  },
  {
    id: "outdoormom-forest",
    title: "숲속 트레일 캠프",
    emoji: "🌲",
    badge: "컨셉 리서치 중",
    subtitle: "초록이 가득한 숲길 산책 — 아침 안개 속 포레스트 워크",
    image:
      "https://images.unsplash.com/photo-1505635725851-c2cfe9e29112?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZXN0JTIwcGF0aCUyMGdyZWVufGVufDB8fDB8fHww",
    imageAlt: "초록 잎이 우거진 숲길",
    href: "/compare/outdoormom",
    hint: "후보: 강릉 연곡 솔숲 · 뉴질랜드 로토루아 숲",
  },
  {
    id: "outdoormom-lake",
    title: "호수 자연 캠프",
    emoji: "🦆",
    badge: "컨셉 리서치 중",
    subtitle: "오리가 노니는 호수, 물수제비와 자연 속 다이빙",
    image:
      "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFrZSUyMG1vcm5pbmclMjBtaXN0fGVufDB8fDB8fHww",
    imageAlt: "아침 안개가 낀 호수",
    href: "/compare/outdoormom",
    hint: "후보: 뉴질랜드 테카포·와나카 호수 캠퍼밴",
  },
];
