import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 701px)');
    const handler = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const cls = ['navbar', scrolled && 'scrolled', menuOpen && 'mobile-open'].filter(Boolean).join(' ');

  return (
    <nav className={cls}>
      <button className="nav-logo" onClick={() => scrollTo('home')} type="button" aria-label="Vai alla home">
        <img src="/fonts/images/Lovebeat.svg" alt="Love Beat" />
      </button>

      <ul className="nav-links" role="list">
        {[['about','Chi Siamo'],['lineup','Line-up'],['tickets','Biglietti'],['gallery','Gallery'],['contact','Contatti']].map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
          </li>
        ))}
      </ul>

      <button className="nav-cta" onClick={() => scrollTo('tickets')} type="button">
        Biglietti
      </button>

      <button
        className="hamburger"
        aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(v => !v)}
        type="button"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </nav>
  );
}
