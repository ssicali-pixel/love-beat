import { useState } from 'react';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [msg,   setMsg]   = useState({ text: '', type: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      setMsg({ text: data.message, type: data.success ? 'success' : 'error' });
      if (data.success) setEmail('');
    } catch {
      setMsg({ text: 'Errore di rete. Riprova.', type: 'error' });
    }
  };

  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-box">
          <div className="newsletter-text">
            <h3>NON PERDERTI NULLA</h3>
            <p>Iscriviti alla newsletter e ricevi news, lineup updates e offerte esclusive.</p>
          </div>
          <form className="newsletter-form" onSubmit={submit}>
            <input type="email" placeholder="La tua email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit">ISCRIVITI</button>
          </form>
          {msg.text && <p className={`form-message ${msg.type}`}>{msg.text}</p>}
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
      const res  = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
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
        <div className="section-header">
          <p className="section-tag">Scrivici</p>
          <h2 className="section-title">CON<span>TATTI</span></h2>
        </div>
        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="info-item"><span className="info-icon">📍</span><div><strong>Location</strong><p>Parco Sempione, Milano</p></div></div>
            <div className="info-item"><span className="info-icon">📅</span><div><strong>Date</strong><p>14 — 15 Giugno 2026</p></div></div>
            <div className="info-item"><span className="info-icon">✉️</span><div><strong>Email</strong><p>info@lovebeatfestival.it</p></div></div>
            <div className="info-item"><span className="info-icon">📱</span><div><strong>Social</strong><p>@lovebeatfest</p></div></div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <input type="text"  placeholder="Il tuo nome"  value={form.name}    onChange={set('name')}    required />
              <input type="email" placeholder="La tua email" value={form.email}   onChange={set('email')}   required />
            </div>
            <textarea placeholder="Il tuo messaggio..." value={form.message} onChange={set('message')} rows="5" required />
            <button type="submit" className="btn-primary">INVIA MESSAGGIO</button>
            {msg.text && <p className={`form-message ${msg.type}`}>{msg.text}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (<><NewsletterForm /><ContactForm /></>);
}
