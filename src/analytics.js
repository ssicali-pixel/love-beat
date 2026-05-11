const TRACK_URL = '/api/analytics/track';

let sessionId = sessionStorage.getItem('lb_sid');
if (!sessionId) {
  sessionId = Math.random().toString(36).slice(2, 13);
  sessionStorage.setItem('lb_sid', sessionId);
}

const sessionStart = Date.now();

function send(page, action) {
  const payload = JSON.stringify({ page, action, sessionId, timestamp: new Date().toISOString() });
  try {
    navigator.sendBeacon(TRACK_URL, new Blob([payload], { type: 'application/json' }));
  } catch {
    fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackPage(page) {
  send(page, 'pageview');
}

export function trackClick(section) {
  send(section, `click:${section}`);
}

window.addEventListener('beforeunload', () => {
  const secs = Math.round((Date.now() - sessionStart) / 1000);
  send('session', `duration:${secs}`);
});
