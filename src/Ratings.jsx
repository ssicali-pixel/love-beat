const RATINGS = [
  {
    name: 'Marco R.',
    rating: 5,
    text: 'La migliore esperienza musicale che abbia mai vissuto in Sicilia. Un festival vero, non una sagra.',
    date: '2025',
  },
  {
    name: 'Sofia K.',
    rating: 5,
    text: 'Sound system da brividi, lineup strepitosa e Catania come sfondo. Non esiste posto migliore.',
    date: '2025',
  },
  {
    name: 'Andrea M.',
    rating: 5,
    text: "Avevo visto Carl Cox dieci volte. Mai come qui, alle 3 di notte con l'Etna sullo sfondo.",
    date: '2025',
  },
];

function Stars({ n }) {
  return (
    <div className="rating-stars" aria-label={`${n} stelle su 5`}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </div>
  );
}

export default function Ratings() {
  return (
    <section className="section section-dark" id="ratings">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">REVI<span>EWS</span></h2>
        </header>

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
