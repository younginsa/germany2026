import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CityForecast {
  city: string;
  emoji: string;
  low: number;
  high: number;
  desc: string;
}

/** 출발 전 플레이스홀더 — 12월 독일 남부의 평년 겨울 날씨 */
const FORECAST: CityForecast[] = [
  { city: "프랑크푸르트", emoji: "🌨️", low: -1, high: 4, desc: "눈 조금" },
  { city: "하이델베르크", emoji: "☁️", low: -2, high: 3, desc: "흐림" },
  { city: "로텐부르크", emoji: "❄️", low: -4, high: 1, desc: "눈" },
  { city: "뉘른베르크", emoji: "🌨️", low: -3, high: 2, desc: "눈·흐림" },
  { city: "뮌헨", emoji: "❄️", low: -5, high: 1, desc: "눈" },
];

export function WeatherStrip() {
  return (
    <div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
        {FORECAST.map((f) => (
          <Card
            key={f.city}
            className="flex min-w-[8.5rem] shrink-0 flex-col items-center gap-1 px-4 py-4"
          >
            <span className="text-2xl" aria-hidden>
              {f.emoji}
            </span>
            <p className="text-sm font-semibold tracking-tight">{f.city}</p>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
            <p className="mt-1 text-sm font-medium tabular-nums">
              <span className="text-primary">{f.low}°</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span>{f.high}°</span>
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Info className="h-3 w-3 shrink-0" />
        예보는 출발 2주 전부터 제공됩니다 — 현재는 12월 평년 기온 기준입니다.
      </p>
    </div>
  );
}
