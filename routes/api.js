const express = require('express');
const router  = express.Router();
const { router: analyticsRouter, trackEvent } = require('./analytics');

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
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@'))
    return res.status(400).json({ success: false, message: 'Email non valida.' });
  if (subscribers.includes(email))
    return res.status(409).json({ success: false, message: "Email già registrata!" });
  subscribers.push(email);
  trackEvent({ page: 'newsletter', action: 'newsletter_signup', sessionId: '_server', timestamp: new Date().toISOString() });
  console.log(`[NEWSLETTER] Nuovo iscritto: ${email}`);
  res.json({ success: true, message: 'Iscritto con successo! Ci vediamo al festival.' });
});

// POST contact
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'Compila tutti i campi.' });
  if (!email.includes('@'))
    return res.status(400).json({ success: false, message: 'Email non valida.' });
  messages.push({ name, email, message, date: new Date().toISOString() });
  console.log(`[CONTACT] ${name} (${email}): ${message}`);
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
router.post('/tickets/order', (req, res) => {
  const { ticketType, category, weekendId, date, quantity, name, email } = req.body;

  const VALID_WEEKENDS = ['w1', 'w2', 'w3'];
  const VALID_TYPES    = ['day', 'weekend', 'prive'];
  const VALID_CATS     = ['normal', 'vip'];

  const PRICES = {
    'day-normal': 45, 'day-vip': 95,
    'weekend-normal': 80, 'weekend-vip': 170,
    'prive-normal': 380,
  };

  if (!VALID_TYPES.includes(ticketType))
    return res.status(400).json({ success: false, message: 'Tipo biglietto non valido.' });

  if (!VALID_WEEKENDS.includes(weekendId))
    return res.status(400).json({ success: false, message: 'Weekend non valido.' });

  const cat = ticketType === 'prive' ? 'normal' : (category || 'normal');
  if (!VALID_CATS.includes(cat))
    return res.status(400).json({ success: false, message: 'Categoria non valida.' });

  if (ticketType === 'day' && !date)
    return res.status(400).json({ success: false, message: 'Seleziona il giorno.' });

  if (!name || !name.trim())
    return res.status(400).json({ success: false, message: 'Nome obbligatorio.' });

  if (!email || !email.includes('@'))
    return res.status(400).json({ success: false, message: 'Email non valida.' });

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 6)
    return res.status(400).json({ success: false, message: 'Quantità non valida (1–6).' });

  const priceKey = `${ticketType}-${cat}`;
  const unitPrice = PRICES[priceKey] || 0;
  const total     = unitPrice * qty;
  const orderId   = `SC-${Date.now().toString(36).toUpperCase()}`;

  orders.push({
    orderId, ticketType, category: cat, weekendId,
    date: date || null,
    quantity: qty, unitPrice, total,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
  });

  console.log(`[ORDER] ${orderId} — ${name} (${email}): ${qty}× ${ticketType}/${cat} weekend=${weekendId} = €${total}`);
  trackEvent({ page: 'tickets', action: 'ticket_order', sessionId: '_server', timestamp: new Date().toISOString() });

  res.json({ success: true, orderId, total, message: 'Ordine ricevuto!' });
});

module.exports = router;
