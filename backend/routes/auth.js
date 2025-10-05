const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme-supersecret';

// In-memory users for stub (replace with MongoDB models in production)
const users = new Map();
const pending2FA = new Map();

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (users.has(email)) return res.status(409).json({ error: 'User exists' });
  users.set(email, { email, password, name });
  res.json({ message: 'Registered successfully' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pending2FA.set(email, code);
  // In production, send the 2FA code via email/SMS provider
  res.json({ message: '2FA code sent', email });
});

router.post('/2fa/verify', (req, res) => {
  const { email, code } = req.body;
  const expected = pending2FA.get(email);
  if (!expected || expected !== code) return res.status(400).json({ error: 'Invalid 2FA code' });
  pending2FA.delete(email);
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.get(payload.email);
    res.json({ user: { email: user.email, name: user.name } });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;