'use strict';

const crypto = require('crypto');

/** Sets conservative security headers on every response (helmet-lite, no dependency). */
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "script-src 'self'",
    "connect-src 'self'",
  ].join('; '));
  next();
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Gates admin/analytics-read endpoints behind DASHBOARD_TOKEN.
 * If the env var is unset the gate is open (local dev) — the server warns at boot.
 * When set, requires a matching `x-dashboard-token` header or `?token=` query value.
 */
function requireDashboardToken(req, res, next) {
  const expected = process.env.DASHBOARD_TOKEN;
  if (!expected) return next();

  const provided = req.get('x-dashboard-token') || req.query.token || '';
  if (provided && safeEqual(provided, expected)) return next();

  return res.status(401).json({ success: false, message: 'Non autorizzato.' });
}

module.exports = { securityHeaders, requireDashboardToken, safeEqual };
