import { CloudRain, Sun, Waves, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** 12월 싱가포르 평년 날씨 — 시내(도착·하선) · 해상(크루즈 4박) */
const WEATHER: { city: string; icon: LucideIcon; low: number; high: number; desc: string }[] = [
  { city: "싱가포르 시내", icon: CloudRain, low: 24, high: 31, desc: "습함 · 오후 스콜" },
  { city: "해상 (크루즈)", icon: Waves, low: 25, high: 30, desc: "바람 · 구름 조금" },
];

/** 싱가포르 날씨 카드 — 시내와 해상을 나란히 표시 */
export function WeatherCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-primary" />
          싱가포르 날씨
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
