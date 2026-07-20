import FamilyChecklist from '@/components/FamilyChecklist';
import { days } from '@/data/trip';

const transportRows = [
  ['공동 9인승 렌트', '짐을 한 번에 옮기기 편함', '차량 크기·주차·트렁크 실측 필수'],
  ['가족별 렌트 2대', '일정 분리와 아이 변수 대응이 쉬움', '비용·운전자·주차가 두 배'],
  ['기차 + Uber', '장거리 운전 부담이 적음', '유모차·캐리어·카시트 이동이 복잡'],
];

export default function Home() {
  return (
    <main>
      <header className="hero">
        <nav className="nav shell">
          <a className="brand" href="#top">GERMANY 2026</a>
          <div className="navLinks">
            <a href="#itinerary">일정</a>
            <a href="#transport">이동</a>
            <a href="#checklist">체크리스트</a>
          </div>
        </nav>
        <div id="top" className="heroContent shell">
          <p className="eyebrow">2026.12.18 — 12.27 · 두 가족의 겨울여행</p>
          <h1>아이 셋과 함께하는<br />독일 크리스마스 로드트립</h1>
          <p className="heroCopy">프랑크푸르트 → 로텐부르크 → 뉘른베르크 → 뮌헨 → 프랑크푸르트</p>
          <div className="familyPills"><span>2020년생</span><span>2022년생</span><span>2024년생</span></div>
        </div>
      </header>

      <section className="summary shell">
        <article><strong>10일</strong><span>여행 기간</span></article>
        <article><strong>4개 도시</strong><span>숙박 거점</span></article>
        <article><strong>3명</strong><span>동반 어린이</span></article>
      </section>

      <section id="itinerary" className="section shell">
        <div className="sectionHeading"><div><span className="eyebrow">DAY BY DAY</span><h2>날짜별 일정</h2></div></div>
        <div className="timeline">
          {days.map((day, index) => (
            <article className="dayCard" key={day.date}>
              <div className="dayIndex">{String(index + 1).padStart(2, '0')}</div>
              <div className="dayBody">
                <div className="dayTop"><div><p>{day.date} ({day.day})</p><h3>{day.city}</h3></div><span>{day.stay}</span></div>
                <p className="theme">{day.theme}</p>
                <ul>{day.schedule.map((item) => <li key={item}>{item}</li>)}</ul>
                <div className="detailGrid">
                  <div><h4>음식점 후보</h4>{day.food.map((item) => <p key={item}>{item}</p>)}</div>
                  {day.market && <div><h4>크리스마스마켓</h4><p>{day.market}</p></div>}
                </div>
                {day.note && <p className="note">주의 · {day.note}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="transport" className="section darkSection">
        <div className="shell">
          <div className="sectionHeading"><div><span className="eyebrow">MOVE SMART</span><h2>이동수단 비교</h2></div></div>
          <div className="comparison">
            {transportRows.map(([title, good, caution]) => (
              <article key={title}><h3>{title}</h3><p><b>장점</b>{good}</p><p><b>주의</b>{caution}</p></article>
            ))}
          </div>
          <div className="warningBox">
            <h3>9인승 차량 예약 전 반드시 확인</h3>
            <ul>
              <li>성인과 아이 전원이 탑승한 상태에서 카시트 3개를 설치할 수 있는지</li>
              <li>겨울 외투, 유모차, 대형 캐리어를 실을 실제 트렁크 공간이 남는지</li>
              <li>겨울타이어 포함 여부와 적설 시 스노체인 제공 조건</li>
              <li>완전자차·면책금·유리 및 타이어 보장 범위</li>
              <li>추가 운전자 전원 등록과 국경 이동 조건</li>
            </ul>
          </div>
        </div>
      </section>

      <FamilyChecklist />

      <footer><div className="shell"><strong>GERMANY 2026</strong><p>운영시간과 교통 조건은 출발 직전에 공식 채널에서 다시 확인하세요.</p></div></footer>
    </main>
  );
}
