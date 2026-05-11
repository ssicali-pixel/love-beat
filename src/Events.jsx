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
      <section className="section" id="lineup">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Chi suona</p>
            <h2 className="section-title">LINE<span>-UP</span></h2>
            <p className="section-desc">I migliori artisti della scena house mondiale.</p>
          </div>
          <div className="filter-tabs">
            {[['all','Tutti'],['Sabato','Sabato 14'],['Domenica','Domenica 15']].map(([val, label]) => (
              <button key={val} className={`tab${filter === val ? ' active' : ''}`} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>
          <div className="lineup-grid">
            {loading && <p className="loading">Caricamento artisti...</p>}
            {error   && <p className="loading">Errore nel caricamento.</p>}
            {lineup.map(a => (
              <div className="artist-card" key={a.name}>
                <img className="artist-img" src={a.image} alt={a.name} loading="lazy" />
                <div className="artist-info">
                  <p className="artist-genre">{a.genre}</p>
                  <h3 className="artist-name">{a.name}</h3>
                  <p className="artist-bio">{a.bio}</p>
                  <div className="artist-meta">
                    <span className="artist-tag">{a.day}</span>
                    <span className="artist-tag">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark" id="schedule">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Quando</p>
            <h2 className="section-title">SCHE<span>DULE</span></h2>
          </div>
          <div className="schedule-tabs">
            {[['Sabato','SAB 14'],['Domenica','DOM 15']].map(([val, label]) => (
              <button key={val} className={`stab${scheduleDay === val ? ' active' : ''}`} onClick={() => setScheduleDay(val)}>{label}</button>
            ))}
          </div>
          <div className="schedule-grid">
            {loading && <p className="loading">Caricamento programma...</p>}
            {schedule.map(a => (
              <div className="schedule-item" key={a.name + a.time}>
                <div className="schedule-time">{a.time}</div>
                <div><div className="schedule-name">{a.name}</div><div className="schedule-genre">{a.genre}</div></div>
                <span className="schedule-stage">{a.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
