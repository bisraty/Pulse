import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <label htmlFor="dashboard-search" className="sr-only">
          Search
        </label>
        <input
          id="dashboard-search"
          type="search"
          placeholder="Search…"
          className="w-full rounded-lg border border-border bg-muted/60 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center  gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
