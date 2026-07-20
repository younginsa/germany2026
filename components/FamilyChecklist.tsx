'use client';

import { useEffect, useMemo, useState } from 'react';
import { checklistGroups } from '@/data/trip';

type Family = 'familyA' | 'familyB';
type Checks = Record<string, boolean>;

const labels: Record<Family, string> = { familyA: '가족 A', familyB: '가족 B' };

export default function FamilyChecklist() {
  const [family, setFamily] = useState<Family>('familyA');
  const [checks, setChecks] = useState<Record<Family, Checks>>({ familyA: {}, familyB: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('germany2026-checklist');
      if (saved) setChecks(JSON.parse(saved));
    } catch {
      // Corrupted browser storage should never block the trip page.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('germany2026-checklist', JSON.stringify(checks));
  }, [checks, hydrated]);

  const allItems = useMemo(() => checklistGroups.flatMap((group) => group.items.map((item) => `${group.title}:${item}`)), []);
  const completed = allItems.filter((id) => checks[family][id]).length;
  const percent = Math.round((completed / allItems.length) * 100);

  const toggle = (id: string) => {
    setChecks((current) => ({
      ...current,
      [family]: { ...current[family], [id]: !current[family][id] },
    }));
  };

  const reset = () => {
    setChecks((current) => ({ ...current, [family]: {} }));
  };

  return (
    <section id="checklist" className="section shell">
      <div className="sectionHeading">
        <div>
          <span className="eyebrow">각자 저장되는 준비 현황</span>
          <h2>가족별 체크리스트</h2>
        </div>
        <button className="textButton" onClick={reset}>현재 가족 초기화</button>
      </div>

      <div className="familyTabs" role="tablist" aria-label="가족 선택">
        {(Object.keys(labels) as Family[]).map((key) => (
          <button key={key} className={family === key ? 'active' : ''} onClick={() => setFamily(key)}>
            {labels[key]}
          </button>
        ))}
      </div>

      <div className="progressCard">
        <div><strong>{labels[family]}</strong><span>{completed}/{allItems.length} 완료</span></div>
        <div className="progressTrack"><span style={{ width: `${percent}%` }} /></div>
      </div>

      <div className="checkGrid">
        {checklistGroups.map((group) => (
          <article className="checkCard" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map((item) => {
              const id = `${group.title}:${item}`;
              return (
                <label className="checkItem" key={id}>
                  <input type="checkbox" checked={Boolean(checks[family][id])} onChange={() => toggle(id)} />
                  <span>{item}</span>
                </label>
              );
            })}
          </article>
        ))}
      </div>
      <p className="storageNote">체크 상태는 이 브라우저의 localStorage에만 저장됩니다. 가족 A와 가족 B는 같은 기기에서도 별도로 관리됩니다.</p>
    </section>
  );
}
