import { useEffect, useRef } from 'react';
import { useLang } from './LangContext';

const STAT_VALUES = [
  { value: 15000, suffix: '+', fmt: v => v.toLocaleString('it-IT') },
  { value: 3,     suffix: '',  fmt: null },
  { value: 18,    suffix: 'h', fmt: null },
  { value: 24,    suffix: '',  fmt: null },
];

const CSS = `
  .rt2-section { padding: 8rem 0; }

  /* ── Section title — large, red, editorial ── */
  .rt2-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 2rem;
    margin-bottom: 5rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--dim);
  }

  .rt2-h2 {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 9vw, 8rem);
    font-weight: 700;
    color: #FF1F3D;
    line-height: 0.86;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    margin: 0;
  }

  .rt2-header-sub {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--muted);
    max-width: 240px;
    line-height: 1.65;
    text-align: right;
    padding-bottom: 0.4rem;
  }

  /* ── Stats grid: 4 colonne, border-top rosso, celle pulite ── */
  .rt2-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 2px solid #FF1F3D;
    margin-bottom: 7rem;
  }

  .rt2-cell {
    position: relative;
    overflow: hidden;
    padding: 3rem 2rem 3rem 2rem;
    border-right: 1px solid var(--dim);
  }
  .rt2-cell:first-child { padding-left: 0; }
  .rt2-cell:last-child  { border-right: none; padding-right: 0; }

  /* barra rossa animata che scorre dall'alto all'ingresso */
  .rt2-cell::after {
    content: '';
    position: absolute;
    top: -2px; left: 0;
    width: 0; height: 2px;
    background: #FF1F3D;
    transition: width 1.6s cubic-bezier(0.16,1,0.3,1);
  }
  .rt2-cell.rt2-in::after { width: 100%; }
  .rt2-cell > * { position: relative; z-index: 1; }

  /* numero grande */
  .rt2-num-row {
    display: flex;
    align-items: baseline;
    gap: 2px;
    margin-bottom: 1rem;
    line-height: 1;
  }

  .rt2-num {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 5.5vw, 5.5rem);
    font-weight: 700;
    line-height: 1;
    color: #FF1F3D;
    letter-spacing: -0.04em;
  }

  .rt2-suffix {
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 700;
    color: #FF1F3D;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  /* label — blu, uppercase piccolo */
  .rt2-label {
    font-family: var(--font-body);
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 0.5rem;
    display: block;
  }

  /* descrizione — muted */
  .rt2-desc {
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--muted);
    line-height: 1.65;
  }

  /* ── Reviews ── */
  .rt2-rev-header {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--dim);
  }

  .rt2-rev-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 6vw, 5.5rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    color: #FF1F3D;
    line-height: 0.9;
  }

  .rt2-rev-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid var(--dim);
    border-left: 1px solid var(--dim);
  }

  .rt2-rev-card {
    padding: 2.5rem 2rem;
    border-right: 1px solid var(--dim);
    border-bottom: 1px solid var(--dim);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rt2-stars {
    color: #FF1F3D;
    font-size: 0.875rem;
    letter-spacing: 0.12em;
  }

  /* Review text: muted blue, not red */
  .rt2-rev-text {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--muted);
    line-height: 1.75;
    font-style: italic;
    flex: 1;
  }

  .rt2-rev-author {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--dim);
  }
  /* Author name: blue */
  .rt2-rev-author strong {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--white);
  }
  .rt2-rev-author span {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.75rem;
    color: var(--muted);
  }

  @media (max-width: 1024px) {
    .rt2-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    /* seconda colonna non ha border-right */
    .rt2-cell:nth-child(2) { border-right: none; padding-right: 0; }
    /* terza colonna riparte da sinistra come la prima */
    .rt2-cell:nth-child(3) { padding-left: 0; border-right: 1px solid var(--dim); border-top: 1px solid var(--dim); }
    .rt2-cell:nth-child(4) { border-right: none; padding-right: 0; border-top: 1px solid var(--dim); }
    .rt2-rev-grid { grid-template-columns: 1fr; border-left: 0; }
    .rt2-rev-card { border: 1px solid var(--dim); margin-bottom: -1px; }
    .rt2-header { grid-template-columns: 1fr; }
    .rt2-header-sub { text-align: left; max-width: none; }
  }
  @media (max-width: 640px) {
    .rt2-section { padding: 5rem 0; }
    .rt2-cell { padding: 2rem 1.5rem 2rem 1.5rem; }
    .rt2-cell:first-child { padding-left: 0; }
    .rt2-cell:nth-child(2) { padding-right: 0; }
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
  const stats = t.ratings.stats;
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
          const { value, fmt } = STAT_VALUES[i];
          const duration = 2200;
          const start = performance.now();
          (function tick(now) {
            const tt  = Math.min((now - start) / duration, 1);
            const cur = Math.round(easeOutQuart(tt) * value);
            el.textContent = fmt ? fmt(cur) : String(cur);
            if (tt < 1) requestAnimationFrame(tick);
            else el.textContent = fmt ? fmt(value) : String(value);
          })(performance.now());
        });
      },
      { threshold: 0.15 }
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
            <h2 className="rt2-h2">
              {t.ratings.title[0]}<br />{t.ratings.title[1]}
            </h2>
            <p className="rt2-header-sub">{t.about.lead}</p>
          </header>

          <div className="rt2-grid">
            {STAT_VALUES.map((s, i) => (
              <div key={i} className="rt2-cell" ref={el => (cellRefs.current[i] = el)}>
                <div className="rt2-num-row">
                  <span className="rt2-num" ref={el => (numRefs.current[i] = el)}>0</span>
                  {s.suffix && <span className="rt2-suffix">{s.suffix}</span>}
                </div>
                <span className="rt2-label">{stats[i].label}</span>
                <p className="rt2-desc">{stats[i].desc}</p>
              </div>
            ))}
          </div>

          <div className="rt2-rev-header">
            <h3 className="rt2-rev-title">
              {t.ratings.reviewsTitle[0]}<span>{t.ratings.reviewsTitle[1]}</span>
            </h3>
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
