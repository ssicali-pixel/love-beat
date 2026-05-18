import { useState, useEffect } from 'react';

const FESTIVAL_DATE = new Date('2026-06-14T18:00:00');
const pad = (n) => String(n).padStart(2, '0');

export default function Hero() {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00', started: false });

  useEffect(() => {
    function tick() {
      const diff = FESTIVAL_DATE - new Date();
      if (diff <= 0) { setTime(t => ({ ...t, started: true })); return; }
      setTime({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
        started: false,
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="home">
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-text">14 — 15 Giugno 2026</span>
        <span className="hero-eyebrow-line" />
        <span className="hero-eyebrow-text">Catania</span>
        <span className="hero-eyebrow-line" />
        <span className="hero-eyebrow-text">Catania With Love</span>
      </div>

      <h1 className="hero-title">
        Love<br />
        <span className="hero-title-accent">Beat</span>
      </h1>

      <div className="hero-bottom">
        <p className="hero-subtitle">
          House music festival<br />
          nel cuore di Catania.<br />
          Tre palchi · Dodici ore.
        </p>

        {time.started ? (
          <p className="festival-started">Il festival è iniziato</p>
        ) : (
          <div className="countdown">
            {[['d', 'GG'], ['h', 'HH'], ['m', 'MM'], ['s', 'SS']].map(([k, lbl], i) => (
              <>
                {i > 0 && <span key={`sep-${k}`} className="countdown-sep" aria-hidden="true">:</span>}
                <div className="countdown-item" key={k}>
                  <span>{time[k]}</span>
                  <label>{lbl}</label>
                </div>
              </>
            ))}
          </div>
        )}

        <div className="hero-btns">
          <button className="btn-primary" onClick={() => scrollTo('tickets')}>Biglietti →</button>
          <button className="btn-outline" onClick={() => scrollTo('lineup')}>Line-up</button>
        </div>
      </div>
    </section>
  );
}
