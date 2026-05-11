const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { router: analyticsRouter, trackEvent } = require('./analytics');

router.use('/analytics', analyticsRouter);

const subscribers = [];
const messages = [];

// GET lineup
router.get('/lineup', (req, res) => {
  const lineup = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/lineup.json'), 'utf-8'));
  res.json({ success: true, data: lineup });
});

// POST newsletter
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Email non valida.' });
  }
  if (subscribers.includes(email)) {
    return res.status(409).json({ success: false, message: 'Email gia\' registrata!' });
  }
  subscribers.push(email);
  trackEvent({ page: 'newsletter', action: 'newsletter_signup', sessionId: '_server', timestamp: new Date().toISOString() });
  console.log(`Nuovo iscritto: ${email}`);
  res.json({ success: true, message: 'Iscritto con successo! Ci vediamo al festival.' });
});

// POST contact
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Compila tutti i campi.' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Email non valida.' });
  }
  messages.push({ name, email, message, date: new Date().toISOString() });
  console.log(`Nuovo messaggio da ${name} (${email}): ${message}`);
  res.json({ success: true, message: 'Messaggio inviato! Ti risponderemo presto.' });
});

// GET tickets info
router.get('/tickets', (req, res) => {
  const tickets = [
    { id: 1, type: 'Day Pass', price: 35, description: 'Accesso per un giorno a tua scelta', available: true },
    { id: 2, type: 'Weekend Pass', price: 60, description: 'Accesso sabato e domenica', available: true },
    { id: 3, type: 'VIP Pass', price: 120, description: 'Accesso completo + area VIP + backstage', available: true },
  ];
  res.json({ success: true, data: tickets });
});

module.exports = router;
