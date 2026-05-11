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
      <div className="hero-bg" />
      <div className="hero-content">
        <img className="hero-logo" src="/fonts/images/Lovebeat.svg" alt="Lovebeat" />
        <p className="hero-pretitle">14 &mdash; 15 GIUGNO 2026 &bull; MILANO</p>
        <h1 className="hero-title">HOUSE FESTIVAL</h1>
        <p className="hero-subtitle">Il festival house che fa battere il cuore della città</p>
        <div className="countdown">
          {time.started ? (
            <p className="festival-started">IL FESTIVAL È INIZIATO!</p>
          ) : (
            [['d','Giorni'],['h','Ore'],['m','Minuti'],['s','Secondi']].map(([k, label]) => (
              <div className="countdown-item" key={k}>
                <span>{time[k]}</span>
                <label>{label}</label>
              </div>
            ))
          )}
        </div>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => scrollTo('tickets')}>PRENDI IL PASS</button>
          <button className="btn-outline" onClick={() => scrollTo('lineup')}>SCOPRI LA LINE-UP</button>
        </div>
      </div>
      <div className="hero-scroll"><span>SCROLL</span><div className="scroll-line" /></div>
    </section>
  );
}
