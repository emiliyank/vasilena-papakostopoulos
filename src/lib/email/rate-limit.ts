const hits = new Map<string, number[]>();

/** Simple in-memory rate limit. Suitable for a low-traffic portfolio. */
export function isRateLimited(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}
