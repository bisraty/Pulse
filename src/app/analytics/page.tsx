"use client";

import { useLiveData } from "@/hooks/useLiveData";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { TrafficSourcesTable } from "@/components/analytics/TrafficSourcesTable";
import { GeoBreakdown } from "@/components/analytics/GeoBreakdown";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";

export default function AnalyticsPage() {
  const data = useLiveData();

  if (!data) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Conversion funnel, traffic sources, and geographic breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="animate-fade-in" style={{ animationDelay: "60ms" }}>
          <ConversionFunnel funnel={data.funnel} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "120ms" }}>
          <GeoBreakdown geo={data.geo} />
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "180ms" }}>
        <TrafficSourcesTable sources={data.trafficSources} />
      </div>
    </div>
  );
}
