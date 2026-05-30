'use strict';

// Pragmatic email check: one @, a dot in the domain, no whitespace.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/;

// Strip ASCII control chars (0x00-0x1F except tab/LF/CR, plus 0x7F DEL).
// Built from an escaped string so the source stays pure-ASCII.
const CONTROL_RE = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

/** Coerce to a trimmed, control-char-free string, or null if invalid/empty/too long. */
function sanitizeString(value, { max = 1000, min = 1 } = {}) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(CONTROL_RE, '').trim();
  if (cleaned.length < min || cleaned.length > max) return null;
  return cleaned;
}

/** Validate + normalise an email, or null if invalid. */
function sanitizeEmail(value) {
  const s = sanitizeString(value, { max: 254 });
  if (!s) return null;
  const lower = s.toLowerCase();
  return EMAIL_RE.test(lower) ? lower : null;
}

/** YYYY-MM-DD or null. */
function sanitizeDate(value) {
  const s = sanitizeString(value, { max: 10 });
  if (!s || !DATE_RE.test(s)) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : s;
}

/** True only for a plain (non-array, non-null) object — rejects arrays/primitives as bodies. */
function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** One of the allowed string values, or null. */
function sanitizeEnum(value, allowed) {
  return typeof value === 'string' && allowed.includes(value) ? value : null;
}

module.exports = {
  EMAIL_RE,
  sanitizeString,
  sanitizeEmail,
  sanitizeDate,
  sanitizeEnum,
  isPlainObject,
};
