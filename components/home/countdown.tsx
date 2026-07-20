"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

interface CountdownProps {
  /** 여행 시작일 (ISO date, 예: "2026-12-18") */
  targetDate: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function partsUntil(target: number, now: number): TimeParts {
  const totalSeconds = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** 출발까지 남은 시간 — 마운트 전에는 "—"를 렌더링해 hydration 불일치를 방지 */
export function Countdown({ targetDate }: CountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(`${targetDate}T00:00:00`).getTime();
  const parts = now === null ? null : partsUntil(target, now);

  const cells: { label: string; value: string }[] = [
    { label: "일", value: parts ? String(parts.days) : "—" },
    { label: "시간", value: parts ? String(parts.hours).padStart(2, "0") : "—" },
    { label: "분", value: parts ? String(parts.minutes).padStart(2, "0") : "—" },
    { label: "초", value: parts ? String(parts.seconds).padStart(2, "0") : "—" },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Plane className="h-4 w-4" />
          출발까지
        </p>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-primary">
          {parts ? `D-${parts.days}` : "D-—"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="glass flex flex-col items-center justify-center rounded-2xl px-2 py-4 shadow-[var(--shadow-soft)] sm:py-5"
          >
            <span className="text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
              {cell.value}
            </span>
            <span className="mt-1 text-xs font-medium text-muted-foreground">
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
