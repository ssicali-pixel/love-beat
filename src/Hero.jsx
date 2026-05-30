import { useEffect, useRef } from 'react';
import { useLang } from './LangContext';
import { TAPPE } from './data/festival';

const LINE1 = 'South'.split('');
const LINE2 = 'Calling'.split('');

const CSS = `
  /* ── SHELL — light editorial hero on the original cream background ─────── */
  .sc-hero {
    position: relative;
    min-height: 100svh;
    background: var(--surface);
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: clamp(2rem, 5vw, 5rem);
    padding: 7.5rem clamp(1.5rem, 5vw, 4.5rem) 4rem;
    overflow: hidden;
  }

  /* ── LEFT — text column, strict vertical hierarchy ────────────────────── */
  .sc-hero-content {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 640px;
  }

  /* 1 · eyebrow */
  .sc-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.6875rem;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 2.25rem;
    opacity: 0;
    animation: festival-sub-in 0.9s ease 1.35s forwards;
  }
  .sc-hero-tag::before {
    content: '';
    width: 32px; height: 2px;
    background: var(--accent);
    display: inline-block;
  }

  /* 2 · primary — the title */
  .sc-hero-title {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(3.2rem, 9vw, 8.5rem);
    line-height: 0.86;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    margin: 0;
  }
  .sc-hero-line { display: block; }
  .sc-hero-line.sc-line-1 { color: var(--white); }
  .sc-hero-line.sc-accent { color: var(--accent); }
  .sc-hero-char { display: inline-block; }

  /* 3 · secondary — lede */
  .sc-hero-lede {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: clamp(0.95rem, 1.4vw, 1.0625rem);
    line-height: 1.75;
    color: var(--muted);
    max-width: 30rem;
    margin-top: 2.25rem;
    opacity: 0;
    animation: festival-sub-in 0.9s ease 1.7s forwards;
  }

  /* 4 · tertiary — next stop + CTA, clearly detached by a rule */
  .sc-hero-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem 2.5rem;
    width: 100%;
    max-width: 32rem;
    margin-top: 2.75rem;
    padding-top: 2rem;
    border-top: 1px solid var(--dim);
    opacity: 0;
    animation: festival-sub-in 0.9s ease 1.95s forwards;
  }
  .sc-hero-next {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .sc-hero-next-label {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.625rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .sc-hero-next-city {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.375rem;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    color: var(--white);
    line-height: 1;
  }
  .sc-hero-next-dates {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.8125rem;
    letter-spacing: 0.02em;
    color: var(--accent);
  }
  .sc-hero-actions .btn-primary { flex-shrink: 0; }

  /* tour strip — the four cities, low in the hierarchy */
  .sc-hero-tour {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.9rem;
    margin-top: 1.75rem;
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.625rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0;
    animation: festival-sub-in 0.9s ease 2.15s forwards;
  }
  .sc-hero-tour span:not(:last-child)::after {
    content: '·';
    margin-left: 0.9rem;
    color: var(--accent);
  }

  /* ── RIGHT — contained framed photo (no full-bleed black) ─────────────── */
  .sc-hero-visual {
    grid-column: 2;
    position: relative;
    align-self: stretch;
    margin: 1.5rem 0;
    border-radius: 4px;
    overflow: hidden;
    min-height: 62vh;
    box-shadow: 0 30px 70px rgba(26, 120, 200, 0.18);
    opacity: 0;
    animation: sc-visual-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  }
  .sc-hero-visual-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 38%;
    display: block;
  }
  @keyframes sc-visual-in {
    from { opacity: 0; transform: translateX(28px) scale(1.04); }
    to   { opacity: 1; transform: translateX(0)    scale(1);    }
  }

  /* ── Responsive — stack, photo below text ────────────────────────────── */
  @media (max-width: 900px) {
    .sc-hero {
      grid-template-columns: 1fr;
      align-items: start;
      padding-top: 6.5rem;
    }
    .sc-hero-content { grid-column: 1; max-width: none; order: 1; }
    .sc-hero-visual  { grid-column: 1; order: 2; min-height: 40vh; margin-top: 2.5rem; }
  }
`;

export default function Hero() {
  const { t } = useLang();
  const charRefs = useRef([]);

  useEffect(() => {
    const chars  = charRefs.current.filter(Boolean);
    const timers = [];

    chars.forEach((el, i) => {
      const t1 = setTimeout(() => {
        el.style.transition = 'transform 0.45s cubic-bezier(0.4,0,1,1)';
        el.style.transform  = 'translateY(40px)';
        const t2 = setTimeout(() => {
          el.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
          el.style.transform  = 'translateY(0)';
        }, 450);
        timers.push(t2);
      }, i * 55);
      timers.push(t1);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const next = TAPPE[0];

  return (
    <>
      <style>{CSS}</style>
      <section className="sc-hero" id="home">

        {/* LEFT — text */}
        <div className="sc-hero-content">
          <span className="sc-hero-tag">{t.hero.tag}</span>

          <h1 className="sc-hero-title">
            <span className="sc-hero-line sc-line-1">
              {LINE1.map((c, i) => (
                <span
                  key={i}
                  className="sc-hero-char"
                  ref={el => (charRefs.current[i] = el)}
                  style={{ transform: 'translateY(-120vh)' }}
                >{c}</span>
              ))}
            </span>
            <span className="sc-hero-line sc-accent">
              {LINE2.map((c, i) => (
                <span
                  key={i}
                  className="sc-hero-char"
                  ref={el => (charRefs.current[LINE1.length + i] = el)}
                  style={{ transform: 'translateY(-120vh)' }}
                >{c}</span>
              ))}
            </span>
          </h1>

          <p className="sc-hero-lede">{t.hero.lede}</p>

          <div className="sc-hero-actions">
            <div className="sc-hero-next">
              <span className="sc-hero-next-label">{t.hero.nextLabel}</span>
              <span className="sc-hero-next-city">{next.city}</span>
              <span className="sc-hero-next-dates">{next.range}</span>
            </div>
            <a className="btn-primary" href="#lineup">{t.hero.cta}</a>
          </div>

          <div className="sc-hero-tour" aria-hidden="true">
            {TAPPE.map(tp => <span key={tp.id}>{tp.city}</span>)}
          </div>
        </div>

        {/* RIGHT — contained visual */}
        <div className="sc-hero-visual">
          <img
            className="sc-hero-visual-img"
            src="/foto/colin-lloyd-5TGwSC4dHOU-unsplash.jpg"
            alt="South Calling Festival"
          />
        </div>

      </section>
    </>
  );
}
