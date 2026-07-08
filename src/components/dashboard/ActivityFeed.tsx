import { Card } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/format";
import { EVENT_COLOR, EVENT_ICON } from "@/lib/activityEventStyles";
import { cn } from "@/lib/cn";
import type { ActivityEvent } from "@/types/data";

const MAX_VISIBLE = 20;

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  const recent = events.slice(-MAX_VISIBLE).reverse();

  return (
    <Card className="flex max-h-[620px] flex-col gap-3 p-5">
      <h2 className="text-sm font-semibold text-foreground">Live activity</h2>
      <ul
        aria-live="polite"
        aria-label="Live activity feed"
        tabIndex={0}
        className="flex h-full flex-col gap-1 overflow-y-auto pr-1"
      >
        {recent.map((event) => {
          const Icon = EVENT_ICON[event.type];
          return (
            <li
              key={event.id}
              className="animate-feed-item flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm"
            >
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", EVENT_COLOR[event.type])} aria-hidden="true" />
              <div className="flex-1">
                <p className="text-foreground">{event.message}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(event.time)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
