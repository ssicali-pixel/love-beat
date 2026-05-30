(function () {
  'use strict';

  // Forward the dashboard token (from ?token=… in the URL) to the gated
  // analytics endpoints so the page works when DASHBOARD_TOKEN is set.
  var token   = new URLSearchParams(location.search).get('token') || '';
  var headers = token ? { 'x-dashboard-token': token } : {};

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function set(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  async function load() {
    try {
      const [daily, stats] = await Promise.all([
        fetch('/api/analytics/daily', { headers: headers }).then(function (r) { return r.json(); }),
        fetch('/api/analytics/stats', { headers: headers }).then(function (r) { return r.json(); }),
      ]);

      if (daily && daily.success) {
        var d = daily.data;
        set('stat-visitors', d.visitors);
        set('stat-top-page', String(d.topPage).toUpperCase());
        set('stat-newsletter', d.newsletterSignups);
        set('stat-clicks-today', d.clicks);

        var chartEl = document.getElementById('clicks-chart');
        var sections = Object.entries(d.clicksBySection).sort(function (a, b) { return b[1] - a[1]; });
        if (sections.length === 0) {
          chartEl.innerHTML = '<p class="empty">Nessun click ancora oggi.</p>';
        } else {
          var max = Math.max.apply(null, sections.map(function (e) { return e[1]; }));
          chartEl.innerHTML = sections.map(function (entry) {
            var sec = entry[0], count = entry[1];
            return '' +
              '<div class="bar-row">' +
                '<span class="bar-label">' + esc(sec) + '</span>' +
                '<div class="bar-track">' +
                  '<div class="bar-fill" style="width:' + Math.round(count / max * 100) + '%"></div>' +
                '</div>' +
                '<span class="bar-count">' + Number(count) + '</span>' +
              '</div>';
          }).join('');
        }
      }

      if (stats && stats.success) {
        var s = stats.data;
        set('stat-total-visitors', s.totalVisitors);
        set('stat-avg-duration', s.avgSessionDuration);
        set('stat-total-clicks', s.totalClicks);

        var pagesEl = document.getElementById('top-pages');
        if (s.topPages.length === 0) {
          pagesEl.innerHTML = '<p class="empty">Nessuna visita ancora.</p>';
        } else {
          pagesEl.innerHTML = s.topPages.slice(0, 8).map(function (p, i) {
            return '' +
              '<div class="page-row">' +
                '<span>' +
                  '<span class="page-rank">#' + (i + 1) + '</span>' +
                  '<span class="page-name">' + esc(p.page) + '</span>' +
                '</span>' +
                '<span class="page-views">' + Number(p.views) + ' views</span>' +
              '</div>';
          }).join('');
        }
      }

      set('last-updated', 'Aggiornato: ' + new Date().toLocaleTimeString('it-IT'));
    } catch (err) {
      set('last-updated', 'Errore nel caricamento');
      console.error(err);
    }
  }

  var btn = document.getElementById('refresh-btn');
  if (btn) btn.addEventListener('click', load);

  load();
  setInterval(load, 30000);
})();
