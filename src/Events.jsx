import { useState, useEffect, useRef } from 'react';
import { useLang } from './LangContext';
import { TAPPE, STAGES } from './data/festival';

// ── Shared data ────────────────────────────────────────────────────────────

const TICKET_BASE = [
  { id: 'day',     label: 'Day Pass',     priceNormal: 45,  priceVip: 95,  hasVip: true,  hasDay: true,  featured: false },
  { id: 'weekend', label: 'Weekend Pass', priceNormal: 80,  priceVip: 170, hasVip: true,  hasDay: false, featured: true  },
  { id: 'prive',   label: 'Privé Table',  priceNormal: 380,               hasVip: false, hasDay: false, featured: false },
];

const STAGE_LABELS   = { main: 'Main Stage', porto: 'Porto Stage', cave: 'Cave Stage' };
const STAGE_COLORS   = { main: '#FF1F3D', porto: '#B84000', cave: '#2A1A1A' };

// ── Wave paths (calcolati una volta, mai rigenerati) ───────────────────────
const WAVE_PATHS = (() => {
  const W = 1440, AMP = 30, FREQ = 0.018;
  const centerYs = [300, 650, 1000, 1350, 1700];
  return centerYs.map((cy, i) => {
    const ph = i * 0.3;
    let d = '';
    for (let x = 0; x <= W; x += 4) {
      const y = +(cy + AMP * Math.sin(x * FREQ + ph)).toFixed(1);
      d += x === 0 ? `M0,${y}` : ` L${x},${y}`;
    }
    return d;
  });
})();

// ── CSS ────────────────────────────────────────────────────────────────────

const CSS = `
  /* ══ WEEKEND SELECTOR ══════════════════════════════════════════════════ */
  .ev-weekends {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 2.5rem;
  }
  .ev-wk-btn {
    background: #fff;
    border: 1.5px solid rgba(26,120,200,0.18);
    padding: 28px 28px 24px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.42s, box-shadow 0.42s, transform 0.42s cubic-bezier(0.16,1,0.3,1);
  }
  /* fill sweep on active */
  .ev-wk-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #FF1F3D;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.52s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .ev-wk-btn.ev-wk-active::before { transform: scaleY(1); }
  /* large decorative number */
  .ev-wk-btn::after {
    content: attr(data-n);
    position: absolute;
    right: 14px; bottom: -16px;
    font-family: var(--font-display);
    font-size: 120px;
    font-weight: 700;
    letter-spacing: -0.06em;
    line-height: 1;
    color: rgba(26,120,200,0.055);
    pointer-events: none;
    z-index: 0;
    transition: color 0.42s;
  }
  .ev-wk-btn > * { position: relative; z-index: 1; }
  .ev-wk-btn:hover:not(.ev-wk-active) {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(26,120,200,0.13);
    border-color: rgba(26,120,200,0.35);
  }
  .ev-wk-btn.ev-wk-active {
    border-color: #FF1F3D;
    box-shadow: 0 10px 42px rgba(255,31,61,0.28);
    transform: translateY(-2px);
  }
  .ev-wk-btn.ev-wk-active::after { color: rgba(255,255,255,0.07); }
  .ev-wk-btn.ev-wk-active .ev-wk-label { color: #FFFFFF; }
  .ev-wk-btn.ev-wk-active .ev-wk-range { color: rgba(255,255,255,0.68); }
  .ev-wk-btn.ev-wk-active .ev-wk-count { color: rgba(255,255,255,0.52); }
  .ev-wk-btn.ev-wk-active .ev-wk-count::before { background: rgba(255,255,255,0.65); }

  .ev-wk-label {
    font-family: var(--font-display);
    font-size: clamp(1.2rem, 2vw, 1.75rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: #1A78C8;
    display: block;
    margin-bottom: 8px;
    transition: color 0.42s;
  }
  .ev-wk-range {
    font-family: var(--font-body);
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(26,120,200,0.65);
    display: block;
    margin-bottom: 18px;
    transition: color 0.42s;
  }
  .ev-wk-count {
    font-family: var(--font-body);
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(26,120,200,0.48);
    transition: color 0.42s;
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .ev-wk-count::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #FF1F3D;
    flex-shrink: 0;
    transition: background 0.42s;
  }

  /* ══ DAY / STAGE CONTROLS ════════════════════════════════════════════ */
  .ev-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  /* ── stage-primary : day selector ── */
  .ev-days { display: flex; gap: 8px; }
  .ev-day-btn {
    position: relative; overflow: hidden;
    font-family: var(--font-body);
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    background: transparent;
    border: 1px solid rgba(26,120,200,0.25);
    color: rgba(26,120,200,0.60);
    padding: 0; cursor: pointer;
    border-radius: 100px;
    transition: color 0.3s, border-color 0.3s;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .ev-day-btn::before {
    content: ''; position: absolute;
    left: 50%; top: 50%;
    width: 20px; height: 20px; border-radius: 50%;
    background: #FF1F3D;
    transform: translate(-50%,-50%) scale(0);
    transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .ev-day-btn:hover::before,
  .ev-day-btn.ev-day-active::before { transform: translate(-50%,-50%) scale(22); }
  .ev-day-btn:hover,
  .ev-day-btn.ev-day-active { color: #FFFDF7; border-color: #FF1F3D; }
  .ev-day-btn .real {
    display: block; position: relative; z-index: 1;
    padding: 16px 36px;
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .ev-day-btn .ghost {
    position: absolute; inset: 0; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    transform: translateY(100%);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .ev-day-btn:hover .real,
  .ev-day-btn.ev-day-active .real { transform: translateY(-100%); }
  .ev-day-btn:hover .ghost,
  .ev-day-btn.ev-day-active .ghost { transform: translateY(0); }

  /* ── stage-secondary : stage filters ── */
  .ev-stage-filters { display: flex; gap: 8px; }
  .ev-stage-btn {
    position: relative; overflow: hidden;
    font-family: var(--font-body);
    font-size: 9px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    background: transparent;
    border: 1px solid rgba(26,120,200,0.18);
    color: rgba(26,120,200,0.45);
    padding: 0; cursor: pointer;
    border-radius: 100px; opacity: 0.4;
    transition: color 0.3s, border-color 0.3s, opacity 0.3s;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .ev-stage-btn::before {
    content: ''; position: absolute;
    left: 50%; top: 50%;
    width: 20px; height: 20px; border-radius: 50%;
    background: #FF1F3D;
    transform: translate(-50%,-50%) scale(0);
    transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
    z-index: 0;
  }
  .ev-stage-btn:hover::before,
  .ev-stage-btn.ev-stage-active::before { transform: translate(-50%,-50%) scale(22); }
  .ev-stage-btn:hover,
  .ev-stage-btn.ev-stage-active { opacity: 1; color: #FFFDF7; border-color: #FF1F3D; }
  .ev-stage-btn .real {
    display: block; position: relative; z-index: 1;
    padding: 12px 26px;
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .ev-stage-btn .ghost {
    position: absolute; inset: 0; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    transform: translateY(100%);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  .ev-stage-btn:hover .real,
  .ev-stage-btn.ev-stage-active .real { transform: translateY(-100%); }
  .ev-stage-btn:hover .ghost,
  .ev-stage-btn.ev-stage-active .ghost { transform: translateY(0); }

  /* ══ ARTIST LIST ═════════════════════════════════════════════════════ */
  .ev-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ev-header-row { display: none; }

  .ev-row {
    display: grid;
    grid-template-columns: minmax(180px, 220px) 1fr 52px;
    gap: 1.5rem 2rem;
    align-items: center;
    padding: 20px 24px;
    background: #fff;
    border: 1px solid rgba(26,120,200,0.10);
    box-shadow: 0 2px 16px rgba(26,120,200,0.05);
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, border-color 0.2s;
  }
  .ev-row:hover {
    transform: translateY(-3px);
    border-color: rgba(255,31,61,0.28);
    box-shadow: 0 12px 40px rgba(26,120,200,0.14);
  }

  .ev-avatar {
    width: 100%;
    aspect-ratio: 1;
    max-width: 220px;
    max-height: 220px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
    background: rgba(26,120,200,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(26,120,200,0.12);
  }
  .ev-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ev-avatar-fallback {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 700;
    color: rgba(26,120,200,0.45);
    text-transform: uppercase;
  }

  .ev-row-content { min-width: 0; display: flex; flex-direction: column; gap: 10px; }
  .ev-row-top {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ev-time {
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    font-weight: 700;
    color: #FF1F3D;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }

  .ev-name {
    font-family: var(--font-display);
    font-size: clamp(1.7rem, 3.8vw, 2.8rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.95;
    color: #1A78C8;
  }

  .ev-hl-badge {
    display: inline-block;
    font-family: var(--font-body);
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #FFFDF7;
    background: #FF1F3D;
    padding: 4px 10px;
  }

  .ev-genre {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    color: rgba(26,120,200,0.55);
    line-height: 1.4;
  }

  .ev-stage-badge {
    font-family: var(--font-body);
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 5px 12px;
    border: 1px solid;
    white-space: nowrap;
    align-self: flex-start;
  }

  .ev-arrow {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(26,120,200,0.22);
    text-align: center;
    transition: color 0.2s, transform 0.2s;
  }
  .ev-row:hover .ev-arrow { color: #FF1F3D; transform: translateX(4px); }

  .ev-empty {
    text-align: center; padding: 4rem 0;
    font-family: var(--font-body); font-size: 0.875rem;
    color: rgba(26,120,200,0.40); letter-spacing: 0.1em;
  }

  /* ══ ARTIST MODAL ════════════════════════════════════════════════════ */
  .ev-overlay {
    position: fixed; inset: 0;
    background: rgba(8,3,3,0.80); backdrop-filter: blur(6px);
    z-index: 300; display: flex; align-items: center; justify-content: center;
    padding: 2rem; animation: ev-fade 0.2s ease;
  }
  @keyframes ev-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ev-rise { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .ev-modal {
    background: #fff; width: 100%; max-width: 720px; max-height: 92vh;
    overflow-y: auto; position: relative;
    animation: ev-rise 0.38s cubic-bezier(0.16,1,0.3,1);
  }
  .ev-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 4px; background: #FF1F3D;
  }
  .ev-modal-inner { padding: 56px 48px 48px; }
  .ev-modal-close {
    position: absolute; top: 18px; right: 22px;
    background: transparent; border: none; font-size: 1.5rem;
    color: rgba(26,120,200,0.3); cursor: pointer; line-height: 1; transition: color 0.2s; padding: 0;
  }
  .ev-modal-close:hover { color: #FF1F3D; }

  .ev-modal-time-stage { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .ev-modal-time { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: #FF1F3D; }
  .ev-modal-stage-badge {
    font-family: var(--font-body); font-size: 8px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 10px; border: 1px solid;
  }

  .ev-modal-name {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.02em; line-height: 0.92;
    color: #1A78C8; margin-bottom: 6px;
  }
  .ev-modal-hl {
    display: inline-block; font-family: var(--font-body);
    font-size: 8px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
    background: #FF1F3D; color: #FFFDF7; padding: 3px 8px;
    margin-left: 12px; vertical-align: middle; position: relative; top: -6px;
  }
  .ev-modal-meta {
    font-family: var(--font-body); font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(26,120,200,0.4); margin-bottom: 28px;
  }
  .ev-modal-divider { border: none; border-top: 1px solid rgba(26,120,200,0.10); margin: 0 0 24px; }
  .ev-modal-bio {
    font-family: var(--font-body); font-weight: 500; font-size: 0.9375rem;
    color: rgba(26,120,200,0.72); line-height: 1.78; margin-bottom: 28px;
  }
  .ev-modal-tracks-label {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(26,120,200,0.38); margin-bottom: 12px; display: block;
  }
  .ev-modal-tracks { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 28px; }
  .ev-modal-track {
    font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
    color: rgba(26,120,200,0.62); display: flex; align-items: center; gap: 10px;
  }
  .ev-modal-track-num {
    font-family: var(--font-display); font-size: 0.75rem; font-weight: 700;
    color: rgba(255,31,61,0.3); min-width: 18px;
  }
  .ev-modal-stage-box {
    background: rgba(26,120,200,0.04); padding: 16px 20px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  }
  .ev-modal-stage-name {
    font-family: var(--font-display); font-size: 1rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.01em; color: #1A78C8;
  }
  .ev-modal-stage-loc {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(26,120,200,0.4); margin-top: 3px;
  }
  .ev-modal-stage-cap {
    font-family: var(--font-display); font-size: 1.5rem; font-weight: 700;
    color: rgba(26,120,200,0.25); text-align: right; line-height: 1;
  }
  .ev-modal-hero {
    display: flex; align-items: center; gap: 20px; margin-bottom: 20px;
  }
  .ev-modal-avatar {
    width: 120px; height: 120px; flex-shrink: 0; overflow: hidden;
    border-radius: 6px; background: rgba(26,120,200,0.07);
    box-shadow: 0 6px 24px rgba(26,120,200,0.14);
    display: flex; align-items: center; justify-content: center;
  }
  .ev-modal-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ev-modal-avatar-fallback {
    font-family: var(--font-display); font-size: 1.5rem; font-weight: 700;
    color: rgba(26,120,200,0.5); text-transform: uppercase;
  }
  .ev-modal-head { min-width: 0; flex: 1; }

  .ev-modal-tickets-label {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(26,120,200,0.38); margin: 28px 0 12px; display: block;
  }
  .ev-modal-wk-meta {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(26,120,200,0.32); margin-bottom: 12px;
  }

  .ev-ticket-subs { display: flex; flex-direction: column; gap: 12px; }

  .ev-ticket-sub {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    gap: 4px 20px;
    align-items: start;
    width: 100%;
    padding: 22px 24px 20px;
    border: 1px solid rgba(26,120,200,0.12);
    background: linear-gradient(135deg, #fff 0%, #FDF9F4 100%);
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  .ev-ticket-sub::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: rgba(255,31,61,0.25);
    transition: width 0.25s, background 0.25s;
  }
  .ev-ticket-sub:hover {
    border-color: rgba(26,120,200,0.28);
    box-shadow: 0 10px 36px rgba(26,120,200,0.10);
    transform: translateY(-2px);
  }
  .ev-ticket-sub:hover::before { width: 6px; background: #FF1F3D; }

  .ev-ticket-sub.ev-ticket-sub-active {
    border-color: #FF1F3D;
    background: linear-gradient(135deg, #fff 0%, rgba(255,31,61,0.04) 100%);
    box-shadow: 0 12px 44px rgba(26,120,200,0.16);
  }
  .ev-ticket-sub.ev-ticket-sub-active::before { width: 6px; background: #FF1F3D; }

  .ev-ticket-sub.ev-ticket-sub-featured {
    border-color: #1A78C8;
    background: linear-gradient(145deg, #2A88D8 0%, #1A78C8 100%);
    color: #FFFDF7;
    box-shadow: 0 14px 48px rgba(26,120,200,0.28);
  }
  .ev-ticket-sub.ev-ticket-sub-featured::before { background: rgba(250,248,242,0.5); width: 5px; }
  .ev-ticket-sub.ev-ticket-sub-featured:hover { box-shadow: 0 18px 56px rgba(26,120,200,0.36); }
  .ev-ticket-sub.ev-ticket-sub-featured.ev-ticket-sub-active {
    box-shadow: 0 20px 60px rgba(26,120,200,0.42);
    outline: 2px solid rgba(250,248,242,0.35);
    outline-offset: 2px;
  }

  .ev-ticket-sub-num {
    grid-row: 1 / 3;
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    color: rgba(26,120,200,0.08);
    letter-spacing: -0.04em;
    align-self: center;
    min-width: 44px;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-num { color: rgba(250,248,242,0.15); }

  .ev-ticket-sub-badge {
    grid-column: 2;
    font-family: var(--font-body);
    font-size: 7px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #FFFDF7;
    background: rgba(250,248,242,0.18);
    padding: 4px 10px;
    align-self: start;
    margin-bottom: 2px;
    width: fit-content;
  }

  .ev-ticket-sub-info { grid-column: 2; min-width: 0; }
  .ev-ticket-sub-tier {
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 2.5vw, 1.35rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1;
    color: #1A78C8;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-tier { color: #FFFDF7; }

  .ev-ticket-sub-desc {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(26,120,200,0.45);
    margin-top: 6px;
    display: block;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-desc { color: rgba(250,248,242,0.65); }

  .ev-ticket-sub-perks {
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 500;
    color: rgba(26,120,200,0.58);
    margin-top: 10px;
    line-height: 1.55;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-perks { color: rgba(250,248,242,0.78); }

  .ev-ticket-sub-price-col {
    grid-column: 3;
    grid-row: 1 / 3;
    text-align: right;
    align-self: center;
  }
  .ev-ticket-sub-price {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 700;
    color: #FF1F3D;
    line-height: 1;
    white-space: nowrap;
    display: block;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-price { color: #FFFDF7; }
  .ev-ticket-sub-price sup { font-size: 0.4em; font-weight: 500; vertical-align: top; }

  .ev-ticket-sub-from {
    font-family: var(--font-body);
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(26,120,200,0.38);
    margin-top: 4px;
    display: block;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-from { color: rgba(250,248,242,0.5); }

  .ev-ticket-sub-cta {
    grid-column: 2 / 4;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(26,120,200,0.35);
    margin-top: 4px;
    text-align: right;
  }
  .ev-ticket-sub-active .ev-ticket-sub-cta,
  .ev-ticket-sub:hover .ev-ticket-sub-cta { color: #FF1F3D; }
  .ev-ticket-sub-featured .ev-ticket-sub-cta { color: rgba(250,248,242,0.45); }
  .ev-ticket-sub-featured.ev-ticket-sub-active .ev-ticket-sub-cta { color: #FFFDF7; }

  .ev-ticket-sub-vip {
    grid-column: 1 / -1;
    display: flex;
    gap: 0;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(26,120,200,0.10);
  }
  .ev-ticket-sub-featured .ev-ticket-sub-vip { border-top-color: rgba(250,248,242,0.2); }
  .ev-ticket-sub-vip button {
    flex: 1;
    padding: 10px;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 1px solid rgba(26,120,200,0.16);
    background: rgba(255,255,255,0.6);
    color: rgba(26,120,200,0.55);
    cursor: pointer;
    transition: all 0.15s;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-vip button {
    border-color: rgba(250,248,242,0.25);
    background: rgba(0,0,0,0.15);
    color: rgba(250,248,242,0.7);
  }
  .ev-ticket-sub-vip button + button { border-left: none; }
  .ev-ticket-sub-vip button.ev-vip-on {
    background: #FF1F3D;
    border-color: #FF1F3D;
    color: #FFFDF7;
  }
  .ev-ticket-sub-featured .ev-ticket-sub-vip button.ev-vip-on {
    background: #FFFDF7;
    border-color: #FFFDF7;
    color: #8B0000;
  }

  .ev-modal-checkout {
    margin-top: 24px;
    padding: 24px;
    background: radial-gradient(120% 140% at 0% 0%, rgba(255,31,61,0.08) 0%, rgba(255,255,255,0.92) 55%);
    border: 1px solid rgba(26,120,200,0.16);
    box-shadow: 0 14px 40px rgba(26,120,200,0.12);
  }
  .ev-modal-checkout-title {
    font-family: var(--font-display); font-size: 1.2rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.02em; color: #1A78C8;
    margin-bottom: 16px;
  }

  .pm-wk {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: rgba(26,120,200,0.38); margin-bottom: 8px; display: block;
  }
  .pm-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; }
  .pm-type {
    font-family: var(--font-display); font-size: clamp(1.5rem,4vw,2rem);
    font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em;
    color: #1A78C8; line-height: 1;
  }
  .pm-price { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: #FF1F3D; line-height: 1; }

  .pm-perf { border: none; border-top: 2px dashed rgba(26,120,200,0.15); margin: 20px -44px 24px; }

  .pm-toggle-row { display: flex; gap: 0; margin-bottom: 20px; }
  .pm-toggle-opt {
    flex: 1; padding: 10px; text-align: center; cursor: pointer;
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid rgba(26,120,200,0.16); color: rgba(26,120,200,0.5);
    background: transparent; transition: all 0.15s;
  }
  .pm-toggle-opt + .pm-toggle-opt { border-left: none; }
  .pm-toggle-opt.pm-toggle-active { background: #FF1F3D; border-color: #FF1F3D; color: #FFFDF7; }

  .pm-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 18px; }
  .pm-field label {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase; color: rgba(26,120,200,0.42);
  }
  .pm-field input {
    background: rgba(255,255,255,0.9); border: 1px solid rgba(26,120,200,0.15);
    color: #1A78C8; padding: 10px 12px;
    font-family: var(--font-body); font-weight: 500; font-size: 0.9375rem; width: 100%;
    transition: border-color 0.2s;
  }
  .pm-field input:focus { outline: none; border-color: #FF1F3D; box-shadow: 0 0 0 3px rgba(255,31,61,0.12); }
  .pm-field input::placeholder { color: rgba(26,120,200,0.25); }

  .pm-qty-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .pm-qty-lbl {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase; color: rgba(26,120,200,0.42);
  }
  .pm-qty-ctrl { display: flex; align-items: center; border: 1px solid rgba(26,120,200,0.16); }
  .pm-qty-ctrl button {
    background: transparent; border: none; width: 36px; height: 36px;
    font-size: 1.1rem; color: #FF1F3D; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  }
  .pm-qty-ctrl button:hover:not(:disabled) { background: rgba(255,31,61,0.07); }
  .pm-qty-ctrl button:disabled { opacity: 0.28; cursor: not-allowed; }
  .pm-qty-ctrl span {
    min-width: 36px; text-align: center;
    font-family: var(--font-display); font-weight: 700; font-size: 1rem;
    color: #1A78C8;
    border-left: 1px solid rgba(26,120,200,0.16);
    border-right: 1px solid rgba(26,120,200,0.16);
    line-height: 36px;
  }

  .pm-total {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 0;
    border-top: 1px solid rgba(26,120,200,0.18);
    border-bottom: 1px solid rgba(26,120,200,0.18);
    margin-bottom: 22px;
  }
  .pm-total-lbl {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.24em; text-transform: uppercase; color: rgba(26,120,200,0.42);
  }
  .pm-total-amt { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: #FF1F3D; line-height: 1; }

  .pm-err { font-family: var(--font-body); font-size: 0.8rem; color: #FF1F3D; margin-bottom: 12px; }

  .pm-submit {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; font-family: var(--font-body); font-size: 10px;
    font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; border: none; background: #FF1F3D; color: #FFFDF7; width: 100%;
    box-shadow: 0 10px 24px rgba(26,120,200,0.25);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .pm-submit:hover:not(:disabled) { background: #D91030; transform: translateY(-2px); box-shadow: 0 14px 30px rgba(255,31,61,0.33); }
  .pm-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .pm-success { text-align: center; padding: 52px 44px 44px; }
  .pm-success-icon {
    width: 50px; height: 50px; border-radius: 50%;
    background: #FF1F3D; color: #FFFDF7; font-size: 1.4rem;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
  }
  .pm-success-order {
    font-family: var(--font-body); font-size: 9px; font-weight: 500;
    letter-spacing: 0.26em; text-transform: uppercase; color: rgba(26,120,200,0.4); margin-bottom: 12px;
  }
  .pm-success h3 {
    font-family: var(--font-display); font-size: 1.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: -0.02em; color: #1A78C8; margin-bottom: 8px;
  }
  .pm-success p { font-family: var(--font-body); font-size: 0.875rem; color: rgba(26,120,200,0.56); line-height: 1.65; margin-bottom: 4px; }
  .pm-success p strong { color: #1A78C8; font-weight: 500; }
  .pm-success .pm-submit { margin-top: 24px; justify-content: center; }

  /* ══ RESPONSIVE ══════════════════════════════════════════════════════ */
  @media (max-width: 1080px) {
    .ev-weekends { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .ev-weekends { grid-template-columns: 1fr; gap: 8px; }
  }
  @media (max-width: 760px) {
    .ev-row {
      grid-template-columns: 120px 1fr 40px;
      gap: 1rem 1.25rem;
      padding: 16px 18px;
    }
    .ev-avatar { max-width: 140px; max-height: 140px; }
    .ev-controls { flex-direction: column; align-items: flex-start; }
    .ev-ticket-sub {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto auto;
    }
    .ev-ticket-sub-price-col { grid-column: 2; grid-row: auto; text-align: left; margin-top: 8px; }
    .ev-ticket-sub-cta { grid-column: 1 / -1; text-align: left; }
  }
  @media (max-width: 520px) {
    .ev-row {
      grid-template-columns: 100px 1fr 36px;
      padding: 14px;
    }
    .ev-avatar { max-width: 110px; max-height: 110px; border-radius: 4px; }
    .ev-modal-inner, .pm-inner, .pm-success { padding: 44px 24px 32px; }
    .pm-perf { margin-left: -24px; margin-right: -24px; }
  }

  /* ══ WAVE DECORATIVE ════════════════════════════════════════════════ */
  #lineup { position: relative; overflow: hidden; isolation: isolate; }
  .ev-waves {
    position: absolute;
    top: clamp(260px, 32vh, 400px);   /* sotto il titolo LINE-UP, non lo attraversa */
    left: 0; right: 0;
    height: 1000px;                   /* altezza fissa: non si stira al cambio giorno */
    z-index: -1;
    pointer-events: none;
    clip-path: inset(0 calc((1 - var(--wave-prog, 0)) * 100%) 0 0);
  }
  .ev-wave-svg { display: block; width: 100%; height: 100%; }
  .ev-wave {
    fill: none;
    stroke: #FF1F3D;
    stroke-width: 32;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

// ── Helper components ──────────────────────────────────────────────────────

function ArtistAvatar({ name, slug }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="ev-avatar">
      {!err
        ? <img src={`/artists/${slug}.jpg`} alt={name} onError={() => setErr(true)} />
        : <span className="ev-avatar-fallback">{initials}</span>
      }
    </div>
  );
}

function ModalAvatar({ name, slug }) {
  const [err, setErr] = useState(false);
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="ev-modal-avatar">
      {!err
        ? <img src={`/artists/${slug}.jpg`} alt={name} onError={() => setErr(true)} />
        : <span className="ev-modal-avatar-fallback">{initials}</span>
      }
    </div>
  );
}

function ArtistModal({ artist, stages, weekend, onClose, te, ts, weekends }) {
  const TICKETS = [
    { ...TICKET_BASE[0], subtitle: ts.daySubtitle,     perks: ts.dayPerks     },
    { ...TICKET_BASE[1], subtitle: ts.weekendSubtitle, perks: ts.weekendPerks },
    { ...TICKET_BASE[2], subtitle: ts.priveSubtitle,   perks: ts.privePerks   },
  ];
  const stage      = (stages || []).find(s => s.id === artist.stage) || {};
  const stageColor = STAGE_COLORS[artist.stage] || '#1A78C8';
  const defaultDayIdx = Math.max(0, weekend.dates.indexOf(artist.date));

  const [activeTicket, setActiveTicket] = useState(null);
  const [vipCat,       setVipCat]       = useState('normal');
  const [dayIdx,       setDayIdx]       = useState(defaultDayIdx);
  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [qty,          setQty]          = useState(1);
  const [orderState,   setOrderState]   = useState('idle');
  const [orderId,      setOrderId]      = useState('');
  const [errMsg,       setErrMsg]       = useState('');

  const ticket = TICKETS.find(t => t.id === activeTicket);
  const effectiveCat = ticket?.hasVip ? vipCat : 'normal';
  const unitPrice = ticket
    ? (ticket.hasVip ? (vipCat === 'vip' ? ticket.priceVip : ticket.priceNormal) : ticket.priceNormal)
    : 0;
  const total = unitPrice * qty;
  const selectedDate = ticket?.hasDay ? weekend.dates[dayIdx] : null;

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const selectTicket = (ticketId) => {
    setActiveTicket(ticketId);
    setVipCat('normal');
    setOrderState('idle');
    setErrMsg('');
  };

  const submit = async e => {
    e.preventDefault();
    if (!ticket) return;
    setOrderState('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/tickets/order', {
        method: 'POST',
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
      if (!res.ok) throw new Error(data.message || 'Errore');
      setOrderId(data.orderId);
      setOrderState('success');
    } catch (err) {
      setErrMsg(err.message);
      setOrderState('error');
    }
  };

  return (
    <div className="ev-overlay" onClick={onClose}>
      <div className="ev-modal" onClick={e => e.stopPropagation()}>
        <button className="ev-modal-close" onClick={onClose}>×</button>
        <div className="ev-modal-inner">
          {orderState === 'success' ? (
            <div className="pm-success">
              <div className="pm-success-icon">✓</div>
              <p className="pm-success-order">{orderId}</p>
              <h3>{te.orderConfirmed}</h3>
              <p>{qty}× {ticket?.label}{effectiveCat === 'vip' ? ' VIP' : ''} — €{total}</p>
              <p>{weekend.label} · {weekend.range}</p>
              <p>{te.confirmEmail} <strong>{email}</strong></p>
              <button type="button" className="pm-submit" onClick={onClose}>{te.close}</button>
            </div>
          ) : (
            <>
              <div className="ev-modal-hero">
                <ModalAvatar name={artist.name} slug={artist.slug} />
                <div className="ev-modal-head">
                  <div className="ev-modal-time-stage">
                    <span className="ev-modal-time">{artist.time}</span>
                    <span className="ev-modal-stage-badge" style={{ borderColor: stageColor, color: stageColor }}>
                      {STAGE_LABELS[artist.stage]}
                    </span>
                  </div>
                  <h2 className="ev-modal-name">
                    {artist.name}
                    {artist.headliner && <span className="ev-modal-hl">Headliner</span>}
                  </h2>
                  <p className="ev-modal-meta" style={{ marginBottom: 0 }}>
                    {artist.genre} &nbsp;·&nbsp; {artist.origin}
                  </p>
                </div>
              </div>

              <hr className="ev-modal-divider" />
              <p className="ev-modal-bio">{artist.bio}</p>

              <span className="ev-modal-tracks-label">{te.tracksLabel}</span>
              <ul className="ev-modal-tracks">
                {artist.tracks.map((t, i) => (
                  <li key={t} className="ev-modal-track">
                    <span className="ev-modal-track-num">0{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ul>

              {stage.name && (
                <div className="ev-modal-stage-box">
                  <div>
                    <div className="ev-modal-stage-name">{stage.name}</div>
                    <div className="ev-modal-stage-loc">{stage.subtitle} &nbsp;·&nbsp; {stage.location}</div>
                  </div>
                  <div className="ev-modal-stage-cap">{stage.capacity?.toLocaleString('it-IT')}</div>
                </div>
              )}

              <span className="ev-modal-tickets-label">{te.ticketsLabel}</span>
              <p className="ev-modal-wk-meta">{weekend.label} · {weekend.range}</p>

              <div className="ev-ticket-subs">
                {TICKETS.map((t, i) => {
                  const isActive = activeTicket === t.id;
                  const price = t.hasVip && isActive
                    ? (vipCat === 'vip' ? t.priceVip : t.priceNormal)
                    : t.priceNormal;
                  const perks = (t.perks.normal || []).slice(0, 3).join(' · ');

                  return (
                    <div key={t.id}>
                      <button
                        type="button"
                        className={`ev-ticket-sub${t.featured ? ' ev-ticket-sub-featured' : ''}${isActive ? ' ev-ticket-sub-active' : ''}`}
                        onClick={() => selectTicket(t.id)}
                      >
                        <span className="ev-ticket-sub-num">{String(i + 1).padStart(2, '0')}</span>
                        {t.featured && <span className="ev-ticket-sub-badge">{te.mostPopular}</span>}
                        <div className="ev-ticket-sub-info">
                          <span className="ev-ticket-sub-tier">{t.label}</span>
                          <span className="ev-ticket-sub-desc">{t.subtitle}</span>
                          <span className="ev-ticket-sub-perks">{perks}</span>
                        </div>
                        <div className="ev-ticket-sub-price-col">
                          <span className="ev-ticket-sub-price"><sup>€</sup>{price}</span>
                          {t.hasVip && !isActive && (
                            <span className="ev-ticket-sub-from">{te.fromPrice}{t.priceNormal}</span>
                          )}
                        </div>
                        <span className="ev-ticket-sub-cta">
                          {isActive ? te.selected : te.select}
                        </span>
                        {isActive && t.hasVip && (
                          <div className="ev-ticket-sub-vip" onClick={e => e.stopPropagation()}>
                            {[['normal', 'Normal'], ['vip', 'VIP']].map(([id, lbl]) => (
                              <button
                                key={id}
                                type="button"
                                className={vipCat === id ? 'ev-vip-on' : ''}
                                onClick={() => setVipCat(id)}
                              >{lbl}</button>
                            ))}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {ticket && (
                <div className="ev-modal-checkout">
                  <p className="ev-modal-checkout-title">{te.checkoutTitle} · {ticket.label}</p>
                  <form onSubmit={submit}>
                    {ticket.hasDay && (
                      <>
                        <div className="pm-field"><label>{te.dayLabel}</label></div>
                        <div className="pm-toggle-row">
                          {weekend.dayLabels.map((lbl, i) => (
                            <button
                              key={lbl}
                              type="button"
                              className={`pm-toggle-opt${dayIdx === i ? ' pm-toggle-active' : ''}`}
                              onClick={() => setDayIdx(i)}
                            >{lbl}</button>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="pm-field">
                      <label htmlFor="am-name">{te.fullName}</label>
                      <input id="am-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Mario Rossi" autoComplete="name" />
                    </div>
                    <div className="pm-field">
                      <label htmlFor="am-email">Email</label>
                      <input id="am-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="mario@example.com" autoComplete="email" />
                    </div>
                    <div className="pm-qty-row">
                      <span className="pm-qty-lbl">{ticket.id === 'prive' ? te.qtyTables : te.qtyTickets}</span>
                      <div className="pm-qty-ctrl">
                        <button type="button" disabled={qty <= 1} onClick={() => setQty(q => q - 1)}>−</button>
                        <span>{qty}</span>
                        <button type="button" disabled={qty >= 6} onClick={() => setQty(q => q + 1)}>+</button>
                      </div>
                    </div>
                    <div className="pm-total">
                      <span className="pm-total-lbl">{te.total}</span>
                      <span className="pm-total-amt">€{total}</span>
                    </div>
                    {orderState === 'error' && <p className="pm-err">{errMsg}</p>}
                    <button className="pm-submit" type="submit" disabled={orderState === 'loading'}>
                      <span>{orderState === 'loading' ? te.processing : te.confirmOrder}</span>
                      {orderState !== 'loading' && <span>→</span>}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Events() {
  const { t } = useLang();
  const te = t.events;
  const ts = t.tickets;
  // Sorgente unica dei dati: le quattro tappe del festival itinerante.
  const weekends = TAPPE;
  const data = { artists: TAPPE.flatMap(tp => tp.artists), stages: STAGES };
  const loading = false;
  const [weekendId,setWeekendId]= useState(TAPPE[0].id);
  const [dayIdx,   setDayIdx]   = useState(0);
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedArtist, setSelectedArtist] = useState(null);

  const sectionRef = useRef(null);
  const wavesRef   = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const waves   = wavesRef.current;
    if (!section || !waves) return;

    let current = 0;
    let target  = 0;
    let rafId   = null;

    function onScroll() {
      const rect       = section.getBoundingClientRect();
      const scrollable = window.innerHeight * 1.2;
      target = Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    function tick() {
      current += (target - current) * 0.08;
      waves.style.setProperty('--wave-prog', current.toFixed(4));
      rafId = requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!rafId) { onScroll(); rafId = requestAnimationFrame(tick); }
        } else {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        }
      },
      { threshold: 0 }
    );

    obs.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const weekend = weekends.find(w => w.id === weekendId) || weekends[0];
  const artistWeekend = selectedArtist
    ? (weekends.find(w => w.id === selectedArtist.tappaId) || weekend)
    : weekend;
  const date    = weekend.dates[dayIdx];

  const artists = (data?.artists ?? [])
    .filter(a => a.date === date && (stageFilter === 'all' || a.stage === stageFilter))
    .sort((a, b) => {
      const ta = a.time < '12:00' ? `2${a.time}` : `1${a.time}`;
      const tb = b.time < '12:00' ? `2${b.time}` : `1${b.time}`;
      return ta.localeCompare(tb);
    });

  return (
    <>
      <style>{CSS}</style>

      <section className="section section-dark" id="lineup" ref={sectionRef}>
        <div className="ev-waves" ref={wavesRef}>
          <svg className="ev-wave-svg" viewBox="0 0 1440 2000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {WAVE_PATHS.map((d, i) => (
              <path key={i} className="ev-wave" d={d} />
            ))}
          </svg>
        </div>
        <div className="container">

          {/* ── LINE-UP header ── */}
          <header className="section-header">
            <h2 className="section-title">LINE<span>-UP</span></h2>
          </header>

          {/* ── Weekend selector ── */}
          <div className="ev-weekends">
            {weekends.map((w, wIdx) => {
              const cnt = (data?.artists ?? []).filter(a => a.tappaId === w.id).length;
              return (
                <button key={w.id} type="button"
                  data-n={String(wIdx + 1).padStart(2, '0')}
                  className={`ev-wk-btn${weekendId === w.id ? ' ev-wk-active' : ''}`}
                  onClick={() => { setWeekendId(w.id); setDayIdx(0); setStageFilter('all'); }}
                >
                  <span className="ev-wk-label">{w.label}</span>
                  <span className="ev-wk-range">{w.range}</span>
                  <span className="ev-wk-count">{te.artistCount(cnt)}</span>
                </button>
              );
            })}
          </div>

          {/* ── Day + Stage controls ── */}
          <div className="ev-controls">
            <div className="ev-days">
              {weekend.dayLabels.map((lbl, i) => (
                <button key={lbl} type="button"
                  className={`ev-day-btn${dayIdx === i ? ' ev-day-active' : ''}`}
                  onClick={() => { setDayIdx(i); setStageFilter('all'); }}
                >
                  <span className="real">{lbl}</span>
                  <span className="ghost" aria-hidden="true">{lbl}</span>
                </button>
              ))}
            </div>
            <div className="ev-stage-filters">
              {[['all', te.stageAll],['main','Main'],['porto','Porto'],['cave','Cave']].map(([id, lbl]) => (
                <button key={id} type="button"
                  className={`ev-stage-btn${stageFilter === id ? ' ev-stage-active' : ''}`}
                  onClick={() => setStageFilter(id)}
                >
                  <span className="real">{lbl}</span>
                  <span className="ghost" aria-hidden="true">{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Artist rows ── */}
          <div className="ev-list" role="list">
            {loading && <p className="loading">{te.loading}</p>}
            {!loading && artists.length === 0 && (
              <div className="ev-empty">{te.empty}</div>
            )}
            {artists.map(a => {
              const sc = STAGE_COLORS[a.stage] || '#1A78C8';
              return (
                <div key={a.id} className="ev-row" role="listitem"
                  onClick={() => setSelectedArtist(a)}
                  tabIndex={0} onKeyDown={e => e.key === 'Enter' && setSelectedArtist(a)}
                >
                  <ArtistAvatar name={a.name} slug={a.slug} />
                  <div className="ev-row-content">
                    <div className="ev-row-top">
                      <span className="ev-time">{a.time}</span>
                      {a.headliner && <span className="ev-hl-badge">Headliner</span>}
                      <span className="ev-stage-badge" style={{ borderColor: sc, color: sc }}>
                        {STAGE_LABELS[a.stage]}
                      </span>
                    </div>
                    <span className="ev-name">{a.name}</span>
                    <span className="ev-genre">{a.genre}</span>
                  </div>
                  <span className="ev-arrow">→</span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Modals ── */}
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          stages={data?.stages ?? []}
          weekend={artistWeekend}
          onClose={() => setSelectedArtist(null)}
          te={te}
          ts={ts}
          weekends={weekends}
        />
      )}
    </>
  );
}
