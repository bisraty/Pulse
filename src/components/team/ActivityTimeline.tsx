import { Card } from "@/components/ui/Card";
import { formatDayHeading, formatTimeOfDay } from "@/lib/format";
import { EVENT_COLOR, EVENT_ICON } from "@/lib/activityEventStyles";
import { cn } from "@/lib/cn";
import type { ActivityEvent } from "@/types/data";

interface DayGroup {
  day: number;
  events: ActivityEvent[];
}

function groupByDay(events: ActivityEvent[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  [...events].reverse().forEach((event) => {
    const key = new Date(event.time).toDateString();
    const group = groups.get(key);
    if (group) {
      group.events.push(event);
    } else {
      groups.set(key, { day: event.time, events: [event] });
    }
  });

  return Array.from(groups.values());
}

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  const groups = groupByDay(events);

  return (
    <Card className="flex max-h-160 flex-col gap-4 p-5">
      <h2 className="text-sm font-semibold text-foreground">Activity timeline</h2>
      <div
        tabIndex={0}
        aria-label="Activity timeline, grouped by day"
        className="flex flex-col gap-6 overflow-y-auto pr-1"
      >
        {groups.map((group) => (
          <div key={group.day} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {formatDayHeading(group.day)}
            </h3>
            <ul className="flex flex-col gap-1">
              {group.events.map((event) => {
                const Icon = EVENT_ICON[event.type];
                return (
                  <li key={event.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm">
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", EVENT_COLOR[event.type])} aria-hidden="true" />
                    <div className="flex-1">
                      <p className="text-foreground">{event.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeOfDay(event.time)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
