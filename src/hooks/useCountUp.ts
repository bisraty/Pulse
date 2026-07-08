"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Animates numeric transitions between values; snaps instantly under prefers-reduced-motion. */
export function useCountUp(value: number, durationMs = 600): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = displayRef.current;
    const delta = value - from;
    if (delta === 0) return;

    const start = performance.now();

    function step(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + delta * eased;
      setDisplay(next);
      displayRef.current = next;
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs, prefersReducedMotion]);

  return prefersReducedMotion ? value : display;
}
