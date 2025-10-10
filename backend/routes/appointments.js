const express = require('express');
const router = express.Router();


router.get('/availability', async (req, res) => {
  const { doctorId, date } = req.query;
  
  res.json({ doctorId, date, slots: ['09:00', '10:00', '14:30'] });
});


router.post('/book', async (req, res) => {
  const { doctorId, date, time, patientEmail } = req.body;
  
  res.json({ status: 'confirmed', doctorId, date, time, patientEmail });
});

module.exports = router;