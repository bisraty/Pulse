import type { TimeSeriesPoint } from "@/types/data";

/** Averages `points` down to at most `bucketCount` points, preserving order. */
export function downsample(points: TimeSeriesPoint[], bucketCount: number): TimeSeriesPoint[] {
  if (points.length <= bucketCount) return points;

  const bucketSize = points.length / bucketCount;
  const result: TimeSeriesPoint[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const start = Math.floor(i * bucketSize);
    const end = Math.max(start + 1, Math.floor((i + 1) * bucketSize));
    const slice = points.slice(start, end);
    const avgValue = slice.reduce((sum, p) => sum + p.value, 0) / slice.length;
    result.push({ time: slice[slice.length - 1].time, value: Math.round(avgValue) });
  }

  return result;
}
