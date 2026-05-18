const AREAS = [
  { name: 'Main Stage',     desc: 'Il palco principale. Le headliner, il sound system da 100kW, la folla che non dorme.' },
  { name: 'Underground',    desc: 'Techno e house sperimentale senza filtri. Il cuore oscuro del festival.' },
  { name: 'Sunset Terrace', desc: "Set al tramonto con vista sull'Etna e sul porto di Catania. Imperdibile." },
  { name: 'Chill Zone',     desc: "Relax, street food siciliano e musica ambient. Il respiro tra un set e l'altro." },
];

export default function Areas() {
  return (
    <section className="section section-dark" id="areas">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">LE<span> AREE</span></h2>
          <p className="section-desc">Quattro zone. Quattro esperienze distinte.</p>
        </header>

        <div className="areas-grid">
          {AREAS.map((a, i) => (
            <div className="area-card" key={a.name}>
              <span className="area-index">0{i + 1}</span>
              <h3 className="area-name">{a.name}</h3>
              <p className="area-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
