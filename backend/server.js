const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medportal';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

mongoose
  .connect(MONGODB_URI, { dbName: 'medportal' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/cms', require('./routes/cms'));

// n8n webhook proxy
app.post('/validate', async (req, res) => {
  try {
    const { data } = await axios.post(`${N8N_WEBHOOK_URL}/validate`, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Validation proxy failed', details: err.message });
  }
});

app.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${N8N_WEBHOOK_URL}/status/${id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Status proxy failed', details: err.message });
  }
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'MedPortal backend' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));