import { useEffect, useRef } from 'react';
import { useLang } from './LangContext';

export default function Footer() {
  const { t } = useLang();
  const taglineRef = useRef(null);

  useEffect(() => {
    const el = taglineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-tagline" ref={taglineRef}>
            <div className="ft-line"><span>The South</span></div>
            <div className="ft-line"><span>Calls</span></div>
            <div className="ft-line ft-accent"><span>Once</span></div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">{t.footer.copy}</p>
          <nav className="footer-socials" aria-label="Social media">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="TikTok">TikTok</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Resident Advisor">RA</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
