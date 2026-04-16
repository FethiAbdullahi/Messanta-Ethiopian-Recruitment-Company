/**
 * Simple in-memory sliding-window rate limiter (per Node process).
 * Good enough to slow abuse on /api/enroll; for strict global limits use Redis/Upstash.
 */
const buckets = new Map<string, number[]>();

function prune(now: number, windowMs: number, stamps: number[]): number[] {
  return stamps.filter((t) => now - t < windowMs);
}

export function rateLimitExceeded(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const prev = buckets.get(key) ?? [];
  const next = prune(now, windowMs, prev);
  next.push(now);
  buckets.set(key, next);
  if (buckets.size > 50_000) {
    for (const [k, v] of buckets) {
      if (prune(now, windowMs, v).length === 0) buckets.delete(k);
    }
  }
  return next.length > max;
}

export function clientIpFromRequest(request: Request): string {
  const h = request.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const real = h.get('x-real-ip')?.trim();
  if (real) return real.slice(0, 128);
  return 'unknown';
}
