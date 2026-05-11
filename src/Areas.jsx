const AREAS = [
  { name: 'Main Stage',     desc: 'Il palco principale con le headliner.',            color: 'var(--pink)'   },
  { name: 'Underground',    desc: 'Techno e house sperimentale senza filtri.',         color: 'var(--purple)' },
  { name: 'Sunset Terrace', desc: 'Set al tramonto con vista panoramica sulla città.', color: 'var(--cyan)'   },
  { name: 'Chill Zone',     desc: 'Relax, food e musica ambient.',                     color: 'var(--green)'  },
];

export default function Areas() {
  return (
    <section className="section section-dark" id="areas">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Il venue</p>
          <h2 className="section-title">LE<span> AREE</span></h2>
          <p className="section-desc">Quattro zone, quattro esperienze uniche.</p>
        </div>
        <div className="areas-grid">
          {AREAS.map(a => (
            <div className="area-card" key={a.name} style={{ '--area-color': a.color }}>
              <div className="area-dot" />
              <h3 className="area-name">{a.name}</h3>
              <p className="area-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
