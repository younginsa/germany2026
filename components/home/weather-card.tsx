import { CloudSnow, Snowflake, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** 12월 독일 평년 날씨 — 프랑크푸르트(도착) · 뮌헨(마지막) */
const WEATHER: { city: string; icon: LucideIcon; low: number; high: number; desc: string }[] = [
  { city: "프랑크푸르트", icon: CloudSnow, low: -1, high: 4, desc: "눈 조금" },
  { city: "뮌헨", icon: Snowflake, low: -5, high: 1, desc: "눈" },
];

/** 독일 날씨 카드 — 두 도시를 나란히 표시 */
export function WeatherCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Snowflake className="h-4 w-4 text-primary" />
          독일 날씨
        </CardTitle>
        <span className="text-xs font-medium text-muted-foreground">12월 평년</span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {WEATHER.map((w) => (
            <div
              key={w.city}
              className="flex flex-col items-center gap-1 rounded-xl bg-secondary/50 px-3 py-3"
            >
              <w.icon className="h-6 w-6 text-primary" aria-hidden />
              <p className="text-sm font-semibold tracking-tight">{w.city}</p>
              <p className="text-xs text-muted-foreground">{w.desc}</p>
              <p className="text-sm font-medium tabular-nums">
                <span className="font-semibold">{w.high}°</span>
                <span className="text-muted-foreground"> / {w.low}°</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
