const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { specialty, location, minRating } = req.query;
    const q = {};
    if (specialty) q.specialty = specialty;
    if (location) q.location = location;
    if (minRating) q.rating = { $gte: Number(minRating) };
    const doctors = await Doctor.find(q).limit(100);
    res.json(doctors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const doc = await Doctor.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;