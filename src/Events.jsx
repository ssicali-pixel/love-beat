import { useState, useEffect } from 'react';

export default function Events() {
  const [artists,     setArtists]     = useState([]);
  const [filter,      setFilter]      = useState('all');
  const [scheduleDay, setScheduleDay] = useState('Sabato');
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);

  useEffect(() => {
    fetch('/api/lineup')
      .then(r => r.json())
      .then(({ data }) => { setArtists(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const lineup   = filter === 'all' ? artists : artists.filter(a => a.day === filter);
  const schedule = [...artists.filter(a => a.day === scheduleDay)].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      {/* ── LINE-UP ── */}
      <section className="section section-dark" id="lineup">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">LINE<span>-UP</span></h2>
            <p className="section-desc">I migliori artisti della scena house e techno mondiale.</p>
          </header>

          <div className="filter-tabs" role="group" aria-label="Filtra per giorno">
            {[['all','Tutti'],['Sabato','Sab 14'],['Domenica','Dom 15']].map(([val, label]) => (
              <button
                key={val}
                className={`tab${filter === val ? ' active' : ''}`}
                onClick={() => setFilter(val)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <p className="loading">Caricamento artisti…</p>}
          {error   && <p className="loading">Errore nel caricamento.</p>}

          {!loading && !error && (
            <>
              <div className="lineup-table-header" aria-hidden="true">
                <span className="lineup-col-label">Orario</span>
                <span className="lineup-col-label">Artista</span>
                <span className="lineup-col-label">Genere</span>
                <span className="lineup-col-label">Stage</span>
              </div>
              <div className="lineup-list" role="list">
                {lineup.map(a => (
                  <div className="lineup-row" key={a.name} role="listitem">
                    <span className="lineup-time">{a.time}</span>
                    <span className="lineup-name">{a.name}</span>
                    <span className="lineup-genre">{a.genre}</span>
                    <span className="lineup-stage">{a.stage}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section className="section" id="schedule">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">SCHE<span>DULE</span></h2>
          </header>

          <div className="schedule-tabs" role="group" aria-label="Seleziona giorno">
            {[['Sabato','SAB 14'],['Domenica','DOM 15']].map(([val, label]) => (
              <button
                key={val}
                className={`stab${scheduleDay === val ? ' active' : ''}`}
                onClick={() => setScheduleDay(val)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <p className="loading">Caricamento programma…</p>}

          <div className="schedule-grid" role="list">
            {schedule.map(a => (
              <div className="schedule-item" key={a.name + a.time} role="listitem">
                <span className="schedule-time">{a.time}</span>
                <div>
                  <div className="schedule-name">{a.name}</div>
                  <div className="schedule-genre">{a.genre}</div>
                </div>
                <span className="schedule-stage">{a.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
