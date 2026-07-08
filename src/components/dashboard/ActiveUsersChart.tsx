"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import { downsample } from "@/lib/downsample";
import { formatTimeLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { TimeRange, TimeSeriesPoint } from "@/types/data";

const RANGES: TimeRange[] = ["1H", "24H", "7D", "30D"];

const RANGE_MS: Record<TimeRange, number> = {
  "1H": 60 * 60 * 1000,
  "24H": 24 * 60 * 60 * 1000,
  "7D": 7 * 24 * 60 * 60 * 1000,
  "30D": 30 * 24 * 60 * 60 * 1000,
};

const RANGE_BUCKETS: Record<TimeRange, number> = {
  "1H": 60,
  "24H": 96,
  "7D": 84,
  "30D": 90,
};

export function ActiveUsersChart({ history }: { history: TimeSeriesPoint[] }) {
  const [range, setRange] = useState<TimeRange>("24H");
  const gradientId = useId();

  const data = useMemo(() => {
    const now = history.length > 0 ? history[history.length - 1].time : 0;
    const windowStart = now - RANGE_MS[range];
    const filtered = history.filter((p) => p.time >= windowStart);
    return downsample(filtered, RANGE_BUCKETS[range]).map((p) => ({
      time: p.time,
      value: p.value,
      label: formatTimeLabel(p.time, range),
    }));
  }, [history, range]);

  const trend = data.length > 1 ? data[data.length - 1].value - data[0].value : 0;
  const trendLabel = trend > 0 ? "trending up" : trend < 0 ? "trending down" : "flat";

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">Active users over time</h2>
        <div role="group" aria-label="Time range" className="flex gap-1 rounded-lg border border-border p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                range === r
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div
        className="h-72 w-full"
        role="img"
        aria-label={`Area chart of active users over the last ${range}, currently ${trendLabel}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-accent)"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
