const express = require('express');
const Business = require('../models/Business');

const router = express.Router();

// Get business config
router.get('/', async (req, res) => {
  try {
    const business = await Business.findOne();
    if (!business) {
      // Return default config if none exists
      return res.json({
        name: 'Agendou',
        phone: '',
        email: '',
        address: '',
        workingHours: {
          monday: { start: '09:00', end: '18:00' },
          tuesday: { start: '09:00', end: '18:00' },
          wednesday: { start: '09:00', end: '18:00' },
          thursday: { start: '09:00', end: '18:00' },
          friday: { start: '09:00', end: '18:00' },
          saturday: { start: '09:00', end: '18:00' },
          sunday: { start: '09:00', end: '18:00' }
        }
      });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update business config
router.put('/', async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;