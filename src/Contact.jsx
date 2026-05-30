import { useState } from 'react';
import { useLang } from './LangContext';

function NewsletterForm() {
  const { t } = useLang();
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
      setMsg({ text: t.newsletter.errorNet, type: 'error' });
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-box">
          <div className="newsletter-text">
            <h3>{t.newsletter.heading[0]}<br />{t.newsletter.heading[1]}<br />{t.newsletter.heading[2]}</h3>
            <p>{t.newsletter.desc}</p>
          </div>
          <div className="nl-card">
            <div className="nl-card-header">
              <span className="nl-tag">{t.newsletter.tag}</span>
              <div className="ci-dots">
                <span /><span /><span />
              </div>
            </div>
            <div className="nl-card-body">
              <form className="newsletter-form" onSubmit={submit}>
                <input
                  type="email"
                  className="nl-input"
                  placeholder={t.newsletter.placeholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <button type="submit">
                  <span className="real">{t.newsletter.button}</span>
                  <span className="ghost" aria-hidden="true">{t.newsletter.button}</span>
                </button>
              </form>
              {msg.text && <p className={`form-message ${msg.type}`}>{msg.text}</p>}
              <p className="nl-privacy">{t.newsletter.privacy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const { t } = useLang();
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
      setMsg({ text: t.contact.errorNet, type: 'error' });
    }
  };

  return (
    <section className="section section-dark" id="contact">
      <div className="container">
        <header className="section-header sh-v">
          <span className="section-tag">{t.contact.label}</span>
          <h2 className="section-title">{t.contact.title[0]}<span>{t.contact.title[1]}</span></h2>
          <p className="section-desc">{t.contact.desc}</p>
        </header>

        <div className="contact-layout">

          {/* ── Left: info column ── */}
          <div className="contact-info-col">
            <h3 className="contact-info-title">
              {t.contact.subtitle[0]}<br />{t.contact.subtitle[1]}
            </h3>
            <ul className="info-list" role="list">
              {t.contact.infos.map(([label, value]) => (
                <li className="info-item" key={label}>
                  <span className="info-item-label">{label}</span>
                  <span className="info-item-value">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: premium inbox card ── */}
          <div className="contact-inbox">

            {/* Card header — email-style */}
            <div className="ci-header">
              <div className="ci-header-top">
                <span className="ci-tag">{t.contact.formTag}</span>
                <div className="ci-dots">
                  <span /><span /><span />
                </div>
              </div>
              <div className="ci-to-row">
                <span className="ci-to-label">{t.contact.toLabel}</span>
                <span className="ci-to-value">info@southcallingfestival.it</span>
              </div>
            </div>

            {/* Card body — form */}
            <div className="ci-body">
              <form onSubmit={submit}>
                <div className="ci-row">
                  <div className="ci-field">
                    <label className="ci-label">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      className="ci-input"
                      placeholder={t.contact.namePlaceholder}
                      value={form.name}
                      onChange={set('name')}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="ci-field">
                    <label className="ci-label">{t.contact.emailLabel}</label>
                    <input
                      type="email"
                      className="ci-input"
                      placeholder={t.contact.emailPlaceholder}
                      value={form.email}
                      onChange={set('email')}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="ci-field">
                  <label className="ci-label">{t.contact.messageLabel}</label>
                  <textarea
                    className="ci-input ci-textarea"
                    placeholder={t.contact.messagePlaceholder}
                    value={form.message}
                    onChange={set('message')}
                    rows="7"
                    required
                  />
                </div>
                <div className="ci-footer">
                  <button className="ci-send" type="submit">
                    <span className="real">{t.contact.button}</span>
                    <span className="ghost" aria-hidden="true">{t.contact.button}</span>
                  </button>
                  {msg.text && <p className={`form-message ${msg.type}`}>{msg.text}</p>}
                </div>
              </form>
            </div>
          </div>

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
