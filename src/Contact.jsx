import { useState } from 'react';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [msg,   setMsg]   = useState({ text: '', type: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg({ text: data.message, type: data.success ? 'success' : 'error' });
      if (data.success) setEmail('');
    } catch {
      setMsg({ text: 'Errore di rete. Riprova.', type: 'error' });
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-box">
          <div className="newsletter-text">
            <h3>Non<br />perderti<br />nulla</h3>
            <p>
              Iscriviti alla newsletter. Lineup update,
              presale esclusive e news da Catania With Love.
            </p>
          </div>
          <div>
            <form className="newsletter-form" onSubmit={submit}>
              <input
                type="email"
                placeholder="La tua email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button type="submit">Iscriviti →</button>
            </form>
            {msg.text && <p className={`form-message ${msg.type}`}>{msg.text}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [msg,  setMsg]  = useState({ text: '', type: '' });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMsg({ text: data.message, type: data.success ? 'success' : 'error' });
      if (data.success) setForm({ name: '', email: '', message: '' });
    } catch {
      setMsg({ text: 'Errore di rete. Riprova.', type: 'error' });
    }
  };

  return (
    <section className="section section-dark" id="contact">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">CON<span>TATTI</span></h2>
        </header>

        <div className="contact-layout">
          <div>
            <h3 className="contact-info-title">Vieni<br />a trovarci</h3>
            <ul className="info-list" role="list">
              {[
                ['Location',  'Parco Bellini, Catania'],
                ['Date',      '14 — 15 Giugno 2026'],
                ['Email',     'info@lovebeatfestival.it'],
                ['Social',    '@lovebeatfest'],
              ].map(([label, value]) => (
                <li className="info-item" key={label}>
                  <span className="info-item-label">{label}</span>
                  <span className="info-item-value">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Il tuo nome"
                value={form.name}
                onChange={set('name')}
                required
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="La tua email"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </div>
            <textarea
              placeholder="Il tuo messaggio…"
              value={form.message}
              onChange={set('message')}
              rows="6"
              required
            />
            <button type="submit">Invia messaggio →</button>
            {msg.text && <p className={`form-message ${msg.type}`}>{msg.text}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <>
      <NewsletterForm />
      <ContactForm />
    </>
  );
}
