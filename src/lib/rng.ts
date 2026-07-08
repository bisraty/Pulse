/** Deterministic PRNG (mulberry32) so seeded history is reproducible across runs. */
export function mulberry32(seed: number) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RandomFn = () => number;

interface RandomWalkOptions {
  /** Standard deviation of each step, relative to current value. */
  volatility: number;
  /** Slow drift applied per step, relative to current value (e.g. gentle growth). */
  drift?: number;
  min?: number;
  max?: number;
  /** Probability per step of a larger one-off spike/dip for visual interest. */
  spikeChance?: number;
  spikeMagnitude?: number;
  /**
   * Pull-back-to-baseline strength per step (0-1). Without this, a purely
   * multiplicative walk can drift unboundedly or get stuck near a `min`/`max`
   * clamp over thousands of compounding steps — this keeps it wandering
   * around a realistic baseline instead.
   */
  meanReversion?: number;
  /** Anchor point for `meanReversion`; defaults to the metric's starting value. */
  baseline?: number;
}

/** One random-walk step from `value`, clamped to [min, max]. */
export function randomWalkStep(value: number, random: RandomFn, opts: RandomWalkOptions): number {
  const {
    volatility,
    drift = 0,
    min = -Infinity,
    max = Infinity,
    spikeChance = 0,
    spikeMagnitude = 0,
    meanReversion = 0,
    baseline = value,
  } = opts;

  const gaussian = (random() + random() + random() - 1.5) / 1.5;
  let next = value * (1 + drift) + value * volatility * gaussian;
  next += (baseline - value) * meanReversion;

  if (spikeChance > 0 && random() < spikeChance) {
    const direction = random() > 0.5 ? 1 : -1;
    next += value * spikeMagnitude * direction * (0.5 + random());
  }

  return Math.min(max, Math.max(min, next));
}

export function pickRandom<T>(items: readonly T[], random: RandomFn): T {
  return items[Math.floor(random() * items.length)];
}
