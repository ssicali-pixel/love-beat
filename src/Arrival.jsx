import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangContext';
import { TAPPE } from './data/festival';

const CSS = `
  /* ── SHELL ─────────────────────────────────────────────────────────── */
  .arr {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(to bottom,
        #FFFDF7 0%,
        #FBFAF4 34%,
        #eef4fb 62%,
        #dde9f7 100%);
    isolation: isolate;
  }

  /* ── 3D SCENE ──────────────────────────────────────────────────────── */
  .arr-scene {
    position: absolute;
    inset: 0;
    z-index: 1;
    perspective: 760px;
    perspective-origin: 50% 28%;
    overflow: hidden;
  }

  /* horizon glow where the runway vanishes */
  .arr-scene::before {
    content: '';
    position: absolute;
    left: 50%; top: 26%;
    width: 70vw; height: 30vh;
    transform: translateX(-50%);
    background: radial-gradient(60% 80% at 50% 100%, rgba(26,120,200,0.22), transparent 72%);
    pointer-events: none;
  }

  /* ── RUNWAY — a flat plane laid back in 3D ─────────────────────────── */
  .arr-runway {
    position: absolute;
    left: 50%;
    bottom: -10%;
    width: clamp(320px, 50vw, 600px);
    height: 135vh;
    transform: translateX(-50%) rotateX(73deg);
    transform-origin: bottom center;
    background: linear-gradient(to top,
      #12365a 0%,
      #103051 48%,
      rgba(15,42,69,0.45) 82%,
      rgba(15,42,69,0) 100%);
    box-shadow: 0 0 120px 40px rgba(15,42,69,0.18);
  }

  /* runway side edges */
  .arr-runway::after {
    content: '';
    position: absolute;
    inset: 0;
    border-left: 4px solid rgba(255,253,247,0.55);
    border-right: 4px solid rgba(255,253,247,0.55);
  }

  /* animated dashed centre line — gives the sense of approach speed */
  .arr-centerline {
    position: absolute;
    left: 50%; top: 0; bottom: 0;
    width: 12px;
    transform: translateX(-50%);
    background: repeating-linear-gradient(to top,
      rgba(255,253,247,0.92) 0 44px,
      transparent 44px 120px);
  }
  .arr.is-in .arr-centerline { animation: arr-dash 0.85s linear infinite; }
  @keyframes arr-dash { from { background-position-y: 0; } to { background-position-y: 120px; } }

  /* threshold bars near the touchdown zone */
  .arr-threshold {
    position: absolute;
    left: 14%; right: 14%;
    bottom: 6%;
    height: 12px;
    background: repeating-linear-gradient(to right,
      rgba(255,253,247,0.9) 0 14px,
      transparent 14px 30px);
  }

  /* ── PLANE SHADOW ──────────────────────────────────────────────────── */
  .arr-plane-shadow {
    position: absolute;
    left: 50%; top: 0;
    width: clamp(90px, 12vw, 150px);
    height: 30px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center, rgba(8,20,35,0.45) 0%, rgba(8,20,35,0) 70%);
    z-index: 4;
    opacity: 0;
    will-change: transform, opacity;
  }
  .arr.is-in .arr-plane-shadow {
    animation: arr-shadow 4s cubic-bezier(0.4, 0, 0.25, 1) 0.5s forwards;
  }
  @keyframes arr-shadow {
    0%   { opacity: 0;    transform: translateX(-50%) translateY(12vh) scale(0.3); }
    62%  { opacity: 0.22; transform: translateX(-50%) translateY(42vh) scale(0.7); }
    100% { opacity: 0.4;  transform: translateX(-50%) translateY(58vh) scale(1);   }
  }

  /* ── PLANE ─────────────────────────────────────────────────────────── */
  .arr-plane {
    position: absolute;
    left: 50%; top: 0;
    width: clamp(110px, 15vw, 190px);
    transform: translateX(-50%);
    z-index: 6;
    opacity: 0;
    will-change: transform, opacity;
    filter: drop-shadow(0 14px 22px rgba(15,42,69,0.28));
  }
  .arr-plane-svg { display: block; width: 100%; height: auto; }

  .arr.is-in .arr-plane {
    animation: arr-land 4s cubic-bezier(0.4, 0, 0.25, 1) 0.5s forwards;
  }
  @keyframes arr-land {
    0%   { opacity: 0; transform: translateX(-50%) translateY(5vh)  scale(0.34) rotate(-5deg); }
    14%  { opacity: 1; }
    62%  {             transform: translateX(-50%) translateY(34vh) scale(0.72) rotate(2deg);  }
    84%  {             transform: translateX(-50%) translateY(53vh) scale(1)    rotate(0deg);  }
    91%  {             transform: translateX(-50%) translateY(49vh) scale(1)    rotate(0deg);  }
    100% {             transform: translateX(-50%) translateY(51vh) scale(1)    rotate(0deg);  }
  }

  /* ── EYEBROW ───────────────────────────────────────────────────────── */
  .arr-eyebrow {
    position: absolute;
    top: clamp(2.5rem, 9vh, 6rem);
    left: 0; right: 0;
    text-align: center;
    z-index: 9;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.6875rem;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--accent);
    opacity: 0;
  }
  .arr-eyebrow::before {
    content: '';
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent);
    margin-right: 0.8rem;
    vertical-align: middle;
    box-shadow: 0 0 0 0 rgba(255,31,61,0.5);
    animation: arr-pulse 1.6s ease-out infinite;
  }
  .arr.is-in .arr-eyebrow { animation: arr-fade 0.9s ease 0.3s forwards; }
  @keyframes arr-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(255,31,61,0.45); }
    100% { box-shadow: 0 0 0 12px rgba(255,31,61,0); }
  }
  @keyframes arr-fade { to { opacity: 1; } }

  /* ── NEXT-STOP CARD ────────────────────────────────────────────────── */
  .arr-card {
    position: relative;
    z-index: 10;
    width: min(440px, 86vw);
    padding: 2.4rem 2.6rem 2.6rem;
    text-align: center;
    background: rgba(255, 253, 247, 0.82);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(26, 120, 200, 0.18);
    box-shadow: 0 40px 90px rgba(26, 120, 200, 0.22);
    opacity: 0;
    transform: translateY(28px) scale(0.94);
    will-change: transform, opacity;
  }
  .arr.is-in .arr-card {
    animation: arr-card-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 3.5s forwards;
  }
  @keyframes arr-card-in {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .arr-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
  }

  .arr-card-label {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.625rem;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1rem;
  }
  .arr-card-label::before,
  .arr-card-label::after {
    content: '';
    width: 18px; height: 1px;
    background: rgba(255, 31, 61, 0.4);
  }

  .arr-card-city {
    display: block;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(2.6rem, 7vw, 4.5rem);
    line-height: 0.92;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: #1A78C8;
    margin-bottom: 0.7rem;
  }

  .arr-card-date {
    display: block;
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.9375rem;
    letter-spacing: 0.04em;
    color: var(--accent);
    margin-bottom: 1.8rem;
  }

  .arr-card .btn-primary { width: 100%; justify-content: center; }

  /* ── reduced motion — show end state, skip the flight ──────────────── */
  @media (prefers-reduced-motion: reduce) {
    .arr-plane  { opacity: 1; transform: translateX(-50%) translateY(51vh); }
    .arr-card   { opacity: 1; transform: none; }
    .arr-eyebrow { opacity: 1; }
  }
`;

function PlaneSVG() {
  return (
    <svg className="arr-plane-svg" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="arrBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"   stopColor="#d4112c" />
          <stop offset="0.5" stopColor="#FF1F3D" />
          <stop offset="1"   stopColor="#b80d24" />
        </linearGradient>
      </defs>
      {/* tail stabilisers (far end) */}
      <path d="M60 30 L41 19 L41 26 L60 36 L79 26 L79 19 Z" fill="#b80d24" />
      {/* main swept wings */}
      <path d="M60 64 L9 96 L9 105 L60 80 L111 105 L111 96 Z" fill="url(#arrBody)" />
      {/* engines */}
      <rect x="32" y="78" width="8" height="15" rx="4" fill="#8f0a1c" />
      <rect x="80" y="78" width="8" height="15" rx="4" fill="#8f0a1c" />
      {/* fuselage */}
      <rect x="50.5" y="20" width="19" height="96" rx="9.5" fill="url(#arrBody)" />
      {/* nose toward viewer */}
      <path d="M50.5 106 a9.5 16 0 0 0 19 0 Z" fill="#ff4e63" />
      {/* cockpit */}
      <ellipse cx="60" cy="112" rx="5" ry="7" fill="rgba(255,255,255,0.55)" />
      {/* fuselage stripe */}
      <rect x="58.5" y="28" width="3" height="80" rx="1.5" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

export default function Arrival() {
  const { t } = useLang();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const next = TAPPE[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section
        className={`arr${inView ? ' is-in' : ''}`}
        id="arrival"
        ref={ref}
        aria-label={`${t.arrival.label}: ${next.city}`}
      >
        <div className="arr-scene" aria-hidden="true">
          <div className="arr-runway">
            <div className="arr-centerline" />
            <div className="arr-threshold" />
          </div>
          <div className="arr-plane-shadow" />
          <div className="arr-plane"><PlaneSVG /></div>
        </div>

        <span className="arr-eyebrow">{t.arrival.eyebrow}</span>

        <div className="arr-card">
          <span className="arr-card-label">{t.arrival.label}</span>
          <span className="arr-card-city">{next.city}</span>
          <span className="arr-card-date">{next.range}</span>
          <a className="btn-primary" href="#lineup">{t.arrival.cta}</a>
        </div>
      </section>
    </>
  );
}
