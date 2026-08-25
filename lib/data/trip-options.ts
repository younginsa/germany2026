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

/** 미니 비교표 (선택) — 이동수단·일정 배분 등 옵션 내 의사결정용 */
export interface TripMiniTable {
  title: string;
  intro?: string;
  /** 열 제목 */
  columns: string[];
  /** 행 — 라벨 + 열별 내용 */
  rows: { label: string; cells: string[] }[];
  note?: string;
}

/** 예약 가이드 (선택) — 예약 절차 + 공식/에이전시 링크 */
export interface TripBookingGuide {
  title: string;
  intro?: string;
  steps: TripFlowSection[];
  links: TripOptionLink[];
  note?: string;
  /** 가이드 사진 캐러셀 — 클릭 시 확대 (선택) */
  photos?: TripGalleryImage[];
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
  /** 미니 비교표들 (선택) — 이동수단, 일정 배분 등 */
  tables?: TripMiniTable[];
  /** 일정 흐름 (3~4개 구간) */
  flow: TripFlowSection[];
  /** 3·5·7세 아이들 관점 */
  kids: string;
  tips: string[];
  /** 예약 방법 안내 (선택) */
  booking?: TripBookingGuide;
  /** 추가 가이드 섹션들 (선택) — 예: 크루즈 문꾸미기 문화 */
  guides?: TripBookingGuide[];
  gallery: TripGalleryImage[];
}

export interface TripOption {
  id: string;
  /** 카드 그룹 — 미지정 시 "winter" (겨울 가족여행 시나리오) */
  group?: "winter" | "trail";
  /** 비용 표기 단위 (예: "3인", "4인") — 미지정 시 겨울="가족", 트레일="1인" */
  costUnit?: string;
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
    costUnit: "3인",
    costPerFamily: "약 950만원",
    costGroup: "성인 2 + 아이 1 (5세) · 3인 총액",
    costNote:
      "직항 왕복(성인 ~180만·소아 ~140만), 트리플룸 1개 × 9박, 콤팩트 SUV 렌터카, 식비·입장료 포함 추정",
    flight: "직항 13시간 30분 + 시차 8시간",
    weather: "-1~4°C · 눈/비, 16시면 해가 짐",
    kidScore: 4,
    kidNote:
      "5세는 마켓 회전목마·성·마차를 다 즐길 수 있는 나이 — 3세가 빠지면서 체력·유모차 부담이 크게 줄었어요. 방한만 확실하면 OK",
    highlights: [
      "뢰머베르크·뉘른베르크 크리스마스 마켓",
      "노이슈반슈타인 성 (겨울 설경)",
      "로텐부르크 중세 마을",
    ],
    pros: [
      "크리스마스 시즌 감성의 정점 — 대체 불가",
      "일정·숙소 계획이 이미 완료된 상태",
      "3인 소그룹이라 이동·숙소·식당 모두 단순해짐",
    ],
    cons: [
      "1인당 비용이 가장 높은 옵션",
      "장거리 비행 + 시차 8시간 적응",
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
      tables: [
        {
          title: "이동수단 비교 — 렌터카 vs 대중교통",
          intro:
            "성인 2 + 5세 1, 캐리어 2~3개, 프랑크푸르트→로맨틱 가도→뮌헨 9일 기준이에요.",
          columns: [
            "🚗 렌터카 (현재 계획)",
            "🚆 기차 + 택시·우버",
            "🔀 혼합 — 기차 + 스팟별 투어",
          ],
          rows: [
            {
              label: "총 비용 (9일)",
              cells: [
                "약 110만원 — 콤팩트 SUV 9일 ~70만 + 유류 ~15만 + 주차 ~25만 (부스터 시트 대여 포함)",
                "약 40~50만원 — 도이칠란트티켓(월 63유로, 지역열차 무제한) 성인 2 ≈ 19만 (5세 무료) + 역↔숙소 택시 ~20만",
                "약 70~80만원 — 지역열차 + 노이슈반슈타인 데이투어(뮌헨 출발) 또는 1일 렌트",
              ],
            },
            {
              label: "동선 자유도",
              cells: [
                "최고 — 로텐부르크·퓌센 소도시 문앞까지, 밤 마켓 끝나고 바로 출발",
                "제한 — 로텐부르크는 슈타이나흐 환승, 퓌센은 뮌헨에서 2시간. 겨울엔 '로맨틱 가도 버스'가 아예 운행 안 해요 (4~10월만)",
                "좋음 — 대도시 간은 기차, 기차가 불편한 성·소도시만 투어버스로",
              ],
            },
            {
              label: "아이와의 현실",
              cells: [
                "부스터 하나로 끝. 짐은 트렁크에, 낮잠은 이동 중에 — 여전히 가장 편한 방식",
                "5세면 유모차 없이 걷기 가능 — 셋이서 기차 여행이 충분히 현실적이에요. 택시 이용 시 휴대용 부스터 지참",
                "기차 구간은 짐을 최소로, 투어버스는 부스터 제공 여부 사전 확인",
              ],
            },
            {
              label: "겨울 조건",
              cells: [
                "눈길·초행 아우토반 운전 부담 (겨울타이어는 렌터카 기본 포함)",
                "날씨 무관 — 단, 독일 기차 지연은 유명하니 환승 여유 30분 이상",
                "운전 부담 없이 소도시 접근성 유지 — 겨울에 균형이 가장 좋아요",
              ],
            },
            {
              label: "준비물·서류",
              cells: [
                "국제운전면허증(IDP) + 국내면허증, 환경존(Umweltzone) 스티커 — 렌터카는 기본 부착",
                "DB Navigator 앱, 도이칠란트티켓은 구독형 — 귀국 후 해지 필수. 휴대용 부스터 시트",
                "투어는 사전 예약 (겨울 노이슈반슈타인 투어는 조기 마감)",
              ],
            },
            {
              label: "추천 상황",
              cells: [
                "소도시 3곳 + 짐 있는 겨울 이동엔 여전히 1순위",
                "3인 소그룹이 되면서 7인 때보다 훨씬 현실적 — 비용 최저, 어른 둘이 아이 하나면 환승도 무리 없음",
                "운전 부담은 줄이고 소도시 접근은 유지하고 싶을 때",
              ],
            },
          ],
          note: "우버는 프랑크푸르트·뮌헨 등 대도시에만 있어요 — 로텐부르크·퓌센엔 없습니다. 기차 비용은 지역열차(RE/RB) 기준이며 ICE 이용 시 별도 요금. 3인이 된 지금은 기차 옵션도 진지하게 고려할 만해요.",
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
          body: "노이슈반슈타인 성은 눈 덮인 겨울이 제일 예쁘지만 12/24·25는 휴관 — 방문일을 12/23 또는 12/26으로 잡아요. 오르막은 마차를 타면 5세도 신나는 이벤트가 돼요. 25일은 온 나라가 쉬는 날이니 호텔 수영장, 교회 콘서트, 눈놀이 같은 '느린 하루'로 비워두는 게 현실적이에요. 26일은 뮌헨 박물관들이 다시 문을 열어요.",
        },
      ],
      kids: "다섯 살은 이 여행의 최적 나이일지도 몰라요 — 회전목마와 진저브레드에 진심이고, 성을 보면 '진짜 공주(기사) 나오냐'고 묻는 나이. 유모차 없이 걷다가 지치면 어른 둘이 번갈아 업으면 되는 인원 구성이라, 예전 7인 플랜보다 하루하루가 훨씬 가벼워요. 그래도 해 지면 기온이 뚝 떨어지니 오후 낮잠 → 점등 시간 재출동 리듬을 추천해요.",
      tips: [
        "방한 부츠·핫팩·장갑은 한국에서 챙겨가기 (현지 조달 비쌈)",
        "마켓은 16시 점등 직후 1~2시간이 황금 시간대",
        "5세 부스터 시트는 렌터카 예약 시점에 확정",
        "식료품·기념품은 12/24 오전이 마감 — 이후 귀국까지 상점이 거의 안 열어요",
        "12/24~26 저녁 식사는 호텔 레스토랑 사전 예약이 안전 (기차역 마트는 연휴에도 영업)",
      ],
      guides: [
        {
          title: "🎠 5살과 독일 — 이 나이에 딱 맞는 스팟들",
          intro:
            "다섯 살 눈높이에 맞는, 그리고 무엇보다 '12월에 실제로 여는' 곳만 골랐어요. 레고랜드·라벤스부르거 슈필란트 같은 야외 테마파크는 겨울 휴장이라 뺐습니다. 아래 다섯 곳이 우리 루트(프랑크푸르트→뉘른베르크→뮌헨) 위에 그대로 얹혀요.",
          steps: [
            {
              heading: "1 · 플레이모빌 펀파크 윈터차우버 (뉘른베르크 근교)",
              body: "11월 말~2월 겨울 시즌으로 여는 몇 안 되는 키즈 파크예요. 수천 개 조명이 켜진 야간 트레일, 진짜 얼음 스케이트장 2개 — 동물 모형을 잡고 타는 초보존이 있어서 5살 첫 스케이트에 딱이에요. 추우면 5,000㎡ 실내 HOB센터(플레이모빌 놀이마을)로 피신. 12월엔 건물 창문 전체가 아이들이 꾸민 대형 어드벤트 캘린더가 돼요. 날씨(강풍·혹한)에 따라 야외 일부가 닫힐 수 있어요.",
            },
            {
              heading: "2 · 뉘른베르크 장난감 박물관 — 마켓 바로 옆",
              body: "킨더바이나흐트에서 도보 2분. 곰인형 '엠마'가 안내하는 어린이 오디오가이드(영어)가 있고, 꼭대기층이 통째로 놀이 공간이에요. 레고·플레이모빌·바비 등 아이가 아는 장난감의 100년 전 조상들을 구경하는 재미. 마켓 기간엔 월요일도 열어요.",
            },
            {
              heading: "3 · 케테 볼파르트 크리스마스 박물관 (로텐부르크)",
              body: "입구의 실물 크기 호두까기 인형, 조명 12,500개·오너먼트 1,600개가 달린 5m 회전 트리 — 5살에겐 박물관이라기보다 크리스마스 원더랜드예요. 로텐부르크 마켓·상점과 묶어 1~2시간 코스.",
            },
            {
              heading: "4 · 뮌헨 독일박물관 킨더라이히",
              body: "3~8세 전용 체험관 — 걸어 들어가는 거대 기타, 경광등 켜지는 진짜 소방차 운전석, 수문 달린 물놀이 존. 6세 미만 무료이고 입장 인원 제한제(현장 신호등 표시)라 오전에 가는 게 안전해요. 일요일엔 뮌헨 박물관 대부분이 1유로!",
            },
            {
              heading: "5 · 젠켄베르크 자연사박물관 (프랑크푸르트) — 시차 적응일 코스",
              body: "유럽 최대급 공룡 화석 전시 — T-렉스 전신 골격과 트리케라톱스 앞에서 입이 벌어져요. 만지고 관찰하는 체험 코너도 있어서 도착 직후 몽롱한 첫 이틀의 실내 코스로 최적. 중앙역에서 도보 15분.",
            },
          ],
          links: [
            {
              label: "플레이모빌 펀파크 — 운영시간·요금 (영문)",
              url: "https://www.playmobil-funpark.de/en/oeffnungszeiten-preise",
            },
            {
              label: "독일박물관 킨더라이히 안내",
              url: "https://www.deutsches-museum.de/museumsinsel/ausstellung/kinderreich",
            },
            {
              label: "뉘른베르크 장난감 박물관 (독일관광청)",
              url: "https://www.germany.travel/en/cities-culture/toy-museum.html",
            },
            {
              label: "로텐부르크 크리스마스 박물관 (공식)",
              url: "https://gotisches-haus.de/en/rothenburg-ob-der-tauber-en/german-christmas-museum-rothenburg/",
            },
          ],
          note: "뉘른베르크 카드(2일권, 성인 €38)는 장난감 박물관 포함 시내 박물관 + 대중교통이 전부 포함이라 뉘른베르크에서 1박 이상이면 계산해볼 가치가 있어요.",
          photos: [
            {
              src: "https://images.unsplash.com/photo-1542332606-b2d1c52a6c33?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hyaXN0bWFzJTIwY2Fyb3VzZWx8ZW58MHx8MHx8fDA%3D",
              alt: "크리스마스 마켓의 회전목마",
              caption: "마켓마다 있는 앤티크 회전목마 — 5살의 최애",
            },
            {
              src: "https://images.unsplash.com/photo-1561424412-6c2125ecb1cc?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hyaXN0bWFzJTIwY2Fyb3VzZWx8ZW58MHx8MHx8fDA%3D",
              alt: "점등된 회전목마",
              caption: "해 지면 점등되는 회전목마",
            },
            {
              src: "https://images.unsplash.com/photo-1544212415-b269f18bf7ed?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2VybWFuJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
              alt: "독일 크리스마스 마켓의 장난감 노점",
              caption: "수공예 장난감·오너먼트 노점 구경",
            },
            {
              src: "https://images.unsplash.com/photo-1513038630932-13873b1a7f29?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlub3NhdXIlMjBtdXNldW0lMjBza2VsZXRvbnxlbnwwfHwwfHx8MA%3D%3D",
              alt: "자연사박물관의 공룡 골격",
              caption: "젠켄베르크의 공룡 홀 — 첫 이틀 실내 코스",
            },
            {
              src: "https://images.unsplash.com/photo-1601182207230-1b165dea2212?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlub3NhdXIlMjBtdXNldW0lMjBza2VsZXRvbnxlbnwwfHwwfHx8MA%3D%3D",
              alt: "공룡 화석 전시",
              caption: "T-렉스 앞에서 멈추는 시간",
            },
          ],
        },
        {
          title: "🌍 국경 너머 — 이웃 나라 크리스마스 원정",
          intro:
            "독일은 유럽 한가운데라, 우리 루트에서 차·기차로 2~3시간이면 나라가 바뀌어요. 관건은 날짜 궁합 — 12/18~27 일정 기준으로 '언제까지 여는지'를 함께 적었어요. 12/25 이후에도 열리는 곳: 잘츠부르크(1/1)·콜마르(12/29)·프라하(1/6)·바젤 조명(1/3).",
          steps: [
            {
              heading: "🇦🇹 잘츠부르크 — 뮌헨에서 기차 1시간 45분, 우리 일정의 정답",
              body: "대성당 광장 크리스킨들마켓이 1/1까지 열어서 독일이 다 닫는 12/25·26에도 갈 수 있어요. 아이 프로그램이 특히 강한 도시 — 헬브룬 궁전 '어드벤트차우버'엔 어린이 전용 구역(크리스마스 기차, 크리스트킨트 우체국, 보물찾기)이 있고, 모차르트광장 아이스링크는 1/31까지. 호엔잘츠부르크 요새에 오르면 알프스를 배경으로 한 구시가 설경이 펼쳐져요. 바이에른 티켓이면 가족 왕복 기차가 저렴해요. 참고: 크람푸스(무서운 산타 동행자) 퍼레이드는 5살이 놀랄 수 있으니 일정 확인.",
            },
            {
              heading: "🇫🇷 스트라스부르 & 콜마르 — 프랑크푸르트에서 차 2~2.5시간",
              body: "스트라스부르는 1570년부터 이어진 '크리스마스의 수도' — 대성당 앞 광장과 클레베르 광장의 대형 트리가 도시 전체를 무대로 만들어요 (본 마켓은 12/24 18시 종료). 콜마르는 12/29까지 열고, 프티트 베니스 지구에 산타와 놀이기구가 있는 어린이 전용 마켓이 따로 있어요 — 수·토엔 어린이 합창단이 운하 배 위에서 캐럴을 불러요. 하프팀버 골목은 '미녀와 야수' 마을의 실제 모델급 동화 뷰. 콜마르 구시가는 차량 진입 금지 — 외곽 주차 후 도보.",
            },
            {
              heading: "🇨🇭 스위스 (바젤·취리히·루체른) — 마켓은 일찍 닫아요",
              body: "스위스 마켓은 12/21~24에 대부분 종료라 우리 일정 후반과는 안 맞아요 (루체른 12/21, 바젤·취리히 12/23~24). 대신 바젤의 시내 조명은 1/3까지 켜져 있고, 뮌스터 광장·바르퓌서 광장에 샬레 150개가 서는 스위스 최대 마켓이에요 (12/2~20엔 성 마르틴 탑에서 구시가 야경 조망, CHF 5). 루체른은 카펠교+호수+알프스를 배경으로 한 중세 광장 마켓 — 여행 초반(12/18~21)에만 가능한 카드예요. 프랑크푸르트에서 바젤은 차 3시간.",
            },
            {
              heading: "🇨🇿 프라하 — 뉘른베르크에서 차 3시간, 연휴 공백의 해결사",
              body: "구시가 광장 마켓이 1/6까지 열고, 12/25·26에도 정오~22시 운영 — 독일의 '연휴 셧다운'을 정확히 메워주는 카드예요. 틴 성당 첨탑 + 천문시계 + 대형 트리 조합은 유럽 마켓 뷰의 정점으로 꼽히고, 구시가 청사 탑에 오르면 마켓 전체가 한눈에 내려다보여요. 광장 한가운데 전망대는 무료 수준, 매시 정각엔 천문시계 인형극.",
            },
          ],
          links: [
            {
              label: "잘츠부르크 어드벤트 공식 (영문)",
              url: "https://www.salzburg.info/en/salzburg/advent/salzburg-christmas-market",
            },
            {
              label: "스트라스부르 마켓 가이드 (영문)",
              url: "https://beyondtheguidebooks.com/strasbourg-christmas-market/",
            },
            {
              label: "바젤 크리스마스 공식 (영문)",
              url: "https://www.basel.com/en/events/christmas/christmas-market",
            },
            {
              label: "프라하 마켓 일정·가이드 (영문)",
              url: "https://www.pragueexperience.com/events/christmas-markets.asp",
            },
          ],
          note: "렌터카로 국경을 넘을 땐 렌터카사에 사전 고지(대부분 무료 허용)하고, 스위스 고속도로는 비네트(통행 스티커, 연간 CHF 40)가 필요해요. 오스트리아도 고속도로 비네트 필수 — 잘츠부르크는 기차가 속 편한 이유예요.",
          photos: [
            {
              src: "https://images.unsplash.com/photo-1604685779820-d3857fcb4dac?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYXNib3VyZyUyMGNocmlzdG1hc3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "스트라스부르의 크리스마스 장식 거리",
              caption: "🇫🇷 스트라스부르 — '크리스마스의 수도'",
            },
            {
              src: "https://images.unsplash.com/photo-1580112613591-a4be59e156a5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RyYXNib3VyZyUyMGNocmlzdG1hc3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "스트라스부르 대성당과 크리스마스 마켓",
              caption: "🇫🇷 대성당 앞 마켓 — 1570년부터",
            },
            {
              src: "https://images.unsplash.com/photo-1701943523362-4fc34a738dc4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RyYXNib3VyZyUyMGNocmlzdG1hc3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "스트라스부르 골목의 크리스마스 장식",
              caption: "🇫🇷 골목마다 걸린 장식들",
            },
            {
              src: "https://images.unsplash.com/photo-1601913463132-42453ea75691?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sbWFyJTIwZnJhbmNlfGVufDB8fDB8fHww",
              alt: "콜마르의 하프팀버 하우스",
              caption: "🇫🇷 콜마르 — 동화책 그 자체",
            },
            {
              src: "https://images.unsplash.com/photo-1584109504427-f9b960c94cdb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sbWFyJTIwZnJhbmNlfGVufDB8fDB8fHww",
              alt: "콜마르 운하와 옛 골목",
              caption: "🇫🇷 프티트 베니스 — 배 위의 캐럴 합창",
            },
            {
              src: "https://images.unsplash.com/photo-1506892215-0b05442bfc9e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29sbWFyJTIwZnJhbmNlfGVufDB8fDB8fHww",
              alt: "콜마르 거리 풍경",
              caption: "🇫🇷 콜마르 구시가 — 12/29까지 마켓",
            },
            {
              src: "https://images.unsplash.com/photo-1677652646789-7c13af77bd21?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsemJ1cmclMjB3aW50ZXJ8ZW58MHx8MHx8fDA%3D",
              alt: "잘츠부르크의 겨울 풍경",
              caption: "🇦🇹 잘츠부르크 — 마켓이 1/1까지",
            },
            {
              src: "https://images.unsplash.com/photo-1742160492576-abd2940e826f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FsemJ1cmclMjB3aW50ZXJ8ZW58MHx8MHx8fDA%3D",
              alt: "잘츠부르크 구시가와 요새",
              caption: "🇦🇹 호엔잘츠부르크 요새와 구시가",
            },
            {
              src: "https://images.unsplash.com/photo-1578300689752-6acba2879bec?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2FsemJ1cmclMjB3aW50ZXJ8ZW58MHx8MHx8fDA%3D",
              alt: "알프스를 배경으로 한 잘츠부르크",
              caption: "🇦🇹 알프스 설경을 배경으로",
            },
            {
              src: "https://images.unsplash.com/photo-1553713822-6b472e98ef99?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJhZ3VlJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
              alt: "프라하 구시가 광장의 크리스마스 마켓",
              caption: "🇨🇿 프라하 구시가 광장 — 1/6까지, 12/25도 오픈",
            },
            {
              src: "https://images.unsplash.com/photo-1639488013074-dcd13020150b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJhZ3VlJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
              alt: "틴 성당과 크리스마스 트리",
              caption: "🇨🇿 틴 성당 + 대형 트리 — 유럽 마켓 뷰의 정점",
            },
            {
              src: "https://images.unsplash.com/photo-1650099077872-9b384deb8fe3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJhZ3VlJTIwY2hyaXN0bWFzJTIwbWFya2V0fGVufDB8fDB8fHww",
              alt: "프라하의 겨울 야경",
              caption: "🇨🇿 천문시계 탑에서 내려다본 마켓",
            },
            {
              src: "https://images.unsplash.com/photo-1477271706509-fecda7438b68?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHVjZXJuZSUyMHN3aXR6ZXJsYW5kfGVufDB8fDB8fHww",
              alt: "루체른 카펠교",
              caption: "🇨🇭 루체른 카펠교 — 마켓은 12/21까지",
            },
            {
              src: "https://images.unsplash.com/photo-1518079521743-d5f88b127929?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHVjZXJuZSUyMHN3aXR6ZXJsYW5kfGVufDB8fDB8fHww",
              alt: "루체른 호수와 알프스",
              caption: "🇨🇭 호수 너머 알프스 — 루체른",
            },
            {
              src: "https://images.unsplash.com/photo-1543788860-6f99bdcd4b75?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8enVyaWNoJTIwY2hyaXN0bWFzfGVufDB8fDB8fHww",
              alt: "취리히의 크리스마스 조명",
              caption: "🇨🇭 취리히 — 유럽 최대 실내 마켓의 도시",
            },
            {
              src: "https://images.unsplash.com/photo-1639337665352-288e448db1c4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8enVyaWNoJTIwY2hyaXN0bWFzfGVufDB8fDB8fHww",
              alt: "취리히 시내의 겨울 풍경",
              caption: "🇨🇭 바젤·취리히 조명은 1/3까지",
            },
          ],
        },
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
    costUnit: "4인",
    costPerFamily: "약 750~900만원",
    costGroup: "성인 2 + 아이 2 (7·3세) · 4인 총액",
    costNote:
      "항공 ~330만 + 크루즈 오션뷰 3박 ~240~470만(출항일별 실제 요금표 참고) + 싱가포르 호텔 3박 ~90만 + 식비·교통. 12/21 크리스마스 항차는 12/7 대비 인테리어 기준 +57%",
    flight: "직항 6시간 30분 · 시차 1시간",
    weather: "27~31°C · 덥고 습함, 스콜성 소나기",
    kidScore: 5,
    kidNote:
      "7세와 3세 모두 연령별 키즈클럽 이용 가능 + 캐릭터 그리팅 — 이 연령대에 사실상 최적",
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
          name: "🚢 미키의 트리 점등식",
          period: "승선 첫날 밤 · 아트리움",
          body: "홀리데이 항차의 시작. 3층 높이 트리 앞에 모여 미키·미니·구피와 캐럴을 부르고, 카운트다운과 함께 트리에 불이 들어와요. 아이들이 직접 점등에 참여할 수 있고, 마지막에 산타가 등장해요.",
        },
        {
          name: "🚢 산타 & 미세스 클로스",
          period: "홀리데이 항차 내내",
          body: "산타에게 위시리스트를 직접 전하는 그리팅, 미세스 클로스의 아트리움 스토리타임, 스타킹·카드 만들기 공작. 3세도 7세도 각자 눈높이로 즐길 수 있는 프로그램이에요.",
        },
        {
          name: "🚢 미키·미니 홀리데이 데크 파티",
          period: "홀리데이 항차 · 상갑판",
          body: "미키·미니·도널드·칩앤데일이 총출동하는 야외 파티 — 음악·댄스에 캔디케인 림보 같은 게임까지. '산타의 윈터 원더랜드 볼'에선 겨울왕국 자매와 인공눈까지 등장해요.",
        },
        {
          name: "🚢 진저브레드 하우스 & 캐럴, 특별 메뉴",
          period: "12월 · 선내 전역",
          body: "승무원들이 직접 만든 실물 크기 진저브레드 하우스가 아트리움에 서고, 뮤지컬 배우들이 캐럴을 불러요. 크리스마스 이브와 당일엔 각각 다른 특별 메뉴가 나오고, 캐릭터들은 전부 크리스마스 의상으로 갈아입어요.",
        },
        {
          name: "🌴 유니버설 스튜디오 — A Universal Christmas",
          period: "11월 말 ~ 1월 초 · 입장권에 포함",
          body: "시즌 퍼레이드와 산타 모자를 쓴 캐릭터들, 열대 인공눈. 크리스마스 기간엔 21시까지 연장 운영하고, 금~일 21시엔 레이크 할리우드 불꽃놀이가 열려요.",
          url: "https://www.rwsentosa.com/en/attractions/universal-studios-singapore",
        },
        {
          name: "🌴 싱가포르 동물원 · 버드 파라다이스 크리스마스",
          period: "12월 · 12/25 당일 운영",
          body: "동물원은 크리스마스 미스터리 트레일과 캐릭터 그리팅을, 버드 파라다이스는 새들이 산타의 편지와 선물을 배달하는 특별 쇼를 열어요.",
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
      tables: [
        {
          title: "🎄 크리스마스를 배에서? 싱가포르에서? — 항차가 곧 결정",
          intro:
            "2026년 12월 달력을 보면 답이 정해져요. 3박은 월요일, 4박은 목요일 출발이라 — 12/21(월) 3박을 타면 12/24 하선해서 크리스마스는 싱가포르에서, 12/24(목) 4박을 타면 크리스마스 이브와 당일을 배 위에서 보내요. 즉 '어디서 보낼까'는 '어느 항차를 예약할까'와 같은 질문이에요.",
          columns: [
            "🚢 배 위에서 — 12/24(목) 출발 4박",
            "🌴 싱가포르에서 — 12/21(월) 출발 3박",
          ],
          rows: [
            {
              label: "일정",
              cells: [
                "12/24 승선 → 12/25 크리스마스 당일 항해 → 12/28 하선",
                "12/21 승선 → 12/24 하선 → 12/25 싱가포르 시내",
              ],
            },
            {
              label: "크리스마스 당일 프로그램",
              cells: [
                "미키의 트리 점등식, 미키·미니 홀리데이 데크 파티, 산타의 윈터 원더랜드 볼, 크리스마스 전용 특별 메뉴(이브·당일 각각), 실물 크기 진저브레드 하우스, 캐럴 공연, 데크 홀리데이 영화 상영",
                "가든스 바이 더 베이 크리스마스 원더랜드, 유니버설 스튜디오 'A Universal Christmas'(연장 운영 21시), 오차드로드 라이트업, 싱가포르 동물원 크리스마스 프로그램, CHIJMES·캐피톨 캐럴 공연과 인공눈",
              ],
            },
            {
              label: "산타를 만날 수 있나",
              cells: [
                "산타 + 미세스 클로스 그리팅, 미세스 클로스 스토리타임, 아이들이 직접 스타킹·카드 만들기 — 3세·7세 모두 참여 가능",
                "몰·이벤트장 산타 포토존 위주 (줄이 길고 유료인 경우 많음)",
              ],
            },
            {
              label: "분위기",
              cells: [
                "디즈니 캐릭터가 전부 크리스마스 의상으로 갈아입어요 — '디즈니 크리스마스' 그 자체. 배 안이라 이동·날씨 걱정 없음",
                "도시 전체가 열대 크리스마스 — 30도에 인공눈. 스케일은 크지만 인파와 이동이 변수",
              ],
            },
            {
              label: "비용",
              cells: [
                "4박이라 3박 대비 30~40% 높고, 크리스마스 항차라 성수기 할증까지 겹쳐요 — 가장 비싼 조합",
                "12/21 항차도 12/7 대비 +57%지만 4박보다는 저렴 · 시내 숙박비는 별도",
              ],
            },
            {
              label: "리스크",
              cells: [
                "최성수기라 조기 매진 가능성 — 잔여 객실부터 확인해야",
                "12/25는 싱가포르 공휴일이지만 상점·관광지는 정상 영업 (독일과 달리 휴무 걱정 없음) · 다만 인파 최고조",
              ],
            },
            {
              label: "이런 가족에게",
              cells: [
                "아이들에게 '디즈니 크리스마스'를 선물하고 싶다면 — 3·7세엔 평생 기억",
                "예산을 아끼면서 크리스마스 분위기는 즐기고 싶다면 · 유니버설·동물원도 함께 보고 싶다면",
              ],
            },
          ],
          note: "참고: 취항 첫 시즌엔 12/22 출발 크리스마스 5박, 12/27 출발 연말 5박 같은 특별 항차가 따로 편성됐어요 — 2026년 12월에도 5박 홀리데이 항차가 있는지 예약 화면에서 함께 확인해보세요. 연말 항차엔 카운트다운 파티와 선상 불꽃놀이가 열려요.",
        },
        {
          title: "💰 출항일별 실제 요금 (3박 · 2인 1실 기준)",
          intro:
            "가장 중요한 포인트 — 크루즈 요금은 '객실당 2인' 기준으로 표시돼요. 3·4번째 인원은 추가 요금이라, 우리처럼 4인이면 표시가보다 올라갑니다. 아래는 3박(월요일 출발) 항차의 2인 1실 총액이에요.",
          columns: ["인테리어 (내측)", "오션뷰", "베란다"],
          rows: [
            {
              label: "11/30(월) 출발",
              cells: ["$570", "$832", "$793"],
            },
            {
              label: "12/7(월) 출발",
              cells: ["$625", "$832", "$904"],
            },
            {
              label: "12/14(월) 출발",
              cells: ["$765", "$882", "$940"],
            },
            {
              label: "12/21(월) 출발 · 크리스마스",
              cells: ["$983", "$1,114", "조회 필요"],
            },
            {
              label: "12/28(월) 출발 · 연말",
              cells: ["최성수기 — 조회 필요", "—", "—"],
            },
          ],
          note: "출처: 크루즈 요금 비교 사이트(booking.com cruises) 집계값 · 2026년 8월 기준. 12/21 항차가 12/7보다 인테리어 기준 57% 비싸요 — 크리스마스를 하루이틀만 비켜도 절약폭이 큽니다. 4박(목요일 출발) 항차는 3박 대비 30~40% 높아요.",
        },
        {
          title: "🧮 우리 4인 가족 실제 결제액 계산법",
          intro:
            "성인 2 + 아이 2(7·3세)가 오션뷰 4인실 하나를 쓸 때, 표시가에 무엇이 더해지는지예요.",
          columns: ["항목", "금액", "비고"],
          rows: [
            {
              label: "1 · 기본 요금",
              cells: [
                "2인 1실 표시가",
                "$832 ~ $1,114",
                "출항일에 따라 (위 표) · 세금·항만세 포함",
              ],
            },
            {
              label: "2 · 3·4번째 인원",
              cells: [
                "아이 2명 추가 요금",
                "실시간 조회 필요",
                "성인 요금보다 크게 저렴하지만 공개 정가가 없어요 — 인원 4명으로 넣어야 실제가가 나와요",
              ],
            },
            {
              label: "3 · 팁 (자동 부과)",
              cells: [
                "1인 1박 $16",
                "약 $192",
                "4인 × 3박 · 3세 유아도 포함이에요 (컨시어지는 1박 $27.25)",
              ],
            },
            {
              label: "4 · 불포함 항목",
              cells: [
                "주류·스페셜티 식당·와이파이·사진·스파·너서리",
                "선택",
                "식사·공연·키즈클럽·수영장은 전부 포함이에요",
              ],
            },
            {
              label: "참고 실사례",
              cells: [
                "4인 가족 오션뷰 3박",
                "약 $3,400",
                "취항 초기(성수기) 사례 — 4인 총액 감각의 상한선으로 참고",
              ],
            },
          ],
          note: "⚠️ 크루즈 요금은 실시간 변동제(수요·잔여 객실에 따라 수시 변동)라, 위 숫자는 '감 잡기용 기준선'이에요. 공식 사이트에서 인원을 정확히 4명(3세 포함)으로 넣고 견적을 뽑는 게 유일한 정확한 방법입니다.",
        },
        {
          title: "싱가포르, 크루즈 전에 둘까 후에 둘까?",
          intro: "시내 관광 3박을 승선 전과 하선 후 중 어디에 배치할지의 비교예요.",
          columns: ["✅ 크루즈 전 싱가포르", "크루즈 후 싱가포르"],
          rows: [
            {
              label: "지연·결항 리스크",
              cells: [
                "항공 지연에도 승선까지 버퍼 확보 — 크루즈 여행의 철칙은 '최소 하루 전 도착'이에요",
                "배를 놓칠 리스크 자체가 없음 (하선은 지연이 거의 없어요)",
              ],
            },
            {
              label: "컨디션 적응",
              cells: [
                "더위·시차(1시간)를 승선 전에 적응 — 배에서 컨디션 최상으로 시작",
                "적응 과정 없이 크루즈 직행 — 첫날 컨디션 리스크를 배에서 감당",
              ],
            },
            {
              label: "아이 기분 곡선",
              cells: [
                "도시 → 크루즈로 갈수록 상승 — 하이라이트가 마지막에 와요",
                "배에서 내리기 싫어하는 아이들을 달래며 관광 — 뭘 봐도 시시해질 위험",
              ],
            },
            {
              label: "짐·동선",
              cells: [
                "호텔 → 크루즈센터로 한 번만 이동, 승선일 오전은 여유",
                "하선일 아침 짐 들고 이동 — 호텔 얼리체크인 협의 필요",
              ],
            },
            {
              label: "귀국편 궁합",
              cells: [
                "귀국편 시간대 제약 없음",
                "밤 비행 귀국이면 하선 후 하루를 알차게 쓰고 공항으로 — 이 경우엔 후배치도 매력",
              ],
            },
          ],
          note: "결론: 승선 전 2박(적응 + 원더랜드) + 하선 후 1박(마무리 + 밤 비행 버퍼) 배분을 추천해요. 한쪽에 몰아야 한다면 '전'이 정답 — 배를 놓치는 리스크만은 피해야 하니까요.",
        },
        {
          title: "승선 전 싱가포르 3일 플랜",
          intro: "위 추천 배분(전 2박 + 후 1박) 기준의 아이 동반 플랜이에요.",
          columns: ["오전", "오후", "저녁"],
          rows: [
            {
              label: "DAY 1 · 도착",
              cells: [
                "창이 도착 — 주얼 '레인 보텍스' 실내 폭포 구경",
                "호텔 체크인 + 수영장으로 더위 적응",
                "가든스 바이 더 베이 · 크리스마스 원더랜드 (온라인 예매 필수)",
              ],
            },
            {
              label: "DAY 2 · 시티",
              cells: [
                "싱가포르 동물원 (아침이 가장 시원해요)",
                "호텔 낮잠 — 승선 전 아이 컨디션 저축",
                "오차드로드 라이트업 산책 + 호커센터 저녁",
              ],
            },
            {
              label: "DAY 3 · 승선",
              cells: [
                "짐 싸서 마리나베이 — 머라이언 파크 산책",
                "12시~ 크루즈 체크인 (오전 등록하면 점심부터 선내 이용)",
                "세일어웨이 파티 + 선상 첫 저녁",
              ],
            },
          ],
          note: "하선 후 1박: 센토사(케이블카·아쿠아리움) 반나절 → 밤 비행 귀국이 무난해요.",
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
      kids: "이 배는 사실상 7세와 3세를 위해 설계됐어요. 연령별 클럽이 나뉘어 있어서 둘 다 각자 레벨에 맞게 놀고, 부모는 몇 시간이나마 '여행 중 휴가'를 얻어요. 캐릭터 그리팅은 가족 단위 촬영이라 대기도 짧은 편. 배가 곧 목적지라 '오늘은 어디 가야 해서 일찍 일어나'가 없다는 것도 아이들에겐 큰 장점 — 낮잠 리듬을 지키면서도 하루가 꽉 차요. 유아 동반 가족을 위한 너서리(영유아 돌봄), 유아풀, 가족 전용 프로그램이 따로 있어서 3세도 소외되지 않아요.",
      tips: [
        "12월은 최성수기 — 예약은 빠를수록 좋고 가격 차이가 큼",
        "디즈니 크루즈 앱 필수 — 승선 즉시 공연·그리팅 예약",
        "오션뷰 4인실 하나면 네 식구 정원이 딱 맞아요 — 인사이드보다 만족도 높음",
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
            heading: "0 · 예약 전 꼭 알 것 — 표시가는 '2인 1실' 기준",
            body: "모든 공개 요금은 객실당 2인 기준이에요. 우리는 4인(3세 포함)이라 반드시 인원을 4명으로 넣고 조회해야 실제 결제액이 나와요. 3·4번째 인원 요금은 정가가 공개돼 있지 않고 항차마다 달라요. 팁은 별도로 1인 1박 $16(4인 3박이면 약 $192)이 자동 부과되고, 3세도 대상이에요.",
          },
          {
            heading: "1 · 항차 고르기",
            body: "공식 사이트에서 12월 출항 캘린더를 열고 3박/4박 항차 중 일정에 맞는 날짜를 골라요. 크리스마스가 낀 항차(12/19~25 부근)가 가장 먼저 매진되는 구간이에요.",
          },
          {
            heading: "2 · 객실 정하기",
            body: "인사이드 < 오션뷰 < 베란다 순으로 비싸져요. 성인 2 + 아이 2면 4인 오션뷰 1개가 기준점 — 정원이 딱 맞아요. 3세도 인원에 포함되니 예약 인원을 4인으로 정확히 입력하세요.",
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
        note: "가격·취소 규정은 항차와 객실 등급, 예약 시점에 따라 크게 달라져요. 성인 2 + 아이 2는 오션뷰 4인실 정원에 딱 맞으니, 예약 인원(3세 포함 4명)만 정확히 입력하면 돼요.",
      },
      guides: [
        {
          title: "문꾸미기 & 피시 익스텐더 — 디즈니 크루즈의 숨은 문화",
          intro:
            "선실 문이 철제라 자석이 붙어요. 그래서 디즈니 크루즈에선 출항 전부터 자석을 준비해 각자 방 문을 꾸미는 '문꾸미기'가 전통이 됐어요 — 똑같이 생긴 긴 복도에서 우리 방을 한눈에 찾는 실용성에, 남의 집 문 구경하는 재미까지. 강제성 없는 순수 자율 문화입니다.",
          steps: [
            {
              heading: "1 · 기본 룰 — 자석만, 내 문에만 (2026년 6월 개정)",
              body: "테이프·접착제·젤 부착물은 문 도장이 상해서 금지 — 위반으로 문이 손상되면 건당 $100 배상이에요. 장식은 내 방 문에만 가능하고 복도 벽·천장은 금지, 문에 거는 오버도어 행거와 소리·영상 나는 장식도 금지. 즉, '자석으로 문 위에서만'이 전부예요.",
            },
            {
              heading: "2 · 준비물 — 커스텀 자석이 반, DIY가 반",
              body: "Etsy에서 가족 이름·'First Cruise' 뱃지 커스텀 자석이 $10~30, 아마존에선 'cruise door magnets'로 검색하면 세트가 나와요. 요즘 유행은 DIY — ChatGPT로 우리 가족 캐릭터 이미지를 만들어 인쇄한 뒤 자석 시트(다이소·문구점)에 붙이면 끝. 7세·3세 이름과 미키 귀만 있어도 충분히 예뻐요.",
            },
            {
              heading: "3 · 피시 익스텐더(FE) — 낯선 가족들과 선물 교환",
              body: "방 문 옆의 물고기 모양 금속 장식(원래 우편물 꽂이)에 헝겊 주머니를 걸어두면, 같은 항차의 다른 가족들이 항해 중 몰래 작은 선물($1~5 수준)을 넣고 가요. 2005년 한 승객이 시작한 문화로, 디즈니가 아니라 승객들이 페이스북 항차 그룹에서 조를 짜서 운영해요 — 출항 몇 달 전 그룹 가입이 먼저예요.",
            },
            {
              heading: "4 · 부담되면 '픽시더스트'로 가볍게",
              body: "FE는 사전 가입 + 선물 수십 개 준비라 첫 크루즈엔 부담일 수 있어요. 대안이 픽시더스트 — 그룹 없이, 지나가다 마음에 드는 문에 스티커나 사탕을 무작위로 선물하는 가벼운 버전이에요. 우리처럼 첫 승선이면 문꾸미기 + 픽시더스트 받는 쪽부터 시작해도 충분해요.",
            },
          ],
          links: [
            {
              label: "📸 실제 문꾸미기 사진·영상 (인스타그램)",
              url: "https://www.instagram.com/p/DWL3XFjk8Ld/",
            },
            {
              label: "📸 디즈니크루즈 문꾸미기 릴스",
              url: "https://www.instagram.com/reel/DbVLATjt8BY/",
            },
            {
              label: "📸 픽시더스트 문꾸미기 (유튜브 쇼츠)",
              url: "https://www.youtube.com/shorts/P4Y_4bbFNK8",
            },
            {
              label: "📸 인스타그램 #디즈니크루즈문꾸미기 태그",
              url: "https://www.instagram.com/explore/tags/%EB%94%94%EC%A6%88%EB%8B%88%ED%81%AC%EB%A3%A8%EC%A6%88%EB%AC%B8%EA%BE%B8%EB%AF%B8%EA%B8%B0/",
            },
            {
              label: "문꾸미기·FE 실전 후기 (마일모아)",
              url: "https://www.milemoa.com/bbs/board/11097909",
            },
            {
              label: "셀프 문꾸미기 아이디어·DIY (베스트크루즈)",
              url: "https://bestcruise4u.com/%EB%94%94%EC%A6%88%EB%8B%88-%ED%81%AC%EB%A3%A8%EC%A6%88-%ED%95%84%EC%88%98-%EC%84%A0%EC%8B%A4-%EB%AC%B8-%EA%BE%B8%EB%AF%B8%EA%B8%B0-%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4-%EC%A7%81%EC%A0%91-%EB%A7%8C/",
            },
            {
              label: "Fish Extender 완전 가이드 (Cruise Critic, 영문)",
              url: "https://www.cruisecritic.com/articles/fish-extenders-on-disney-cruise-line",
            },
            {
              label: "Etsy — 크루즈 도어 자석 쇼핑",
              url: "https://www.etsy.com/search?q=disney%20cruise%20door%20magnets",
            },
          ],
          note: "디즈니 어드벤처(싱가포르)는 취항 초기라 FE 문화가 미국 노선만큼 정착되진 않았어요 — 우리 항차 페이스북 그룹에 FE 모집 글이 있는지 먼저 확인하고, 없어도 문꾸미기만으로 충분히 재밌어요. 참고: 일부 컨시어지 등급은 목재 문이라 자석이 안 붙어요.",
          photos: [
            {
              src: "https://images.unsplash.com/photo-1670499709068-09c3dd290cc0?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3J1aXNlJTIwc2hpcCUyMGNvcnJpZG9yfGVufDB8fDB8fHww",
              alt: "크루즈 선실 복도",
              caption: "똑같이 생긴 복도 — 문꾸미기가 시작된 이유",
            },
            {
              src: "https://images.unsplash.com/photo-1596754125792-b003864a168e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3J1aXNlJTIwc2hpcCUyMGNvcnJpZG9yfGVufDB8fDB8fHww",
              alt: "크루즈 객실 복도의 문들",
              caption: "이 문들 중 하나가 우리 방 — 자석 하나면 바로 찾아요",
            },
            {
              src: "https://images.unsplash.com/photo-1670499709277-3d56f64e2857?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3J1aXNlJTIwc2hpcCUyMGNvcnJpZG9yfGVufDB8fDB8fHww",
              alt: "크루즈 선내 복도 풍경",
              caption: "복도 산책 = 남의 집 문 구경하는 재미",
            },
            {
              src: "https://images.unsplash.com/photo-1487770931682-b80013ed9cc9?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZGdlJTIwbWFnbmV0c3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "다양한 자석들",
              caption: "준비물은 오직 자석 — 테이프·접착제는 금지",
            },
            {
              src: "https://images.unsplash.com/photo-1597502321303-ac7965ad7e8e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJpZGdlJTIwbWFnbmV0c3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "냉장고에 붙은 자석들",
              caption: "커스텀 자석은 Etsy에서 $10~30",
            },
            {
              src: "https://images.unsplash.com/photo-1609446154807-d56805f0e007?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2lkcyUyMGNyYWZ0aW5nJTIwdG9nZXRoZXJ8ZW58MHx8MHx8fDA%3D",
              alt: "아이와 함께 만들기",
              caption: "출발 전 아이와 DIY — 자석 시트에 인쇄물 붙이기",
            },
            {
              src: "https://images.unsplash.com/photo-1617117206620-b01f2919ff86?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2lkcyUyMGNyYWZ0aW5nJTIwdG9nZXRoZXJ8ZW58MHx8MHx8fDA%3D",
              alt: "만들기 재료들",
              caption: "7세는 직접 그리고, 3세는 붙이기 담당",
            },
            {
              src: "https://images.unsplash.com/photo-1604118464816-5e2bd7b863c2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hbGwlMjBnaWZ0JTIwYmFnc3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "작은 선물 주머니들",
              caption: "피시 익스텐더에 넣는 선물은 $1~5 수준",
            },
            {
              src: "https://images.unsplash.com/photo-1677753727712-c79ce4c420c1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.0.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hbGwlMjBnaWZ0JTIwYmFnc3xlbnwwfHwwfHx8MA%3D%3D",
              alt: "포장된 작은 선물들",
              caption: "모르는 가족에게 받는 깜짝 선물의 재미",
            },
            {
              src: "https://images.unsplash.com/photo-1625768376503-68d2495d78c5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RpY2tlcnMlMjBjcmFmdHxlbnwwfHwwfHx8MA%3D%3D",
              alt: "스티커 모음",
              caption: "픽시더스트용 스티커 — 부담 없는 입문 버전",
            },
            {
              src: "https://images.unsplash.com/photo-1621252756235-7f37e5e5125e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RpY2tlcnMlMjBjcmFmdHxlbnwwfHwwfHx8MA%3D%3D",
              alt: "다양한 스티커들",
              caption: "아이가 직접 고른 스티커를 나눠주는 즐거움",
            },
          ],
        },
        {
          title: "📒 스위티 팁 — 실제 탑승자 정리본 요약",
          intro:
            "실제로 다녀온 분(유튜버 트위티)의 23쪽짜리 정리본과 메뉴 한글 번역본(디즈니 크루즈 패밀리 카페), 객실 테마 시트를 받아서 핵심만 추렸어요. 아래 스크린샷을 누르면 원문 페이지를 크게 볼 수 있고, 원본 파일은 프로젝트의 sweetyref 폴더에 있어요. 항차마다 운영이 조금씩 달라질 수 있다는 게 작성자의 당부.",
          steps: [
            {
              heading: "1 · 온라인 체크인은 '한국시간 새벽 1시' 게임",
              body: "승선 1달 전 셀프 온라인 체크인이 열리는데 미국 동부시간 기준이라 한국시간 새벽 1시경이에요. 여권, 흰 배경 어깨까지 나온 사진(탑승객 전원), 영문 주소를 미리 파일로 준비해 복붙하면 만차 항차에서도 12:15 승선을 잡은 실제 후기가 있어요. 일찍 타면 배에서 점심 먹고 배 구경까지 여유. 아이 동반이면 비행기 연착 대비 전날 싱가포르 도착이 정배예요.",
            },
            {
              heading: "2 · 객실 고르기 — 가든뷰 베란다의 비밀",
              body: "카테고리는 숫자+알파벳(5A 등): 숫자가 등급(1~4 스위트 / 5~6 베란다 / 7~ 스탠다드·인사이드), 알파벳은 위치(A일수록 좋음). 가든뷰 베란다 객실은 대부분의 공연이 열리는 가든 무대를 객실 베란다에서 줄 없이 관람 — 81호는 무대 바로 앞이라 스파이더맨이 하이파이브까지 해줘요(대신 공연 소음과 맞은편 객실 시선은 감수, 커튼 필수). 객실번호 다섯 자리 중 가운데가 홀수면 우현 = 불꽃놀이 방향! 발코니 문을 열면 에어컨이 멈추는 것도 알아두세요.",
            },
            {
              heading: "3 · 객실 테마 시트로 아이 최애 캐릭터 방 노리기",
              body: "객실마다 겨울왕국·모아나·인어공주·라이온킹·니모·스파이더맨·아이언맨·알라딘 등 테마가 정해져 있어요. 받은 엑셀 시트에 카테고리별 테마 매핑이 정리돼 있어서(스위트는 엘사/안나 스위트까지!), 예약 전에 참고하면 문 열자마자 환호성이 나오는 방을 고를 수 있어요.",
            },
            {
              heading: "4 · 식사 공략 — 무료만으로 충분",
              body: "저녁은 로테이션 다이닝(6가지 배정 경우의 수, 승선 후 앱 확인) — 5:45/8:15 2부제인데 아이 가족은 5:45가 정석이라 예약 시 바로 선택하세요(늦으면 대기신청). 무료 맛집: 그램마 탈라스 키친(모아나 할머니 컨셉, 한국인 후기 최고), 스티치스 오하나 그릴(고추장 버거·김치 핫도그!), 피자 플래닛(밤 9시 재오픈 직후가 한산). 룸서비스 조식 무료(카드에 체크해 새벽 3시까지 문에, 하선일 제외), 아이스아메리카노는 17층 바샤 커피머신에서. 영어 메뉴판이 걱정이면 첨부된 손글씨 한글 번역본 10쪽이면 끝이에요.",
            },
            {
              heading: "5 · 공연·캐릭터 그리팅 실전",
              body: "캐릭터 그리팅 예약은 1인당 캐릭터별 1회뿐, 오픈은 첫날 오후 4~5시(안전교육 후 순차) — 예약창이 안 보이면 핸드폰 시간대를 싱가포르로 고정하세요. 뮤지컬 Remember는 항차당 1회 자동배정, 시어터는 40분 전 도착 추천. 모아나 공연(웨이파인더 베이)은 일부러 물을 튀기며 해서 앞줄은 젖어요(수건 무료 제공). 라이온킹 불꽃놀이는 Day2 밤 10:30 우현 방향. 공주님들은 예약 없이 7층 다이아몬드 매장 앞 출몰(오전 8~10시·오후 2~5시). 로얄 게더링엔 다이소 액자(품번 1070933)와 메탈릭 마커(1051642)를 가져가면 액자에 예쁘게 사인을 받아요 — 백설공주에겐 사과를 보여주면 웃으며 스몰챗!",
            },
            {
              heading: "6 · 우리 아이들(7세·3세) 시설 매핑",
              body: "오셔니어 클럽(3~10세, 무료)은 둘 다 입장 가능 — 단 기저귀를 완전히 떼야 해요. 3세가 아직이면 너서리 it's a small world(3세 미만 개념, 30분 $4.5). 수영장: 스플래시 패드는 4세 이하 전용이고 방수기저귀 아이는 여기만 가능, 플라잉 소서는 4~8세, 슬라이드는 키 122cm 이상. 비비디 바비디 부티크(3~12세, 드레스 포함 $230 수준)는 사전예약 필수 — 일찍 잡을수록 드레스를 며칠 입어요. 남자아이 인기 코스는 마블 스타일 스튜디오.",
            },
            {
              heading: "7 · 지갑·짐 꿀팁 모음",
              body: "선내는 완전 무현금(객실 카드로 결제, 미성년자 카드는 결제 불가). 와이파이는 1박 기본 $26/프리미엄 $42, 기기 1대만 — 왓츠앱은 무료로 작동해서 한국인 항차 단톡방(네이버 카페에서 항차 날짜 검색)이 정보 창구예요. 주류 반입은 성인당 와인 1병 또는 맥주 6캔(핸드캐리만). 멀티탭은 압수되니 1구 어댑터로(객실에 220V·USB 콘센트, 전기포트 있음). 셀프세탁 16층($3.5). 굿즈샵은 첫날 저녁 6시 오픈 — 뱃고동 키링은 바코드 끝자리 '212'가 출항 뱃고동 소리예요. 하선 때 싱가포르 입국신고서(SGAC)를 한 번 더 써야 하는 것도 잊지 마세요.",
            },
          ],
          links: [
            {
              label: "유튜버 트위티 — 디즈니 어드벤처 영상 검색",
              url: "https://www.youtube.com/results?search_query=%ED%8A%B8%EC%9C%84%ED%8B%B0+%EB%94%94%EC%A6%88%EB%8B%88+%EC%96%B4%EB%93%9C%EB%B2%A4%EC%B2%98+%ED%81%AC%EB%A3%A8%EC%A6%88",
            },
            {
              label: "디즈니 크루즈 패밀리 카페 검색 (네이버)",
              url: "https://search.naver.com/search.naver?query=%EC%8B%B1%EA%B0%80%ED%8F%AC%EB%A5%B4+%EB%94%94%EC%A6%88%EB%8B%88+%ED%81%AC%EB%A3%A8%EC%A6%88+%ED%8C%A8%EB%B0%80%EB%A6%AC+%EC%B9%B4%ED%8E%98",
            },
          ],
          note: "원본: 디즈니 어드벤처 크루즈 정리 23쪽(by 유튜버 트위티) · 메뉴 한글 번역본 10쪽(디즈니 크루즈 패밀리 카페) · 룸테마 시트 — components/sweetyref 폴더에 보관 중이에요.",
          photos: [
            {
              src: "/sweety/tip-01.jpg",
              alt: "정리본 1쪽 — 예약과 온라인 체크인",
              caption: "p.1 — 예약처·용어·온라인 체크인 총정리",
            },
            {
              src: "/sweety/tip-05.jpg",
              alt: "정리본 5쪽 — 객실 종류",
              caption: "p.5 — 객실 종류별 실물 사진과 특징",
            },
            {
              src: "/sweety/tip-07.jpg",
              alt: "정리본 7쪽 — 배의 주요 시설",
              caption: "p.7 — 층별 시설표 + 비비디 바비디 부티크",
            },
            {
              src: "/sweety/tip-09.jpg",
              alt: "정리본 9쪽 — 수영장과 세탁실",
              caption: "p.9 — 수영장 나이·키 제한 총정리",
            },
            {
              src: "/sweety/tip-11.jpg",
              alt: "정리본 11쪽 — 저녁식사 로테이션",
              caption: "p.11 — 로테이션 다이닝 6개 식당 배정표",
            },
            {
              src: "/sweety/tip-12.jpg",
              alt: "정리본 12쪽 — 무료 식당",
              caption: "p.12 — 무료 식당 리스트와 운영시간",
            },
            {
              src: "/sweety/tip-14.jpg",
              alt: "정리본 14쪽 — 공연 일정표",
              caption: "p.14 — 공연별 요일·시간·좌석 꿀팁 표",
            },
            {
              src: "/sweety/tip-16.jpg",
              alt: "정리본 16쪽 — 액티비티와 포토스팟",
              caption: "p.16 — 액티비티 사전예약 시점 + 포토스팟",
            },
            {
              src: "/sweety/tip-20.jpg",
              alt: "정리본 20쪽 — 와이파이와 반입금지",
              caption: "p.20 — 와이파이 요금·반입금지 물품",
            },
            {
              src: "/sweety/menu-01.jpg",
              alt: "메뉴 한글 번역본",
              caption: "메뉴 손글씨 한글 번역 (전 10쪽 중 1쪽)",
            },
          ],
        },
      ],
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
    subtitle: "사리아 → 산티아고 120km — 둘이 걷는 순례길",
    image:
      "https://images.unsplash.com/photo-1641218356058-1a8988a5135b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtaW5vJTIwZGUlMjBzYW50aWFnb3xlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "산티아고 순례길의 들판과 순례자",
    period: "8박 10일 (걷기 5~6일)",
    costPerFamily: "약 280만원",
    costGroup: "둘이 합계 약 560만원",
    costNote:
      "마드리드 왕복 항공 ~140만, 기차·버스 이동, 알베르게·펜션 8박, 식사·짐 배송 포함 1인 추정",
    flight: "직항 14시간 30분 (마드리드) · 시차 8시간",
    weather: "최적 5~6월·9월 · 12월은 우천·짧은 해로 비추천",
    kidScore: 3,
    kidNote:
      "하루 20km 안팎을 5~6일 연속 — 기술 없이 걷기 체력만 있으면 되는 코스. 출발 전 주말 장거리 걷기로 몸만 만들어 두면 충분해요",
    highlights: [
      "사리아 → 산티아고 마지막 120km (완주 증명서 발급 구간)",
      "노란 화살표와 조개껍데기 따라 걷는 순례자 경험",
      "산티아고 대성당 도착의 감동 + 순례자 미사",
    ],
    pros: [
      "매일 6시간을 나란히 걷는 시간 — 친구와의 여행으로 최적",
      "마을·카페·숙소가 촘촘해 초행에도 가장 안전한 구간",
      "짐 배송 서비스(구간당 4~8유로)로 맨몸 걷기 가능",
    ],
    cons: [
      "5~6일 연속 걷기 체력 필요 (하루 20km 안팎)",
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
        "매일 아침 배낭 대신 물병 하나 들고, 노란 화살표를 따라 걷기만 하면 되는 여행이에요. 갈리시아의 초록 들판과 돌담 마을을 지나며 하루 20km — 도착한 마을의 알베르게에서 순례자 메뉴로 저녁을 먹고, 다음 날 또 걷습니다. 대화가 끊기면 끊긴 대로 좋은 길 — 마지막 날 산티아고 대성당 광장에 서면, 우리 둘 이름이 적힌 라틴어 완주 증명서가 기다려요.",
      notice: {
        title: "이 여행은 12월용이 아니에요",
        items: [
          "갈리시아의 12월은 비가 잦고 해가 짧아요 — 5~6월 또는 9월이 최적 시즌이에요.",
          "성수기(5~9월)엔 사리아 구간 숙소가 빨리 차요 — 알베르게 대신 사설 숙소를 원하면 미리 예약.",
          "완주 증명서는 도보 100km 이상 + 순례자 여권에 하루 2개 이상 스탬프가 조건이에요.",
        ],
        footnote: "붐빔을 피하려면 6월 초·9월 중순이 스윗스팟이에요",
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
          body: "성당·카페·알베르게마다 도장이 달라요 — 여권이 채워질수록 뿌듯함도 쌓여요. 하루 2개 이상이 완주 인정 조건.",
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
          body: "마드리드에서 하루 시차 적응(프라도 미술관·타파스) 후 고속열차+버스로 사리아 이동. 순례자 여권을 만들고 첫 스탬프를 찍는 것으로 여행이 시작돼요.",
        },
        {
          heading: "DAY 3–8 · 걷기 5~6일 — 사리아에서 산티아고까지",
          body: "포르토마린(22km), 팔라스 데 레이(25km), 아르수아, 오 페드로우소… 표준 구간을 그대로 걸어요. 오전에 걷고 오후 2~3시면 마을 도착 — 샤워하고 광장 바에서 맥주 한 잔이 순례길의 공식 루틴이에요.",
        },
        {
          heading: "DAY 9–10 · 산티아고 대성당, 그리고 귀국",
          body: "오브라도이로 광장에 도착해 대성당을 올려다보는 순간이 이 여행의 전부예요. 순례자 사무소에서 완주 증명서를 받고, 저녁은 갈리시아 문어 요리로 자축 — 다음 날 마드리드 경유 귀국.",
        },
      ],
      kids: "매일 6시간을 나란히 걷다 보면 밀린 이야기가 바닥나고, 그때부터가 진짜라고들 해요 — 침묵이 어색하지 않은 사이가 되는 여행. 각자의 페이스가 달라도 괜찮아요. 먼저 도착한 사람이 바에서 기다리면 되니까.",
      tips: [
        "짐 배송(Jacotrans 등) 구간당 4~8유로 — 어깨가 자유로워져요",
        "공립 알베르게(10~15유로)는 현지 감성, 사설은 편안함 — 섞어 자는 게 정답",
        "물집 대비: 발 관리 키트 + 양말 이중으로",
        "출발 전 주말마다 15~20km 걷기 연습 2~3회",
        "5~6월·9월이 최적 시즌 — 6월 초·9월 중순이 가장 한적",
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
    subtitle: "미 서부 국립공원 로드트립 — 둘이서 열이틀",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9zZW1pdGV8ZW58MHx8MHx8fDA%3D",
    imageAlt: "요세미티 밸리의 절경",
    period: "11박 12일 (여름 시즌)",
    costPerFamily: "약 450만원",
    costGroup: "둘이 합계 약 900만원",
    costNote:
      "SF 왕복 항공 ~130만 + 국내선(SFO→보즈먼), 렌터카·연료 셰어, 롯지·모텔 11박(2인 1실), 식비·입장료 포함 1인 추정",
    flight: "직항 10시간 30분 (SF) · 시차 -17시간",
    weather: "최적 6~9월 · 12월엔 옐로스톤 도로 폐쇄 (설상차 투어만)",
    kidScore: 2,
    kidNote:
      "기본은 드라이브 + 가벼운 하이킹. 원하면 미스트 트레일·하프돔(퍼밋 추첨)급으로 난이도를 마음껏 올릴 수 있어요",
    highlights: [
      "요세미티 밸리 — 엘 캐피탄·하프돔·폭포",
      "옐로스톤 올드 페이스풀 간헐천 + 들소 떼",
      "미스트 트레일·하프돔 등 본격 하이킹 선택지",
    ],
    pros: [
      "새벽 일출 사파리부터 밤 별 관측까지 — 어른 페이스로 꽉 채우는 일정",
      "본격 하이킹 선택 가능 (미스트 트레일, 하프돔 퍼밋)",
      "롯지·캠핑·모텔 등 숙소 스타일 선택지 다양",
    ],
    cons: [
      "두 공원 간 1,300km — 국내선 점프 없이는 이동이 여행의 절반",
      "공원 내 숙소는 1년 전 예약 경쟁",
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
        "차창 밖으로 엘 캐피탄의 수직 절벽이 나타나는 순간, 말을 잃는 여행이에요. 요세미티의 화강암 계곡에서 시작해 비행기로 한 번 점프하면, 이번엔 김이 솟는 간헐천과 도로를 막는 들소 떼의 옐로스톤. 새벽엔 야생동물 사파리, 낮엔 트레일, 밤엔 은하수 — 어른 둘이라 가능한 밀도로 채우는 미국식 대자연 로드트립입니다.",
      notice: {
        title: "여름 여행이에요 — 예약 전쟁 미리 알기",
        items: [
          "옐로스톤 주요 도로는 11월~4월 폐쇄 (설상차 투어만 가능) — 6~9월 여행으로 계획해야 해요.",
          "요세미티는 여름 성수기 차량 입장 예약제(사전 예약)를 운영해요 — 공원 내 롯지는 1년 전부터 경쟁.",
          "두 공원은 1,300km 떨어져 있어요 — SFO→보즈먼 국내선(2시간)으로 점프해 운전을 아끼는 게 정답.",
        ],
        footnote: "미국 국립공원 연간 패스(America the Beautiful, $80)로 두 공원 입장료 해결",
      },
      events: [
        {
          name: "미스트 트레일 — 버날 폭포 하이킹",
          period: "봄~가을 · 왕복 3~5시간",
          body: "요세미티 대표 트레일 — 폭포 물보라를 맞으며 오르는 계단길이에요. 체력이 되면 네바다 폭포까지 이어 걷기.",
          url: "https://www.nps.gov/yose/planyourvisit/mist-trail.htm",
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
          heading: "DAY 1–4 · 샌프란시스코 & 요세미티",
          body: "SF에서 하루 시차 적응 후 요세미티로. 첫날은 터널뷰·밸리 드라이브로 몸을 풀고, 둘째 날 미스트 트레일로 본격 하이킹 — 글레이셔 포인트 일몰까지 보면 요세미티는 완성이에요.",
        },
        {
          heading: "DAY 5 · 국내선 점프, 몬태나로",
          body: "SFO에서 보즈먼까지 2시간 비행 — 1,300km 운전을 건너뛰는 핵심 설계예요. 보즈먼에서 렌터카를 다시 받아 옐로스톤 북쪽 게이트로.",
        },
        {
          heading: "DAY 6–10 · 옐로스톤 & 그랜드티턴",
          body: "새벽 라마 밸리에서 들소·엘크 사파리로 하루를 열고, 낮엔 올드 페이스풀과 그랜드 프리즈매틱 — 하루 한 구역씩. 남쪽 그랜드티턴에서 제니 호수 카누와 트레일 하루를 보태면 완벽해요.",
        },
        {
          heading: "DAY 11–12 · 귀국",
          body: "보즈먼 → SF 경유 귀국. 시차가 커서 돌아온 뒤 하루이틀은 일정을 비워두는 게 좋아요.",
        },
      ],
      kids: "운전을 번갈아 하고, 새벽 사파리를 위해 5시에 서로를 깨워주고, 트레일에선 앞뒤로 페이스를 맞추는 — 역할 분담이 되는 둘이라 완성되는 여행이에요. 밤에 롯지 앞에서 맥주 한 캔 들고 은하수 보는 시간이 하이라이트라는 후기가 많아요.",
      tips: [
        "국립공원 연간 패스 America the Beautiful ($80) — 두 공원이면 본전",
        "공원 내 롯지는 1년 전, 늦었다면 게이트 타운 모텔로",
        "하프돔 도전 시 퍼밋 추첨(3월 사전 + 데일리) 필수",
        "음식은 곰 보관함(Bear Box) 규정 필수 준수 · 곰 스프레이 렌트",
        "옐로스톤은 고도 2,400m — 도착 첫날은 가볍게",
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
    subtitle: "올레 7코스 완주 + 감성 스팟 — 둘만의 리셋 여행",
    image:
      "https://images.unsplash.com/photo-1612977512598-3b8d6a498bbb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amVqdSUyMGlzbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "제주 해안의 풍경",
    period: "2박 3일",
    costPerFamily: "약 40만원",
    costGroup: "둘이 합계 약 80만원",
    costNote:
      "국내선 왕복 ~10만, 숙소 2박(2인 1실), 렌터카 셰어 또는 대중교통, 식비·카페 포함 1인 추정",
    flight: "직항 1시간 10분 · 시차 없음",
    weather: "12월 5~11°C · 바람 강함 — 걷기엔 오히려 선선해서 좋아요",
    kidScore: 2,
    kidNote:
      "하루 15~20km 풀코스 완주도 무리 없는 난이도 — 일부 바윗길만 주의하면 운동화로도 충분해요",
    highlights: [
      "올레 7코스 완주 — 올레꾼 선정 최고의 길 (외돌개·돔베낭길)",
      "서건도 '모세의 기적' 바닷길 (간조 체험)",
      "감성 카페 + 느린 우체통 (1년 뒤 도착하는 엽서)",
    ],
    pros: [
      "금요일 퇴근 후 출발 가능한 부담 제로 — 다음 주에도 실행 가능",
      "17.7km 풀코스 완주 + 스탬프 — 성취감 있는 주말",
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
        "아침 비행기를 타면 점심 전에 서귀포 바닷가를 걷고 있는 여행이에요. 올레꾼들이 '최고의 길'로 꼽는 7코스 17.7km를 하루에 완주하고, 지치면 범섬이 보이는 오션뷰 카페로. 간조에 맞추면 서건도까지 바닷길이 열리고, 돔베낭길 빨간 우체통에 넣은 엽서는 1년 뒤 서로의 집에 도착해요. 밀린 이야기를 걷는 속도로 푸는, 둘만의 리셋 여행.",
      notice: {
        title: "12월 제주 걷기 — 준비물이 절반",
        items: [
          "제주의 겨울 바람은 체감온도를 뚝 떨어뜨려요 — 방풍 자켓·비니 필수, 대신 걷기엔 땀 안 나는 최적 온도.",
          "서건도 바닷길은 간조에만 열려요 — 물때표(간조 시간)를 미리 확인하고 일정을 맞추세요.",
          "7코스 일부는 바윗길 — 운동화도 되지만 접지력 좋은 트레킹화가 편해요.",
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
          body: "과수원에서 직접 따서 바구니 가득 — 걷기 끝난 오후의 달콤한 마무리 코스예요.",
        },
        {
          name: "느린 우체통 엽서 쓰기",
          period: "연중 · 7코스 돔베낭길",
          body: "1년 뒤 도착하는 엽서 — '내년의 우리'에게 서로 한 장씩 써서 넣어요.",
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
          heading: "DAY 1 · 금요일 오후 도착, 워밍업",
          body: "오후 비행기로 도착해 서귀포에 짐을 풀어요. 해질녘 칠십리 시공원 산책 — 전망대에서 천지연 폭포와 새연교를 보고, 저녁은 서귀포 매일올레시장에서.",
        },
        {
          heading: "DAY 2 · 올레 7코스 완주의 날",
          body: "아침부터 제주올레 여행자센터에서 출발 — 외돌개, 돔베낭길, 수봉로, 속골을 지나 월평까지 17.7km 풀코스. 중간에 범섬 오션뷰 카페 한 번, 느린 우체통에 엽서 한 장. 완주 스탬프 찍고 저녁은 흑돼지로 자축.",
        },
        {
          heading: "DAY 3 · 간조의 서건도, 그리고 귀국",
          body: "물때가 맞으면 서건도 바닷길을 건너는 '모세의 기적' 체험, 아니면 동백 명소나 감귤밭으로. 오후 비행기로 — 일요일 저녁이면 집이에요.",
        },
      ],
      kids: "직장인 둘에게 최적화된 카드예요 — 연차 없이 주말+하루로 되고, 비용은 회식 두 번 값. 17.7km를 함께 완주하고 나면 '다음엔 산티아고 가자'는 말이 자연스럽게 나오는, 트레일 여행의 입문판입니다.",
      tips: [
        "물때표(간조 시각) 확인 — 서건도는 간조 전후 1~2시간만",
        "올레 패스포트 — 완주 스탬프 모으는 맛이 생각보다 큼",
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
  "비용은 성수기 기준 추정치이며, 인원 기준은 옵션마다 달라요 — 독일: 성인 2 + 아이 1(5세) 3인 총액 · 디즈니 크루즈: 성인 2 + 아이 2(7·3세) 4인 총액 · 나머지 겨울 옵션: 두 가족(어른 4 + 아이 3) 가족당 · 걷기·트레일: 성인 2인 기준 1인당. 실제 가격은 예약 시점·시즌에 따라 크게 달라질 수 있어요.";

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
