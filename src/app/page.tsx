"use client";

import { useLiveData } from "@/hooks/useLiveData";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ActiveUsersChart } from "@/components/dashboard/ActiveUsersChart";
import { RevenueByPlanChart } from "@/components/dashboard/RevenueByPlanChart";
import { DeviceDonutChart } from "@/components/dashboard/DeviceDonutChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TeamPresenceStrip } from "@/components/dashboard/TeamPresenceStrip";
import { OverviewSkeleton } from "@/components/dashboard/OverviewSkeleton";
import type { KpiId } from "@/types/data";

const KPI_ORDER: KpiId[] = ["mrr", "activeUsers", "requestsPerMin", "errorRate"];

export default function OverviewPage() {
  const data = useLiveData();

  if (!data) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Live metrics for Pulse, updating in real time.</p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "60ms" }}>
        <TeamPresenceStrip team={data.team} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_ORDER.map((id, i) => (
          <div key={id} className="animate-fade-in" style={{ animationDelay: `${120 + i * 60}ms` }}>
            <KpiCard kpi={data.kpis[id]} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:grid-rows-2">
        <div className="animate-fade-in xl:col-span-2" style={{ animationDelay: "360ms" }}>
          <ActiveUsersChart history={data.kpis.activeUsers.history} />
        </div>
        <div className="animate-fade-in xl:row-span-2" style={{ animationDelay: "420ms" }}>
          <ActivityFeed events={data.activityFeed} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "480ms" }}>
          <RevenueByPlanChart revenueByPlan={data.revenueByPlan} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "540ms" }}>
          <DeviceDonutChart trafficByDevice={data.trafficByDevice} />
        </div>
      </div>
    </div>
  );
}
