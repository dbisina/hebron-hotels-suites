// In-memory rate limiter. For production, replace with Redis + @upstash/ratelimit.

interface Bucket {
  count: number;
  reset: number;
}

const store = new Map<string, Bucket>();

// Clean stale entries every 5 minutes to avoid memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (v.reset < now) store.delete(k);
    }
  }, 300_000);
}

/**
 * Returns true if the request should be blocked.
 * @param key   e.g. `"login:" + ip`
 * @param limit max requests per window
 * @param windowMs window in ms
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return false;
  }

  bucket.count++;
  if (bucket.count > limit) return true;
  return false;
}
