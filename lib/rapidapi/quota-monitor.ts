export interface QuotaStatus {
  provider: string;
  plan: string;
  limit: number;
  remaining: number;
  resetSeconds: number;
  resetAt?: string;
  status: 'active' | 'depleted' | 'offline';
  lastChecked: string;
  latencyMs: number;
  message?: string;
}

// In-memory cache for quota status and circuit-breaker
let cachedQuota: QuotaStatus | null = null;
let lastCheckTime = 0;
const QUOTA_CACHE_TTL_MS = 60 * 1000; // Cache quota status for 60 seconds

export async function getUdyamQuotaStatus(forceRefresh = false): Promise<QuotaStatus> {
  const now = Date.now();
  if (!forceRefresh && cachedQuota && now - lastCheckTime < QUOTA_CACHE_TTL_MS) {
    return cachedQuota;
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST || 'udyam-aadhaar-verification.p.rapidapi.com';

  if (!apiKey) {
    cachedQuota = {
      provider: 'RapidAPI IDfy Udyam',
      plan: 'MOCK_FALLBACK',
      limit: 0,
      remaining: 0,
      resetSeconds: 0,
      status: 'offline',
      lastChecked: new Date().toISOString(),
      latencyMs: 0,
      message: 'RAPIDAPI_KEY not configured. Running in offline fallback mode.',
    };
    lastCheckTime = now;
    return cachedQuota;
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://${apiHost}/v3/tasks?request_id=quota_ping_${Date.now()}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    const limitHeader = res.headers.get('x-ratelimit-requests-limit');
    const remainingHeader = res.headers.get('x-ratelimit-requests-remaining');
    const resetHeader = res.headers.get('x-ratelimit-requests-reset');

    const limit = limitHeader ? parseInt(limitHeader, 10) : 35;
    const remaining = remainingHeader ? parseInt(remainingHeader, 10) : 0;
    const resetSeconds = resetHeader ? parseInt(resetHeader, 10) : 0;

    let resetAt: string | undefined;
    if (resetSeconds > 0) {
      resetAt = new Date(Date.now() + resetSeconds * 1000).toISOString();
    }

    const isDepleted = res.status === 429 || remaining <= 0;

    cachedQuota = {
      provider: 'RapidAPI (IDfy Udyam Verification)',
      plan: 'BASIC',
      limit,
      remaining,
      resetSeconds,
      resetAt,
      status: isDepleted ? 'depleted' : 'active',
      lastChecked: new Date().toISOString(),
      latencyMs,
      message: isDepleted
        ? 'Monthly quota reached (0 calls remaining). Lighthouse circuit-breaker active: instant <5ms fallback mode.'
        : `${remaining} of ${limit} requests remaining in current billing cycle.`,
    };
    lastCheckTime = now;
    return cachedQuota;
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    cachedQuota = {
      provider: 'RapidAPI (IDfy Udyam Verification)',
      plan: 'BASIC',
      limit: 35,
      remaining: 0,
      resetSeconds: 2000000,
      status: 'depleted',
      lastChecked: new Date().toISOString(),
      latencyMs,
      message: 'Gateway rate-limit active. Instant circuit-breaker fallback enabled.',
    };
    lastCheckTime = now;
    return cachedQuota;
  }
}

export function isQuotaDepleted(): boolean {
  if (cachedQuota && cachedQuota.status === 'depleted') {
    return true;
  }
  return false;
}
