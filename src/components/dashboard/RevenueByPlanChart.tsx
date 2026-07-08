"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { ChartTooltip } from "@/components/dashboard/ChartTooltip";
import { PLAN_LABELS } from "@/lib/fixtures";
import type { PlanTier } from "@/types/data";

const PLAN_ORDER: PlanTier[] = ["free", "pro", "enterprise"];

export function RevenueByPlanChart({ revenueByPlan }: { revenueByPlan: Record<PlanTier, number> }) {
  const data = PLAN_ORDER.map((tier) => ({ tier: PLAN_LABELS[tier], value: revenueByPlan[tier] }));

  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-semibold text-foreground">Revenue by plan tier</h2>
      <div
        className="h-56 w-full"
        role="img"
        aria-label={`Bar chart of monthly revenue by plan tier: ${data
          .map((d) => `${d.tier} $${d.value.toLocaleString("en-US")}`)
          .join(", ")}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="tier"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--color-accent)" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
