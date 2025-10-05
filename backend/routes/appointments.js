const express = require('express');
const router = express.Router();

// Availability stub
router.get('/availability', async (req, res) => {
  const { doctorId, date } = req.query;
  // Stubbed slots
  res.json({ doctorId, date, slots: ['09:00', '10:00', '14:30'] });
});

// Booking stub
router.post('/book', async (req, res) => {
  const { doctorId, date, time, patientEmail } = req.body;
  // TODO: Save to DB and send confirmation via SendGrid
  res.json({ status: 'confirmed', doctorId, date, time, patientEmail });
});

module.exports = router;