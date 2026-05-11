import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
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
        <img src="/fonts/images/Lovebeat.svg" alt="Lovebeat logo" />
      </button>
      <ul className="nav-links">
        <li><a href="#about"   onClick={() => scrollTo('about')}>Chi Siamo</a></li>
        <li><a href="#lineup"  onClick={() => scrollTo('lineup')}>Line-up</a></li>
        <li><a href="#tickets" onClick={() => scrollTo('tickets')}>Biglietti</a></li>
        <li><a href="#gallery" onClick={() => scrollTo('gallery')}>Gallery</a></li>
        <li><a href="#contact" onClick={() => scrollTo('contact')}>Contatti</a></li>
      </ul>
      <button className="nav-cta" onClick={() => scrollTo('tickets')}>COMPRA ORA</button>
      <button className="hamburger" aria-label="Apri menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
        &#9776;
      </button>
    </nav>
  );
}
