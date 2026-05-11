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
        <div className="section-header">
          <p className="section-tag">Chi siamo</p>
          <h2 className="section-title">ABOUT<span> US</span></h2>
          <p className="section-desc">LOVEBEAT è il festival house che porta la musica elettronica nel cuore di Milano.</p>
        </div>
        <div className="about-stats">
          {STATS.map(s => (
            <div className="about-stat" key={s.label}>
              <span className="about-number">{s.number}</span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
