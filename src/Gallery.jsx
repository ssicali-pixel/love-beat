import { useState } from 'react';

const ITEMS = [
  { src: '/img/gallery/g1.jpg', alt: 'Main Stage 2025' },
  { src: '/img/gallery/g2.jpg', alt: 'Crowd' },
  { src: '/img/gallery/g3.jpg', alt: 'DJ Set' },
  { src: '/img/gallery/g4.jpg', alt: 'Sunset set' },
  { src: '/img/gallery/g5.jpg', alt: 'Underground stage' },
  { src: '/img/gallery/g6.jpg', alt: 'Crowd energy' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="section section-dark" id="gallery">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Memories</p>
          <h2 className="section-title">GALLE<span>RY</span></h2>
        </div>
        <div className="gallery-grid">
          {ITEMS.map(item => (
            <div className="gallery-item" key={item.src} onClick={() => setLightbox(item)}>
              <img src={item.src} alt={item.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="gallery-lightbox" onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <button className="lightbox-close" aria-label="Chiudi" onClick={() => setLightbox(null)}>&times;</button>
          <img src={lightbox.src} alt={lightbox.alt} />
        </div>
      )}
    </section>
  );
}
