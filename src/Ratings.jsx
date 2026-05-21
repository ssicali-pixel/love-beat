import { useLang } from './LangContext';

function Stars({ n, aria }) {
  return (
    <div className="rating-stars" aria-label={aria}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </div>
  );
}

export default function Ratings() {
  const { t } = useLang();
  return (
    <section className="section section-dark" id="ratings">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">REVI<span>EWS</span></h2>
        </header>

        <div className="ratings-grid">
          {t.ratings.reviews.map(r => (
            <div className="rating-card" key={r.name}>
              <Stars n={r.rating} aria={t.ratings.starsAria(r.rating)} />
              <p className="rating-text">"{r.text}"</p>
              <div className="rating-author">
                <strong>{r.name}</strong>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
