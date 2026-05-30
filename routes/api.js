const express = require('express');
const router  = express.Router();
const { router: analyticsRouter, trackEvent } = require('./analytics');
const { createRateLimiter } = require('../middleware/rateLimit');
const {
  sanitizeString,
  sanitizeEmail,
  sanitizeDate,
  sanitizeEnum,
  isPlainObject,
} = require('../middleware/validate');

// Strict limiter for abuse-prone write endpoints: 5 attempts / 15 min / IP.
// Each endpoint gets an independent bucket so one action can't exhaust another.
const strictLimit = () => createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Troppi tentativi. Riprova tra 15 minuti.',
});
const newsletterLimiter = strictLimit();
const contactLimiter    = strictLimit();
const orderLimiter      = strictLimit();

router.use('/analytics', analyticsRouter);

const subscribers = [];
const messages    = [];
const orders      = [];

const getLineup = () => require('../data/lineup.json');

// GET full lineup (stages + weekends + artists)
router.get('/lineup', (req, res) => {
  res.json({ success: true, data: getLineup() });
});

// GET stages only
router.get('/stages', (req, res) => {
  res.json({ success: true, data: getLineup().stages });
});

// POST newsletter
router.post('/newsletter', newsletterLimiter, (req, res) => {
  if (!isPlainObject(req.body))
    return res.status(400).json({ success: false, message: 'Richiesta non valida.' });

  const email = sanitizeEmail(req.body.email);
  if (!email)
    return res.status(400).json({ success: false, message: 'Email non valida.' });
  if (subscribers.includes(email))
    return res.status(409).json({ success: false, message: 'Email già registrata!' });

  subscribers.push(email);
  trackEvent({ page: 'newsletter', action: 'newsletter_signup', sessionId: '_server', timestamp: new Date().toISOString() });
  console.log(`[NEWSLETTER] Nuovo iscritto: ${email}`);
  res.json({ success: true, message: 'Iscritto con successo! Ci vediamo al festival.' });
});

// POST contact
router.post('/contact', contactLimiter, (req, res) => {
  if (!isPlainObject(req.body))
    return res.status(400).json({ success: false, message: 'Richiesta non valida.' });

  const name    = sanitizeString(req.body.name,    { max: 100 });
  const email   = sanitizeEmail(req.body.email);
  const message = sanitizeString(req.body.message, { max: 2000 });

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'Compila tutti i campi correttamente.' });

  messages.push({ name, email, message, date: new Date().toISOString() });
  console.log(`[CONTACT] ${name} (${email}): ${message.slice(0, 200)}`);
  res.json({ success: true, message: 'Messaggio inviato! Ti risponderemo presto.' });
});

// GET ticket types
router.get('/tickets', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'day',
        label: 'Day Pass',
        subtitle: '1 giorno a scelta',
        priceNormal: 45,
        priceVip: 95,
        hasVip: true,
        hasDay: true,
        perks: {
          normal: ['Accesso 1 giorno', 'Tutti e 3 i palchi', 'Area ristoro'],
          vip:    ['Accesso 1 giorno', 'Tutti e 3 i palchi', 'Area VIP esclusiva', 'Priority entry', 'Welcome drink'],
        },
      },
      {
        id: 'weekend',
        label: 'Weekend Pass',
        subtitle: 'Sabato + Domenica',
        featured: true,
        priceNormal: 80,
        priceVip: 170,
        hasVip: true,
        hasDay: false,
        perks: {
          normal: ['Accesso 2 giorni', 'Tutti e 3 i palchi', 'Area ristoro', 'Priority entry'],
          vip:    ['Accesso 2 giorni', 'Tutti e 3 i palchi', 'Area VIP esclusiva', 'Priority entry', 'Welcome drink', 'Backstage pass'],
        },
      },
      {
        id: 'prive',
        label: 'Privé Table',
        subtitle: 'Tavolo riservato · 4 persone',
        priceNormal: 380,
        hasVip: false,
        hasDay: false,
        perks: {
          normal: ['Tavolo riservato (4 pax)', '2 bottiglie incluse', 'Accesso 2 giorni', 'Area VIP', 'Host dedicato', 'Priority entry'],
        },
      },
    ],
  });
});

// POST ticket order
router.post('/tickets/order', orderLimiter, (req, res) => {
  if (!isPlainObject(req.body))
    return res.status(400).json({ success: false, message: 'Richiesta non valida.' });

  // The four itinerant stops (ids from src/data/festival.js).
  const VALID_WEEKENDS = ['catania', 'palermo', 'agrigento', 'napoli'];
  const VALID_TYPES    = ['day', 'weekend', 'prive'];
  const VALID_CATS     = ['normal', 'vip'];

  const PRICES = {
    'day-normal': 45, 'day-vip': 95,
    'weekend-normal': 80, 'weekend-vip': 170,
    'prive-normal': 380,
  };

  const ticketType = sanitizeEnum(req.body.ticketType, VALID_TYPES);
  if (!ticketType)
    return res.status(400).json({ success: false, message: 'Tipo biglietto non valido.' });

  const weekendId = sanitizeEnum(req.body.weekendId, VALID_WEEKENDS);
  if (!weekendId)
    return res.status(400).json({ success: false, message: 'Tappa non valida.' });

  const cat = ticketType === 'prive'
    ? 'normal'
    : sanitizeEnum(req.body.category, VALID_CATS) || 'normal';
  if (!VALID_CATS.includes(cat))
    return res.status(400).json({ success: false, message: 'Categoria non valida.' });

  let date = null;
  if (ticketType === 'day') {
    date = sanitizeDate(req.body.date);
    if (!date)
      return res.status(400).json({ success: false, message: 'Seleziona un giorno valido.' });
  }

  const name  = sanitizeString(req.body.name, { max: 100 });
  if (!name)
    return res.status(400).json({ success: false, message: 'Nome obbligatorio.' });

  const email = sanitizeEmail(req.body.email);
  if (!email)
    return res.status(400).json({ success: false, message: 'Email non valida.' });

  const qty = Number(req.body.quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 6)
    return res.status(400).json({ success: false, message: 'Quantità non valida (1–6).' });

  const unitPrice = PRICES[`${ticketType}-${cat}`] || 0;
  const total     = unitPrice * qty;
  const orderId   = `SC-${Date.now().toString(36).toUpperCase()}`;

  orders.push({
    orderId, ticketType, category: cat, weekendId,
    date,
    quantity: qty, unitPrice, total,
    name, email,
    createdAt: new Date().toISOString(),
  });

  console.log(`[ORDER] ${orderId} — ${name} (${email}): ${qty}× ${ticketType}/${cat} tappa=${weekendId} = €${total}`);
  trackEvent({ page: 'tickets', action: 'ticket_order', sessionId: '_server', timestamp: new Date().toISOString() });

  res.json({ success: true, orderId, total, message: 'Ordine ricevuto!' });
});

module.exports = router;
