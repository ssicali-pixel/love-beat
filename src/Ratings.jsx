import { useEffect, useRef } from 'react';
import { useLang } from './LangContext';

const STATS = [
  {
    value: 15000,
    suffix: '+',
    label: 'Partecipanti',
    desc: 'Presenze attese tra il Porto e le Cave del festival',
    fmt: v => v.toLocaleString('it-IT'),
  },
  {
    value: 3,
    suffix: '',
    label: 'Stage',
    desc: "Main, Porto e Cave — tre ambienti, un'unica notte",
    fmt: null,
  },
  {
    value: 18,
    suffix: 'h',
    label: 'Di musica',
    desc: "Dal tramonto all'alba, senza interruzioni",
    fmt: null,
  },
  {
    value: 24,
    suffix: '',
    label: 'DJ Artisti',
    desc: 'House, techno e deep — da tutto il mondo al festival',
    fmt: null,
  },
];

const CSS = `
  .rt2-section { padding: 8rem 0; }

  .rt2-header { margin-bottom: 4rem; }

  .rt2-tag {
    display: block;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.30em;
    text-transform: uppercase;
    color: #FF1F3D;
    margin-bottom: 1.2rem;
  }

  .rt2-h2 {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 700;
    color: #1A78C8;
    line-height: 0.92;
    text-transform: uppercase;
    letter-spacing: -0.03em;
  }

  .rt2-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid rgba(26,120,200,0.12);
    border-left: 1px solid rgba(26,120,200,0.12);
    margin-bottom: 6rem;
  }

  .rt2-cell {
    position: relative;
    overflow: hidden;
    padding: 2.5rem 2rem;
    border-right: 1px solid rgba(26,120,200,0.12);
    border-bottom: 1px solid rgba(26,120,200,0.12);
  }

  .rt2-cell::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,31,61,0.04);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 1.2s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }

  .rt2-cell::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 100%; height: 2px;
    background: #FF1F3D;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 1.4s cubic-bezier(0.16,1,0.3,1) 0.15s;
  }

  .rt2-cell.rt2-in::before { transform: scaleY(1); }
  .rt2-cell.rt2-in::after  { transform: scaleX(1); }

  .rt2-cell > * { position: relative; z-index: 1; }

  .rt2-num-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.75rem;
  }

  .rt2-num {
    font-family: var(--font-display);
    font-size: clamp(48px, 7vw, 64px);
    font-weight: 700;
    line-height: 1;
    color: #1A78C8;
    letter-spacing: -0.03em;
  }

  .rt2-suffix {
    font-family: var(--font-display);
    font-size: clamp(30px, 4.5vw, 42px);
    font-weight: 700;
    color: #FF1F3D;
    line-height: 1;
    letter-spacing: -0.02em;
    margin-left: 3px;
  }

  .rt2-label {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(26,120,200,0.45);
    margin-bottom: 0.85rem;
  }

  .rt2-desc {
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(26,120,200,0.65);
    line-height: 1.65;
  }

  /* ── Reviews ── */
  .rt2-rev-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(26,120,200,0.12);
  }

  .rt2-rev-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 4rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: #1A78C8;
    line-height: 0.92;
  }
  .rt2-rev-title span { color: #FF1F3D; }

  .rt2-rev-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid rgba(26,120,200,0.12);
    border-left: 1px solid rgba(26,120,200,0.12);
  }

  .rt2-rev-card {
    padding: 2.5rem 2rem;
    border-right: 1px solid rgba(26,120,200,0.12);
    border-bottom: 1px solid rgba(26,120,200,0.12);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rt2-stars {
    color: #FF1F3D;
    font-size: 0.875rem;
    letter-spacing: 0.12em;
  }

  .rt2-rev-text {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.9375rem;
    color: rgba(26,120,200,0.82);
    line-height: 1.75;
    font-style: italic;
    flex: 1;
  }

  .rt2-rev-author {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(26,120,200,0.10);
  }
  .rt2-rev-author strong {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #1A78C8;
  }
  .rt2-rev-author span {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.75rem;
    color: rgba(26,120,200,0.50);
  }

  @media (max-width: 1024px) {
    .rt2-rev-grid { grid-template-columns: 1fr; border-left: 0; }
    .rt2-rev-card { border: 1px solid rgba(26,120,200,0.12); margin-bottom: -1px; }
  }
  @media (max-width: 640px) {
    .rt2-section { padding: 5rem 0; }
    .rt2-grid { grid-template-columns: 1fr; margin-bottom: 4rem; }
  }
`;

function Stars({ n, aria }) {
  return (
    <div className="rt2-stars" aria-label={aria}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </div>
  );
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export default function Ratings() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const numRefs    = useRef([]);
  const cellRefs   = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        cellRefs.current.forEach(cell => { if (cell) cell.classList.add('rt2-in'); });

        numRefs.current.forEach((el, i) => {
          if (!el) return;
          const { value, fmt } = STATS[i];
          const duration = 2000;
          const start = performance.now();

          (function tick(now) {
            const t   = Math.min((now - start) / duration, 1);
            const cur = Math.round(easeOutQuart(t) * value);
            el.textContent = fmt ? fmt(cur) : String(cur);
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = fmt ? fmt(value) : String(value);
          })(performance.now());
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className="rt2-section" id="ratings" ref={sectionRef}>
        <div className="container">

          <header className="rt2-header">
            <span className="rt2-tag">South Calling Festival</span>
            <h2 className="rt2-h2">Il festival<br />in numeri.</h2>
          </header>

          <div className="rt2-grid">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="rt2-cell"
                ref={el => (cellRefs.current[i] = el)}
              >
                <div className="rt2-num-row">
                  <span className="rt2-num" ref={el => (numRefs.current[i] = el)}>0</span>
                  {s.suffix && <span className="rt2-suffix">{s.suffix}</span>}
                </div>
                <div className="rt2-label">{s.label}</div>
                <p className="rt2-desc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="rt2-rev-header">
            <h3 className="rt2-rev-title">REVI<span>EWS</span></h3>
          </div>

          <div className="rt2-rev-grid">
            {t.ratings.reviews.map(r => (
              <div className="rt2-rev-card" key={r.name}>
                <Stars n={r.rating} aria={t.ratings.starsAria(r.rating)} />
                <p className="rt2-rev-text">"{r.text}"</p>
                <div className="rt2-rev-author">
                  <strong>{r.name}</strong>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
