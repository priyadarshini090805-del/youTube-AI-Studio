import { AppHeader } from "@/components/layout/app-header";
import { Dashboard } from "@/features/generation/components/dashboard";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
}
