import { useEffect, useRef, useState } from 'react';

const PARTNERS = [
  { name: 'Resident Advisor', label: 'Media partner',     logo: '/logos/channels4_profile.jpg',                               url: '#' },
  { name: 'Boiler Room',      label: 'Streaming partner', logo: '/logos/Boiler_Room_logo.svg.png',                            url: '#' },
  { name: 'Pioneer DJ',       label: 'Tech partner',      logo: '/logos/pioneer-seeklogo.png',                                url: '#' },
  { name: 'Absolut',          label: 'Beverage sponsor',  logo: '/logos/absolut-vodka-515.png',                               url: '#' },
  { name: 'Red Bull',         label: 'Energy partner',    logo: '/logos/redbullenergydrink.svg',                              url: '#' },
  { name: 'Comune di Catania',label: 'Institutional',     logo: '/logos/comune-catania-digitalizza-segnalazioni-cittadini.jpg', url: '#' },
];

/* pattern larghezze/allineamento — si ripete ogni 3 card */
const LAYOUT = [
  { w: '90%', align: 'flex-start', from: -1 },  // entra da sinistra
  { w: '75%', align: 'flex-end',   from:  1 },  // entra da destra
  { w: '82%', align: 'flex-start', from: -1 },  // entra da sinistra
];

const CSS = `
  .pa-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 3rem;
  }

  /* ── card ── */
  .pa-card {
    height: 200px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 4px 28px rgba(160,0,0,0.10);
    display: flex;
    align-items: center;
    padding: 0 52px 0 40px;
    gap: 0;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    cursor: default;
    opacity: 0;
    transition:
      transform  0.9s cubic-bezier(0.16, 1, 0.3, 1),
      opacity    0.9s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease;
    will-change: transform, opacity;
  }

  /* striscia rossa a sinistra */
  .pa-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: #E00000;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .pa-card.pa-from-l { transform: translateX(-115%) rotate(-1.5deg); }
  .pa-card.pa-from-r { transform: translateX( 115%) rotate( 1.5deg); }

  .pa-card.pa-in {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
  .pa-card.pa-in:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(160,0,0,0.18);
  }
  .pa-card.pa-in:hover::before { width: 10px; }

  /* ── numero decorativo gigante ── */
  .pa-idx {
    position: absolute;
    right: 44px;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-display);
    font-size: 130px;
    font-weight: 700;
    line-height: 1;
    color: rgba(160,0,0,0.05);
    letter-spacing: -0.04em;
    user-select: none;
    pointer-events: none;
  }

  /* ── area logo ── */
  .pa-logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 110px;
    background: #F7F4F0;
    border-radius: 6px;
    margin-left: 28px;
  }
  .pa-logo img {
    max-width: 140px;
    max-height: 80px;
    object-fit: contain;
    display: block;
  }

  /* ── testi ── */
  .pa-info {
    margin-left: 48px;
    flex: 1;
  }
  .pa-label {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #E00000;
    line-height: 1;
  }
  .pa-name {
    font-family: var(--font-display);
    font-size: clamp(22px, 3vw, 34px);
    font-weight: 700;
    color: #B80000;
    margin-top: 10px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }

  /* ── mobile ── */
  @media (max-width: 600px) {
    .pa-card { height: auto; min-height: 130px; padding: 28px 20px 28px 36px; }
    .pa-logo { width: 120px; height: 80px; margin-left: 20px; }
    .pa-logo img { max-width: 100px; max-height: 60px; }
    .pa-info { margin-left: 24px; }
    .pa-idx { font-size: 80px; right: 16px; }
  }
`;

/* palette colori per il fallback — uno per partner, in loop */
const FALLBACK_PALETTE = [
  { bg: '#E8EAF6', fg: '#3949AB' },
  { bg: '#FCE4EC', fg: '#C62828' },
  { bg: '#E8F5E9', fg: '#2E7D32' },
  { bg: '#FFF3E0', fg: '#E65100' },
  { bg: '#F3E5F5', fg: '#6A1B9A' },
  { bg: '#E0F7FA', fg: '#006064' },
];

/* cerchio colorato con le iniziali — mostrato se Clearbit non risponde */
function LogoFallback({ name, idx }) {
  const { bg, fg } = FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
  const initials = name
    .split(' ')
    .filter(w => /^[A-Za-zÀ-ÖØ-öø-ÿ]/.test(w))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-label={name}>
      <circle cx="30" cy="30" r="30" fill={bg} />
      <text
        x="30" y="40"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill={fg}
        fontFamily="sans-serif"
        letterSpacing="1"
      >{initials}</text>
    </svg>
  );
}

export default function Partners() {
  const listRef  = useRef(null);
  const cardsRef = useRef([]);
  const [imgErrors, setImgErrors] = useState(() => Array(PARTNERS.length).fill(false));

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        /* entrano una alla volta, 180ms di delay tra una card e la successiva */
        cards.forEach((card, i) =>
          setTimeout(() => card.classList.add('pa-in'), i * 180)
        );
      },
      { threshold: 0.1 }
    );

    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <section className="section" id="partners">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">PART<span>NERS</span></h2>
          </header>

          <div className="pa-list" ref={listRef}>
            {PARTNERS.map(({ name, label, logo, url }, i) => {
              const { w, align, from } = LAYOUT[i % LAYOUT.length];
              const fromCls = from === -1 ? 'pa-from-l' : 'pa-from-r';

              return (
                <a
                  key={name}
                  href={url}
                  className={`pa-card ${fromCls}`}
                  ref={el => (cardsRef.current[i] = el)}
                  style={{ width: w, alignSelf: align }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                >
                  <span className="pa-idx">{String(i + 1).padStart(2, '0')}</span>

                  <div className="pa-logo">
                    {logo && !imgErrors[i] ? (
                      <img
                        src={logo}
                        alt={name}
                        onError={() =>
                          setImgErrors(prev => {
                            const s = [...prev]; s[i] = true; return s;
                          })
                        }
                      />
                    ) : (
                      <LogoFallback name={name} idx={i} />
                    )}
                  </div>

                  <div className="pa-info">
                    <div className="pa-label">{label}</div>
                    <div className="pa-name">{name}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
