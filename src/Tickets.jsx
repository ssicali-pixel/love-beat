import { useState, useEffect, useRef } from 'react';
import { useLang } from './LangContext';

const TICKET_BASE = [
  { id: 'day',     label: 'Day Pass',      priceNormal: 45,  priceVip: 95,  hasVip: true,  hasDay: true,  featured: false },
  { id: 'weekend', label: 'Weekend Pass',  priceNormal: 80,  priceVip: 170, hasVip: true,  hasDay: false, featured: true  },
  { id: 'prive',   label: 'Privé Table',   priceNormal: 380,               hasVip: false, hasDay: false, featured: false },
];

const TICKET_IDX = Object.fromEntries(TICKET_BASE.map((t, i) => [t.id, i + 1]));

function TicketCard({ ticket, cardRef, onBuy, ts }) {
  const [vipCat, setVipCat] = useState('normal');

  const featured     = !!ticket.featured;
  const iconColor    = featured ? '#FAF8F2' : '#E00000';
  const displayPrice = ticket.hasVip
    ? (vipCat === 'vip' ? ticket.priceVip : ticket.priceNormal)
    : ticket.priceNormal;
  const perks = ticket.perks[ticket.hasVip ? vipCat : 'normal'] || [];

  return (
    <div
      className={`tk-card${featured ? ' tk-featured' : ''}`}
      ref={cardRef}
    >
      <span className="tk-bg-num">
        {String(TICKET_IDX[ticket.id] ?? 1).padStart(2, '0')}
      </span>

      <span className="tk-subtitle">{ticket.subtitle || ''}</span>
      <p className="tk-tier">{ticket.label}</p>

      <div className="tk-div" />

      <div className="tk-price-area">
        <div className="tk-price"><sup>€</sup>{displayPrice}</div>
        {ticket.hasVip && (
          <div className="tk-price-note">
            {vipCat === 'vip' ? ts.packageVip : ts.packageNormal}
          </div>
        )}
      </div>

      {ticket.hasVip && (
        <div className="tk-vip-toggle">
          {[['normal', 'Normal'], ['vip', 'VIP']].map(([id, lbl]) => (
            <button
              key={id} type="button"
              className={`tk-vip-opt${vipCat === id ? ' tk-vip-sel' : ''}`}
              onClick={() => setVipCat(id)}
            >{lbl}</button>
          ))}
        </div>
      )}

      <ul className="tk-perks">
        {perks.map(p => (
          <li key={p} className="tk-perk">
            <span className="tk-perk-ico"><CheckSvg color={iconColor} /></span>
            {p}
          </li>
        ))}
      </ul>

      <p className="tk-avail">{ts.available}</p>

      <button className="tk-btn" type="button" onClick={() => onBuy(ticket, vipCat)}>
        <span className="real">{ts.buy}</span>
        <span className="ghost" aria-hidden="true">{ts.buy}</span>
      </button>
    </div>
  );
}

const CSS = `
  /* ── Weekend selector ── */
  .tk-weeks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 3rem;
  }
  .tk-wk {
    background: #fff;
    border: 1px solid rgba(160,0,0,0.14);
    padding: 20px 24px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .tk-wk::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: #E00000;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .tk-wk:hover::after, .tk-wk.tk-wk-active::after { transform: scaleX(1); }
  .tk-wk.tk-wk-active { border-color: #E00000; box-shadow: 0 4px 24px rgba(160,0,0,0.12); }
  .tk-wk-label {
    font-family: var(--font-display);
    font-size: clamp(1rem, 1.8vw, 1.3rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: #B80000;
    display: block;
    margin-bottom: 4px;
  }
  .tk-wk-range {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(140,0,0,0.42);
    display: block;
  }

  /* ── Ticket grid ── */
  .tk-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 0;
  }

  .tk-card {
    position: relative;
    overflow: hidden;
    background: #fff;
    padding: 48px 36px 40px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 28px rgba(160,0,0,0.08);
    opacity: 0;
    transform: translateY(36px);
    transition:
      opacity   0.8s cubic-bezier(0.16,1,0.3,1),
      transform 0.8s cubic-bezier(0.16,1,0.3,1),
      box-shadow 0.3s ease;
  }
  .tk-card.tk-in { opacity: 1; transform: translateY(0); }
  .tk-card:not(.tk-featured):hover {
    box-shadow: 0 20px 60px rgba(160,0,0,0.16);
    transform: translateY(-8px);
  }
  .tk-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: #E00000;
    transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .tk-card:not(.tk-featured):hover::before { width: 8px; }
  .tk-card.tk-featured { background: #E00000; color: #FAF8F2; }
  .tk-card.tk-featured::before { background: rgba(250,248,242,0.35); }

  .tk-bg-num {
    position: absolute; right: -8px; bottom: -24px;
    font-family: var(--font-display); font-size: 180px; font-weight: 700;
    line-height: 1; letter-spacing: -0.04em;
    color: rgba(160,0,0,0.05); user-select: none; pointer-events: none;
  }
  .tk-featured .tk-bg-num { color: rgba(250,248,242,0.10); }

  .tk-subtitle {
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(140,0,0,0.45); margin-bottom: 10px; display: block;
  }
  .tk-featured .tk-subtitle { color: rgba(250,248,242,0.60); }

  .tk-tier {
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 2vw, 1.9rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.02em; line-height: 1;
    color: #B80000;
  }
  .tk-featured .tk-tier { color: #FAF8F2; }

  .tk-div {
    width: 100%; height: 1px;
    background: rgba(160,0,0,0.12); margin: 24px 0;
  }
  .tk-featured .tk-div { background: rgba(250,248,242,0.20); }

  /* price + VIP toggle */
  .tk-price-area { margin-bottom: 4px; }
  .tk-price {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 5vw, 5rem); font-weight: 700;
    line-height: 1; color: #B80000; display: flex; align-items: flex-start; gap: 3px;
  }
  .tk-price sup { font-size: 0.32em; margin-top: 13px; font-weight: 500; }
  .tk-featured .tk-price { color: #FAF8F2; }
  .tk-price-note {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(140,0,0,0.38); margin-top: 4px;
  }
  .tk-featured .tk-price-note { color: rgba(250,248,242,0.50); }

  /* VIP toggle */
  .tk-vip-toggle {
    display: flex; gap: 0; margin-top: 14px; margin-bottom: 4px;
  }
  .tk-vip-opt {
    flex: 1; padding: 8px; text-align: center; cursor: pointer;
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid rgba(160,0,0,0.18);
    color: rgba(140,0,0,0.45);
    background: transparent;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .tk-vip-opt + .tk-vip-opt { border-left: none; }
  .tk-vip-opt.tk-vip-sel { background: #E00000; border-color: #E00000; color: #FAF8F2; }
  .tk-vip-opt:not(.tk-vip-sel):hover { color: #B80000; border-color: rgba(160,0,0,0.35); }
  .tk-featured .tk-vip-opt { border-color: rgba(250,248,242,0.25); color: rgba(250,248,242,0.55); }
  .tk-featured .tk-vip-opt.tk-vip-sel { background: #FAF8F2; border-color: #FAF8F2; color: #B80000; }

  /* perks */
  .tk-perks { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 20px; flex: 1; }
  .tk-perk {
    font-family: var(--font-body); font-size: 0.8rem; font-weight: 500;
    color: rgba(140,0,0,0.68); display: flex; align-items: center; gap: 10px;
  }
  .tk-perk-ico {
    flex-shrink: 0; width: 15px; height: 15px;
    border: 1px solid rgba(224,0,0,0.25); display: flex; align-items: center; justify-content: center;
  }
  .tk-featured .tk-perk { color: rgba(250,248,242,0.80); }
  .tk-featured .tk-perk-ico { border-color: rgba(250,248,242,0.35); }

  .tk-avail {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; color: rgba(140,0,0,0.4);
    margin-top: 22px; margin-bottom: 18px; display: flex; align-items: center; gap: 6px;
  }
  .tk-avail::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #4CAF50; display: block; flex-shrink: 0; }
  .tk-featured .tk-avail { color: rgba(250,248,242,0.50); }
  .tk-featured .tk-avail::before { background: rgba(250,248,242,0.55); }

  /* ── .ticket variant ── */
  .tk-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0; width: 100%;
    font-family: var(--font-body); font-size: 12px;
    font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; border: none; border-radius: 100px;
    background: #E00000; color: #FAF8F2;
    transition: color 0.3s;
  }
  .tk-btn::before {
    content: ''; position: absolute;
    left: 50%; top: 50%;
    width: 20px; height: 20px; border-radius: 50%;
    background: #B80000;
    transform: translate(-50%,-50%) scale(0);
    transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .tk-btn:hover:not(:disabled)::before { transform: translate(-50%,-50%) scale(22); }
  .tk-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .tk-btn .real {
    display: block; position: relative; z-index: 1;
    padding: 22px 48px;
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .tk-btn .ghost {
    position: absolute; inset: 0; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    transform: translateY(100%);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .tk-btn:hover:not(:disabled) .real { transform: translateY(-100%); }
  .tk-btn:hover:not(:disabled) .ghost { transform: translateY(0); }
  .tk-featured .tk-btn { background: #FAF8F2; color: #B80000; }
  .tk-featured .tk-btn::before { background: rgba(245,240,232,0.96); }

  /* ── Modal ── */
  .tk-overlay {
    position: fixed; inset: 0;
    background: rgba(8,3,3,0.78); backdrop-filter: blur(6px);
    z-index: 300; display: flex; align-items: center; justify-content: center;
    padding: 2rem; animation: tk-fade 0.2s ease;
  }
  @keyframes tk-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes tk-rise { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .tk-modal {
    background: #fff; width: 100%; max-width: 500px; max-height: 90vh;
    overflow-y: auto; position: relative; overflow: hidden;
    animation: tk-rise 0.38s cubic-bezier(0.16,1,0.3,1);
  }
  .tk-modal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #E00000; }

  .tk-modal-inner { padding: 52px 44px 44px; }

  .tk-modal-close {
    position: absolute; top: 18px; right: 22px;
    background: transparent; border: none; font-size: 1.5rem;
    color: rgba(140,0,0,0.3); cursor: pointer; line-height: 1; transition: color 0.2s; padding: 0;
  }
  .tk-modal-close:hover { color: #E00000; }

  .tk-mwk {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(140,0,0,0.38); margin-bottom: 8px; display: block;
  }
  .tk-mhead { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; }
  .tk-mtype {
    font-family: var(--font-display); font-size: clamp(1.5rem,4vw,2rem);
    font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em;
    color: #B80000; line-height: 1;
  }
  .tk-mprice {
    font-family: var(--font-display); font-size: 2rem; font-weight: 700;
    color: #E00000; line-height: 1;
  }

  .tk-perf { border: none; border-top: 2px dashed rgba(160,0,0,0.15); margin: 20px -44px 24px; }

  /* Day selector (for day pass) */
  .tk-day-sel { display: flex; gap: 0; margin-bottom: 20px; }
  .tk-day-opt {
    flex: 1; padding: 10px; text-align: center; cursor: pointer;
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid rgba(160,0,0,0.16); color: rgba(140,0,0,0.5);
    background: transparent; transition: all 0.15s;
  }
  .tk-day-opt + .tk-day-opt { border-left: none; }
  .tk-day-opt.tk-day-sel-active { background: #E00000; border-color: #E00000; color: #FAF8F2; }

  /* Cat selector (Normal / VIP) */
  .tk-cat-sel { display: flex; gap: 0; margin-bottom: 20px; }
  .tk-cat-opt {
    flex: 1; padding: 10px; text-align: center; cursor: pointer;
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid rgba(160,0,0,0.16); color: rgba(140,0,0,0.5);
    background: transparent; transition: all 0.15s;
  }
  .tk-cat-opt + .tk-cat-opt { border-left: none; }
  .tk-cat-opt.tk-cat-active { background: #E00000; border-color: #E00000; color: #FAF8F2; }

  .tk-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 18px; }
  .tk-field label {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase; color: rgba(140,0,0,0.42);
  }
  .tk-field input {
    background: transparent; border: none; border-bottom: 1px solid rgba(160,0,0,0.15);
    color: #B80000; padding: 8px 0; font-family: var(--font-body); font-weight: 500;
    font-size: 0.9375rem; width: 100%; transition: border-color 0.2s;
  }
  .tk-field input:focus { outline: none; border-bottom-color: #E00000; }
  .tk-field input::placeholder { color: rgba(140,0,0,0.25); }

  .tk-qty-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .tk-qty-label { font-family: var(--font-body); font-size: 9px; font-weight: 500; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(140,0,0,0.42); }
  .tk-qty-ctrl { display: flex; align-items: center; border: 1px solid rgba(160,0,0,0.16); }
  .tk-qty-ctrl button {
    background: transparent; border: none; width: 36px; height: 36px;
    font-size: 1.1rem; color: #E00000; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  }
  .tk-qty-ctrl button:hover:not(:disabled) { background: rgba(224,0,0,0.07); }
  .tk-qty-ctrl button:disabled { opacity: 0.28; cursor: not-allowed; }
  .tk-qty-ctrl span {
    min-width: 36px; text-align: center; font-family: var(--font-display); font-weight: 700; font-size: 1rem;
    color: #B80000; border-left: 1px solid rgba(160,0,0,0.16); border-right: 1px solid rgba(160,0,0,0.16); line-height: 36px;
  }

  .tk-total {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 0; border-top: 1px solid rgba(160,0,0,0.10); border-bottom: 1px solid rgba(160,0,0,0.10); margin-bottom: 22px;
  }
  .tk-total-lbl { font-family: var(--font-body); font-size: 9px; font-weight: 500; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(140,0,0,0.42); }
  .tk-total-amt { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: #E00000; line-height: 1; }

  .tk-err { font-family: var(--font-body); font-size: 0.8rem; color: #E00000; margin-bottom: 12px; }

  .tk-submit { justify-content: center; }

  /* Success */
  .tk-success { text-align: center; padding: 52px 44px 44px; }
  .tk-success-icon { width: 50px; height: 50px; border-radius: 50%; background: #E00000; color: #FAF8F2; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
  .tk-success-order { font-family: var(--font-body); font-size: 9px; font-weight: 500; letter-spacing: 0.26em; text-transform: uppercase; color: rgba(140,0,0,0.4); margin-bottom: 12px; }
  .tk-success h3 { font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; color: #B80000; margin-bottom: 8px; }
  .tk-success p { font-family: var(--font-body); font-size: 0.875rem; color: rgba(140,0,0,0.56); line-height: 1.65; margin-bottom: 4px; }
  .tk-success p strong { color: #B80000; font-weight: 500; }
  .tk-success .tk-btn { margin-top: 24px; justify-content: center; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .tk-weeks { grid-template-columns: 1fr; }
    .tk-grid { grid-template-columns: 1fr; max-width: 440px; margin-left: auto; margin-right: auto; }
  }
  @media (max-width: 540px) {
    .tk-card { padding: 36px 24px 32px; }
    .tk-modal-inner, .tk-success { padding: 40px 24px 32px; }
    .tk-perf { margin-left: -24px; margin-right: -24px; }
  }
`;

const CheckSvg = ({ color }) => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M1 4.5l2.5 2.5 4.5-5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Modal({ ticket, weekend, initialCat, onClose, tm }) {
  const [cat,     setCat]     = useState(initialCat || 'normal');
  const [dayIdx,  setDayIdx]  = useState(0);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [qty,     setQty]     = useState(1);
  const [state,   setState]   = useState('idle');
  const [orderId, setOrderId] = useState('');
  const [errMsg,  setErrMsg]  = useState('');

  const effectiveCat = ticket.hasVip ? cat : 'normal';
  const unitPrice = ticket.hasVip
    ? (cat === 'vip' ? ticket.priceVip : ticket.priceNormal)
    : ticket.priceNormal;
  const total = unitPrice * qty;
  const selectedDate = ticket.hasDay ? weekend.dates[dayIdx] : null;

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const submit = async e => {
    e.preventDefault();
    setState('loading');
    setErrMsg('');
    try {
      const res  = await fetch('/api/tickets/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketType: ticket.id,
          category:   effectiveCat,
          weekendId:  weekend.id,
          date:       selectedDate,
          quantity:   qty,
          name, email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setOrderId(data.orderId);
      setState('success');
    } catch (err) {
      setErrMsg(err.message);
      setState('error');
    }
  };

  return (
    <div className="tk-overlay" onClick={onClose}>
      <div className="tk-modal" onClick={e => e.stopPropagation()}>
        <button className="tk-modal-close" onClick={onClose}>×</button>

        {state === 'success' ? (
          <div className="tk-success">
            <div className="tk-success-icon">✓</div>
            <p className="tk-success-order">{orderId}</p>
            <h3>{tm.confirmed}</h3>
            <p>{qty}× {ticket.label}{effectiveCat === 'vip' ? ' VIP' : ''} — €{total}</p>
            <p>{weekend.label} · {weekend.range}</p>
            <p>{tm.confirmEmail} <strong>{email}</strong></p>
            <button className="tk-btn" onClick={onClose}>
              <span className="real">{tm.close}</span>
              <span className="ghost" aria-hidden="true">{tm.close}</span>
            </button>
          </div>
        ) : (
          <div className="tk-modal-inner">
            <span className="tk-mwk">{weekend.label} · {weekend.range}</span>
            <div className="tk-mhead">
              <span className="tk-mtype">{ticket.label}</span>
              <span className="tk-mprice">€{unitPrice}</span>
            </div>

            <hr className="tk-perf" />

            <form onSubmit={submit}>
              {ticket.hasDay && (
                <>
                  <div className="tk-field"><label>{tm.day}</label></div>
                  <div className="tk-day-sel">
                    {weekend.dayLabels.map((lbl, i) => (
                      <button
                        key={lbl} type="button"
                        className={`tk-day-opt${dayIdx === i ? ' tk-day-sel-active' : ''}`}
                        onClick={() => setDayIdx(i)}
                      >{lbl}</button>
                    ))}
                  </div>
                </>
              )}

              {ticket.hasVip && (
                <>
                  <div className="tk-field"><label>{tm.category}</label></div>
                  <div className="tk-cat-sel">
                    {[['normal', `Normal — €${ticket.priceNormal}`], ['vip', `VIP — €${ticket.priceVip}`]].map(([id, lbl]) => (
                      <button
                        key={id} type="button"
                        className={`tk-cat-opt${cat === id ? ' tk-cat-active' : ''}`}
                        onClick={() => setCat(id)}
                      >{lbl}</button>
                    ))}
                  </div>
                </>
              )}

              <div className="tk-field">
                <label htmlFor="tk-name">{tm.fullName}</label>
                <input id="tk-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Mario Rossi" autoComplete="name" />
              </div>
              <div className="tk-field">
                <label htmlFor="tk-email">Email</label>
                <input id="tk-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="mario@example.com" autoComplete="email" />
              </div>

              <div className="tk-qty-row">
                <span className="tk-qty-label">{tm.qty(ticket.id === 'prive')}</span>
                <div className="tk-qty-ctrl">
                  <button type="button" disabled={qty <= 1} onClick={() => setQty(q => q - 1)}>−</button>
                  <span>{qty}</span>
                  <button type="button" disabled={qty >= 6} onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>

              <div className="tk-total">
                <span className="tk-total-lbl">{tm.total}</span>
                <span className="tk-total-amt">€{total}</span>
              </div>

              {state === 'error' && <p className="tk-err">{errMsg}</p>}

              <button className="tk-btn tk-submit" type="submit" disabled={state === 'loading'}>
                <span className="real">{state === 'loading' ? tm.processing : tm.confirmOrder}</span>
                <span className="ghost" aria-hidden="true">{state === 'loading' ? tm.processing : tm.confirmOrder}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Tickets() {
  const { t, weekends } = useLang();
  const ts = t.tickets;
  const [selectedWeekend, setSelectedWeekend] = useState('w1');
  const [modal,           setModal]           = useState(null);
  const cardsRef = useRef([]);

  const TICKETS = [
    { ...TICKET_BASE[0], subtitle: ts.daySubtitle,     perks: ts.dayPerks     },
    { ...TICKET_BASE[1], subtitle: ts.weekendSubtitle, perks: ts.weekendPerks },
    { ...TICKET_BASE[2], subtitle: ts.priveSubtitle,   perks: ts.privePerks   },
  ];

  useEffect(() => {
    const handler = e => setSelectedWeekend(e.detail.weekendId);
    window.addEventListener('selectWeekend', handler);
    return () => window.removeEventListener('selectWeekend', handler);
  }, []);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cards.forEach((c, i) => setTimeout(() => c.classList.add('tk-in'), i * 160));
      },
      { threshold: 0.08 }
    );
    if (cards[0]?.parentElement) observer.observe(cards[0].parentElement);
    return () => observer.disconnect();
  }, []);

  const weekend = weekends.find(w => w.id === selectedWeekend) || weekends[0];

  const openModal = (ticket, cat = 'normal') => setModal({ ticket, cat });

  return (
    <>
      <style>{CSS}</style>

      <section className="section" id="tickets">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">{ts.title[0]}<span>{ts.title[1]}</span></h2>
          </header>

          {/* Weekend picker */}
          <div className="tk-weeks">
            {weekends.map(w => (
              <button
                key={w.id} type="button"
                className={`tk-wk${selectedWeekend === w.id ? ' tk-wk-active' : ''}`}
                onClick={() => setSelectedWeekend(w.id)}
              >
                <span className="tk-wk-label">{w.label}</span>
                <span className="tk-wk-range">{w.range}</span>
              </button>
            ))}
          </div>

          {/* Ticket cards */}
          <div className="tk-grid">
            {TICKETS.map((tk, i) => (
              <TicketCard
                key={tk.id}
                ticket={tk}
                cardRef={el => (cardsRef.current[i] = el)}
                onBuy={openModal}
                ts={ts}
              />
            ))}
          </div>
        </div>
      </section>

      {modal && (
        <Modal
          ticket={modal.ticket}
          weekend={weekend}
          initialCat={modal.cat}
          onClose={() => setModal(null)}
          tm={ts.modal}
        />
      )}
    </>
  );
}
