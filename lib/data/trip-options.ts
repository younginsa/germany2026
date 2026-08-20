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

/** 세부 페이지용 블로그 스타일 콘텐츠 */
export interface TripDetail {
  /** 도입부 — 이런 여행이에요 */
  intro: string;
  /** 현지 휴무 등 꼭 알아야 할 정보 (선택) */
  notice?: TripNotice;
  /** 12월 시즌 이벤트 (선택) */
  events?: TripEvent[];
  /** 일정 흐름 (3~4개 구간) */
  flow: TripFlowSection[];
  /** 3·5·7세 아이들 관점 */
  kids: string;
  tips: string[];
  gallery: TripGalleryImage[];
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
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("디즈니 어드벤처 크루즈 싱가포르 아이랑 후기"),
      },
    ],
    detail: {
      intro:
        "마리나베이 크루즈 센터에서 디즈니 어드벤처에 오르는 순간, 여행 준비가 끝나요. 이동도, 식당 검색도, '오늘 뭐 하지'도 없어요. 아이들은 연령별 키즈클럽으로, 어른은 선베드로. 저녁엔 온 가족이 브로드웨이급 공연을 보고, 복도에서 미키를 만나면 그날은 성공한 날이에요.",
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
      flow: [
        {
          heading: "DAY 1–2 · 싱가포르 워밍업",
          body: "주얼 창이의 실내 폭포로 시작해서, 저녁엔 가든스 바이 더 베이 슈퍼트리 쇼. 12월 싱가포르는 덥지만 어디든 에어컨이 있어서 아이들 컨디션 관리가 쉬워요.",
        },
        {
          heading: "DAY 3–5 · 디즈니 어드벤처 3박",
          body: "승선하자마자 앱으로 캐릭터 그리팅과 공연을 예약하는 게 첫 미션. 낮엔 워터슬라이드와 수영장, 저녁엔 매일 다른 테마 레스토랑을 돌아요. 식사·공연·키즈클럽이 전부 요금에 포함 — 배 안에선 지갑 꺼낼 일이 거의 없어요.",
        },
        {
          heading: "DAY 6–7 · 싱가포르 마무리",
          body: "하선 후 컨디션 보고 싱가포르 동물원(주롱은 3세 최애) 또는 유니버설 스튜디오 중 택일. 마지막 밤은 마리나베이 야경으로 마무리.",
        },
      ],
      kids: "이 배는 사실상 3·5·7세를 위해 설계됐어요. 연령별 클럽이 나뉘어 있어서 셋 다 각자 레벨에 맞게 놀고, 부모는 몇 시간이나마 '여행 중 휴가'를 얻어요. 캐릭터 그리팅은 가족 단위 촬영이라 대기도 짧은 편.",
      tips: [
        "12월은 최성수기 — 예약은 빠를수록 좋고 가격 차이가 큼",
        "디즈니 크루즈 앱 필수 — 승선 즉시 공연·그리팅 예약",
        "오션뷰 4인실 2개가 인사이드보다 만족도 높음",
        "뱃멀미약 챙기기 (항로는 잔잔한 편이지만 보험용)",
        "호텔+티켓 패키지·한인 에이전시 OBC 혜택 비교해보기",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1707342614540-023ae9b375c6?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlzbmV5JTIwY3J1aXNlJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "디즈니 크루즈 선상",
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
        label: "네이버 블로그 후기 검색",
        url: naverBlogSearch("홍콩 12월 아이랑 가족여행 후기"),
      },
    ],
    detail: {
      intro:
        "12월의 홍콩은 1년 중 가장 쾌적해요 — 맑고 건조한 20도 안팎, 걷기 딱 좋은 날씨. 그리고 이 도시는 크리스마스에 진심이에요. 침사추이 건물들이 통째로 일루미네이션이 되고, 디즈니랜드는 겨울 이벤트로 반짝여요. 독일의 크리스마스 감성을 3시간 45분 비행으로 맛보는 압축판입니다.",
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
          name: "박싱데이 세일",
          period: "12/26~27",
          body: "독일에선 상점이 닫는 날, 홍콩에선 최대 세일이 열려요 — 아이 옷·장난감 쇼핑 타이밍.",
        },
      ],
      flow: [
        {
          heading: "DAY 1–2 · 디즈니랜드 (호텔 1박 추천)",
          body: "홍콩 디즈니는 아담해서 오히려 유아 동반에 최적이에요. 겨울왕국 구역 '월드 오브 프로즌'과 라이온킹 공연이 하이라이트. 폐장 불꽃까지 보려면 파크 호텔에서 1박 하는 게 체력적으로 편해요.",
        },
        {
          heading: "DAY 3 · 오션파크",
          body: "판다 보고, 케이블카 타고 산을 넘어 아쿠아리움까지. 케이블카에서 내려다보는 남중국해 풍경은 어른들 몫이에요.",
        },
        {
          heading: "DAY 4–5 · 시티 & 일루미네이션",
          body: "피크트램으로 빅토리아 피크에 오르고, 저녁엔 스타페리를 타고 심포니 오브 라이트 야경을 봐요. 마지막 날은 딤섬 브런치와 침사추이 크리스마스 장식 산책으로 마무리.",
        },
      ],
      kids: "디즈니랜드의 유아용 어트랙션 비중이 높아 3세도 탈 게 많고, 도시가 컴팩트해서 이동이 다 30분 안쪽이에요. 지하철·페리·트램 — 탈것 자체가 아이들에겐 어트랙션이 돼요.",
      tips: [
        "파크 내 생수가 비싸요 (병당 ~4천원) — 1인 1병 반입 가능",
        "입장 즉시 앱에서 '숲 속의 플레이하우스' 등 공연 예약",
        "디즈니 호텔 직판 '호텔+티켓' 패키지가 15~20% 저렴",
        "옥토퍼스 카드 하나로 모든 교통 해결",
        "12월 크리스마스 주간은 최성수기 — 평일 방문 추천",
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
];

/** 비용·인원 가정 문구 — 페이지 하단 안내에 사용 */
export const COMPARE_ASSUMPTIONS =
  "비용은 2026년 12월 성수기 기준 추정치입니다 (어른 4 + 아이 3·5·7세 두 가족 기준, 가족당 = 전체 ÷ 2). 실제 가격은 예약 시점·객실 등급에 따라 크게 달라질 수 있어요.";
