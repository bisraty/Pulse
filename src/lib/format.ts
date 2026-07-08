import type { KpiUnit, TimeRange } from "@/types/data";

export function formatKpiValue(value: number, unit: KpiUnit): string {
  switch (unit) {
    case "currency":
      return `$${Math.round(value).toLocaleString("en-US")}`;
    case "percent":
      return `${value.toFixed(2)}%`;
    case "count":
    default:
      return Math.round(value).toLocaleString("en-US");
  }
}

export function formatTimeLabel(time: number, range: TimeRange): string {
  const date = new Date(time);
  if (range === "1H" || range === "24H") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  if (range === "7D") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatRelativeTime(time: number): string {
  const diffSec = Math.round((Date.now() - time) / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay}d ago`;
}

export function formatDayHeading(time: number): string {
  const date = new Date(time);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function formatTimeOfDay(time: number): string {
  return new Date(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
