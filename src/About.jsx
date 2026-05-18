const STATS = [
  { number: '12',  label: 'Ore di musica' },
  { number: '3',   label: 'Stage' },
  { number: '20+', label: 'Artisti' },
  { number: '10K', label: 'Partecipanti' },
];

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">ABOUT<span> US</span></h2>
        </header>

        <div className="about-intro">
          <div className="about-claim">
            CATANIA<br />
            <span>WITH</span><br />
            LOVE
          </div>
          <p className="about-body">
            LOVEBEAT nasce dalla passione per la house music e per Catania.
            Un festival che porta i nomi più grandi della scena internazionale
            nel cuore della Sicilia — tre palchi, dodici ore di musica continua,
            e migliaia di persone unite da un unico ritmo.
            <br /><br />
            Dal tramonto sull'Etna all'alba sul porto, LOVEBEAT è l'esperienza
            che ridefinisce il festival estivo in Italia.
          </p>
        </div>

        <div className="about-stats">
          {STATS.map(s => (
            <div className="about-stat" key={s.label}>
              <span className="about-number">{s.number}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
