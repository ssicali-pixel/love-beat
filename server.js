const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const { loadEnv } = require('./config/env');
loadEnv();

const apiRoutes = require('./routes/api');
const { createRateLimiter } = require('./middleware/rateLimit');
const { securityHeaders, requireDashboardToken } = require('./middleware/security');

const app  = express();
const PORT = process.env.PORT || 3000;

// Only trust X-Forwarded-For when explicitly running behind a trusted proxy,
// otherwise clients could spoof their IP and bypass the rate limiter.
app.set('trust proxy', Number(process.env.TRUST_PROXY) || false);
app.disable('x-powered-by');

// Security headers on every response
app.use(securityHeaders);

// CORS — same-origin only by default; opt into cross-origin via CORS_ORIGINS
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: corsOrigins.length ? corsOrigins : false,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 204,
}));

// Body parsing with hard size caps (reject oversized payloads early)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Global API rate limit (per IP)
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Troppe richieste. Riprova tra qualche minuto.',
});
app.use('/api', apiLimiter, apiRoutes);

// Analytics dashboard (and its raw HTML) — gated behind DASHBOARD_TOKEN
app.get(['/dashboard', '/dashboard.html'], requireDashboardToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.get('/dashboard.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.js'));
});

// In production serve the Vite build; in dev Vite runs separately and proxies /api
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Centralised error handler — catches body-parser failures (malformed / oversized)
// and any downstream errors, without leaking internals.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err) return next();
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Payload troppo grande.' });
  }
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ success: false, message: 'JSON malformato.' });
  }
  console.error('[ERROR]', err.message);
  return res.status(500).json({ success: false, message: 'Errore interno.' });
});

if (!process.env.DASHBOARD_TOKEN) {
  console.warn('[WARN] DASHBOARD_TOKEN non impostato: /dashboard e gli endpoint analytics di lettura sono pubblici. Imposta DASHBOARD_TOKEN in .env per proteggerli in produzione.');
}

app.listen(PORT, () => {
  console.log(`LOVEBEAT API running on http://localhost:${PORT}`);
});
