"use client";

import { useSyncExternalStore } from "react";
import { dataStream } from "@/lib/dataStream";
import type { DashboardSnapshot } from "@/types/data";

function getServerSnapshot(): DashboardSnapshot | null {
  return null;
}

/**
 * Subscribes the calling component to the simulated realtime data stream.
 * Returns `null` until the stream initializes on the client, so callers can
 * render a skeleton on first paint instead of a hydration mismatch.
 */
export function useLiveData(): DashboardSnapshot | null {
  return useSyncExternalStore(dataStream.subscribe, dataStream.getSnapshot, getServerSnapshot);
}
