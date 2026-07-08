"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { formatKpiValue } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { KpiState } from "@/types/data";

export function KpiCard({ kpi }: { kpi: KpiState }) {
  const animatedValue = useCountUp(kpi.value);
  const isIncreasing = kpi.changePct >= 0;
  // Rising error rate is bad, unlike the other three KPIs — invert the color semantics for it.
  const isGoodDirection = kpi.id === "errorRate" ? !isIncreasing : isIncreasing;
  const TrendIcon = isIncreasing ? TrendingUp : TrendingDown;
  const sparklineData = kpi.history.slice(-30);

  return (
    <Card className="flex flex-col gap-3 p-5">
      <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>

      <div className="flex items-end justify-between gap-4">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {formatKpiValue(animatedValue, kpi.unit)}
        </span>
        <div className="h-10 w-24" aria-hidden="true">
          <Sparkline data={sparklineData} positive={isGoodDirection} />
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          isGoodDirection ? "text-success" : "text-danger"
        )}
      >
        <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>
          {isIncreasing ? "+" : ""}
          {kpi.changePct.toFixed(1)}
          {kpi.unit === "percent" ? "pp" : "%"} vs yesterday
        </span>
      </div>
    </Card>
  );
}
