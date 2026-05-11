const PARTNERS = [
  { name: 'Resident Advisor', label: 'Media partner',     url: '#' },
  { name: 'Boiler Room',      label: 'Streaming partner', url: '#' },
  { name: 'Absolut',          label: 'Beverage sponsor',  url: '#' },
  { name: 'Pioneer DJ',       label: 'Tech partner',      url: '#' },
  { name: 'Comune di Milano', label: 'Institutional',     url: '#' },
  { name: 'Red Bull',         label: 'Energy partner',    url: '#' },
];

export default function Partners() {
  return (
    <section className="section" id="partners">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Con noi</p>
          <h2 className="section-title">PART<span>NERS</span></h2>
        </div>
        <div className="partners-grid">
          {PARTNERS.map(p => (
            <a href={p.url} className="partner-item" key={p.name} target="_blank" rel="noopener noreferrer">
              <span className="partner-name">{p.name}</span>
              <span className="partner-label">{p.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
