"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useThemeStore } from "@/store/useThemeStore";
import { cn } from "@/lib/cn";
import type { Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
];

export function AppearanceSection() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const syncFromDom = useThemeStore((s) => s.syncFromDom);

  useEffect(() => {
    syncFromDom();
  }, [syncFromDom]);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        <p className="text-xs text-muted-foreground">Choose how Pulse looks on this device.</p>
      </div>
      <div role="radiogroup" aria-label="Theme" className="flex gap-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const selected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
