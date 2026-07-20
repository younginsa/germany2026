import { TopNav } from "@/components/layout/top-nav";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { MapSwitchCta } from "@/components/layout/map-switch-cta";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-24">
        {children}
      </main>
      <MapSwitchCta />
      <BottomTabs />
    </div>
  );
}
