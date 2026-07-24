import { TopNav } from "@/components/layout/top-nav";
import { MapSwitchCta } from "@/components/layout/map-switch-cta";
import { MaterialsCta } from "@/components/layout/materials-cta";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh">
        <TopNav />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
          {children}
        </main>
        <MapSwitchCta />
        <MaterialsCta />
      </div>
    </AuthGuard>
  );
}
