import { mulberry32, randomWalkStep, pickRandom, type RandomFn } from "@/lib/rng";
import {
  FAKE_NAMES,
  FAKE_COUNTRIES,
  TEAM_ROSTER,
  TRAFFIC_SOURCE_NAMES,
  GEO_COUNTRIES,
} from "@/lib/fixtures";
import type {
  DashboardSnapshot,
  KpiId,
  KpiState,
  KpiUnit,
  TimeSeriesPoint,
  ActivityEvent,
  ActivityEventType,
  TeamMember,
  PlanTier,
  DeviceType,
  FunnelStage,
  TrafficSource,
  CountryStat,
} from "@/types/data";

/**
 * Simulated realtime data source for the Pulse dashboard.
 *
 * `subscribe()` / `getSnapshot()` mirror the shape React's
 * `useSyncExternalStore` expects, so consuming components never touch a
 * timer or `Math.random` directly — everything goes through `useLiveData()`
 * in `src/hooks/useLiveData.ts`.
 *
 * --- Swapping in Supabase Realtime later ---
 * 1. Replace `initialize()` with an initial fetch (e.g. `supabase.from(...)
 *    .select()`) to populate `this.snapshot` instead of generating it.
 * 2. Replace `scheduleTick()` / `tick()` with a Realtime channel subscription:
 *      supabase.channel("dashboard")
 *        .on("postgres_changes", { event: "*", schema: "public", table: "activity_events" },
 *            (payload) => this.mergeAndNotify(payload))
 *        .subscribe();
 * 3. Keep `subscribe()` and `getSnapshot()` with identical signatures — every
 *    consumer goes through `useLiveData()`, so no component needs to change.
 * 4. Return `() => channel.unsubscribe()` from `subscribe()` instead of the
 *    `clearTimeout` cleanup used below.
 */

const SEED = 1337;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const HISTORY_DAYS = 30;
const MAX_HISTORY_MS = HISTORY_DAYS * DAY_MS;
const SEED_STEP_MS = 5 * MINUTE_MS;
const TICK_MIN_MS = 2000;
const TICK_MAX_MS = 4000;
/**
 * Hard cap on stored activity events, independent of the 7-day time window
 * below. The time window alone only bounds the *seeded* history — during a
 * long-running tab, new events keep landing well inside that window, so
 * without a count cap the array (and the Team page's timeline) would grow
 * unboundedly for as long as the tab stays open.
 */
const MAX_ACTIVITY_EVENTS = 150;

interface KpiConfig {
  label: string;
  unit: KpiUnit;
  start: number;
  volatility: number;
  drift?: number;
  spikeChance?: number;
  spikeMagnitude?: number;
  meanReversion?: number;
  min?: number;
  max?: number;
}

const KPI_CONFIG: Record<KpiId, KpiConfig> = {
  mrr: {
    label: "Revenue (MRR)",
    unit: "currency",
    start: 42_500,
    volatility: 0.004,
    drift: 0.00004,
    spikeChance: 0.01,
    spikeMagnitude: 0.03,
    meanReversion: 0.006,
    min: 0,
  },
  activeUsers: {
    label: "Active Users",
    unit: "count",
    start: 1_850,
    volatility: 0.012,
    spikeChance: 0.015,
    spikeMagnitude: 0.18,
    meanReversion: 0.01,
    min: 0,
  },
  requestsPerMin: {
    label: "Requests/min",
    unit: "count",
    start: 3_200,
    volatility: 0.015,
    spikeChance: 0.02,
    spikeMagnitude: 0.25,
    meanReversion: 0.02,
    min: 0,
  },
  errorRate: {
    label: "Error Rate",
    unit: "percent",
    start: 0.35,
    volatility: 0.03,
    spikeChance: 0.02,
    spikeMagnitude: 2.2,
    meanReversion: 0.03,
    min: 0,
    max: 8,
  },
};

function roundForUnit(value: number, unit: KpiUnit): number {
  return unit === "percent" ? Math.round(value * 100) / 100 : Math.round(value);
}

function seedHistory(random: RandomFn, now: number, config: KpiConfig): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  let value = config.start;
  const start = now - MAX_HISTORY_MS;
  for (let t = start; t <= now; t += SEED_STEP_MS) {
    value = randomWalkStep(value, random, { ...config, baseline: config.start });
    points.push({ time: t, value: roundForUnit(value, config.unit) });
  }
  return points;
}

function findValueNear(history: TimeSeriesPoint[], targetTime: number): number {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].time <= targetTime) return history[i].value;
  }
  return history[0]?.value ?? 0;
}

/**
 * For percent-unit metrics (e.g. error rate), a relative percent-change is
 * misleading near zero (0.3% -> 2.7% reads as "+800%"), so those report a
 * percentage-point delta instead; other units report a relative % change.
 */
function computeChangePct(current: number, history: TimeSeriesPoint[], now: number, unit: KpiUnit): number {
  const prior = findValueNear(history, now - DAY_MS);
  if (unit === "percent") return Math.round((current - prior) * 10) / 10;
  if (!prior) return 0;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

function generateActivityEvent(random: RandomFn, time: number): ActivityEvent {
  const roll = random();
  let type: ActivityEventType;
  let message: string;

  if (roll < 0.22) {
    type = "upgrade";
    message = `${pickRandom(FAKE_NAMES, random)} upgraded to ${pickRandom(["Pro", "Enterprise"] as const, random)}`;
  } else if (roll < 0.45) {
    type = "signup";
    message = `New signup from ${pickRandom(FAKE_COUNTRIES, random)}`;
  } else if (roll < 0.62) {
    type = "trial_started";
    message = `${pickRandom(FAKE_NAMES, random)} started a trial`;
  } else if (roll < 0.78) {
    type = "payment_succeeded";
    message = `Payment received from ${pickRandom(FAKE_NAMES, random)}`;
  } else if (roll < 0.92) {
    type = "payment_failed";
    message = "Payment failed — retrying";
  } else {
    type = "churn";
    message = `${pickRandom(FAKE_NAMES, random)} cancelled their subscription`;
  }

  return { id: `${time}-${Math.floor(random() * 1e9)}`, type, message, time };
}

function seedActivityFeed(random: RandomFn, now: number): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const spanMs = 3 * DAY_MS;
  let t = now - spanMs;
  while (t < now) {
    events.push(generateActivityEvent(random, Math.floor(t)));
    t += (6 + random() * 14) * MINUTE_MS;
  }
  return events.slice(-MAX_ACTIVITY_EVENTS);
}

function seedTeam(random: RandomFn, now: number): TeamMember[] {
  return TEAM_ROSTER.map((member, i) => ({
    ...member,
    online: i < 4,
    lastActiveTime: now - Math.floor(random() * 3 * 60 * MINUTE_MS),
  }));
}

function toggleRandomMember(team: TeamMember[], random: RandomFn, now: number): TeamMember[] {
  const index = Math.floor(random() * team.length);
  return team.map((member, i) =>
    i === index ? { ...member, online: !member.online, lastActiveTime: now } : member
  );
}

function seedFunnel(): FunnelStage[] {
  return [
    { id: "visitors", label: "Visitors", count: 12_400 },
    { id: "signups", label: "Signups", count: 1_860 },
    { id: "trials", label: "Trials", count: 640 },
    { id: "paid", label: "Paid", count: 205 },
  ];
}

function nudgeFunnel(funnel: FunnelStage[], random: RandomFn): FunnelStage[] {
  return funnel.map((stage) => ({
    ...stage,
    count: Math.max(1, Math.round(randomWalkStep(stage.count, random, { volatility: 0.01, min: 1 }))),
  }));
}

const TRAFFIC_SOURCE_BASE: Record<string, { visitors: number; conversionPct: number }> = {
  "Organic Search": { visitors: 5_200, conversionPct: 3.8 },
  Direct: { visitors: 3_100, conversionPct: 4.5 },
  Referral: { visitors: 1_400, conversionPct: 5.1 },
  Social: { visitors: 1_800, conversionPct: 2.2 },
  "Paid Ads": { visitors: 2_600, conversionPct: 3.0 },
  Email: { visitors: 900, conversionPct: 6.4 },
};

function seedTrafficSources(random: RandomFn, now: number): TrafficSource[] {
  const points = 20;
  const stepMs = MAX_HISTORY_MS / points;
  return TRAFFIC_SOURCE_NAMES.map((source) => {
    const base = TRAFFIC_SOURCE_BASE[source];
    let value = base.visitors;
    const history: TimeSeriesPoint[] = [];
    for (let i = 0; i < points; i++) {
      value = randomWalkStep(value, random, { volatility: 0.05, min: 0 });
      history.push({ time: now - MAX_HISTORY_MS + i * stepMs, value: Math.round(value) });
    }
    return { source, visitors: Math.round(value), conversionPct: base.conversionPct, history };
  });
}

function seedGeo(random: RandomFn): CountryStat[] {
  const weights = [0.32, 0.14, 0.11, 0.1, 0.09, 0.08, 0.09, 0.07];
  const total = 14_200;
  return GEO_COUNTRIES.map((country, i) => ({
    country,
    visitors: Math.round(total * weights[i] * (0.9 + random() * 0.2)),
  }));
}

function computeRevenueByPlan(mrr: number, random: RandomFn): Record<PlanTier, number> {
  const shares: Record<PlanTier, number> = { free: 0.04, pro: 0.46, enterprise: 0.5 };
  return {
    free: Math.round(mrr * shares.free * (0.95 + random() * 0.1)),
    pro: Math.round(mrr * shares.pro * (0.95 + random() * 0.1)),
    enterprise: Math.round(mrr * shares.enterprise * (0.95 + random() * 0.1)),
  };
}

function normalizeDeviceWeights(
  weights: Record<DeviceType, number>,
  random: RandomFn
): Record<DeviceType, number> {
  const nudged = {
    desktop: Math.max(1, weights.desktop + (random() - 0.5) * 3),
    mobile: Math.max(1, weights.mobile + (random() - 0.5) * 3),
    tablet: Math.max(1, weights.tablet + (random() - 0.5) * 1.5),
  };
  const total = nudged.desktop + nudged.mobile + nudged.tablet;
  return {
    desktop: Math.round((nudged.desktop / total) * 1000) / 10,
    mobile: Math.round((nudged.mobile / total) * 1000) / 10,
    tablet: Math.round((nudged.tablet / total) * 1000) / 10,
  };
}

type Listener = () => void;

export class DataStream {
  private snapshot: DashboardSnapshot | null = null;
  private listeners = new Set<Listener>();
  private random: RandomFn = mulberry32(SEED);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    if (!this.snapshot) this.initialize();
    if (!this.timeoutId) this.scheduleTick();

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    };
  };

  getSnapshot = (): DashboardSnapshot | null => this.snapshot;

  private initialize() {
    const now = Date.now();
    const random = this.random;

    const kpis = {} as Record<KpiId, KpiState>;
    (Object.keys(KPI_CONFIG) as KpiId[]).forEach((id) => {
      const config = KPI_CONFIG[id];
      const history = seedHistory(random, now, config);
      const value = history[history.length - 1].value;
      kpis[id] = {
        id,
        label: config.label,
        unit: config.unit,
        value,
        changePct: computeChangePct(value, history, now, config.unit),
        history,
      };
    });

    this.snapshot = {
      kpis,
      revenueByPlan: computeRevenueByPlan(kpis.mrr.value, random),
      trafficByDevice: normalizeDeviceWeights({ desktop: 58, mobile: 34, tablet: 8 }, random),
      activityFeed: seedActivityFeed(random, now),
      team: seedTeam(random, now),
      funnel: seedFunnel(),
      trafficSources: seedTrafficSources(random, now),
      geo: seedGeo(random),
    };
  }

  private scheduleTick() {
    const delay = TICK_MIN_MS + this.random() * (TICK_MAX_MS - TICK_MIN_MS);
    this.timeoutId = setTimeout(() => {
      this.tick();
      if (this.listeners.size > 0) this.scheduleTick();
      else this.timeoutId = null;
    }, delay);
  }

  private tick() {
    const prev = this.snapshot;
    if (!prev) return;

    const now = Date.now();
    const random = this.random;

    const kpis = {} as Record<KpiId, KpiState>;
    (Object.keys(KPI_CONFIG) as KpiId[]).forEach((id) => {
      const config = KPI_CONFIG[id];
      const prevKpi = prev.kpis[id];
      const nextValue = roundForUnit(
        randomWalkStep(prevKpi.value, random, {
          ...config,
          volatility: config.volatility / 3,
          baseline: config.start,
        }),
        config.unit
      );
      const history = [...prevKpi.history, { time: now, value: nextValue }].filter(
        (p) => p.time >= now - MAX_HISTORY_MS
      );
      kpis[id] = {
        ...prevKpi,
        value: nextValue,
        history,
        changePct: computeChangePct(nextValue, history, now, config.unit),
      };
    });

    const activityFeed =
      random() < 0.7
        ? [...prev.activityFeed, generateActivityEvent(random, now)]
            .filter((e) => e.time >= now - 7 * DAY_MS)
            .slice(-MAX_ACTIVITY_EVENTS)
        : prev.activityFeed;

    const team = random() < 0.06 ? toggleRandomMember(prev.team, random, now) : prev.team;

    const trafficSources = prev.trafficSources.map((s) => ({
      ...s,
      visitors: Math.round(randomWalkStep(s.visitors, random, { volatility: 0.02, min: 0 })),
      conversionPct:
        Math.round(randomWalkStep(s.conversionPct, random, { volatility: 0.015, min: 0.2, max: 20 }) * 10) /
        10,
    }));

    const geo = prev.geo.map((g) => ({
      ...g,
      visitors: Math.round(randomWalkStep(g.visitors, random, { volatility: 0.015, min: 0 })),
    }));

    this.snapshot = {
      kpis,
      revenueByPlan: computeRevenueByPlan(kpis.mrr.value, random),
      trafficByDevice: normalizeDeviceWeights(prev.trafficByDevice, random),
      activityFeed,
      team,
      funnel: nudgeFunnel(prev.funnel, random),
      trafficSources,
      geo,
    };

    this.listeners.forEach((listener) => listener());
  }
}

export const dataStream = new DataStream();
