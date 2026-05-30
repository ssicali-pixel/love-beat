'use strict';

/**
 * Lightweight in-memory, per-IP rate limiter (fixed window).
 * Dependency-free — suitable for a single-instance deployment. For multi-instance
 * deployments use a shared store (Redis) instead.
 */
function createRateLimiter({ windowMs, max, message } = {}) {
  if (!windowMs || !max) throw new Error('createRateLimiter requires windowMs and max');

  const hits = new Map(); // key -> { count, resetAt }

  // Evict expired buckets periodically so the map cannot grow unbounded.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, rec] of hits) {
      if (rec.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  if (typeof sweep.unref === 'function') sweep.unref();

  return function rateLimit(req, res, next) {
    const key = (req.ip || req.socket?.remoteAddress || 'unknown').toString();
    const now = Date.now();

    let rec = hits.get(key);
    if (!rec || rec.resetAt <= now) {
      rec = { count: 0, resetAt: now + windowMs };
      hits.set(key, rec);
    }
    rec.count += 1;

    const remaining   = Math.max(0, max - rec.count);
    const resetSeconds = Math.ceil((rec.resetAt - now) / 1000);
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(resetSeconds));

    if (rec.count > max) {
      res.setHeader('Retry-After', String(resetSeconds));
      return res.status(429).json({
        success: false,
        message: message || 'Troppe richieste. Riprova più tardi.',
      });
    }
    next();
  };
}

module.exports = { createRateLimiter };
