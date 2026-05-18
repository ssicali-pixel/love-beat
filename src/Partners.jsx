const PARTNERS = [
  { name: 'Resident Advisor', label: 'Media partner',     url: '#' },
  { name: 'Boiler Room',      label: 'Streaming partner', url: '#' },
  { name: 'Pioneer DJ',       label: 'Tech partner',      url: '#' },
  { name: 'Absolut',          label: 'Beverage sponsor',  url: '#' },
  { name: 'Red Bull',         label: 'Energy partner',    url: '#' },
  { name: 'Comune di Catania',label: 'Institutional',     url: '#' },
];

export default function Partners() {
  return (
    <section className="section" id="partners">
      <div className="container">
        <header className="section-header">
          <h2 className="section-title">PART<span>NERS</span></h2>
        </header>

        <div className="partners-list" role="list">
          {PARTNERS.map(p => (
            <a
              href={p.url}
              className="partner-item"
              key={p.name}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
            >
              <span className="partner-name">{p.name}</span>
              <span className="partner-label">{p.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
