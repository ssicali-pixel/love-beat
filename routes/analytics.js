const express = require('express');
const router = express.Router();

const events = [];

function trackEvent({ page, action, sessionId, timestamp }) {
  events.push({
    page: String(page || 'unknown').slice(0, 64),
    action: String(action || 'unknown').slice(0, 64),
    sessionId: String(sessionId || 'anon').slice(0, 64),
    timestamp: timestamp || new Date().toISOString(),
  });
}

function todayPrefix() {
  return new Date().toISOString().slice(0, 10);
}

// POST /api/analytics/track
router.post('/track', (req, res) => {
  const { page, action, sessionId, timestamp } = req.body;
  if (!page || !action) {
    return res.status(400).json({ success: false, message: 'page e action obbligatori.' });
  }
  trackEvent({ page, action, sessionId, timestamp });
  res.json({ success: true });
});

// GET /api/analytics/stats
router.get('/stats', (req, res) => {
  const uniqueVisitors = new Set(events.map(e => e.sessionId)).size;

  const pageCounts = {};
  events
    .filter(e => e.action === 'pageview')
    .forEach(e => { pageCounts[e.page] = (pageCounts[e.page] || 0) + 1; });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([page, views]) => ({ page, views }));

  const clicksBySection = {};
  events
    .filter(e => e.action.startsWith('click:'))
    .forEach(e => {
      const section = e.action.slice(6);
      clicksBySection[section] = (clicksBySection[section] || 0) + 1;
    });
  const totalClicks = Object.values(clicksBySection).reduce((a, b) => a + b, 0);

  const durations = events
    .filter(e => e.action.startsWith('duration:'))
    .map(e => parseInt(e.action.slice(9), 10))
    .filter(n => Number.isFinite(n) && n >= 0 && n < 86400);
  const avgSessionDuration = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0;

  res.json({
    success: true,
    data: { totalVisitors: uniqueVisitors, topPages, totalClicks, clicksBySection, avgSessionDuration },
  });
});

// GET /api/analytics/daily
router.get('/daily', (req, res) => {
  const today = todayPrefix();
  const todayEvents = events.filter(e => e.timestamp.startsWith(today));

  const visitors = new Set(todayEvents.map(e => e.sessionId)).size;

  const clicksBySection = {};
  todayEvents
    .filter(e => e.action.startsWith('click:'))
    .forEach(e => {
      const section = e.action.slice(6);
      clicksBySection[section] = (clicksBySection[section] || 0) + 1;
    });
  const clicks = Object.values(clicksBySection).reduce((a, b) => a + b, 0);

  const newsletterSignups = todayEvents.filter(e => e.action === 'newsletter_signup').length;

  const pageCounts = {};
  todayEvents
    .filter(e => e.action === 'pageview')
    .forEach(e => { pageCounts[e.page] = (pageCounts[e.page] || 0) + 1; });
  const topPage = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  res.json({
    success: true,
    data: { date: today, visitors, clicks, newsletterSignups, clicksBySection, topPage },
  });
});

module.exports = { router, trackEvent };
