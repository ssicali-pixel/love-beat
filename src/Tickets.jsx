import { useState, useEffect } from 'react';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(({ data }) => { setTickets(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const buy = (type, price) =>
    alert(`Hai selezionato: ${type} — €${price}\n\n(Integrazione pagamento in arrivo!)`);

  return (
    <section className="section" id="tickets">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Entra</p>
          <h2 className="section-title">BIGLI<span>ETTI</span></h2>
          <p className="section-desc">Scegli il tuo pass e vivi LOVEBEAT al massimo.</p>
        </div>
        <div className="tickets-grid">
          {loading && <p className="loading">Caricamento biglietti...</p>}
          {tickets.map((t, i) => (
            <div className={`ticket-card${i === 1 ? ' featured' : ''}`} key={t.type}>
              {i === 1 && <span className="featured-badge">Più venduto</span>}
              <p className="ticket-type">{t.type}</p>
              <div className="ticket-price"><sup>&euro;</sup>{t.price}</div>
              <p className="ticket-desc">{t.description}</p>
              <button className="btn-primary" onClick={() => buy(t.type, t.price)}>ACQUISTA</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
