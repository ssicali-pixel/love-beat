import { useState } from 'react';
import { useLang } from './LangContext';

const BASE = 'https://images.unsplash.com/photo-';
const Q    = '?auto=format&fit=crop&w=800&q=80';
const QL   = '?auto=format&fit=crop&w=1400&q=90';

const ITEMS = [
  { id: '1506157786151-b8491531f063', alt: 'Main Stage' },
  { id: '1533174072545-7a4b6ad7a6c3', alt: 'Crowd' },
  { id: '1544785349-c4a5301826fd',   alt: 'DJ Set' },
  { id: '1470225620780-dba8ba36b745', alt: 'Sunset set' },
  { id: '1514525253161-7a46d19cd819', alt: 'Underground stage' },
  { id: '1459749411175-04bf5292ceea', alt: 'Crowd energy' },
].map(({ id, alt }) => ({ src: BASE + id + Q, full: BASE + id + QL, alt }));

export default function Gallery() {
  const { t } = useLang();
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="section section-dark" id="gallery">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">GALLE<span>RY</span></h2>
        </header>

        <div className="gallery-grid">
          {ITEMS.map(item => (
            <div
              className="gallery-item"
              key={item.src}
              onClick={() => setLightbox(item)}
              role="button"
              tabIndex={0}
              aria-label={`${t.gallery.openAria} ${item.alt}`}
              onKeyDown={e => e.key === 'Enter' && setLightbox(item)}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">{item.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="gallery-lightbox"
          onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button className="lightbox-close" aria-label={t.gallery.closeAria} onClick={() => setLightbox(null)} type="button">
            ✕
          </button>
          <img src={lightbox.full} alt={lightbox.alt} />
        </div>
      )}
    </section>
  );
}
