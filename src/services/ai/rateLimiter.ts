/**
 * Client-Side Agricultural API & Inference Rate Limiter (§56)
 * Prevents automated script abuse, rapid-fire prompt flooding, and denial-of-service.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

export interface RateLimitOptions {
  key?: string;
  maxRequests?: number;
  windowMs?: number;
}

export function checkRateLimit(options: RateLimitOptions = {}): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
} {
  const key = options.key || 'default_client';
  const maxRequests = options.maxRequests || 20; // 20 requests
  const windowMs = options.windowMs || 60 * 1000; // per 1 minute window

  const now = Date.now();
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { timestamps: [] };
  }

  // Filter out timestamps outside the sliding window
  const validTimestamps = rateLimitStore[key].timestamps.filter(
    (timestamp) => now - timestamp < windowMs
  );

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterMs = windowMs - (now - oldestTimestamp);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  validTimestamps.push(now);
  rateLimitStore[key].timestamps = validTimestamps;

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
  };
}

export function resetRateLimit(key: string = 'default_client'): void {
  delete rateLimitStore[key];
}
