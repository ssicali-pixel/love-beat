import { useState, useEffect, useRef } from 'react';
import { useLang } from './LangContext';

const LANG_CSS = `
  .nav-lang-wrap {
    position: relative;
  }

  .nav-lang-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    font-family: var(--font-body);
    font-weight: 600; font-size: 0.625rem;
    letter-spacing: 0.22em; text-transform: uppercase;
    background: transparent;
    border: 1px solid rgba(26,120,200,0.35);
    color: rgba(26,120,200,0.80);
    padding: 0; cursor: pointer; border-radius: 2px;
    transition: color 0.3s, border-color 0.3s;
  }
  .nav-lang-btn::before {
    content: '';
    position: absolute; left: 50%; top: 50%;
    width: 14px; height: 14px; border-radius: 50%;
    background: #FF1F3D;
    transform: translate(-50%,-50%) scale(0);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .nav-lang-btn:hover::before,
  .nav-lang-btn.nav-lang-open::before { transform: translate(-50%,-50%) scale(8); }
  .nav-lang-btn:hover,
  .nav-lang-btn.nav-lang-open { color: #FFFDF7; border-color: #FF1F3D; }
  .nav-lang-btn .real {
    display: block; position: relative; z-index: 1;
    padding: 0.45rem 0.9rem;
    transition: transform 0.38s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .nav-lang-btn .ghost {
    position: absolute; inset: 0; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    transform: translateY(100%);
    transition: transform 0.38s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
    font-size: 0.5rem;
    letter-spacing: 0.1em;
  }
  .nav-lang-btn:hover .real,
  .nav-lang-btn.nav-lang-open .real { transform: translateY(-100%); }
  .nav-lang-btn:hover .ghost,
  .nav-lang-btn.nav-lang-open .ghost { transform: translateY(0); }

  .nav-lang-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 90px;
    background: #FFFDF7;
    border: 1px solid rgba(26,120,200,0.18);
    box-shadow: 0 8px 32px rgba(0,0,0,0.10);
    display: flex;
    flex-direction: column;
    gap: 0;
    z-index: 200;
    overflow: hidden;
    animation: langDrop 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes langDrop {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nav-lang-opt {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-body);
    font-weight: 600; font-size: 0.625rem;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(26,120,200,0.70);
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(26,120,200,0.10);
    padding: 0; cursor: pointer;
    transition: color 0.3s;
  }
  .nav-lang-opt:last-child { border-bottom: none; }
  .nav-lang-opt::before {
    content: '';
    position: absolute; left: 50%; top: 50%;
    width: 14px; height: 14px; border-radius: 50%;
    background: #FF1F3D;
    transform: translate(-50%,-50%) scale(0);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .nav-lang-opt:hover::before { transform: translate(-50%,-50%) scale(10); }
  .nav-lang-opt:hover { color: #FFFDF7; }
  .nav-lang-opt.nav-lang-active { color: #FF1F3D; }
  .nav-lang-opt.nav-lang-active::before { transform: translate(-50%,-50%) scale(10); }
  .nav-lang-opt.nav-lang-active { color: #FFFDF7; }
  .nav-lang-opt .real {
    display: block; position: relative; z-index: 1;
    padding: 11px 20px;
    transition: transform 0.38s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .nav-lang-opt .ghost {
    position: absolute; inset: 0; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    transform: translateY(100%);
    transition: transform 0.38s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .nav-lang-opt:not(.nav-lang-active):hover .real { transform: translateY(-100%); }
  .nav-lang-opt:not(.nav-lang-active):hover .ghost { transform: translateY(0); }
`;

export default function Navbar() {
  const { lang, t, setLang } = useLang();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setLangOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 701px)');
    const handler = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const selectLang = (l) => { setLang(l); setLangOpen(false); };

  const cls = ['navbar', scrolled && 'scrolled', menuOpen && 'mobile-open'].filter(Boolean).join(' ');

  const NAV_LINKS = [
    ['about',   t.nav.about],
    ['lineup',  t.nav.lineup],
    ['gallery', t.nav.gallery],
    ['contact', t.nav.contact],
  ];

  const LANGS = [
    { code: 'en', label: 'EN', sub: 'English'  },
    { code: 'it', label: 'IT', sub: 'Italiano' },
  ];

  return (
    <>
      <style>{LANG_CSS}</style>
      <nav className={cls}>
        <button className="nav-logo" onClick={() => scrollTo('home')} type="button" aria-label={t.nav.ariaHome}>
          <img src="/fonts/images/Lovebeat.svg" alt="Love Beat" />
        </button>

        <ul className="nav-links" role="list">
          {NAV_LINKS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-lang-wrap" ref={langRef}>
          <button
            className={`nav-lang-btn${langOpen ? ' nav-lang-open' : ''}`}
            onClick={() => setLangOpen(v => !v)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            <span className="real">{lang.toUpperCase()}</span>
            <span className="ghost" aria-hidden="true">▾</span>
          </button>

          {langOpen && (
            <div className="nav-lang-dropdown" role="listbox">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  className={`nav-lang-opt${lang === code ? ' nav-lang-active' : ''}`}
                  onClick={() => selectLang(code)}
                  role="option"
                  aria-selected={lang === code}
                  type="button"
                >
                  <span className="real">{label}</span>
                  <span className="ghost" aria-hidden="true">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="hamburger"
          aria-label={menuOpen ? t.nav.ariaClose : t.nav.ariaOpen}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          type="button"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
    </>
  );
}
