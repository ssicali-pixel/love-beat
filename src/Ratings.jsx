const RATINGS = [
  { name: 'Marco R.',  rating: 5, text: 'La migliore esperienza musicale che abbia mai vissuto a Milano. Tornerò sicuramente!', date: '2025' },
  { name: 'Sofia K.',  rating: 5, text: 'Organizzazione perfetta, sound system incredibile e lineup strepitosa. 10/10!',        date: '2025' },
  { name: 'Andrea M.', rating: 4, text: "Atmosfera unica, artisti di altissimo livello. Non vedo l'ora del 2026.",             date: '2025' },
];

function Stars({ n }) {
  return (
    <div className="rating-stars" aria-label={`${n} stelle su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star${i < n ? ' filled' : ''}`} aria-hidden="true">★</span>
      ))}
    </div>
  );
}

export default function Ratings() {
  return (
    <section className="section section-dark" id="ratings">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Cosa dicono</p>
          <h2 className="section-title">REVI<span>EWS</span></h2>
        </div>
        <div className="ratings-grid">
          {RATINGS.map(r => (
            <div className="rating-card" key={r.name}>
              <Stars n={r.rating} />
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
