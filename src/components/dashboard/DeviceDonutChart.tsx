"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import type { DeviceType } from "@/types/data";

const DEVICE_ORDER: DeviceType[] = ["desktop", "mobile", "tablet"];

const DEVICE_LABELS: Record<DeviceType, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
};

const DEVICE_COLORS: Record<DeviceType, string> = {
  desktop: "var(--color-accent)",
  mobile: "var(--color-success)",
  tablet: "var(--color-muted-foreground)",
};

export function DeviceDonutChart({ trafficByDevice }: { trafficByDevice: Record<DeviceType, number> }) {
  const data = DEVICE_ORDER.map((device) => ({
    key: device,
    device: DEVICE_LABELS[device],
    value: trafficByDevice[device],
  }));

  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-semibold text-foreground">Traffic by device</h2>
      <div className="flex items-center gap-6">
        <div
          className="h-40 w-40 shrink-0"
          role="img"
          aria-label={`Donut chart of traffic by device: ${data
            .map((d) => `${d.device} ${d.value}%`)
            .join(", ")}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="device"
                innerRadius="65%"
                outerRadius="100%"
                paddingAngle={2}
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={DEVICE_COLORS[entry.key]} stroke="var(--color-card)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {data.map((entry) => (
            <li key={entry.key} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: DEVICE_COLORS[entry.key] }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{entry.device}</span>
              <span className="font-medium text-foreground">{entry.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
