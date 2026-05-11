export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <img className="footer-logo" src="/fonts/images/Lovebeat.svg" alt="Lovebeat logo" />
          <p>Il festival che fa battere il cuore di Milano.</p>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 LOVEBEAT FESTIVAL. Tutti i diritti riservati.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="TikTok">TK</a>
            <a href="#" aria-label="Facebook">FB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
