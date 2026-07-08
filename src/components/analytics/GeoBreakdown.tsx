"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import type { CountryStat } from "@/types/data";

export function GeoBreakdown({ geo }: { geo: CountryStat[] }) {
  const data = [...geo].sort((a, b) => b.visitors - a.visitors);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-semibold text-foreground">Visitors by country</h2>
      <div
        className="h-72 w-full"
        role="img"
        aria-label={`Bar chart of visitors by country: ${data
          .map((d) => `${d.country} ${d.visitors.toLocaleString("en-US")}`)
          .join(", ")}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="country"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
            <Bar dataKey="visitors" radius={[0, 6, 6, 0]} fill="var(--color-accent)" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
