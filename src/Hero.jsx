export default function Hero() {
  return (
    <section className="hero hero-photo" id="home">

      {/* ── Background photo ── */}
      <div className="hero-bg">
        <img
          className="hero-bg-img"
          src="/foto/colin-lloyd-5TGwSC4dHOU-unsplash.jpg"
          alt="South Calling Festival"
        />
      </div>
      <div className="hero-bg-grad-v" />
      <div className="hero-bg-grad-h" />

      {/* ── Content ── */}
      <h1 className="festival-title hero-title">
        South<br />
        <span className="hero-title-accent">Calling</span>
      </h1>

    </section>
  );
}
