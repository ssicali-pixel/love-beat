import { useEffect, useRef } from 'react';
import { useLang } from './LangContext';

const CSS = `
  /* ── SECTION SHELL ────────────────────────────────────────────── */
  .ab-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    background: #06020202;
  }

  /* ── PHOTO ────────────────────────────────────────────────────── */
  .ab-photo-wrap {
    position: absolute;
    inset: 0;
    opacity: 0;
    filter: blur(22px);
    transform: scale(1.07);
    transition:
      opacity   2.2s cubic-bezier(0.16, 1, 0.3, 1),
      filter    2.2s cubic-bezier(0.16, 1, 0.3, 1),
      transform 2.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, filter, transform;
  }
  .ab-section.ab-in .ab-photo-wrap {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
  .ab-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 35%;
    display: block;
  }

  /* ── OVERLAYS ─────────────────────────────────────────────────── */
  .ab-grad-v {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(4,1,1,0.18)  0%,
      rgba(4,1,1,0.42)  38%,
      rgba(4,1,1,0.82)  68%,
      rgba(4,1,1,0.97)  100%
    );
  }
  .ab-grad-h {
    position: absolute; inset: 0;
    background: linear-gradient(
      to right,
      rgba(4,1,1,0.60) 0%,
      rgba(4,1,1,0.20) 55%,
      transparent 100%
    );
  }

  /* ── CONTENT GRID ─────────────────────────────────────────────── */
  .ab-content {
    position: relative;
    z-index: 2;
    width: min(1280px, 90%);
    margin: 0 auto;
    padding: 10rem 0 5rem;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 0;
  }

  /* ── EYEBROW ─────────────────────────────────────────────────── */
  .ab-eyebrow {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding-bottom: 2rem;
    margin-bottom: 4rem;
    border-bottom: 1px solid rgba(250,248,242,0.10);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s;
  }
  .ab-section.ab-in .ab-eyebrow { opacity: 1; transform: translateY(0); }

  .ab-ey-tag {
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.30em; text-transform: uppercase;
    color: rgba(250,248,242,0.38);
    white-space: nowrap;
  }
  .ab-ey-line {
    height: 1px; flex: 1;
    background: rgba(250,248,242,0.09);
  }
  .ab-ey-genre {
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,31,61,0.60);
    white-space: nowrap;
  }

  /* ── MAIN ROW ─────────────────────────────────────────────────── */
  .ab-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem 7rem;
    align-items: end;
  }

  /* ── LEFT — TITLE ─────────────────────────────────────────────── */
  .ab-left {}

  .ab-title {
    font-family: var(--font-display);
    font-size: clamp(5rem, 12vw, 12rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 0.86;
    color: #FFFDF7;
    opacity: 0;
    filter: blur(24px);
    transform: scale(1.05);
    transition:
      opacity   1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s,
      filter    1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s,
      transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s;
    will-change: opacity, filter, transform;
  }
  .ab-section.ab-in .ab-title { opacity: 1; filter: blur(0); transform: scale(1); }

  .ab-title-accent { color: #FF1F3D; }

  .ab-title-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.85s ease 1.4s, transform 0.85s ease 1.4s;
  }
  .ab-section.ab-in .ab-title-meta { opacity: 1; transform: translateY(0); }

  .ab-title-date {
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: rgba(250,248,242,0.30);
  }
  .ab-title-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: rgba(255,31,61,0.50); flex-shrink: 0;
  }
  .ab-title-loc {
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: rgba(250,248,242,0.30);
  }

  /* ── RIGHT — COPY + STATS ─────────────────────────────────────── */
  .ab-right {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    justify-content: flex-end;
  }

  .ab-copy {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 1s ease 1s, transform 1s ease 1s;
  }
  .ab-section.ab-in .ab-copy { opacity: 1; transform: translateY(0); }

  .ab-copy-lead {
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 1.8vw, 1.5rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1.1;
    color: rgba(250,248,242,0.88);
    margin-bottom: 1.25rem;
  }

  .ab-copy-body {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: clamp(0.9rem, 1.1vw, 1.0rem);
    line-height: 1.90;
    color: rgba(250,248,242,0.48);
  }
  .ab-copy-body em {
    font-style: normal;
    color: rgba(250,248,242,0.72);
  }

  /* ── STATS ────────────────────────────────────────────────────── */
  .ab-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid rgba(250,248,242,0.08);
    padding-top: 2.5rem;
  }
  .ab-stat {
    padding-right: 1.5rem;
    border-right: 1px solid rgba(250,248,242,0.07);
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .ab-stat:last-child { border-right: none; padding-right: 0; }

  .ab-section.ab-in .ab-stat:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:1.15s; }
  .ab-section.ab-in .ab-stat:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:1.30s; }
  .ab-section.ab-in .ab-stat:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:1.45s; }
  .ab-section.ab-in .ab-stat:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:1.60s; }

  .ab-stat-num {
    font-family: var(--font-display);
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 700;
    line-height: 1;
    color: #FF1F3D;
    display: block;
    margin-bottom: 7px;
  }
  .ab-stat-lbl {
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.20em; text-transform: uppercase;
    color: rgba(250,248,242,0.40);
    display: block;
  }
  .ab-stat-sub {
    font-family: var(--font-body);
    font-size: 8px; font-weight: 500;
    letter-spacing: 0.12em;
    color: rgba(250,248,242,0.18);
    display: block;
    margin-top: 3px;
  }

  /* ── BOTTOM BORDER ────────────────────────────────────────────── */
  .ab-footer-line {
    position: relative; z-index: 2;
    width: min(1280px, 90%);
    margin: 0 auto;
    padding-bottom: 4rem;
    border-bottom: 1px solid rgba(250,248,242,0.07);
  }

  /* ── RESPONSIVE ───────────────────────────────────────────────── */
  @media (max-width: 960px) {
    .ab-main { grid-template-columns: 1fr; gap: 3rem; }
    .ab-right { gap: 2.5rem; }
  }
  @media (max-width: 640px) {
    .ab-content { padding-top: 7rem; padding-bottom: 4rem; }
    .ab-stats { grid-template-columns: repeat(2, 1fr); gap: 2rem 0; }
    .ab-stat:nth-child(2n) { border-right: none; padding-right: 0; }
    .ab-stat { padding-right: 1rem; }
  }
  @media (max-width: 420px) {
    .ab-title { font-size: clamp(4rem, 18vw, 6rem); }
  }
`;

export default function About() {
  const { t } = useLang();
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('ab-in');
          obs.disconnect();
        }
      },
      { threshold: 0.10 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className="ab-section" id="about" ref={sectionRef}>

        {/* Photo */}
        <div className="ab-photo-wrap">
          <img
            className="ab-photo"
            src="/foto/lachy-spratt-s3ObQUr4Kzs-unsplash.jpg"
            alt="South Calling Festival — Catania 2026"
          />
        </div>

        {/* Gradient overlays */}
        <div className="ab-grad-v" />
        <div className="ab-grad-h" />

        {/* Content */}
        <div className="ab-content">

          {/* Eyebrow */}
          <div className="ab-eyebrow">
            <span className="ab-ey-tag">{t.about.eyebrow}</span>
            <span className="ab-ey-line" />
            <span className="ab-ey-genre">{t.about.genre}</span>
          </div>

          {/* Main two-column */}
          <div className="ab-main">

            {/* Left — Title */}
            <div className="ab-left">
              <h2 className="ab-title">
                About<br />
                <span className="ab-title-accent">Us</span>
              </h2>
              <div className="ab-title-meta">
               
              
              </div>
            </div>

            {/* Right — Copy + Stats */}
            <div className="ab-right">
              <div className="ab-copy">
                <p className="ab-copy-lead">{t.about.lead}</p>
                <p className="ab-copy-body">
                  <em>SOUTH CALLING</em> {t.about.body1}
                  <br /><br />
                  {t.about.body2}
                </p>
              </div>

              <div className="ab-stats">
                {t.about.stats.map(s => (
                  <div className="ab-stat" key={s.label}>
                    <span className="ab-stat-num">{s.number}</span>
                    <span className="ab-stat-lbl">{s.label}</span>
                    <span className="ab-stat-sub">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="ab-footer-line" />
      </section>
    </>
  );
}
