import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DataStream } from "./dataStream";

describe("DataStream", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("seeds a full snapshot with 30 days of KPI history on first subscribe", () => {
    const stream = new DataStream();
    stream.subscribe(vi.fn());

    const snapshot = stream.getSnapshot();
    expect(snapshot).not.toBeNull();
    expect(snapshot!.kpis.activeUsers.history.length).toBeGreaterThan(1000);
    expect(snapshot!.kpis.mrr.value).toBeGreaterThan(0);
    expect(snapshot!.team.length).toBeGreaterThan(0);
    expect(snapshot!.trafficSources.length).toBeGreaterThan(0);
  });

  it("returns null from getSnapshot before anyone subscribes", () => {
    const stream = new DataStream();
    expect(stream.getSnapshot()).toBeNull();
  });

  it("emits new data points to subscribers on an interval", () => {
    const stream = new DataStream();
    const listener = vi.fn();
    stream.subscribe(listener);

    const before = stream.getSnapshot()!.kpis.mrr.history;
    const lastPointBefore = before[before.length - 1];

    vi.advanceTimersByTime(5000);

    const after = stream.getSnapshot()!.kpis.mrr.history;
    const lastPointAfter = after[after.length - 1];

    expect(listener).toHaveBeenCalled();
    // The rolling 30-day window trims the oldest point as a new one lands,
    // so length stays constant once full — what should change is the tip.
    expect(lastPointAfter.time).toBeGreaterThan(lastPointBefore.time);
  });

  it("stops emitting once unsubscribed", () => {
    const stream = new DataStream();
    const listener = vi.fn();
    const unsubscribe = stream.subscribe(listener);

    vi.advanceTimersByTime(5000);
    const callsBeforeUnsubscribe = listener.mock.calls.length;
    expect(callsBeforeUnsubscribe).toBeGreaterThan(0);

    unsubscribe();
    vi.advanceTimersByTime(20000);

    expect(listener.mock.calls.length).toBe(callsBeforeUnsubscribe);
  });

  it("supports multiple independent subscribers", () => {
    const stream = new DataStream();
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    stream.subscribe(listenerA);
    const unsubscribeB = stream.subscribe(listenerB);

    vi.advanceTimersByTime(5000);
    expect(listenerA).toHaveBeenCalled();
    expect(listenerB).toHaveBeenCalled();

    unsubscribeB();
    const callsForA = listenerA.mock.calls.length;
    const callsForB = listenerB.mock.calls.length;

    vi.advanceTimersByTime(5000);
    expect(listenerA.mock.calls.length).toBeGreaterThan(callsForA);
    expect(listenerB.mock.calls.length).toBe(callsForB);
  });
});
