export interface TimeSeriesPoint {
  time: number;
  value: number;
}

export type KpiId = "mrr" | "activeUsers" | "requestsPerMin" | "errorRate";

export type KpiUnit = "currency" | "count" | "percent";

export interface KpiState {
  id: KpiId;
  label: string;
  unit: KpiUnit;
  value: number;
  changePct: number;
  history: TimeSeriesPoint[];
}

export type PlanTier = "free" | "pro" | "enterprise";

export type DeviceType = "desktop" | "mobile" | "tablet";

export type ActivityEventType =
  | "upgrade"
  | "signup"
  | "trial_started"
  | "payment_failed"
  | "payment_succeeded"
  | "churn";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  message: string;
  time: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  online: boolean;
  lastActiveTime: number;
}

export type FunnelStageId = "visitors" | "signups" | "trials" | "paid";

export interface FunnelStage {
  id: FunnelStageId;
  label: string;
  count: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  conversionPct: number;
  history: TimeSeriesPoint[];
}

export interface CountryStat {
  country: string;
  visitors: number;
}

export type TimeRange = "1H" | "24H" | "7D" | "30D";

export interface DashboardSnapshot {
  kpis: Record<KpiId, KpiState>;
  revenueByPlan: Record<PlanTier, number>;
  trafficByDevice: Record<DeviceType, number>;
  activityFeed: ActivityEvent[];
  team: TeamMember[];
  funnel: FunnelStage[];
  trafficSources: TrafficSource[];
  geo: CountryStat[];
}
