export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <img className="footer-logo" src="/fonts/images/Lovebeat.svg" alt="Love Beat" />
          <p className="footer-tagline">
            Catania<br />
            <span>With Love</span>
          </p>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Love Beat Festival — Tutti i diritti riservati</p>
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
