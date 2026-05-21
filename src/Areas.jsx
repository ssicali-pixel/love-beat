import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangContext';

const CSS = `
  .st-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 3rem;
  }

  /* ── Stage card ── */
  .st-card {
    position: relative;
    overflow: hidden;
    background: #fff;
    padding: 52px 56px 48px 60px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4rem;
    align-items: start;
    box-shadow: 0 4px 28px rgba(160,0,0,0.07);
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity    0.8s cubic-bezier(0.16, 1, 0.3, 1),
      transform  0.8s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease;
  }
  .st-card.st-in { opacity: 1; transform: translateY(0); }
  .st-card:hover {
    box-shadow: 0 16px 56px rgba(160,0,0,0.14);
    transform: translateY(-5px);
  }

  /* left red stripe */
  .st-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: #E00000;
    transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .st-card:hover::before { width: 9px; }

  /* decorative stage number */
  .st-bg-num {
    position: absolute;
    right: -12px;
    bottom: -28px;
    font-family: var(--font-display);
    font-size: 220px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    color: rgba(160,0,0,0.04);
    user-select: none;
    pointer-events: none;
  }

  /* ── Left content ── */
  .st-main {}

  .st-index {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: #E00000;
    margin-bottom: 14px;
    display: block;
  }

  .st-name {
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.5vw, 3.25rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.92;
    color: #B80000;
    margin-bottom: 6px;
  }

  .st-subtitle {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(140,0,0,0.45);
    margin-bottom: 24px;
    display: block;
  }

  .st-desc {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.9375rem;
    color: rgba(140,0,0,0.68);
    line-height: 1.75;
    max-width: 560px;
    margin-bottom: 28px;
  }

  .st-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .st-tag {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(140,0,0,0.55);
    border: 1px solid rgba(160,0,0,0.18);
    padding: 5px 12px;
  }

  /* ── Right meta ── */
  .st-meta {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    padding-top: 4px;
    min-width: 200px;
  }

  .st-cap {
    text-align: right;
  }
  .st-cap-num {
    font-family: var(--font-display);
    font-size: clamp(3rem, 4vw, 4rem);
    font-weight: 700;
    line-height: 1;
    color: #B80000;
    display: block;
  }
  .st-cap-label {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(140,0,0,0.4);
    display: block;
    margin-top: 4px;
  }

  .st-divider {
    width: 1px;
    height: 40px;
    background: rgba(160,0,0,0.12);
    align-self: center;
  }

  .st-sound {
    text-align: right;
  }
  .st-sound-val {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: #B80000;
    display: block;
    text-transform: uppercase;
    letter-spacing: -0.01em;
  }
  .st-sound-label {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(140,0,0,0.4);
    display: block;
    margin-top: 4px;
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .st-card {
      grid-template-columns: 1fr;
      padding: 40px 28px 36px 36px;
      gap: 2rem;
    }
    .st-meta { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
    .st-divider { width: 40px; height: 1px; }
    .st-sound, .st-cap { text-align: left; }
    .st-bg-num { font-size: 120px; }
  }
`;

export default function Areas() {
  const { t } = useLang();
  const [stages, setStages] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetch('/api/stages')
      .then(r => r.json())
      .then(({ data }) => setStages(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!stages.length) return;
    const cards = cardsRef.current.filter(Boolean);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cards.forEach((c, i) => setTimeout(() => c.classList.add('st-in'), i * 180));
      },
      { threshold: 0.06 }
    );
    if (cards[0]?.parentElement) observer.observe(cards[0].parentElement);
    return () => observer.disconnect();
  }, [stages]);

  return (
    <>
      <style>{CSS}</style>
      <section className="section section-dark" id="areas">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">{t.areas.title[0]}<span>{t.areas.title[1]}</span></h2>
          </header>

          <div className="st-list">
            {stages.map((s, i) => (
              <div
                key={s.id}
                className="st-card"
                ref={el => (cardsRef.current[i] = el)}
              >
                <span className="st-bg-num">{String(i + 1).padStart(2, '0')}</span>

                <div className="st-main">
                  <span className="st-index">0{i + 1} — {s.subtitle}</span>
                  <h3 className="st-name">{s.name}</h3>
                  <span className="st-subtitle">{s.location}</span>
                  <p className="st-desc">{s.description}</p>
                  <div className="st-tags">
                    {s.features.map(f => (
                      <span key={f} className="st-tag">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="st-meta">
                  <div className="st-cap">
                    <span className="st-cap-num">{s.capacity.toLocaleString('it-IT')}</span>
                    <span className="st-cap-label">{t.areas.capacity}</span>
                  </div>
                  <div className="st-divider" />
                  <div className="st-sound">
                    <span className="st-sound-val">{s.soundSystem}</span>
                    <span className="st-sound-label">Sound system</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
