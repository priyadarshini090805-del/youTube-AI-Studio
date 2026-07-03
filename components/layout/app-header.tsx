import { Clapperboard } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Clapperboard className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">YouTube Editorial Production Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Draft-first newsroom workflow — every output requires editorial approval.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
