import { useState } from 'react';
import { useLang } from './LangContext';

const BASE = 'https://images.unsplash.com/photo-';
const Q    = '?auto=format&fit=crop&w=800&q=80';
const QL   = '?auto=format&fit=crop&w=1400&q=90';

const ITEMS = [
  { id: '1506157786151-b8491531f063', alt: 'Main Stage',        type: 'Photo' },
  { id: '1533174072545-7a4b6ad7a6c3', alt: 'Crowd',             type: 'Photo' },
  { id: '1544785349-c4a5301826fd',   alt: 'DJ Set',             type: 'Photo' },
  { id: '1470225620780-dba8ba36b745', alt: 'Sunset Set',        type: 'Photo' },
  { id: '1514525253161-7a46d19cd819', alt: 'Underground',       type: 'Photo' },
  { id: '1459749411175-04bf5292ceea', alt: 'Crowd Energy',      type: 'Photo' },
].map(({ id, alt, type }) => ({ src: BASE + id + Q, full: BASE + id + QL, alt, type }));

const CSS = `
  .gc-row {
    display: flex;
    gap: 8px;
    height: 320px;
  }

  .gc {
    flex: 1;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    cursor: zoom-in;
    transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gc-row:hover .gc       { flex: 0.4; }
  .gc-row:hover .gc:hover { flex: 3.5; }

  .gc-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.5) saturate(0.5);
    transform: scale(1);
    transition:
      filter    0.55s ease,
      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .gc:hover .gc-bg {
    filter: brightness(0.9) saturate(1);
    transform: scale(1.03);
  }

  .gc-tag {
    position: absolute;
    top: 14px; left: 14px;
    z-index: 2;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #fff;
    background: rgba(0,0,0,0.48);
    padding: 4px 10px;
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
  .gc:hover .gc-tag { opacity: 1; }

  .gc-info-wrap {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding-top: 72px;
    background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%);
    transform: translateY(100%);
    transition: transform 0.48s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 2;
  }
  .gc:hover .gc-info-wrap { transform: translateY(0); }

  .gc-info { padding: 0 18px 18px; }

  .gc-num {
    display: block;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.50);
    margin-bottom: 5px;
  }

  .gc-title {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(0.85rem, 1.4vw, 1.05rem);
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gc-lightbox {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.96);
    display: grid; place-items: center;
    padding: 2rem; z-index: 200;
    cursor: zoom-out;
  }
  .gc-lightbox img {
    max-width: min(1100px, 92vw);
    max-height: 90vh;
    object-fit: contain;
    border-radius: 6px;
  }
  .gc-lightbox-close {
    position: absolute; top: 1.25rem; right: 1.75rem;
    border: 0; background: transparent;
    color: rgba(255,255,255,0.45); font-size: 1.75rem;
    cursor: pointer; line-height: 1; padding: 0;
    transition: color 0.2s;
  }
  .gc-lightbox-close:hover { color: #fff; }

  @media (max-width: 700px) {
    .gc-row { flex-direction: column; height: auto; gap: 6px; }
    .gc { flex: none !important; height: 200px; border-radius: 8px; }
    .gc-row:hover .gc { flex: none; }
    .gc-bg { filter: brightness(0.70) saturate(0.85); }
    .gc-info-wrap { transform: translateY(0); }
  }
`;

export default function Gallery() {
  const { t } = useLang();
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <style>{CSS}</style>
      <section className="section section-dark" id="gallery">
        <div className="container">
          <header className="section-header sh-v">
            <h2 className="section-title">GALLE<span>RY</span></h2>
            <p className="section-desc">{t.gallery.desc}</p>
          </header>

          <div className="gc-row">
            {ITEMS.map((item, i) => (
              <div
                key={item.src}
                className="gc"
                onClick={() => setLightbox(item)}
                role="button"
                tabIndex={0}
                aria-label={`${t.gallery.openAria} ${item.alt}`}
                onKeyDown={e => e.key === 'Enter' && setLightbox(item)}
              >
                <div className="gc-bg" style={{ backgroundImage: `url(${item.src})` }} />
                <span className="gc-tag">{item.type}</span>
                <div className="gc-info-wrap">
                  <div className="gc-info">
                    <span className="gc-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="gc-title">{item.alt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {lightbox && (
          <div
            className="gc-lightbox"
            onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
          >
            <button
              className="gc-lightbox-close"
              aria-label={t.gallery.closeAria}
              onClick={() => setLightbox(null)}
              type="button"
            >✕</button>
            <img src={lightbox.full} alt={lightbox.alt} />
          </div>
        )}
      </section>
    </>
  );
}
